// Sample products used when Supabase is not configured yet.
// The same list is also in `supabase/schema.sql` as seed data.
// `emoji` is just a friendly image placeholder until real photos are added.

export const SAMPLE_PRODUCTS = [
  { id: 'kova-200', name: 'Kova', size: '200 gm', price: 140, category: 'Sweets', emoji: '🥮', is_available: true },
  { id: 'kova-250', name: 'Kova', size: '250 gm', price: 175, category: 'Sweets', emoji: '🥮', is_available: true },
  { id: 'kova-500', name: 'Kova', size: '500 gm', price: 350, category: 'Sweets', emoji: '🥮', is_available: true },
  { id: 'kova-1kg', name: 'Kova', size: '1 Kg', price: 700, category: 'Sweets', emoji: '🥮', is_available: true },
  { id: 'sunnundalu-200', name: 'Sunnundalu', size: '200 gm', price: 140, category: 'Sweets', emoji: '🟡', is_available: true },
  { id: 'sunnundalu-250', name: 'Sunnundalu', size: '250 gm', price: 175, category: 'Sweets', emoji: '🟡', is_available: true },
  { id: 'sunnundalu-500', name: 'Sunnundalu', size: '500 gm', price: 350, category: 'Sweets', emoji: '🟡', is_available: true },
  { id: 'sunnundalu-1kg', name: 'Sunnundalu', size: '1 Kg', price: 700, category: 'Sweets', emoji: '🟡', is_available: true },
  // Plain Putharekulu price is a placeholder — the admin can edit it any time.
  { id: 'putharekulu-plain', name: 'Plain Putharekulu', size: '5 Pieces', price: 150, category: 'Sweets', emoji: '📜', is_available: true },
  { id: 'putharekulu-dryfruit', name: 'Dryfruit Putharekulu', size: '5 Pieces', price: 200, category: 'Sweets', emoji: '📜', is_available: true },
  { id: 'jantikalu-200', name: 'Jantikalu Hot', size: '200 gm', price: 100, category: 'Snacks', emoji: '🌀', is_available: true },
  { id: 'boondhi-200', name: 'Boondhi Hot', size: '200 gm', price: 100, category: 'Snacks', emoji: '🟠', is_available: true },
  { id: 'paneer-250', name: 'Paneer', size: '250 gm', price: 145, category: 'Dairy', emoji: '🧀', is_available: true },
  { id: 'paneer-500', name: 'Paneer', size: '500 gm', price: 290, category: 'Dairy', emoji: '🧀', is_available: true },
  { id: 'paneer-1kg', name: 'Paneer', size: '1 Kg', price: 580, category: 'Dairy', emoji: '🧀', is_available: true },
  { id: 'cow-ghee-500', name: 'Cow Ghee', size: '1/2 Kg', price: 390, category: 'Ghee', emoji: '🫕', is_available: true },
  { id: 'cow-ghee-1kg', name: 'Cow Ghee', size: '1 Kg', price: 780, category: 'Ghee', emoji: '🫕', is_available: true },
  { id: 'buffalo-ghee-500', name: 'Buffalo Ghee', size: '1/2 Kg', price: 390, category: 'Ghee', emoji: '🫕', is_available: true },
  { id: 'buffalo-ghee-1kg', name: 'Buffalo Ghee', size: '1 Kg', price: 780, category: 'Ghee', emoji: '🫕', is_available: true },
]

// Emoji placeholder per category, used for products added from the admin panel.
export const CATEGORY_EMOJI = {
  Sweets: '🍬',
  Snacks: '🥨',
  Dairy: '🧀',
  Ghee: '🫕',
}
