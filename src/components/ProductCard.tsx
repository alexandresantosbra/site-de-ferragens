import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-neutral-300" />
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-amber-500 text-neutral-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            Destaque
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            Esgotado
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-neutral-900 text-sm leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 flex-1">{product.specs}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-extrabold text-neutral-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-neutral-500 block">/ {product.unit}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="bg-neutral-900 hover:bg-amber-500 hover:text-neutral-900 text-white rounded-lg p-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 disabled:hover:text-white"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}
