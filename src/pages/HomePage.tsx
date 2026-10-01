import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield,  HardHat, Ruler, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').eq('featured', true).limit(8),
      ]);
      setCategories(catRes.data ?? []);
      setFeaturedProducts(prodRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/36003982/pexels-photo-36003982.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Metal beams stacked in industrial yard"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-500 text-neutral-900 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Mais de 20 anos de experiência
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Ferragens e Aço de <span className="text-amber-500">Qualidade</span> para sua obra
            </h1>
            <p className="mt-6 text-lg text-neutral-300 leading-relaxed max-w-xl">
              Metalons, vergalhões, tubos, chapas e ferragens em geral.
              Tudo que sua construção precisa, com entrega rápida e preços justos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/produtos"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl px-8 py-3.5 flex items-center gap-2 transition-colors"
              >
                Ver Produtos
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/orcamento"
                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold rounded-xl px-8 py-3.5 transition-colors"
              >
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick features */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Entrega Rápida', desc: 'Em todo o estado' },
              { icon: Shield, title: 'Qualidade', desc: 'Produtos certificados' },
              { icon: Ruler, title: 'Corte Sob Medida', desc: 'Na medida certa' },
              { icon: ThumbsUp, title: 'Melhor Preço', desc: 'Da região' },
            ].map((feat) => (
              <div key={feat.title} className="flex items-center gap-3">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <feat.icon className="h-6 w-6 text-amber-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{feat.title}</h3>
                  <p className="text-xs text-neutral-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900">Categorias</h2>
            <p className="text-neutral-500 mt-2">Encontre tudo que precisa para sua obra</p>
          </div>
          <Link to="/categorias" className="hidden sm:flex items-center gap-1 text-amber-600 font-semibold hover:gap-2 transition-all">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-neutral-100 rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="bg-neutral-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900">Produtos em Destaque</h2>
              <p className="text-neutral-500 mt-2">Os mais vendidos da semana</p>
            </div>
            <Link to="/produtos" className="hidden sm:flex items-center gap-1 text-amber-600 font-semibold hover:gap-2 transition-all">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link to="/produtos" className="inline-flex items-center gap-1 text-amber-600 font-semibold">
              Ver todos os produtos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <HardHat className="h-12 w-12 text-neutral-900 mx-auto mb-4" strokeWidth={2} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
            Precisa de um orçamento personalizado?
          </h2>
          <p className="text-neutral-800 mt-3 max-w-xl mx-auto">
            Fale com nossa equipe e receba uma proposta sob medida para seu projeto
          </p>
          <Link
            to="/orcamento"
            className="mt-8 inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl px-8 py-3.5 transition-colors"
          >
            Solicitar Orçamento
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
