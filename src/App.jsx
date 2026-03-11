import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/index.js';
import { api } from './api/client.js';
import { useTelegram } from './hooks/useTelegram.js';
import Layout from './components/layout/Layout.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Spinner from './components/ui/Spinner.jsx';

export default function App() {
  const { user, loading, setUser, setLoading, setError } = useUserStore();
  const { tg } = useTelegram();

  useEffect(() => {
    async function init() {
      try {
        const me = await api.getMe();
        setUser(me);
      } catch (err) {
        if (err.status === 404) {
          setLoading(false);
        } else {
          setError(err.message);
        }
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!user) {
    return <RegisterPage />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"        element={<Navigate to="/menu" replace />} />
          <Route path="/menu"    element={<MenuPage />} />
          <Route path="/cart"    element={<CartPage />} />
          <Route path="/orders"  element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*"        element={<Navigate to="/menu" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
