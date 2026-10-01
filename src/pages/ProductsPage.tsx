import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Package, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { getCategoryIcon } from '@/lib/icons';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('categoria') ?? '';
  const searchQuery = searchParams.get('q') ?? '';

  useEffect(() => {
    async function loadData() {
      const catRes = await supabase.from('categories').select('*').order('name');
      setCategories(catRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      let query = supabase.from('products').select('*');
      if (selectedCategory) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', selectedCategory)
          .maybeSingle();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,specs.ilike.%${searchQuery}%`);
      }
      const res = await query.order('name');
      setProducts(res.data ?? []);
    }
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, sortBy]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('categoria', slug);
    else params.delete('categoria');
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeCategory = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Page header */}
      <div className="bg-neutral-900 text-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {activeCategory ? activeCategory.name : 'Todos os Produtos'}
          </h1>
          <p className="text-neutral-400 mt-2">
            {activeCategory ? activeCategory.description : 'Catálogo completo de ferragens e aço'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="flex-1 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700"
          >
            <option value="name">Nome (A-Z)</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/40' : 'hidden'} lg:relative lg:block lg:bg-transparent lg:w-64 lg:shrink-0`}>
            <div className={`${showFilters ? 'fixed left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto lg:relative lg:w-full lg:p-0' : ''} lg:block`}>
              <div className="lg:hidden flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-5 lg:sticky lg:top-4">
                <h3 className="font-bold text-neutral-900 mb-4">Categorias</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-amber-500 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Todos os produtos
                  </button>
                  {categories.map((cat) => {
                    const Icon = getCategoryIcon(cat.icon);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          selectedCategory === cat.slug
                            ? 'bg-amber-500 text-neutral-900'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {/* Desktop sort */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-500">
                {loading ? 'Carregando...' : `${sortedProducts.length} produto(s) encontrado(s)`}
                {searchQuery && ` para "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 focus:border-amber-500 focus:outline-none"
                >
                  <option value="name">Nome (A-Z)</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-neutral-200 h-80 animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-neutral-100 rounded-full p-8 mb-4">
                  <Package className="h-12 w-12 text-neutral-300" />
                </div>
                <h3 className="text-lg font-bold text-neutral-700">Nenhum produto encontrado</h3>
                <p className="text-sm text-neutral-400 mt-1">Tente outra categoria ou termo de busca</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-lg px-6 py-2.5 transition-colors"
                >
                  Ver todos os produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
