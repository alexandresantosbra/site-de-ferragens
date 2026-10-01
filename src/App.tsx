import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { QuotePage } from '@/pages/QuotePage';
import { ContactPage } from '@/pages/ContactPage';

function CartDrawerWithNav() {
  const { closeCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return <CartDrawer onCheckout={handleCheckout} />;
}

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/produto/:slug" element={<ProductDetailPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/orcamento" element={<QuotePage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawerWithNav />
        </div>
      </HashRouter>
    </CartProvider>
  );
}

export default App;
