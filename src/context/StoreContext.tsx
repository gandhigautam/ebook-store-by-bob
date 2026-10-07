/**
 * StoreContext — persists Orders, Wishlist, and My Writers to localStorage.
 * Completely independent from CartContext so cart state stays lean.
 */
import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Order, WishlistItem, WriterEntry, Book } from '../types';

// ─── Storage keys ────────────────────────────────────────────────────────────
const ORDERS_KEY = 'bookworm_orders';
const WISHLIST_KEY = 'bookworm_wishlist';
const WRITERS_KEY = 'bookworm_writers';

// ─── State ───────────────────────────────────────────────────────────────────
interface StoreState {
  orders: Order[];
  wishlist: WishlistItem[];
  writers: WriterEntry[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────
type StoreAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'ADD_TO_WISHLIST'; payload: Book }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string /* bookId */ }
  | { type: 'ADD_WRITER'; payload: string /* authorName */ }
  | { type: 'REMOVE_WRITER'; payload: string /* authorName */ };

// ─── Reducer ─────────────────────────────────────────────────────────────────
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'ADD_ORDER':
      // Prepend newest order first; avoid duplicates by id
      if (state.orders.some((o) => o.id === action.payload.id)) return state;
      return { ...state, orders: [action.payload, ...state.orders] };

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.some((w) => w.book.id === action.payload.id)) return state;
      return {
        ...state,
        wishlist: [{ book: action.payload, addedAt: new Date().toISOString() }, ...state.wishlist],
      };

    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter((w) => w.book.id !== action.payload) };

    case 'ADD_WRITER':
      if (state.writers.some((w) => w.authorName === action.payload)) return state;
      return {
        ...state,
        writers: [{ authorName: action.payload, addedAt: new Date().toISOString() }, ...state.writers],
      };

    case 'REMOVE_WRITER':
      return { ...state, writers: state.writers.filter((w) => w.authorName !== action.payload) };

    default:
      return state;
  }
}

// ─── Context value ────────────────────────────────────────────────────────────
interface StoreContextValue {
  orders: Order[];
  wishlist: WishlistItem[];
  writers: WriterEntry[];
  addOrder: (order: Order) => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  addWriter: (authorName: string) => void;
  removeWriter: (authorName: string) => void;
  isFollowingWriter: (authorName: string) => boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// ─── Hydration helper ─────────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore corrupt data
  }
  return fallback;
}

const initialState: StoreState = {
  orders: [],
  wishlist: [],
  writers: [],
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState, () => ({
    orders: loadFromStorage<Order[]>(ORDERS_KEY, []),
    wishlist: loadFromStorage<WishlistItem[]>(WISHLIST_KEY, []),
    writers: loadFromStorage<WriterEntry[]>(WRITERS_KEY, []),
  }));

  // Persist each slice independently
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem(WRITERS_KEY, JSON.stringify(state.writers));
  }, [state.writers]);

  const addOrder = (order: Order) => dispatch({ type: 'ADD_ORDER', payload: order });
  const addToWishlist = (book: Book) => dispatch({ type: 'ADD_TO_WISHLIST', payload: book });
  const removeFromWishlist = (bookId: string) => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: bookId });
  const isInWishlist = (bookId: string) => state.wishlist.some((w) => w.book.id === bookId);
  const addWriter = (authorName: string) => dispatch({ type: 'ADD_WRITER', payload: authorName });
  const removeWriter = (authorName: string) => dispatch({ type: 'REMOVE_WRITER', payload: authorName });
  const isFollowingWriter = (authorName: string) => state.writers.some((w) => w.authorName === authorName);

  return (
    <StoreContext.Provider
      value={{
        orders: state.orders,
        wishlist: state.wishlist,
        writers: state.writers,
        addOrder,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addWriter,
        removeWriter,
        isFollowingWriter,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
