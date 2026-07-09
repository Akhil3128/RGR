# Ranganayaki Godavari Ruchulu 🍯

Authentic Rajahmundry / Godavari sweets & snacks — homemade with love, delivered in Vizag.

> **Traditional Taste, Pure Love** — Pre-orders only, via WhatsApp.

A complete, beginner-friendly website with:

1. **Customer website** — browse the menu, build a pre-order basket, and send it straight to WhatsApp.
2. **Admin panel** — secure login (Supabase Auth) to manage products, inventory, and orders, plus a sales/profit dashboard.

Built with **React + Vite + Tailwind CSS** on the frontend and **Supabase** (Postgres + Auth) on the backend.

---

## 1. Folder Structure

```
ranganayaki-godavari-ruchulu/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/              # Reusable customer-site components
│   │   ├── admin/                # Reusable admin-panel components
│   │   │   ├── AdminLayout.jsx   # Top bar + nav for all admin pages
│   │   │   ├── Modal.jsx         # Small reusable modal/dialog
│   │   │   ├── ProtectedRoute.jsx# Blocks /admin/* unless logged in + is admin
│   │   │   └── StatCard.jsx      # Dashboard stat card
│   │   ├── BrandStory.jsx
│   │   ├── CartPanel.jsx         # Cart drawer + checkout form + WhatsApp send
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderForm.jsx         # Name / phone / pickup-delivery / address / notes
│   │   ├── PreOrderBanner.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductMenu.jsx
│   │   ├── QualitySection.jsx
│   │   ├── StickyCartBar.jsx     # Mobile bottom "view cart" bar
│   │   └── WhatsAppFloatButton.jsx
│   ├── context/
│   │   ├── AuthContext.jsx       # Supabase auth session + isAdmin flag
│   │   └── CartContext.jsx       # Cart state (add/remove/qty), saved to localStorage
│   ├── data/
│   │   └── sampleProducts.js     # Fallback demo products (used until Supabase is set up)
│   ├── hooks/
│   │   └── useProducts.js        # Loads products from Supabase (or sample data)
│   ├── lib/
│   │   └── supabaseClient.js     # Creates the Supabase client from your .env values
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── DashboardHome.jsx # Stat cards: orders, sales, cost, profit, low stock...
│   │   │   ├── Inventory.jsx     # Opening/Received/Sales -> Closing stock per product
│   │   │   ├── Login.jsx         # Admin login form
│   │   │   ├── Orders.jsx        # View orders, update status & payment status
│   │   │   └── Products.jsx      # Add / edit / delete products, toggle availability
│   │   └── Home.jsx              # Assembles the whole customer-facing page
│   ├── utils/
│   │   ├── format.js             # ₹ currency formatting helpers
│   │   ├── orderService.js       # Saves an order + order items to Supabase
│   │   └── whatsapp.js           # Builds the WhatsApp pre-order message & link
│   ├── App.jsx                   # All routes (customer site + admin panel)
│   ├── index.css                 # Tailwind + small global styles
│   └── main.jsx                  # App entry point (providers + router)
├── supabase/
│   └── schema.sql                # Full database schema, RLS policies, and seed data
├── .env.example                  # Copy to .env and fill in your Supabase project keys
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js            # Brand colors: maroon, forest (dark green), gold, cream
└── vite.config.js
```

---

## 2. Quick Start (runs immediately, even without Supabase)

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). The website works right away using **sample menu data** — you can browse the menu and even test the WhatsApp ordering flow. It just won't save orders to a database or let you log in to `/admin` until you connect Supabase (Step 3 below).

Other useful commands:

```bash
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
npm run lint       # check code with ESLint
```

---

## 3. Connecting Supabase (database + admin login)

### 3.1 Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account/project.
2. Once the project is ready, go to **Project Settings → API**.
3. Copy the **Project URL** and the **anon public key**.

### 3.2 Set up your environment variables

In the project root, copy `.env.example` to a new file named `.env`:

```bash
cp .env.example .env
```

