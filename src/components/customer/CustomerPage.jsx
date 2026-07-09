import { useEffect, useMemo, useState } from "react";
import { defaultProducts } from "../../data/defaultProducts";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import { formatINR } from "../../utils/currency";
import { buildWhatsAppUrl } from "../../utils/whatsapp";

const initialCustomer = {
  name: "",
  phone: "",
  fulfillmentType: "Delivery",
  address: "",
  notes: "",
};

const colorClasses = {
  bg: "bg-[#f8f2e8]",
  card: "bg-white/80",
  primary: "bg-[#6e1f2b]",
  secondary: "bg-[#214632]",
  accent: "text-[#b08833]",
};

const mapDbProduct = (product) => ({
  id: product.id,
  name: product.name,
  size: product.size,
  price: Number(product.selling_price),
  net_rate: Number(product.net_rate ?? 0),
  available: product.is_available,
});

export default function CustomerPage() {
  const [products, setProducts] = useState(defaultProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState(initialCustomer);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      if (!isSupabaseConfigured) {
        return;
      }

      setLoadingProducts(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("name", { ascending: true });

      if (!error && data?.length) {
        setProducts(data.map(mapDbProduct));
      }
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  const cartItems = useMemo(
    () =>
      Object.values(cart).filter((item) => item.quantity > 0 && Number(item.price) >= 0),
    [cart]
  );
  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current[product.id];
      return {
        ...current,
        [product.id]: {
          ...product,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const updateQuantity = (productId, nextQuantity) => {
    setCart((current) => {
      if (nextQuantity <= 0) {
        const copy = { ...current };
        delete copy[productId];
        return copy;
      }

      return {
        ...current,
        [productId]: {
          ...current[productId],
          quantity: nextQuantity,
        },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => {
      const copy = { ...current };
      delete copy[productId];
      return copy;
    });
  };

  const handleCustomerInput = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const saveOrderToSupabase = async () => {
    if (!isSupabaseConfigured || !cartItems.length) {
      return;
    }

    const orderPayload = {
      customer_name: customer.name,
      customer_phone: customer.phone,
      fulfillment_type: customer.fulfillmentType,
      address: customer.address,
      notes: customer.notes,
      total_amount: totalAmount,
      order_status: "New",
      payment_status: "Pending",
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    const orderItemsPayload = cartItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.id.toString().startsWith("sample-") ? null : item.id,
      product_name: item.name,
      product_size: item.size,
      quantity: item.quantity,
      selling_price: item.price,
      net_rate: item.net_rate ?? 0,
    }));

    const { error: itemError } = await supabase.from("order_items").insert(orderItemsPayload);
    if (itemError) {
      throw new Error(itemError.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!customer.name || !customer.phone || !cartItems.length) {
      setFeedback("Please add items and fill name + phone before placing order.");
      return;
    }

    try {
      await saveOrderToSupabase();
      const whatsappUrl = buildWhatsAppUrl({ customer, cartItems, totalAmount });
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setFeedback("Order details prepared. Please confirm in WhatsApp.");
      setCart({});
      setCustomer(initialCustomer);
    } catch (error) {
      setFeedback(
        `Order was prepared for WhatsApp, but saving in Supabase failed: ${error.message}`
      );
      const whatsappUrl = buildWhatsAppUrl({ customer, cartItems, totalAmount });
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`min-h-screen ${colorClasses.bg} text-[#2f2a26]`}>
      <header
        className={`${colorClasses.primary} px-4 py-8 text-center text-[#f8f2e8] shadow-lg`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#d9b86f]">
          Pre-orders only
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Ranganayaki Godavari Ruchulu</h1>
        <p className="mt-2 text-lg italic text-[#f3dba0]">Traditional Taste, Pure Love</p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-[#f8f2e8]">
          Authentic Rajahmundry / Godavari sweets and snacks in Vizag. Freshly made for your
          family functions, festivals, and gifting.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
        <section className={`rounded-2xl border border-[#d9c7a6] ${colorClasses.card} p-5 shadow`}>
          <h2 className="text-xl font-semibold text-[#6e1f2b]">Our Story</h2>
          <p className="mt-3 leading-7">
            From the traditional kitchens of Rajahmundry to homes in Vizag, we bring original
            Godavari-style sweets with homemade care. Every batch is prepared with quality
            ingredients, hygiene, and attention to authentic taste.
          </p>
        </section>

        <section className={`rounded-2xl border border-[#d9c7a6] ${colorClasses.card} p-5 shadow`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#6e1f2b]">Product Menu</h2>
            <p className="text-xs font-medium uppercase tracking-wider text-[#214632]">
              {loadingProducts ? "Loading products..." : "Freshly prepared for pre-order"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-[#eadfca] bg-white p-4 shadow-sm"
              >
                <div className="mb-3 h-24 rounded-lg bg-[#f6ead0] p-2 text-xs text-[#6a5d4f]">
                  <p className="rounded bg-white/70 px-2 py-1 text-center">
                    Image placeholder
                  </p>
                </div>
                <h3 className="font-semibold text-[#6e1f2b]">{product.name}</h3>
                <p className="text-sm text-[#214632]">{product.size}</p>
                <p className="mt-1 font-bold text-[#b08833]">{formatINR(product.price)}</p>
                <button
                  disabled={!product.available}
                  onClick={() => addToCart(product)}
                  className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                    product.available
                      ? `${colorClasses.secondary} hover:bg-[#1a3527]`
                      : "cursor-not-allowed bg-slate-400"
                  }`}
                >
                  {product.available ? "Add to Order" : "Unavailable"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
            <h2 className="text-xl font-semibold text-[#6e1f2b]">Cart / Order Summary</h2>
            {!cartItems.length ? (
              <p className="mt-3 text-sm text-slate-600">Your cart is empty.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-[#f1e6cf] bg-[#fffaf2] p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-slate-600">
                          {item.size} · {formatINR(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-semibold text-[#6e1f2b]"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded border border-[#d9c7a6] px-2"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded border border-[#d9c7a6] px-2"
                      >
                        +
                      </button>
                      <span className="ml-auto font-semibold text-[#214632]">
                        {formatINR(item.quantity * item.price)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-[#eadfca] pt-3 text-right font-bold">
                  Total: {formatINR(totalAmount)}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#d9c7a6] bg-white p-5 shadow">
            <h2 className="text-xl font-semibold text-[#6e1f2b]">Customer Details</h2>
            <div className="mt-4 grid gap-3">
              <input
                name="name"
                value={customer.name}
                onChange={handleCustomerInput}
                placeholder="Name"
                className="rounded-lg border border-[#d9c7a6] px-3 py-2"
              />
              <input
                name="phone"
                value={customer.phone}
                onChange={handleCustomerInput}
                placeholder="Phone Number"
                className="rounded-lg border border-[#d9c7a6] px-3 py-2"
              />
              <select
                name="fulfillmentType"
                value={customer.fulfillmentType}
                onChange={handleCustomerInput}
                className="rounded-lg border border-[#d9c7a6] px-3 py-2"
              >
                <option>Delivery</option>
                <option>Pickup</option>
              </select>
              <textarea
                name="address"
                value={customer.address}
                onChange={handleCustomerInput}
                placeholder="Address (required for delivery)"
                rows={2}
                className="rounded-lg border border-[#d9c7a6] px-3 py-2"
              />
              <textarea
                name="notes"
                value={customer.notes}
                onChange={handleCustomerInput}
                placeholder="Additional notes"
                rows={2}
                className="rounded-lg border border-[#d9c7a6] px-3 py-2"
              />
              <button
                onClick={handlePlaceOrder}
                className={`rounded-lg px-4 py-2 font-semibold text-white ${colorClasses.secondary} hover:bg-[#1a3527]`}
              >
                Place Order on WhatsApp
              </button>
              {feedback ? <p className="text-sm text-[#6e1f2b]">{feedback}</p> : null}
            </div>
          </div>
        </section>

        <section className={`rounded-2xl border border-[#d9c7a6] ${colorClasses.card} p-5 shadow`}>
          <h2 className={`text-xl font-semibold ${colorClasses.accent}`}>
            Freshly Made • Hygienically Prepared • Quality Assured
          </h2>
          <p className="mt-2 text-sm leading-7">
            Every order is prepared in small batches only after pre-order confirmation. This helps
            us maintain freshness, consistency, and homemade quality.
          </p>
        </section>

        {!isSupabaseConfigured ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Supabase is not configured yet. Sample products are shown now. Add{" "}
            <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in a{" "}
            <code>.env</code> file to enable live product/order/admin features.
          </section>
        ) : null}
      </main>

      <footer className={`${colorClasses.primary} px-4 py-5 text-center text-[#f8f2e8]`}>
        <p className="font-semibold">Pre-orders only • Contact: +91 99638 14860</p>
        <a
          href="https://wa.me/919963814860"
          className="mt-2 inline-block rounded-full border border-[#d9b86f] px-4 py-2 text-sm font-semibold text-[#f3dba0]"
        >
          Chat on WhatsApp
        </a>
      </footer>
    </div>
  );
}
