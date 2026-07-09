// Sample products used ONLY when Supabase is not configured yet.
// Prices and cost (net_rate) match the SQL seed in /supabase/schema.sql.
// net_rate = cost price to the shop (used by admin for profit calculation).

export const SAMPLE_PRODUCTS = [
  // --- Kova ---
  { id: 'kova-200', name: 'Kova', category: 'Sweets', size: '200 gm', price: 140, net_rate: 95, is_available: true, image_url: null, sort_order: 1 },
  { id: 'kova-250', name: 'Kova', category: 'Sweets', size: '250 gm', price: 175, net_rate: 118, is_available: true, image_url: null, sort_order: 2 },
  { id: 'kova-500', name: 'Kova', category: 'Sweets', size: '500 gm', price: 350, net_rate: 235, is_available: true, image_url: null, sort_order: 3 },
  { id: 'kova-1kg', name: 'Kova', category: 'Sweets', size: '1 Kg', price: 700, net_rate: 470, is_available: true, image_url: null, sort_order: 4 },

  // --- Sunnundalu ---
  { id: 'sunnundalu-200', name: 'Sunnundalu', category: 'Sweets', size: '200 gm', price: 140, net_rate: 95, is_available: true, image_url: null, sort_order: 5 },
  { id: 'sunnundalu-250', name: 'Sunnundalu', category: 'Sweets', size: '250 gm', price: 175, net_rate: 118, is_available: true, image_url: null, sort_order: 6 },
  { id: 'sunnundalu-500', name: 'Sunnundalu', category: 'Sweets', size: '500 gm', price: 350, net_rate: 235, is_available: true, image_url: null, sort_order: 7 },
  { id: 'sunnundalu-1kg', name: 'Sunnundalu', category: 'Sweets', size: '1 Kg', price: 700, net_rate: 470, is_available: true, image_url: null, sort_order: 8 },

  // --- Putharekulu (Plain price is editable from admin) ---
  { id: 'putharekulu-plain', name: 'Plain Putharekulu', category: 'Sweets', size: '5 Pieces', price: 150, net_rate: 100, is_available: true, image_url: null, sort_order: 9 },
  { id: 'putharekulu-dryfruit', name: 'Dryfruit Putharekulu', category: 'Sweets', size: '5 Pieces', price: 200, net_rate: 135, is_available: true, image_url: null, sort_order: 10 },

  // --- Hot Snacks ---
  { id: 'jantikalu-hot-200', name: 'Jantikalu Hot', category: 'Snacks', size: '200 gm', price: 100, net_rate: 65, is_available: true, image_url: null, sort_order: 11 },
  { id: 'boondhi-hot-200', name: 'Boondhi Hot', category: 'Snacks', size: '200 gm', price: 100, net_rate: 65, is_available: true, image_url: null, sort_order: 12 },

  // --- Paneer ---
  { id: 'paneer-250', name: 'Paneer', category: 'Dairy', size: '250 gm', price: 145, net_rate: 100, is_available: true, image_url: null, sort_order: 13 },
  { id: 'paneer-500', name: 'Paneer', category: 'Dairy', size: '500 gm', price: 290, net_rate: 200, is_available: true, image_url: null, sort_order: 14 },
  { id: 'paneer-1kg', name: 'Paneer', category: 'Dairy', size: '1 Kg', price: 580, net_rate: 400, is_available: true, image_url: null, sort_order: 15 },

  // --- Ghee ---
  { id: 'cow-ghee-half', name: 'Cow Ghee', category: 'Dairy', size: '1/2 Kg', price: 390, net_rate: 300, is_available: true, image_url: null, sort_order: 16 },
  { id: 'cow-ghee-1kg', name: 'Cow Ghee', category: 'Dairy', size: '1 Kg', price: 780, net_rate: 600, is_available: true, image_url: null, sort_order: 17 },
  { id: 'buffalo-ghee-half', name: 'Buffalo Ghee', category: 'Dairy', size: '1/2 Kg', price: 390, net_rate: 300, is_available: true, image_url: null, sort_order: 18 },
  { id: 'buffalo-ghee-1kg', name: 'Buffalo Ghee', category: 'Dairy', size: '1 Kg', price: 780, net_rate: 600, is_available: true, image_url: null, sort_order: 19 },
]
