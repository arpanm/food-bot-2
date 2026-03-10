import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Layout from './pages/Layout';
import Chat from './pages/Chat';
import Order from './pages/Order';
import OrderTracking from './pages/OrderTracking';
import PartyPlanner from './pages/PartyPlanner';
import DietPlanner from './pages/DietPlanner';
import Reviews from './pages/Reviews';
import Tickets from './pages/Tickets';
import Login from './pages/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Chat />} />
        <Route path="order" element={<Order />} />
        <Route path="order/track/:orderId" element={<OrderTracking />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="party" element={<PartyPlanner />} />
        <Route path="diet" element={<DietPlanner />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
