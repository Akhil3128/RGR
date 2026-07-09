import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import DashboardHome from './pages/admin/DashboardHome'
import Products from './pages/admin/Products'
import Inventory from './pages/admin/Inventory'
import Orders from './pages/admin/Orders'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  )
}
