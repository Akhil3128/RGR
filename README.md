# Ranganayaki Godavari Ruchulu

A complete responsive React + Vite + Tailwind CSS website for a homemade Godavari sweets business in Vizag.

**Tagline:** Traditional Taste, Pure Love  
**Selling model:** Pre-orders only through WhatsApp  
**Contact:** +91 99638 14860

## Features

### Customer website

- Mobile-first home page with traditional maroon, dark green, gold, and cream styling.
- Brand story: authentic Rajahmundry / Godavari sweets from Rajahmundry to Vizag.
- Product menu with item cards, size, price, and Add to Order button.
- Cart with quantity increase/decrease and remove actions.
- Customer form for name, phone, delivery/pickup, address, and notes.
- WhatsApp order button that sends full order details to `+91 99638 14860`.
- Orders are saved to Supabase when configured.
- Sample products are used automatically when Supabase is not configured.

### Admin panel

- Supabase Auth login.
- Product add, edit, delete.
- Selling price and net rate / cost price updates.
- Available / unavailable toggle.
- Inventory management:
  - Opening Stock
  - Stock Received
  - Sales
  - Closing Stock = Opening Stock + Stock Received - Sales
- Order list with order status and payment status updates.
- Dashboard cards:
  - Total Orders
  - Total Sales Amount
  - Total Cost Amount
  - Total Profit
  - Pending Orders
  - Low Stock Items

## Folder structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── README.md
├── supabase
│   └── schema.sql
└── src
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components
    │   ├── AdminDashboard.jsx
    │   ├── AdminLogin.jsx
    │   ├── CartSummary.jsx
    │   ├── CustomerForm.jsx
    │   └── ProductCard.jsx
    ├── data
    │   └── sampleProducts.js
    ├── lib
    │   └── supabase.js
    └── utils
        └── order.js
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment example:

   ```bash
   cp .env.example .env
   ```

3. Add Supabase values to `.env`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open:

   - Customer website: `http://localhost:5173`
   - Admin panel: `http://localhost:5173/admin`

If `.env` is not configured yet, the customer site still works with sample products and opens WhatsApp with the order details. Supabase saving and admin login need the environment variables.

## Supabase database setup

1. Create a Supabase project.
2. Open Supabase Dashboard > SQL Editor.
3. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql).
4. Confirm that the seed products are visible in the `products` table.

The SQL creates:

- `products`
- `orders`
- `order_items`
- `inventory`
- `admin_users`

Important formulas are stored or calculated as:

- Sales Amount = Qty Sold x Selling Price
- Cost Amount = Qty Sold x Net Rate
- Profit = Sales Amount - Cost Amount
- Closing Stock = Opening Stock + Stock Received - Sales

## Admin login setup

1. In Supabase Dashboard, go to Authentication > Users.
2. Create an admin user with email and password.
3. Copy the new user's UUID.
4. In SQL Editor, register that user as an admin:

   ```sql
   insert into public.admin_users (user_id, email)
   values ('AUTH_USER_UUID_HERE', 'admin@example.com');
   ```

5. Visit `/admin` and login with that email and password.

Only users listed in `admin_users` can manage products, inventory, and orders.

## Product seed list

The seed products are included in `supabase/schema.sql` and `src/data/sampleProducts.js`:

1. Kova 200 gm - ₹140
2. Kova 250 gm - ₹175
3. Kova 500 gm - ₹350
4. Kova 1 Kg - ₹700
5. Sunnundalu 200 gm - ₹140
6. Sunnundalu 250 gm - ₹175
7. Sunnundalu 500 gm - ₹350
8. Sunnundalu 1 Kg - ₹700
9. Plain Putharekulu - 5 Pieces - price editable from admin
10. Dryfruit Putharekulu - 5 Pieces - ₹200
11. Jantikalu Hot - 200 gm - ₹100
12. Boondhi Hot - 200 gm - ₹100
13. Paneer 250 gm - ₹145
14. Paneer 500 gm - ₹290
15. Paneer 1 Kg - ₹580
16. Cow Ghee 1/2 Kg - ₹390
17. Cow Ghee 1 Kg - ₹780
18. Buffalo Ghee 1/2 Kg - ₹390
19. Buffalo Ghee 1 Kg - ₹780

## Build for production

```bash
npm run build
```

The production output is created in `dist/`.
