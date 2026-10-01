import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { CartItemData, OrderPayload } from '@/types';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    const orderItems: CartItemData[] = items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      unit: item.product.unit,
    }));

    const payload: OrderPayload = {
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_email: form.customer_email || null,
      customer_address: form.customer_address || null,
      items: orderItems,
      total: totalPrice,
      status: 'pendente',
      notes: form.notes || null,
    };

    try {
      const { error } = await supabase.from('orders').insert(payload);
      if (error) throw error;
      setSuccess(true);
      clearCart();
    } catch {
      alert('Erro ao finalizar pedido. Tente novamente ou ligue para (11) 4002-8922.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 max-w-lg w-full text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Pedido Enviado!</h1>
          <p className="text-neutral-500 mt-3">
            Recebemos seu pedido com sucesso. Nossa equipe entrará em contato em breve
            pelos dados informados para confirmar a entrega e o frete.
          </p>
          <div className="bg-neutral-50 rounded-xl p-5 mt-6 text-left">
            <p className="text-sm text-neutral-500">Resumo do pedido:</p>
            <p className="font-bold text-xl text-neutral-900 mt-1">{formatPrice(totalPrice)}</p>
            <p className="text-sm text-neutral-500 mt-1">Status: <span className="font-semibold text-amber-600">Pendente</span></p>
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl px-8 py-3 transition-colors"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="bg-neutral-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-700">Carrinho vazio</h1>
          <p className="text-neutral-400 mt-2">Adicione produtos antes de finalizar o pedido</p>
          <Link
            to="/produtos"
            className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl px-8 py-3 transition-colors"
          >
            Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="bg-neutral-900 text-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <Link to="/produtos" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 mb-2">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold">Finalizar Pedido</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-neutral-900">Dados para Entrega</h2>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Endereço de entrega
                </label>
                <textarea
                  rows={3}
                  value={form.customer_address}
                  onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Rua, número, bairro, cidade, CEP"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  Observações
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Alguma observação sobre o pedido? Corte sob medida, horário de entrega, etc."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 lg:sticky lg:top-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Resumo do Pedido</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.quantity} {item.product.unit} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Frete</span>
                  <span className="text-neutral-500">A combinar</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="text-2xl font-extrabold text-neutral-900">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
