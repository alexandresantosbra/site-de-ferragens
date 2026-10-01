import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" strokeWidth={2.5} />
            <h2 className="font-bold text-lg">Carrinho</h2>
            {totalItems > 0 && (
              <span className="bg-amber-500 text-neutral-900 text-xs font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="hover:text-amber-400 transition-colors p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="bg-neutral-100 rounded-full p-6">
              <Package className="h-12 w-12 text-neutral-300" />
            </div>
            <div>
              <p className="font-semibold text-neutral-700">Seu carrinho está vazio</p>
              <p className="text-sm text-neutral-400 mt-1">Adicione produtos para continuar</p>
            </div>
            <button
              onClick={closeCart}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-lg px-6 py-2.5 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-neutral-50 rounded-xl p-3 border border-neutral-200"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-white rounded-lg border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 text-sm font-bold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-neutral-300 hover:text-red-600 transition-colors self-start p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-5 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 text-sm">Subtotal</span>
                <span className="text-2xl font-extrabold text-neutral-900">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-neutral-400">Frete calculado na finalização do pedido</p>
              <button
                onClick={onCheckout}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors"
              >
                Finalizar Pedido
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
