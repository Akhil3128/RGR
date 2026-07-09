# Ranganayaki Godavari Ruchulu Website (React + Vite + Tailwind + Supabase)

Complete mobile-first website for **Ranganayaki Godavari Ruchulu** with:

1. **Customer website** (menu, cart, customer form, WhatsApp order)
2. **Admin panel** (Supabase auth login, products, inventory, orders, status updates, dashboard metrics)

Tagline: **Traditional Taste, Pure Love**  
Business model: **Pre-orders only via WhatsApp**

---

## 1) Tech stack

- React + Vite
- Tailwind CSS
- Supabase (Auth + Postgres)

---

## 2) Project folder structure

```text
.
├── index.html
├── package.json
├── postcss.config.js
├── vite.config.js
├── .env.example
├── supabase/
│   └── schema.sql
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   └── defaultProducts.js
    ├── lib/
    │   └── supabaseClient.js
    ├── utils/
    │   ├── currency.js
    │   └── whatsapp.js
    └── components/
        ├── customer/
        │   └── CustomerPage.jsx
        └── admin/
            ├── AdminLogin.jsx
            └── AdminDashboard.jsx
```

---

## 3) Setup steps (local)

### Step A: Install dependencies

```bash
npm install
```

### Step B: Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set values:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

If you skip this, app still runs with sample products and clear setup messages.

### Step C: Run the app

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

---

## 4) Supabase database setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run the full SQL in:

```text
supabase/schema.sql
```

This creates tables:
- `products`
- `orders`
- `order_items`
- `inventory`
- `admin_users`

Includes formulas:
- Sales Amount = Qty Sold × Selling Price
- Cost Amount = Qty Sold × Net Rate
- Profit = Sales Amount - Cost Amount
- Closing Stock = Opening Stock + Stock Received - Sales

Also includes:
- RLS policies for public order placement
- Admin-only management policies
- Default product seed data

---

## 5) Admin login instructions

### Step 1: Create admin auth user

In Supabase Dashboard:
- Authentication → Users → Create user (email + password)

### Step 2: Add that user into `admin_users`

After creating user, copy their `id` and `email`, then run:

```sql
insert into public.admin_users (user_id, email)
values ('<auth_user_uuid>', '<admin_email>');
```

### Step 3: Login

Visit:

```text
/admin/login
```

Use same email/password.

---

## 6) Feature list delivered

### Customer Website

- Hero section + tagline
- Brand story section (Rajahmundry to Vizag)
- Product menu cards with Add to Order
- Cart with:
  - add item
  - increase/decrease quantity
  - remove item
- Customer form:
  - name
  - phone
  - delivery/pickup
  - address
  - notes
- WhatsApp order button to `+91 99638 14860`
- WhatsApp message includes full order details
- Pre-orders only message clearly shown
- Freshly made / hygienic / quality section
- Footer contact + WhatsApp button
- Saves orders to Supabase (orders + order_items)

### Admin Panel

- Supabase Auth login
- Dashboard metrics:
  - Total Orders
  - Total Sales Amount
  - Total Cost Amount
  - Total Profit
  - Pending Orders
  - Low Stock Items
- Product management:
  - add
  - edit
  - delete
  - update selling price
  - update net rate (cost price)
  - mark available/unavailable
- Inventory management:
  - opening stock
  - stock received
  - sales
  - computed closing stock
- Orders management:
  - view orders
  - update order status
  - update payment status

---

## 7) Brand/design notes

- Mobile-first layout
- Traditional color palette:
  - Maroon
  - Dark green
  - Gold accents
  - Cream background
- Card-based clean UI
- Subtle borders + shadows

---

## 8) Production MVP notes

- This is clean and beginner-friendly MVP code.
- You can later add:
  - real product images
  - admin-side pagination/filtering
  - GST fields/invoice export
  - delivery slot/date selection
  - automatic inventory deduction on delivered orders
