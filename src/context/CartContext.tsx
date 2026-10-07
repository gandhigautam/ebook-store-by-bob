import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Book, CartItem, Order } from '../types';

interface CartState {
  items: CartItem[];
  coupon: string;
  discount: number;
  lastOrder: Order | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Book }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { coupon: string; discount: number } }
  | { type: 'SET_LAST_ORDER'; payload: Order }
  | { type: 'LOAD_CART'; payload: CartState };

const TAX_RATE = 0.12;
const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  BOOK20: 20,
  WELCOME50: 50,
  READ100: 100,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.book.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.book.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { book: action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.book.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.book.id !== action.payload.bookId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.book.id === action.payload.bookId ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: '', discount: 0 };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload.coupon, discount: action.payload.discount };
    case 'SET_LAST_ORDER':
      return { ...state, lastOrder: action.payload };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  coupon: string;
  discount: number;
  lastOrder: Order | null;
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  totalAmount: number;
  itemCount: number;
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  setLastOrder: (order: Order) => void;
  isInCart: (bookId: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'bookworm_cart';

const initialState: CartState = {
  items: [],
  coupon: '',
  discount: 0,
  lastOrder: null,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...init, items: parsed.items || [], coupon: parsed.coupon || '', discount: parsed.discount || 0 };
      }
    } catch {
      // ignore
    }
    return init;
  });

  // Persist cart to localStorage (skip lastOrder to keep storage light)
  useEffect(() => {
    const toStore = { items: state.items as CartItem[], coupon: state.coupon, discount: state.discount };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state.items, state.coupon, state.discount]);

  const subtotal = state.items.reduce((sum: number, i: CartItem) => sum + i.book.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryCharges = subtotal > 0 ? 0 : 0; // free delivery
  const totalAmount = subtotal + tax + deliveryCharges - state.discount;

  const addItem = (book: Book) => dispatch({ type: 'ADD_ITEM', payload: book });
  const removeItem = (bookId: string) => dispatch({ type: 'REMOVE_ITEM', payload: bookId });
  const updateQuantity = (bookId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const upper = code.toUpperCase();
    if (VALID_COUPONS[upper] !== undefined) {
      dispatch({ type: 'APPLY_COUPON', payload: { coupon: upper, discount: VALID_COUPONS[upper] } });
      return { success: true, message: `Coupon applied! ₹${VALID_COUPONS[upper]} discount.` };
    }
    return { success: false, message: 'Invalid coupon code.' };
  };

  const setLastOrder = (order: Order) => dispatch({ type: 'SET_LAST_ORDER', payload: order });
  const isInCart = (bookId: string) => state.items.some((i: CartItem) => i.book.id === bookId);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        discount: state.discount,
        lastOrder: state.lastOrder,
        subtotal,
        tax,
        deliveryCharges,
        totalAmount,
        itemCount: state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        setLastOrder,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