Fill in the two values:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_WHATSAPP_NUMBER=919963814860
```

> `VITE_WHATSAPP_NUMBER` is already set to the shop's number (+91 99638 14860, no `+`/spaces). Change it only if the order number changes.

Restart `npm run dev` after editing `.env` so Vite picks up the new values.

### 3.3 Create the database tables

1. In your Supabase project, open the **SQL Editor**.
2. Open the file [`supabase/schema.sql`](./supabase/schema.sql) from this project, copy **all** of it.
3. Paste into a new SQL Editor query and click **Run**.

This creates:

- `products` — the menu, with selling price, net rate (cost price), availability, etc.
- `orders` and `order_items` — pre-orders placed from the website.
- `inventory` — daily Opening Stock / Stock Received / Sales / Closing Stock per product.
- `admin_users` — whitelist of who can access `/admin`.
- Row Level Security (RLS) policies so that:
  - Anyone can view products and place an order (needed for the public site).
  - Only admins can manage products, inventory, and view/update orders.
- 19 seed products matching the menu described below (with **Plain Putharekulu** left with no price — the admin sets it later, see [Section 6](#6-editable-price-plain-putharekulu)).

### 3.4 Create your admin login

1. In Supabase, go to **Authentication → Users → Add User**, and create a user with your email + a password (this is what you'll log in with at `/admin/login`).
2. Copy that user's **UID** from the Users table.
3. Back in the **SQL Editor**, run:

```sql
insert into public.admin_users (user_id, full_name)
values ('PASTE-USER-UID-HERE', 'Admin Name');
```

4. Go to `/admin/login` on your site and log in with that email + password. You're now in the admin dashboard!

> You can repeat step 3 to add more admins later (any existing admin's email works too).

---

## 4. Customer Website

- **Home / Hero** — tagline, pre-order CTA.
- **Brand Story** — "From Rajahmundry to Vizag" section.
- **Menu** — products grouped by category (Sweets, Snacks, Dairy & Ghee), each with an image placeholder, size, price, and an "Add to Order" button that turns into a quantity stepper.
- **Cart** — click the "Cart" button (top-right) or the sticky bar at the bottom on mobile to open the cart drawer. You can change quantities or remove items.
- **Checkout form** — name, phone, pickup/delivery, address (only required for delivery), and optional notes.
- **Send Pre-Order via WhatsApp** — builds a message with all order details (name, phone, items, quantities, prices, total, delivery/pickup, address, notes) and opens WhatsApp to **+91 99638 14860**. The order is also saved to Supabase (if configured) before WhatsApp opens.
- **Pre-Orders Only** banner at the top of the site.
- **Quality section** — Freshly Made / Hygienically Prepared / Quality Assured.
- **Footer** — contact number (tap to call) + WhatsApp button + link to Admin Login.

### Product list (seeded in `supabase/schema.sql`)

| Product | Size | Price |
|---|---|---|
| Kova | 200 gm | ₹140 |
| Kova | 250 gm | ₹175 |
| Kova | 500 gm | ₹350 |
| Kova | 1 Kg | ₹700 |
| Sunnundalu | 200 gm | ₹140 |
| Sunnundalu | 250 gm | ₹175 |
| Sunnundalu | 500 gm | ₹350 |
| Sunnundalu | 1 Kg | ₹700 |
| Plain Putharekulu | 5 Pieces | *Set by admin* |
| Dryfruit Putharekulu | 5 Pieces | ₹200 |
| Jantikalu Hot | 200 gm | ₹100 |
| Boondhi Hot | 200 gm | ₹100 |
| Paneer | 250 gm | ₹145 |
| Paneer | 500 gm | ₹290 |
| Paneer | 1 Kg | ₹580 |
| Cow Ghee | 1/2 Kg | ₹390 |
| Cow Ghee | 1 Kg | ₹780 |
| Buffalo Ghee | 1/2 Kg | ₹390 |
| Buffalo Ghee | 1 Kg | ₹780 |

---

## 5. Admin Panel

Go to `/admin/login`, sign in, and you'll land on the dashboard at `/admin`.

- **Dashboard** (`/admin`) — Total Orders, Total Sales Amount, Total Cost Amount, Total Profit, Pending Orders, Low Stock Items.
- **Orders** (`/admin/orders`) — see every pre-order (with items, address, notes), and update:
  - **Order Status**: New → Confirmed → Preparing → Ready → Delivered (or Cancelled).
  - **Payment Status**: Pending / Paid / Partial.
- **Products** (`/admin/products`) — add, edit, delete products; set selling price and net rate (cost price); mark available/unavailable.
- **Inventory** (`/admin/inventory`) — enter Opening Stock, Stock Received, and Sales for a product on a given date. Closing Stock is calculated automatically by the database:

  ```
  Closing Stock = Opening Stock + Stock Received − Sales
  ```

  Low-stock products (closing stock at or below their threshold) are flagged with a warning banner.

### Dashboard formulas

```
Sales Amount = Qty Sold × Selling Price
Cost Amount  = Qty Sold × Net Rate
Profit       = Sales Amount − Cost Amount
```

These are computed live from `order_items` (sales/selling price) joined with each product's current `net_rate` (cost price) — so keep the net rate updated in **Products** for accurate profit numbers.

---

## 6. Editable Price — Plain Putharekulu

Per the requirements, **Plain Putharekulu** is seeded with `price = NULL` ("price on request") instead of a fixed price. On the customer site it shows "Price on request" and can still be added to the cart — the WhatsApp message will say "Price to be confirmed" for that item. As soon as the admin sets a price for it in **Products → Edit**, it behaves like every other item. This same "leave price blank" trick works for any product, not just this one.

---

## 7. Design

Mobile-first, card-based layout using a traditional-but-modern Indian sweet-shop palette:

- **Maroon** `#7A1F2B` — primary brand color (headers, buttons)
- **Dark Green (Forest)** `#1F3D2B` — secondary accent, WhatsApp CTA
- **Gold** `#D4A017` — highlights, borders, price accents
- **Cream** `#FBF3E3` — background

Colors are defined in [`tailwind.config.js`](./tailwind.config.js) as `maroon`, `forest`, `gold`, and `cream` (e.g. `bg-maroon`, `text-gold-dark`, `border-forest/30`).

---

## 8. If Supabase Isn't Configured Yet

The site is designed to always be demo-able:

- The **customer site** shows the sample products from `src/data/sampleProducts.js` and the full WhatsApp ordering flow still works (it just won't be saved to a database).
- The **admin panel** (`/admin` and `/admin/login`) shows a clear "Supabase Not Configured" message with instructions instead of crashing.

Once you add real `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` values and restart the dev server, everything switches over to live data automatically — no code changes needed.

---

## 9. Deploying

This is a static Vite app, so it can be deployed to Vercel, Netlify, Cloudflare Pages, or any static host:

1. Set the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`) in your hosting provider's dashboard.
2. Build command: `npm run build`
3. Output directory: `dist`

Remember to also add your production domain to Supabase's **Authentication → URL Configuration → Redirect URLs** if you use email links later (not required for the current email/password login flow).

---

## 10. Tech Stack Summary

- **Frontend**: React 19 + Vite + React Router + Tailwind CSS
- **Backend**: Supabase (Postgres database, Auth, Row Level Security)
- **State**: React Context (`CartContext`, `AuthContext`), no extra state library needed
- **Ordering**: WhatsApp deep link (`wa.me`) + Supabase insert

No unnecessary complexity — plain functions, small components, and comments only where the "why" isn't obvious from the code itself.
