import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatINR } from "../../utils/currency";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

const statusOptions = ["New", "Confirmed", "Preparing", "Ready", "Delivered", "Cancelled"];
const paymentOptions = ["Pending", "Paid", "Partial"];

const emptyProductForm = {
  name: "",
  size: "",
  selling_price: "",
  net_rate: "",
  is_available: true,
};

const emptyInventoryForm = {
  product_id: "",
  opening_stock: "",
  stock_received: "",
  sales: "",
};

export default function AdminDashboard({ session }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [inventoryForm, setInventoryForm] = useState(emptyInventoryForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canUseDashboard = Boolean(isSupabaseConfigured && session);

  const loadData = async () => {
    if (!canUseDashboard) {
      return;
    }
    setLoading(true);

    const [productsRes, ordersRes, inventoryRes] = await Promise.all([
      supabase.from("products").select("*").order("name"),
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("inventory")
        .select("*, product:products(name, size)")
        .order("updated_at", { ascending: false }),
    ]);

    if (!productsRes.error) {
      setProducts(productsRes.data ?? []);
    }
    if (!ordersRes.error) {
      setOrders(ordersRes.data ?? []);
    }
    if (!inventoryRes.error) {
      setInventory(inventoryRes.data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseDashboard]);

  const metrics = useMemo(() => {
    const orderItems = orders.flatMap((order) => order.order_items ?? []);
    const salesAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.selling_price),
      0
    );
    const costAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.net_rate ?? 0),
      0
    );
    const pendingOrders = orders.filter((order) =>
      ["New", "Confirmed", "Preparing"].includes(order.order_status)
    ).length;
    const lowStockItems = inventory.filter(
      (entry) =>
        Number(entry.opening_stock) + Number(entry.stock_received) - Number(entry.sales) <= 2
    ).length;

    return {
      totalOrders: orders.length,
      salesAmount,
      costAmount,
      profit: salesAmount - costAmount,
      pendingOrders,
      lowStockItems,
    };
  }, [orders, inventory]);

  const updateProduct = async (productId, updates) => {
    const { error } = await supabase.from("products").update(updates).eq("id", productId);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Product updated.");
    await loadData();
  };

  const addProduct = async (event) => {
    event.preventDefault();
    const payload = {
      name: productForm.name,
      size: productForm.size,
      selling_price: Number(productForm.selling_price),
      net_rate: Number(productForm.net_rate),
      is_available: productForm.is_available,
    };
    const { error } = await supabase.from("products").insert(payload);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Product added.");
    setProductForm(emptyProductForm);
    await loadData();
  };

  const deleteProduct = async (productId) => {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Product deleted.");
    await loadData();
  };

  const saveInventory = async (event) => {
    event.preventDefault();
    const payload = {
      product_id: inventoryForm.product_id,
      opening_stock: Number(inventoryForm.opening_stock),
      stock_received: Number(inventoryForm.stock_received),
      sales: Number(inventoryForm.sales),
    };

    const { error } = await supabase.from("inventory").upsert(payload, {
      onConflict: "product_id",
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Inventory updated.");
    setInventoryForm(emptyInventoryForm);
    await loadData();
  };

  const updateOrder = async (orderId, updates) => {
    const { error } = await supabase.from("orders").update(updates).eq("id", orderId);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Order updated.");
    await loadData();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#f8f2e8] p-5">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h1 className="text-2xl font-bold text-amber-950">Supabase Setup Required</h1>
          <p className="mt-2 text-sm text-amber-900">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in{" "}
            <code>.env</code>, then run the SQL schema from <code>supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f2e8] px-4">
        <div className="rounded-xl bg-white p-5 text-center shadow">
          <p className="text-[#6e1f2b]">Please login to access the admin dashboard.</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="mt-4 rounded-lg bg-[#214632] px-4 py-2 text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f2e8] p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#6e1f2b]">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Ranganayaki Godavari Ruchulu</p>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg bg-[#6e1f2b] px-4 py-2 text-sm font-semibold text-white"
            >
              Sign Out
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-[#214632]">{message}</p> : null}
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Orders" value={metrics.totalOrders} />
          <MetricCard label="Total Sales" value={formatINR(metrics.salesAmount)} />
          <MetricCard label="Total Cost" value={formatINR(metrics.costAmount)} />
          <MetricCard label="Total Profit" value={formatINR(metrics.profit)} />
          <MetricCard label="Pending Orders" value={metrics.pendingOrders} />
          <MetricCard label="Low Stock Items" value={metrics.lowStockItems} />
        </section>

        <section className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
          <h2 className="text-xl font-semibold text-[#6e1f2b]">Products</h2>
          <form onSubmit={addProduct} className="mt-4 grid gap-2 md:grid-cols-6">
            <input
              required
              placeholder="Name"
              value={productForm.name}
              onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <input
              required
              placeholder="Size"
              value={productForm.size}
              onChange={(e) => setProductForm((f) => ({ ...f, size: e.target.value }))}
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Selling Price"
              value={productForm.selling_price}
              onChange={(e) => setProductForm((f) => ({ ...f, selling_price: e.target.value }))}
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Net Rate"
              value={productForm.net_rate}
              onChange={(e) => setProductForm((f) => ({ ...f, net_rate: e.target.value }))}
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={productForm.is_available}
                onChange={(e) => setProductForm((f) => ({ ...f, is_available: e.target.checked }))}
              />
              Available
            </label>
            <button className="rounded bg-[#214632] px-3 py-2 text-sm font-semibold text-white">
              Add Product
            </button>
          </form>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eadfca]">
                  <th className="p-2">Name</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Selling Price</th>
                  <th className="p-2">Net Rate</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#f2e9d7]">
                    <td className="p-2">
                      <input
                        defaultValue={product.name}
                        onBlur={(e) => updateProduct(product.id, { name: e.target.value })}
                        className="w-full rounded border border-[#d9c7a6] px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        defaultValue={product.size}
                        onBlur={(e) => updateProduct(product.id, { size: e.target.value })}
                        className="w-full rounded border border-[#d9c7a6] px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.selling_price}
                        onBlur={(e) =>
                          updateProduct(product.id, { selling_price: Number(e.target.value) })
                        }
                        className="w-full rounded border border-[#d9c7a6] px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.net_rate}
                        onBlur={(e) =>
                          updateProduct(product.id, { net_rate: Number(e.target.value) })
                        }
                        className="w-full rounded border border-[#d9c7a6] px-2 py-1"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        defaultChecked={product.is_available}
                        onChange={(e) => updateProduct(product.id, { is_available: e.target.checked })}
                      />
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded bg-[#6e1f2b] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
          <h2 className="text-xl font-semibold text-[#6e1f2b]">Inventory Management</h2>
          <form onSubmit={saveInventory} className="mt-4 grid gap-2 md:grid-cols-5">
            <select
              required
              value={inventoryForm.product_id}
              onChange={(e) => setInventoryForm((f) => ({ ...f, product_id: e.target.value }))}
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.size}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="0"
              value={inventoryForm.opening_stock}
              onChange={(e) =>
                setInventoryForm((f) => ({ ...f, opening_stock: e.target.value }))
              }
              placeholder="Opening Stock"
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <input
              required
              type="number"
              min="0"
              value={inventoryForm.stock_received}
              onChange={(e) =>
                setInventoryForm((f) => ({ ...f, stock_received: e.target.value }))
              }
              placeholder="Stock Received"
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <input
              required
              type="number"
              min="0"
              value={inventoryForm.sales}
              onChange={(e) => setInventoryForm((f) => ({ ...f, sales: e.target.value }))}
              placeholder="Sales"
              className="rounded border border-[#d9c7a6] px-2 py-2 text-sm"
            />
            <button className="rounded bg-[#214632] px-3 py-2 text-sm font-semibold text-white">
              Save Inventory
            </button>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eadfca]">
                  <th className="p-2">Product</th>
                  <th className="p-2">Opening</th>
                  <th className="p-2">Received</th>
                  <th className="p-2">Sales</th>
                  <th className="p-2">Closing Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((entry) => {
                  const closingStock =
                    Number(entry.opening_stock) + Number(entry.stock_received) - Number(entry.sales);
                  return (
                    <tr key={entry.id} className="border-b border-[#f2e9d7]">
                      <td className="p-2">
                        {entry.product?.name} - {entry.product?.size}
                      </td>
                      <td className="p-2">{entry.opening_stock}</td>
                      <td className="p-2">{entry.stock_received}</td>
                      <td className="p-2">{entry.sales}</td>
                      <td className="p-2 font-semibold">{closingStock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
          <h2 className="text-xl font-semibold text-[#6e1f2b]">Orders</h2>
          <p className="mt-1 text-sm text-slate-600">
            View orders and update order + payment status.
          </p>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-[#eadfca] bg-[#fffaf2] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#6e1f2b]">
                      {order.customer_name} ({order.customer_phone})
                    </p>
                    <p className="text-xs text-slate-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-[#214632]">
                      {formatINR(order.total_amount)}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrder(order.id, { order_status: e.target.value })}
                      className="rounded border border-[#d9c7a6] px-2 py-1 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <select
                      value={order.payment_status}
                      onChange={(e) => updateOrder(order.id, { payment_status: e.target.value })}
                      className="rounded border border-[#d9c7a6] px-2 py-1 text-sm"
                    >
                      {paymentOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(order.order_items ?? []).map((item) => (
                    <li key={item.id}>
                      {item.product_name} ({item.product_size}) × {item.quantity} ={" "}
                      {formatINR(Number(item.quantity) * Number(item.selling_price))}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  <span className="font-medium">Fulfillment:</span> {order.fulfillment_type} |{" "}
                  <span className="font-medium">Address:</span> {order.address || "N/A"} |{" "}
                  <span className="font-medium">Notes:</span> {order.notes || "N/A"}
                </p>
              </article>
            ))}
          </div>
        </section>

        {loading ? <p className="text-sm text-slate-600">Refreshing dashboard...</p> : null}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="rounded-xl border border-[#d9c7a6] bg-white p-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-bold text-[#214632]">{value}</p>
    </article>
  );
}
