import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Layout from './pages/Layout';
import Chat from './pages/Chat';
import Order from './pages/Order';
import PartyPlanner from './pages/PartyPlanner';
import DietPlanner from './pages/DietPlanner';
import Login from './pages/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Chat />} />
        <Route path="order" element={<Order />} />
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
