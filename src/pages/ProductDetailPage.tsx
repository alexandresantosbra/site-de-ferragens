import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package, Check, Truck, Ruler, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setAdded(false);
      setQuantity(1);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (data) {
        setProduct(data as Product);
        if (data.category_id) {
          const { data: cat } = await supabase
            .from('categories')
            .select('*')
            .eq('id', data.category_id)
            .maybeSingle();
          setCategory(cat as Category);

          const { data: rel } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4);
          setRelated(rel ?? []);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  const handleAdd = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      openCart();
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-100 rounded-2xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-100 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-neutral-100 rounded animate-pulse w-1/2" />
            <div className="h-24 bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-neutral-700">Produto não encontrado</h1>
        <Link to="/produtos" className="mt-4 inline-flex items-center gap-2 text-amber-600 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link to="/" className="hover:text-amber-600">Início</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-amber-600">Produtos</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/produtos?categoria=${category.slug}`} className="hover:text-amber-600">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="aspect-square bg-neutral-100">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-neutral-300" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && (
              <Link
                to={`/produtos?categoria=${category.slug}`}
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 mb-2"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl font-extrabold text-neutral-900">{product.name}</h1>
            <p className="text-neutral-600 mt-3 leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && (
              <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-5">
                <h3 className="font-bold text-neutral-900 mb-3">Especificações Técnicas</h3>
                <div className="space-y-2">
                  {product.specs.split('|').map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                      <Check className="h-4 w-4 text-amber-600 shrink-0" />
                      {spec.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-neutral-900">{formatPrice(product.price)}</span>
                <span className="text-lg text-neutral-500 mb-1">/ {product.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                      <Check className="h-4 w-4" /> Em estoque
                    </span>
                    <span className="text-sm text-neutral-400">({product.stock} {product.unit} disponíveis)</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-red-600">Produto esgotado</span>
                )}
              </div>

              {/* Quantity + buttons */}
              {product.stock > 0 && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-700">Quantidade:</span>
                    <div className="flex items-center bg-neutral-100 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-neutral-200 rounded-l-lg transition-colors font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center bg-transparent font-bold text-neutral-900 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-neutral-200 rounded-r-lg transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-neutral-500">
                      Total: <strong className="text-neutral-900">{formatPrice(product.price * quantity)}</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAdd}
                      className={`flex-1 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all ${
                        added
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      {added ? (
                        <><Check className="h-5 w-5" /> Adicionado!</>
                      ) : (
                        <><ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho</>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl py-3.5 transition-colors"
                    >
                      Comprar Agora
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <Truck className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-neutral-700">Entrega Rápida</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <Ruler className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-neutral-700">Corte Sob Medida</p>
              </div>
              <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center">
                <Shield className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-neutral-700">Qualidade Garantida</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/produto/${rel.slug}`}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-amber-400 transition-all"
                >
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    {rel.image_url && (
                      <img
                        src={rel.image_url}
                        alt={rel.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-sm font-bold text-neutral-900 mt-1">{formatPrice(rel.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
