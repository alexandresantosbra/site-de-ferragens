import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="bg-neutral-900 text-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <MessageSquare className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-extrabold">Fale Conosco</h1>
          <p className="text-neutral-400 mt-2">Estamos prontos para atender você</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Telefone</h3>
                  <a href="tel:+551140028922" className="text-neutral-600 hover:text-amber-600 transition-colors block mt-1">
                    (11) 4002-8922
                  </a>
                  <a href="tel:+5511987654321" className="text-neutral-600 hover:text-amber-600 transition-colors block">
                    (11) 98765-4321 (WhatsApp)
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">E-mail</h3>
                  <a href="mailto:vendas@ferroforte.com.br" className="text-neutral-600 hover:text-amber-600 transition-colors block mt-1">
                    vendas@ferroforte.com.br
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Endereço</h3>
                  <p className="text-neutral-600 mt-1">
                    Av. Industrial, 1500 - Galpão 12<br />
                    Bairro Industrial - São Paulo / SP<br />
                    CEP: 02000-000
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">Horário de Atendimento</h3>
                  <div className="text-neutral-600 mt-1 space-y-0.5">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 14h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col">
            <div className="bg-neutral-900 text-white p-6">
              <h2 className="text-xl font-bold">Nossa Localização</h2>
              <p className="text-neutral-400 text-sm mt-1">Venha nos visitar ou retire seu pedido</p>
            </div>
            <div className="flex-1 min-h-[300px] bg-neutral-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(0deg, #d4d4d4 1px, transparent 1px), linear-gradient(90deg, #d4d4d4 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
              </div>
              <div className="relative text-center">
                <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MapPin className="h-8 w-8 text-neutral-900" strokeWidth={2.5} />
                </div>
                <p className="font-semibold text-neutral-700">Av. Industrial, 1500</p>
                <p className="text-sm text-neutral-500">São Paulo - SP</p>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 border-t border-neutral-200">
              <a
                href="#/orcamento"
                className="block text-center bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-xl py-3 transition-colors"
              >
                Solicitar Orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
