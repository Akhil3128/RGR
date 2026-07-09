# Ranganayaki Godavari Ruchulu

A complete responsive website for a homemade sweets business — customer ordering via WhatsApp pre-orders, plus an admin panel for products, inventory, and orders.

**Tagline:** Traditional Taste, Pure Love

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (database + admin authentication)
- **Orders:** WhatsApp integration (+91 99638 14860)

---

## Quick Start (Run Locally)

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173`).

**Without Supabase configured**, the site runs in **demo mode** with sample products. You can browse the menu, add to cart, and test WhatsApp ordering.

### 3. Build for production

```bash
npm run build
npm run preview
```

---

## Supabase Setup

### Step 1: Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**
3. Choose a name, database password, and region (pick one close to India, e.g. Mumbai)
4. Wait for the project to finish setting up

### Step 2: Run the database schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` and paste it
4. Click **Run**

This creates:
- `products` — menu items with price and net rate
- `orders` — customer orders
- `order_items` — line items per order
- `inventory` — stock tracking per product

It also seeds all 19 default products and inventory records.

### Step 3: Get API keys

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Step 4: Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Restart the dev server after creating `.env`.

---

## Admin Login Setup

### Step 1: Create an admin user

1. In Supabase Dashboard, go to **Authentication → Users**
2. Click **Add User → Create New User**
3. Enter email and password (e.g. `admin@yourdomain.com`)
4. Check **Auto Confirm User**
5. Click **Create User**

### Step 2: Log in

1. Open `http://localhost:5173/admin`
2. Enter the email and password you created
3. You will be redirected to the admin dashboard

### Admin features

| Section | What you can do |
|---------|-----------------|
| **Dashboard** | Total orders, sales, cost, profit, pending orders, low stock alerts |
| **Products** | Add, edit, delete products; update price & net rate; mark available/unavailable |
| **Inventory** | Manage opening stock, stock received, sales; closing stock auto-calculated |
| **Orders** | View all orders; update status & payment status |

---

## Project Structure

```
├── index.html                 # HTML entry point
├── package.json
├── vite.config.js
├── .env.example               # Environment variable template
├── supabase/
│   └── schema.sql             # Database tables + seed data
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Routes (customer + admin)
    ├── index.css              # Tailwind + brand colors
    ├── lib/
    │   ├── constants.js       # Business info, phone number
    │   └── supabase.js        # Supabase client
    ├── data/
    │   └── sampleProducts.js  # Fallback products (demo mode)
    ├── context/
    │   ├── CartContext.jsx    # Shopping cart state
    │   └── AuthContext.jsx    # Admin auth state
    ├── hooks/
    │   ├── useProducts.js     # Fetch products
    │   └── useAdminData.js    # Fetch orders & inventory
    ├── utils/
    │   ├── formatters.js      # Currency, stock formulas
    │   └── whatsapp.js        # WhatsApp message builder
    ├── components/
    │   ├── layout/            # Header, Footer
    │   ├── customer/          # Hero, Menu, Cart, OrderForm, etc.
    │   ├── admin/             # Dashboard, Products, Inventory, Orders
    │   └── ui/                # Button, Card, Input, Badge
    └── pages/
        ├── HomePage.jsx       # Customer website (all sections)
        └── AdminLogin.jsx     # Admin login page
```

---

## Customer Website Sections

1. **Hero** — Brand name, tagline, CTA buttons
2. **Pre-Order Banner** — Pre-orders only message
3. **Brand Story** — Rajahmundry to Vizag story
4. **Product Menu** — All items with Add to Order
5. **Cart & Order Form** — Quantity controls, customer details
6. **WhatsApp Order** — Sends full order to +91 99638 14860
7. **Quality Promise** — Fresh, hygienic, quality assured
8. **Footer** — Contact & WhatsApp button

---

## Business Formulas (used in admin)

| Formula | Calculation |
|---------|-------------|
| Sales Amount | Qty Sold × Selling Price |
| Cost Amount | Qty Sold × Net Rate |
| Profit | Sales Amount − Cost Amount |
| Closing Stock | Opening Stock + Stock Received − Sales |

---

## Deploying

Build the static site and deploy to Vercel, Netlify, or any static host:

```bash
npm run build
```

Upload the `dist/` folder, and set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your hosting dashboard.

---

## Contact

**Ranganayaki Godavari Ruchulu**  
WhatsApp: +91 99638 14860  
Vizag, Andhra Pradesh
