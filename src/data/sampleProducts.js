export const sampleProducts = [
  { id: '1', name: 'Kova', size: '200 gm', price: 140, net_rate: 100, category: 'Sweets', available: true },
  { id: '2', name: 'Kova', size: '250 gm', price: 175, net_rate: 125, category: 'Sweets', available: true },
  { id: '3', name: 'Kova', size: '500 gm', price: 350, net_rate: 250, category: 'Sweets', available: true },
  { id: '4', name: 'Kova', size: '1 Kg', price: 700, net_rate: 500, category: 'Sweets', available: true },
  { id: '5', name: 'Sunnundalu', size: '200 gm', price: 140, net_rate: 100, category: 'Sweets', available: true },
  { id: '6', name: 'Sunnundalu', size: '250 gm', price: 175, net_rate: 125, category: 'Sweets', available: true },
  { id: '7', name: 'Sunnundalu', size: '500 gm', price: 350, net_rate: 250, category: 'Sweets', available: true },
  { id: '8', name: 'Sunnundalu', size: '1 Kg', price: 700, net_rate: 500, category: 'Sweets', available: true },
  { id: '9', name: 'Plain Putharekulu', size: '5 Pieces', price: 150, net_rate: 100, category: 'Sweets', available: true },
  { id: '10', name: 'Dryfruit Putharekulu', size: '5 Pieces', price: 200, net_rate: 140, category: 'Sweets', available: true },
  { id: '11', name: 'Jantikalu Hot', size: '200 gm', price: 100, net_rate: 70, category: 'Snacks', available: true },
  { id: '12', name: 'Boondhi Hot', size: '200 gm', price: 100, net_rate: 70, category: 'Snacks', available: true },
  { id: '13', name: 'Paneer', size: '250 gm', price: 145, net_rate: 100, category: 'Dairy', available: true },
  { id: '14', name: 'Paneer', size: '500 gm', price: 290, net_rate: 200, category: 'Dairy', available: true },
  { id: '15', name: 'Paneer', size: '1 Kg', price: 580, net_rate: 400, category: 'Dairy', available: true },
  { id: '16', name: 'Cow Ghee', size: '1/2 Kg', price: 390, net_rate: 300, category: 'Ghee', available: true },
  { id: '17', name: 'Cow Ghee', size: '1 Kg', price: 780, net_rate: 600, category: 'Ghee', available: true },
  { id: '18', name: 'Buffalo Ghee', size: '1/2 Kg', price: 390, net_rate: 300, category: 'Ghee', available: true },
  { id: '19', name: 'Buffalo Ghee', size: '1 Kg', price: 780, net_rate: 600, category: 'Ghee', available: true },
]

export const sampleInventory = sampleProducts.map((p) => ({
  product_id: p.id,
  opening_stock: 0,
  stock_received: 0,
  sales: 0,
  closing_stock: 0,
}))
