import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductsAdmin from './pages/admin/ProductsAdmin'
import InventoryAdmin from './pages/admin/InventoryAdmin'
import OrdersAdmin from './pages/admin/OrdersAdmin'

export default function App() {
  return (
    <Routes>
      {/* Customer website */}
      <Route path="/" element={<HomePage />} />
      <Route path="/order" element={<OrderPage />} />

      {/* Admin panel */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="inventory" element={<InventoryAdmin />} />
        <Route path="orders" element={<OrdersAdmin />} />
      </Route>
    </Routes>
  )
}
