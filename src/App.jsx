import { useEffect, useMemo, useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import CartSummary from './components/CartSummary'
import CustomerForm from './components/CustomerForm'
import ProductCard from './components/ProductCard'
import { sampleProducts } from './data/sampleProducts'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { DISPLAY_PHONE, formatCurrency, getCartTotal } from './utils/order'

const initialCustomer = {
  name: '',
  phone: '',
  fulfillmentType: 'Pickup',
  address: '',
  notes: '',
}

export default function App() {
  const [products, setProducts] = useState(sampleProducts)
  const [cartItems, setCartItems] = useState([])
  const [customer, setCustomer] = useState(initialCustomer)
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [session, setSession] = useState(null)
  const [view, setView] = useState(window.location.pathname.startsWith('/admin') ? 'admin' : 'customer')

  const availableProducts = useMemo(
    () => products.filter((product) => product.available).sort((a, b) => (a.display_order || 99) - (b.display_order || 99)),
    [products],
  )

  async function loadProducts() {
    if (!isSupabaseConfigured) {
      setProducts(sampleProducts)
      return
    }

    const { data, error } = await supabase.from('products').select('*').order('display_order', { ascending: true })
    if (error || !data?.length) {
      setProducts(sampleProducts)
      return
    }

    setProducts(data)
  }

  useEffect(() => {
    loadProducts()

    if (!isSupabaseConfigured) return undefined

    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  function addToCart(product) {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...current, { ...product, quantity: 1 }]
    })
  }

  function increaseQuantity(productId) {
    setCartItems((current) =>
      current.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  function decreaseQuantity(productId) {
    setCartItems((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(productId) {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  async function saveOrder() {
    setSaveMessage('')

    if (!customer.name.trim() || !customer.phone.trim() || cartItems.length === 0) {
      setSaveMessage('Please add items and enter your name and phone number.')
      return false
    }

    if (!isSupabaseConfigured) {
      setSaveMessage('Supabase is not configured yet. The WhatsApp order will still open with all details.')
      return true
    }

    setIsSaving(true)
    const orderId = crypto.randomUUID()
    const totalAmount = getCartTotal(cartItems)
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_name: customer.name.trim(),
        customer_phone: customer.phone.trim(),
        fulfillment_type: customer.fulfillmentType,
        address: customer.address.trim(),
        notes: customer.notes.trim(),
        total_amount: totalAmount,
        status: 'New',
        payment_status: 'Pending',
      })

    if (orderError) {
      setIsSaving(false)
      setSaveMessage(`Could not save order: ${orderError.message}. WhatsApp will still open.`)
      return true
    }

    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.id.startsWith('sample-') ? null : item.id,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      selling_price: Number(item.price || 0),
      net_rate: Number(item.net_rate || 0),
    }))

    const { error: itemError } = await supabase.from('order_items').insert(orderItems)
    setIsSaving(false)

    if (itemError) {
      setSaveMessage(`Order was saved, but items failed to save: ${itemError.message}. WhatsApp will still open.`)
      return true
    }

    setSaveMessage('Order saved. WhatsApp is opening now.')
    return true
  }

  async function loginAdmin(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : { error: '' }
  }

  async function logoutAdmin() {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (view === 'admin') {
    if (!session) {
      return <AdminLogin isConfigured={isSupabaseConfigured} onLogin={loginAdmin} />
    }

    return <AdminDashboard supabase={supabase} onLogout={logoutAdmin} onProductsChanged={loadProducts} />
  }

  return (
    <main className="min-h-screen bg-cream text-maroon-dark">
      <header className="sticky top-0 z-20 border-b border-gold/20 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <button type="button" onClick={() => setView('customer')} className="text-left">
            <p className="font-display text-xl font-bold text-maroon">Ranganayaki Godavari Ruchulu</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Traditional Taste, Pure Love</p>
          </button>
          <button
            type="button"
            onClick={() => setView('admin')}
            className="rounded-full border border-gold px-4 py-2 text-sm font-bold text-maroon"
          >
            Admin
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-maroon text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,#c99a2e_0_8%,transparent_9%),radial-gradient(circle_at_80%_10%,#fff8e8_0_6%,transparent_7%)]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex rounded-full bg-gold px-4 py-2 text-sm font-bold text-maroon-dark">
              Pre-orders only in Vizag
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-7xl">
              Authentic Godavari sweets from Rajahmundry to Vizag.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-cream">
              Homemade Kova, Sunnundalu, Putharekulu, hot snacks, paneer, and pure ghee prepared with traditional care.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#menu" className="rounded-full bg-gold px-6 py-4 text-center font-bold text-maroon-dark">
                View Menu
              </a>
              <a
                href={`https://wa.me/919963814860`}
                className="rounded-full border border-gold px-6 py-4 text-center font-bold text-white"
              >
                WhatsApp {DISPLAY_PHONE}
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-gold/40 bg-cream p-6 text-maroon-dark shadow-soft">
            <div className="rounded-[1.5rem] border-2 border-dashed border-gold p-8 text-center">
              <p className="font-display text-5xl font-bold text-maroon">RGR</p>
              <p className="mt-3 text-lg font-bold text-godavari">Traditional Taste, Pure Love</p>
              <p className="mt-5 leading-7">
                Fresh batches are prepared after confirmation, so every order reaches you with homemade taste and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!isSupabaseConfigured && (
        <div className="mx-auto mt-6 max-w-7xl px-4">
          <div className="rounded-3xl border border-gold/30 bg-white p-5 shadow-soft">
            <p className="font-bold text-maroon">Supabase is not configured yet.</p>
            <p className="mt-2 text-sm leading-6 text-maroon-dark/80">
              The website is using sample products. Add your Supabase URL and anon key in <strong>.env</strong> to save
              orders, manage products, and use admin login.
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {['Freshly made', 'Hygienically prepared', 'Quality assured'].map((item) => (
            <div key={item} className="rounded-3xl border border-gold/25 bg-white p-6 text-center shadow-soft">
              <p className="font-display text-2xl font-bold text-maroon">{item}</p>
              <p className="mt-3 text-sm leading-6 text-maroon-dark/75">
                Small-batch homemade preparation with pure ingredients and family-style care.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div id="story" className="rounded-3xl border border-gold/25 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Our Story</p>
            <h2 className="mt-2 font-display text-4xl font-bold text-maroon-dark">
              Godavari taste, lovingly made at home.
            </h2>
            <p className="mt-4 leading-8 text-maroon-dark/80">
              Ranganayaki Godavari Ruchulu brings the authentic sweet-shop memories of Rajahmundry and the Godavari
              region to families in Vizag. Every order is prepared after confirmation, keeping the taste fresh,
              traditional, and personal.
            </p>
          </div>

          <div id="menu" className="mt-10">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Product Menu</p>
                <h2 className="font-display text-4xl font-bold text-maroon-dark">Sweets, snacks, paneer & ghee</h2>
              </div>
              <p className="rounded-full bg-godavari px-4 py-2 text-sm font-bold text-white">
                Pre-orders only
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {availableProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <CartSummary
            cartItems={cartItems}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeItem}
          />
          <CustomerForm
            customer={customer}
            cartItems={cartItems}
            isSaving={isSaving}
            saveMessage={saveMessage}
            onChange={updateCustomer}
            onSubmitOrder={saveOrder}
          />
        </aside>
      </section>

      <footer className="mt-12 bg-godavari px-4 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Ranganayaki Godavari Ruchulu</h2>
            <p className="mt-2 text-cream">Traditional Taste, Pure Love • Pre-orders only</p>
            <p className="mt-2 font-bold">Contact: {DISPLAY_PHONE}</p>
          </div>
          <a href="https://wa.me/919963814860" className="rounded-full bg-gold px-6 py-4 text-center font-bold text-maroon-dark">
            Order on WhatsApp
          </a>
        </div>
      </footer>
    </main>
  )
}
