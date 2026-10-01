import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';
import { CategoryCard } from '@/components/CategoryCard';
import { Package } from 'lucide-react';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('category_id'),
      ]);

      const catList = catRes.data ?? [];
      setCategories(catList);

      const countMap: Record<string, number> = {};
      for (const prod of prodRes.data ?? []) {
        if (prod.category_id) {
          countMap[prod.category_id] = (countMap[prod.category_id] ?? 0) + 1;
        }
      }
      setCounts(countMap);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="bg-neutral-900 text-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">Categorias</h1>
          <p className="text-neutral-400 mt-2">Navegue por categoria de produto</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} productCount={counts[cat.id] ?? 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
