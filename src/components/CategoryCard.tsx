import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import type { Category } from '@/types';
import { getCategoryIcon } from '@/lib/icons';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  const Icon: LucideIcon = getCategoryIcon(category.icon);

  return (
    <Link
      to={`/produtos?categoria=${category.slug}`}
      className="group relative bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-xl hover:border-amber-400 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-28 w-28" strokeWidth={1} />
      </div>
      <div className="relative">
        <div className="bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-neutral-900 rounded-xl p-3 w-fit transition-all">
          <Icon className="h-8 w-8 text-amber-600 group-hover:text-neutral-900 transition-colors" strokeWidth={1.8} />
        </div>
        <h3 className="mt-4 font-bold text-neutral-900 text-lg group-hover:text-amber-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{category.description}</p>
        {productCount !== undefined && (
          <p className="text-xs text-neutral-400 mt-2">{productCount} produtos</p>
        )}
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-600 group-hover:gap-2 transition-all">
          Ver produtos
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
