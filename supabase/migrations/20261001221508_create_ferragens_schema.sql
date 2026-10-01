/*
# Criar esquema do site de ferragens

## Descrição
Cria as tabelas necessárias para o site de vendas de ferragens (metalons, vergalhões, tubos, chapas, etc.).
App sem login (single-tenant) - todos os dados são públicos para anon e authenticated.

## Novas Tabelas
1. `categories` - Categorias de produtos (Metalon, Vergalhões, Tubos, Chapas, Telas, Ferragens Gerais)
   - id (uuid, PK)
   - name (text, nome da categoria)
   - slug (text, identificador único para URL)
   - icon (text, nome do ícone lucide)
   - description (text, descrição curta)
   - created_at (timestamp)

2. `products` - Produtos à venda
   - id (uuid, PK)
   - category_id (uuid, FK para categories)
   - name (text, nome do produto)
   - slug (text, identificador único)
   - description (text, descrição detalhada)
   - price (numeric(10,2), preço em R$)
   - unit (text, unidade de venda: m, kg, un, barras, etc.)
   - image_url (text, URL da imagem)
   - specs (text, especificações técnicas como bitola, medida, etc.)
   - stock (int, quantidade em estoque)
   - featured (boolean, se aparece em destaque na home)
   - created_at (timestamp)

3. `orders` - Pedidos realizados
   - id (uuid, PK)
   - customer_name (text, nome do cliente)
   - customer_phone (text, telefone)
   - customer_email (text, email)
   - customer_address (text, endereço de entrega)
   - items (jsonb, array de itens {product_id, name, price, quantity, unit})
   - total (numeric(10,2), valor total)
   - status (text, status do pedido: pendente, confirmado, enviado, entregue)
   - notes (text, observações)
   - created_at (timestamp)

## Segurança
- RLS habilitado em todas as tabelas
- Políticas TO anon, authenticated (CRUD completo) pois é app sem login
- Products e Categories: leitura pública, escrita só admin (mas sem auth, permitimos tudo)
- Orders: criação e leitura pública para anon
*/

-- Categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Package',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- Produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'un',
  image_url text,
  specs text,
  stock int NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Inserir categorias
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Metalon', 'metalon', 'Box', 'Perfis de aço estrutural para construção'),
  ('Vergalhões', 'vergalhoes', 'AlignVerticalSpaceAround', 'Barras de aço para armaduras e concreto armado'),
  ('Tubos e Conexões', 'tubos-e-conexoes', 'Pipe', 'Tubos de aço galvanizado e preto'),
  ('Chapas', 'chapas', 'SquareStack', 'Chapas de aço galvanizado e laminada'),
  ('Telas e Grades', 'telas-e-grades', 'Grid3x3', 'Telas soldadas, grades e cercas'),
  ('Ferragens Gerais', 'ferragens-gerais', 'Wrench', 'Dobradiças, fechaduras, parafusos e acessórios')
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos
INSERT INTO products (category_id, name, slug, description, price, unit, image_url, specs, stock, featured) VALUES
  -- Metalon
  ((SELECT id FROM categories WHERE slug = 'metalon'), 'Metalon 50x50x3mm', 'metalon-50x50x3mm', 'Perfil estrutural de aço quadrado 50x50mm com espessura de 3mm. Ideal para estruturas, portões e esquadrias.', 89.90, 'm', 'https://images.pexels.com/photos/22820812/pexels-photo-22820812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 50x50mm | Espessura: 3mm | Material: Aço SAE 1020', 500, true),
  ((SELECT id FROM categories WHERE slug = 'metalon'), 'Metalon 100x50x3mm', 'metalon-100x50x3mm', 'Perfil estrutural retangular 100x50mm com espessura de 3mm. Para estruturas de maior porte.', 125.00, 'm', 'https://images.pexels.com/photos/35898707/pexels-photo-35898707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 100x50mm | Espessura: 3mm | Material: Aço SAE 1020', 300, true),
  ((SELECT id FROM categories WHERE slug = 'metalon'), 'Metalon 30x30x2mm', 'metalon-30x30x2mm', 'Perfil estrutural quadrado 30x30mm com espessura de 2mm. Para estruturas leves e decoração.', 42.50, 'm', 'https://images.pexels.com/photos/12010213/pexels-photo-12010213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 30x30mm | Espessura: 2mm | Material: Aço SAE 1020', 800, false),
  ((SELECT id FROM categories WHERE slug = 'metalon'), 'Metalon 20x20x1.5mm', 'metalon-20x20x1-5mm', 'Perfil estrutural quadrado 20x20mm com espessura de 1.5mm. Ideal para esquadrias e móveis sob medida.', 28.90, 'm', 'https://images.pexels.com/photos/33927546/pexels-photo-33927546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 20x20mm | Espessura: 1.5mm | Material: Aço SAE 1020', 1000, false),

  -- Vergalhões
  ((SELECT id FROM categories WHERE slug = 'vergalhoes'), 'Vergalhão 5/16" CA-50', 'vergalhao-5-16-ca50', 'Vergalhão de aço CA-50 bitola 5/16" (8mm). Para armaduras de concreto armado.', 6.50, 'm', 'https://images.pexels.com/photos/10932215/pexels-photo-10932215.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 5/16" (8mm) | Classe: CA-50 | Norma: NBR 7480', 2000, true),
  ((SELECT id FROM categories WHERE slug = 'vergalhoes'), 'Vergalhão 3/8" CA-50', 'vergalhao-3-8-ca50', 'Vergalhão de aço CA-50 bitola 3/8" (10mm). Para vigas e pilares de concreto armado.', 9.80, 'm', 'https://images.pexels.com/photos/36003982/pexels-photo-36003982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 3/8" (10mm) | Classe: CA-50 | Norma: NBR 7480', 1500, true),
  ((SELECT id FROM categories WHERE slug = 'vergalhoes'), 'Vergalhão 1/2" CA-60', 'vergalhao-1-2-ca60', 'Vergalhão de aço CA-60 bitola 1/2" (12.5mm). Para estruturas de maior responsabilidade.', 15.90, 'm', 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 1/2" (12.5mm) | Classe: CA-60 | Norma: NBR 7480', 800, false),
  ((SELECT id FROM categories WHERE slug = 'vergalhoes'), 'Vergalhão 5/8" CA-50', 'vergalhao-5-8-ca50', 'Vergalhão de aço CA-50 bitola 5/8" (16mm). Para fundações e estruturas pesadas.', 24.50, 'm', 'https://images.pexels.com/photos/14484384/pexels-photo-14484384.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bitola: 5/8" (16mm) | Classe: CA-50 | Norma: NBR 7480', 500, false),

  -- Tubos
  ((SELECT id FROM categories WHERE slug = 'tubos-e-conexoes'), 'Tubo Galvanizado 1"', 'tubo-galvanizado-1', 'Tubo de aço galvanizado 1 polegada. Para instalações hidráulicas e estruturais.', 32.00, 'm', 'https://images.pexels.com/photos/28772266/pexels-photo-28772266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 1" (25mm) | Material: Aço Galvanizado | Norma: NBR 5590', 600, true),
  ((SELECT id FROM categories WHERE slug = 'tubos-e-conexoes'), 'Tubo Galvanizado 2"', 'tubo-galvanizado-2', 'Tubo de aço galvanizado 2 polegadas. Para instalações de maior vazão.', 68.00, 'm', 'https://images.pexels.com/photos/38028966/pexels-photo-38028966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 2" (50mm) | Material: Aço Galvanizado | Norma: NBR 5590', 300, false),
  ((SELECT id FROM categories WHERE slug = 'tubos-e-conexoes'), 'Tubo Preto 3/4"', 'tubo-preto-3-4', 'Tubo de aço preto 3/4 polegada. Para instalações de gás e estrutura.', 22.50, 'm', 'https://images.pexels.com/photos/26648949/pexels-photo-26648949.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 3/4" (20mm) | Material: Aço Preto | Norma: NBR 5590', 900, false),
  ((SELECT id FROM categories WHERE slug = 'tubos-e-conexoes'), 'Tubo Preto 4"', 'tubo-preto-4', 'Tubo de aço preto 4 polegadas. Para exaustão e estrutura industrial.', 145.00, 'm', 'https://images.pexels.com/photos/5503904/pexels-photo-5503904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 4" (100mm) | Material: Aço Preto | Norma: NBR 5590', 150, false),

  -- Chapas
  ((SELECT id FROM categories WHERE slug = 'chapas'), 'Chapa Galvanizada 0.5mm', 'chapa-galvanizada-0-5mm', 'Chapa de aço galvanizado com 0.5mm de espessura. Para coberturas e fechamentos.', 45.00, 'm²', 'https://images.pexels.com/photos/11254943/pexels-photo-11254943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Espessura: 0.5mm | Material: Aço Galvanizado | Dimensão: 1x2m', 400, true),
  ((SELECT id FROM categories WHERE slug = 'chapas'), 'Chapa Laminada 3mm', 'chapa-laminada-3mm', 'Chapa de aço laminada a quente com 3mm de espessura. Para estruturas e fabricação.', 180.00, 'm²', 'https://images.pexels.com/photos/11254945/pexels-photo-11254945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Espessura: 3mm | Material: Aço Laminado | Dimensão: 1x2m', 200, true),
  ((SELECT id FROM categories WHERE slug = 'chapas'), 'Chapa Xadrez 4.5mm', 'chapa-xadrez-4-5mm', 'Chapa de aço xadrez (antiderrapante) com 4.5mm de espessura. Para pisos e plataformas.', 245.00, 'm²', 'https://images.pexels.com/photos/11255085/pexels-photo-11255085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Espessura: 4.5mm | Material: Aço Xadrez | Dimensão: 1x2m', 120, false),
  ((SELECT id FROM categories WHERE slug = 'chapas'), 'Chapa Galvanizada 0.8mm', 'chapa-galvanizada-0-8mm', 'Chapa de aço galvanizado com 0.8mm de espessura. Para coberturas e caixas d''água.', 72.00, 'm²', 'https://images.pexels.com/photos/11255132/pexels-photo-11255132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Espessura: 0.8mm | Material: Aço Galvanizado | Dimensão: 1x2m', 350, false),

  -- Telas e Grades
  ((SELECT id FROM categories WHERE slug = 'telas-e-grades'), 'Tela Soldada 15x15mm 4mm', 'tela-soldada-15x15-4mm', 'Tela soldada de aço com malha 15x15mm e fio de 4mm. Para lajes e armaduras.', 38.00, 'm²', 'https://images.pexels.com/photos/9974622/pexels-photo-9974622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Malha: 15x15mm | Fio: 4mm | Material: Aço CA-60', 500, true),
  ((SELECT id FROM categories WHERE slug = 'telas-e-grades'), 'Tela Galvanizada 50x50mm', 'tela-galvanizada-50x50mm', 'Tela de aço galvanizado com malha 50x50mm. Para cercas e grades.', 25.00, 'm²', 'https://images.pexels.com/photos/2381712/pexels-photo-2381712.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Malha: 50x50mm | Fio: 2mm | Material: Aço Galvanizado', 800, false),
  ((SELECT id FROM categories WHERE slug = 'telas-e-grades'), 'Grade Expandida 30mm', 'grade-expandida-30mm', 'Grade expandida de aço com abertura de 30mm. Para plataformas e proteções.', 55.00, 'm²', 'https://images.pexels.com/photos/11255124/pexels-photo-11255124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Abertura: 30mm | Espessura: 2mm | Material: Aço Expandido', 300, false),
  ((SELECT id FROM categories WHERE slug = 'telas-e-grades'), 'Cerca de Alambrado 50mm', 'cerca-alambrado-50mm', 'Rolo de tela de alambrado galvanizada com malha 50mm. Para cercas perimetrais.', 8.50, 'm²', 'https://images.pexels.com/photos/31406350/pexels-photo-31406350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Malha: 50mm | Fio: 1.6mm | Material: Aço Galvanizado', 1500, false),

  -- Ferragens Gerais
  ((SELECT id FROM categories WHERE slug = 'ferragens-gerais'), 'Dobradiça de Ferro 3"', 'dobradica-ferro-3', 'Dobradiça de ferro fundido 3 polegadas. Para portas de ferro e madeira.', 12.50, 'par', 'https://images.pexels.com/photos/16816396/pexels-photo-16816396.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tamanho: 3" (75mm) | Material: Ferro Fundido', 2000, true),
  ((SELECT id FROM categories WHERE slug = 'ferragens-gerais'), 'Fechadura de Embutir 70mm', 'fechadura-embutir-70mm', 'Fechadura de embutir em aço com 70mm. Para portas internas e externas.', 45.00, 'un', 'https://images.pexels.com/photos/39265301/pexels-photo-39265301.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tamanho: 70mm | Material: Aço | Acabamento: Zincado', 500, false),
  ((SELECT id FROM categories WHERE slug = 'ferragens-gerais'), 'Parafuso Sextavado 3/8"', 'parafuso-sextavado-3-8', 'Parafuso sextavado 3/8" com porca e arruela. Para estruturas metálicas.', 3.50, 'un', 'https://images.pexels.com/photos/34717436/pexels-photo-34717436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 3/8" | Material: Aço Zincado | Comprimento: 50mm', 5000, false),
  ((SELECT id FROM categories WHERE slug = 'ferragens-gerais'), 'Corrente de Aço 4mm', 'corrente-aco-4mm', 'Corrente de aço galvanizado com elos de 4mm. Para suspensão e cercas.', 18.00, 'm', 'https://images.pexels.com/photos/37441612/pexels-photo-37441612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Diâmetro: 4mm | Material: Aço Galvanizado | Carga: 50kg', 1000, false)
ON CONFLICT (slug) DO NOTHING;
