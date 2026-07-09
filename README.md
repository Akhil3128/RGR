# Ranganayaki Godavari Ruchulu

Complete website for a homemade Godavari sweets business in Vizag.

**Tagline:** Traditional Taste, Pure Love  
**Model:** Pre-orders only via WhatsApp (+91 99638 14860)

## Tech stack

- React + Vite
- Tailwind CSS v4
- Supabase (database + admin auth)
- React Router

Works in **demo mode** without Supabase (sample products + localStorage).

---

## Folder structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/          # Admin layout, protected route
│   │   ├── customer/       # Hero, menu, cart, order form, footer
│   │   └── shared/         # Spinner, banners, headings
│   ├── context/
│   │   ├── AuthContext.jsx # Admin login session
│   │   └── CartContext.jsx # Customer cart
│   ├── data/
│   │   └── sampleProducts.js
│   ├── lib/
│   │   ├── api.js          # Products, orders, inventory API
│   │   ├── supabase.js     # Supabase client
│   │   └── utils.js        # Price, WhatsApp, stock formulas
│   ├── pages/
│   │   ├── admin/          # Login, dashboard, products, inventory, orders
│   │   └── customer/       # Home page
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── schema.sql          # Full database schema + seed data
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Leave them empty to run in **demo mode** (sample products, localStorage orders).

### 3. Run the app

```bash
npm run dev
```

Open http://localhost:5173

- Customer site: `/`
- Admin login: `/admin/login`

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Supabase setup

### A. Create a project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Copy **Project URL** and **anon public** key into `.env`.

### B. Create tables

1. Open **SQL Editor** in Supabase.
2. Paste and run everything in `supabase/schema.sql`.
3. This creates:
   - `products`
   - `orders`
   - `order_items`
   - `inventory`
   - `admin_users`
4. It also seeds all 19 products and inventory rows.

### C. Create an admin user

1. Go to **Authentication → Users → Add user**.
2. Create a user with email + password (e.g. `admin@ranganayaki.com`).
3. Optional — link profile:

```sql
INSERT INTO admin_users (id, email, full_name)
VALUES ('<paste-auth-user-uuid>', 'admin@ranganayaki.com', 'Admin');
```

4. Open `/admin/login` and sign in with that email and password.

### D. Demo admin (no Supabase)

If `.env` keys are empty, open `/admin/login` and click **Continue with Demo Admin**.  
Products, inventory, and orders are stored in the browser (`localStorage`).

---

## Customer website features

- Hero with brand name and tagline
- Brand story (Rajahmundry → Vizag)
- Product menu with Add to Order
- Cart with quantity +/− and remove
- Customer form (name, phone, delivery/pickup, address, notes)
- WhatsApp order button → sends full order to **+91 99638 14860**
- Order also saved to Supabase (or localStorage in demo mode)
- Quality section + footer with contact / WhatsApp
- Clear **Pre-orders only** messaging
- Mobile-first design (maroon, dark green, gold, cream)

### WhatsApp message includes

- Customer name & phone
- Items, quantity, price
- Total amount
- Delivery or pickup
- Address & notes

---

## Admin panel features

| Area | What you can do |
|------|-----------------|
| **Dashboard** | Total orders, sales, cost, profit, pending orders, low stock |
| **Products** | Add / edit / delete, update price & net rate, available toggle |
| **Inventory** | Opening stock, stock received, sales, closing stock |
| **Orders** | View orders, update status & payment status |

### Formulas

- Sales Amount = Qty Sold × Selling Price  
- Cost Amount = Qty Sold × Net Rate  
- Profit = Sales Amount − Cost Amount  
- Closing Stock = Opening Stock + Stock Received − Sales  

**Plain Putharekulu** is seeded with price `0` so you can set it from Admin → Products.

---

## Products included

1. Kova 200 gm – ₹140  
2. Kova 250 gm – ₹175  
3. Kova 500 gm – ₹350  
4. Kova 1 Kg – ₹700  
5. Sunnundalu 200 gm – ₹140  
6. Sunnundalu 250 gm – ₹175  
7. Sunnundalu 500 gm – ₹350  
8. Sunnundalu 1 Kg – ₹700  
9. Plain Putharekulu – 5 Pieces (price editable in admin)  
10. Dryfruit Putharekulu – 5 Pieces – ₹200  
11. Jantikalu Hot – 200 gm – ₹100  
12. Boondhi Hot – 200 gm – ₹100  
13. Paneer 250 gm – ₹145  
14. Paneer 500 gm – ₹290  
15. Paneer 1 Kg – ₹580  
16. Cow Ghee 1/2 Kg – ₹390  
17. Cow Ghee 1 Kg – ₹780  
18. Buffalo Ghee 1/2 Kg – ₹390  
19. Buffalo Ghee 1 Kg – ₹780  

---

## Contact

- Phone / WhatsApp: **+91 99638 14860**
