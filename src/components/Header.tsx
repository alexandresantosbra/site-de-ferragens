import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, HardHat, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      window.location.hash = `#/produtos?q=${encodeURIComponent(searchQuery)}`;
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Início', href: '#/' },
    { label: 'Produtos', href: '#/produtos' },
    { label: 'Categorias', href: '#/categorias' },
    { label: 'Orçamento', href: '#/orcamento' },
    { label: 'Contato', href: '#/contato' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-neutral-800 text-neutral-300 text-xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:block">Entrega em todo o estado | Frete a combinar</span>
          <span className="sm:hidden">Frete a combinar</span>
          <div className="flex items-center gap-4">
            <a href="tel:+551140028922" className="hover:text-amber-400 transition-colors">
              (11) 4002-8922
            </a>
            <a href="mailto:vendas@ferroforte.com.br" className="hidden sm:inline hover:text-amber-400 transition-colors">
              vendas@ferroforte.com.br
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-amber-500 rounded-lg p-1.5">
              <HardHat className="h-7 w-7 text-neutral-900" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="text-xl font-extrabold tracking-tight">Ferro<span className="text-amber-500">Forte</span></span>
              <span className="block text-[10px] text-neutral-400 font-medium tracking-widest uppercase">Ferragens & Aço</span>
            </div>
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ferragens, vergalhões, tubos..."
              className="w-full bg-neutral-800 text-white placeholder-neutral-500 rounded-lg pl-4 pr-12 py-2.5 text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-md p-2 transition-colors">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openCart}
              className="relative bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-lg px-3 py-2.5 flex items-center gap-2 font-bold text-sm transition-colors"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden bg-neutral-800 hover:bg-neutral-700 rounded-lg p-2.5 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search - mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ferragens..."
              className="w-full bg-neutral-800 text-white placeholder-neutral-500 rounded-lg pl-4 pr-12 py-2.5 text-sm border border-neutral-700 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-md p-2 transition-colors">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>

      {/* Nav bar */}
      <nav className="bg-neutral-800 border-t border-neutral-700">
        <div className="mx-auto max-w-7xl px-4">
          <div className="hidden md:flex items-center gap-8 h-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href.replace('#', '')}
                className="text-sm font-medium text-neutral-300 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-neutral-800 border-t border-neutral-700">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href.replace('#', '')}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-neutral-200 hover:bg-neutral-700 hover:text-amber-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
