// Sample/fallback product data.
// This is shown on the site ONLY when Supabase has not been configured yet
// (see src/lib/supabaseClient.js), so the site is always demo-able.
// Once Supabase is set up, real products come from the `products` table
// (see supabase/schema.sql for the seed data, which matches this list).

export const sampleProducts = [
  { id: 'sample-1', category: 'Sweets', name: 'Kova', size: '200 gm', price: 140, image_url: null, is_available: true },
  { id: 'sample-2', category: 'Sweets', name: 'Kova', size: '250 gm', price: 175, image_url: null, is_available: true },
  { id: 'sample-3', category: 'Sweets', name: 'Kova', size: '500 gm', price: 350, image_url: null, is_available: true },
  { id: 'sample-4', category: 'Sweets', name: 'Kova', size: '1 Kg', price: 700, image_url: null, is_available: true },
  { id: 'sample-5', category: 'Sweets', name: 'Sunnundalu', size: '200 gm', price: 140, image_url: null, is_available: true },
  { id: 'sample-6', category: 'Sweets', name: 'Sunnundalu', size: '250 gm', price: 175, image_url: null, is_available: true },
  { id: 'sample-7', category: 'Sweets', name: 'Sunnundalu', size: '500 gm', price: 350, image_url: null, is_available: true },
  { id: 'sample-8', category: 'Sweets', name: 'Sunnundalu', size: '1 Kg', price: 700, image_url: null, is_available: true },
  { id: 'sample-9', category: 'Sweets', name: 'Plain Putharekulu', size: '5 Pieces', price: null, image_url: null, is_available: true },
  { id: 'sample-10', category: 'Sweets', name: 'Dryfruit Putharekulu', size: '5 Pieces', price: 200, image_url: null, is_available: true },
  { id: 'sample-11', category: 'Snacks', name: 'Jantikalu Hot', size: '200 gm', price: 100, image_url: null, is_available: true },
  { id: 'sample-12', category: 'Snacks', name: 'Boondhi Hot', size: '200 gm', price: 100, image_url: null, is_available: true },
  { id: 'sample-13', category: 'Dairy & Ghee', name: 'Paneer', size: '250 gm', price: 145, image_url: null, is_available: true },
  { id: 'sample-14', category: 'Dairy & Ghee', name: 'Paneer', size: '500 gm', price: 290, image_url: null, is_available: true },
  { id: 'sample-15', category: 'Dairy & Ghee', name: 'Paneer', size: '1 Kg', price: 580, image_url: null, is_available: true },
  { id: 'sample-16', category: 'Dairy & Ghee', name: 'Cow Ghee', size: '1/2 Kg', price: 390, image_url: null, is_available: true },
  { id: 'sample-17', category: 'Dairy & Ghee', name: 'Cow Ghee', size: '1 Kg', price: 780, image_url: null, is_available: true },
  { id: 'sample-18', category: 'Dairy & Ghee', name: 'Buffalo Ghee', size: '1/2 Kg', price: 390, image_url: null, is_available: true },
  { id: 'sample-19', category: 'Dairy & Ghee', name: 'Buffalo Ghee', size: '1 Kg', price: 780, image_url: null, is_available: true },
]

export const productCategories = ['Sweets', 'Snacks', 'Dairy & Ghee']
