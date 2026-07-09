import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'rgr_cart_v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial)

  // Persist cart so it survives page refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id)
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          size: product.size,
          price: Number(product.price),
          quantity: 1,
        },
      ]
    })
  }

  function increment(id) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: it.quantity + 1 } : it,
      ),
    )
  }

  function decrement(id) {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: it.quantity - 1 } : it,
        )
        .filter((it) => it.quantity > 0),
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items],
  )

  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  )

  const value = {
    items,
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}
