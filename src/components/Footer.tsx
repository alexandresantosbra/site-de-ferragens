import { HardHat, Phone, Mail, MapPin, Truck, Shield, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-16">
      {/* Features strip */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 rounded-lg p-3 shrink-0">
                <Truck className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Entrega Rápida</h4>
                <p className="text-xs">Em todo o estado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 rounded-lg p-3 shrink-0">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Qualidade Garantida</h4>
                <p className="text-xs">Produtos certificados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 rounded-lg p-3 shrink-0">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Atendimento</h4>
                <p className="text-xs">Seg a Sáb, 8h às 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 rounded-lg p-1.5">
                <HardHat className="h-6 w-6 text-neutral-900" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold text-white">Ferro<span className="text-amber-500">Forte</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Sua loja de ferragens e aço com mais de 20 anos de experiência.
              Metalons, vergalhões, tubos, chapas e muito mais com a melhor qualidade.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Produtos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#/produtos?categoria=metalon" className="hover:text-amber-400 transition-colors">Metalon</a></li>
              <li><a href="#/produtos?categoria=vergalhoes" className="hover:text-amber-400 transition-colors">Vergalhões</a></li>
              <li><a href="#/produtos?categoria=tubos-e-conexoes" className="hover:text-amber-400 transition-colors">Tubos e Conexões</a></li>
              <li><a href="#/produtos?categoria=chapas" className="hover:text-amber-400 transition-colors">Chapas</a></li>
              <li><a href="#/produtos?categoria=telas-e-grades" className="hover:text-amber-400 transition-colors">Telas e Grades</a></li>
              <li><a href="#/produtos?categoria=ferragens-gerais" className="hover:text-amber-400 transition-colors">Ferragens Gerais</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Atendimento</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>(11) 4002-8922</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <span>vendas@ferroforte.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Av. Industrial, 1500 - Galpão 12<br />São Paulo - SP</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Horário</h3>
            <ul className="space-y-2 text-sm">
              <li>Segunda a Sexta: 8h - 18h</li>
              <li>Sábado: 8h - 14h</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} FerroForte Ferragens & Aço. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
