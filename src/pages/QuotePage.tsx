import { useState } from 'react';
import { Check, ClipboardList, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function QuotePage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    project: '',
    items: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        customer_address: form.notes || null,
        items: [{
          product_id: 'orcamento',
          name: `Orçamento - ${form.project || 'Projeto'}`,
          price: 0,
          quantity: 1,
          unit: 'orcamento',
        }],
        total: 0,
        status: 'orcamento',
        notes: `Empresa: ${form.company}\nItens solicitados: ${form.items}\nObservações: ${form.notes}`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch {
      alert('Erro ao enviar orçamento. Tente novamente ou ligue para (11) 4002-8922.');
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
          <h1 className="text-2xl font-extrabold text-neutral-900">Orçamento Enviado!</h1>
          <p className="text-neutral-500 mt-3">
            Recebemos sua solicitação. Nossa equipe comercial entrará em contato em até 24 horas
            com uma proposta personalizada.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setForm({ name: '', phone: '', email: '', company: '', project: '', items: '', notes: '' });
            }}
            className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl px-8 py-3 transition-colors"
          >
            Novo Orçamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="bg-neutral-900 text-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <ClipboardList className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-extrabold">Solicitar Orçamento</h1>
          <p className="text-neutral-400 mt-2 max-w-xl mx-auto">
            Para compras em volume ou projetos especiais, solicite um orçamento personalizado.
            Resposta em até 24 horas.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Nome completo *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Telefone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Empresa</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="Nome da empresa (opcional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Tipo de projeto</label>
            <select
              value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione...</option>
              <option value="Construção residencial">Construção residencial</option>
              <option value="Construção comercial">Construção comercial</option>
              <option value="Obra industrial">Obra industrial</option>
              <option value="Serralheria">Serralheria</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              Produtos e quantidades desejadas *
            </label>
            <textarea
              required
              rows={4}
              value={form.items}
              onChange={(e) => setForm({ ...form, items: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors resize-none"
              placeholder="Ex: 50m de metalon 50x50x3mm, 200m de vergalhão 3/8, 30m² de chapa galvanizada 0.5mm..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Observações</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 text-neutral-900 focus:border-amber-500 focus:outline-none transition-colors resize-none"
              placeholder="Endereço de entrega, prazo necessário, condição de pagamento, etc."
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Truck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-700">
              Para compras em volume oferecemos condições especiais de preço e frete.
              Nossa equipe entrará em contato com a melhor proposta.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  );
}
