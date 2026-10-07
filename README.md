# 📚 Book Worm — eBook Store

A complete, production-ready eBook Store built with **React 18 + TypeScript + Tailwind CSS**, based on the provided UI screenshots. Dark-themed UI with a modern eCommerce design inspired by the Book Worm platform.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

```bash
cd ebook-store
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── book/
│   │   ├── BookCard.tsx         # Compact book card used in grids
│   │   └── FeaturedBookCard.tsx # Horizontal card for recommendations
│   ├── cart/
│   │   ├── CartItem.tsx         # Cart line item with qty controls
│   │   └── OrderSummary.tsx     # Price breakdown + coupon + checkout CTA
│   ├── layout/
│   │   ├── Navbar.tsx           # Top navigation bar
│   │   └── Footer.tsx           # Site footer
│   └── ui/
│       ├── Alert.tsx            # Success/error/info banners
│       ├── Button.tsx           # Reusable button with variants
│       ├── Loader.tsx           # Spinner + skeleton components
│       ├── Modal.tsx            # Accessible modal overlay
│       ├── SearchBar.tsx        # Search input with clear button
│       └── StarRating.tsx       # Interactive/static star rating
├── context/
│   └── CartContext.tsx          # Global cart state (React Context + localStorage)
├── data/
│   └── books.ts                 # Mock book data, authors, reviews
├── pages/
│   ├── HomePage.tsx             # Landing page with hero + featured sections
│   ├── CatalogPage.tsx          # Browse / filter / search all books
│   ├── BookDetailPage.tsx       # Single book detail + reviews + related reads
│   ├── CartPage.tsx             # Shopping cart
│   ├── CheckoutPage.tsx         # Address form + order summary
│   ├── PaymentPage.tsx          # Payment method selection + form
│   ├── ConfirmationPage.tsx     # Order success confirmation
│   ├── OrdersPage.tsx           # My Orders placeholder
│   └── WishlistPage.tsx         # Wishlist placeholder
├── types/
│   └── index.ts                 # TypeScript interfaces & types
├── App.tsx                      # Root component with Router + CartProvider
└── main.tsx                     # React entry point
```

---

## 🛣️ Routes

| Route           | Page                         |
|-----------------|------------------------------|
| `/`             | Home — hero, featured, new   |
| `/catalog`      | Browse all books             |
| `/book/:id`     | Book detail, reviews         |
| `/cart`         | Shopping cart                |
| `/checkout`     | Address + order summary      |
| `/payment`      | Payment form (full-screen)   |
| `/confirmation` | Order success (full-screen)  |
| `/orders`       | My Orders                    |
| `/wishlist`     | My Wishlist                  |

---

## 🛒 Cart & State

- Global cart state via **React Context API**
- Cart automatically **persisted to `localStorage`**
- Supported operations: add, remove, update quantity, clear
- Coupon codes: `SAVE10`, `BOOK20`, `WELCOME50`, `READ100`

---

## 🎨 Design

- **Dark theme** matching the Book Worm screenshots (`neutral-900` base)
- **Coloured book covers** generated from mock data — no external images needed
- Responsive: mobile-first, sidebar collapses on small screens
- Tailwind CSS utility classes throughout — no custom CSS file

---

## 📦 Dependencies

| Package              | Purpose                          |
|----------------------|----------------------------------|
| `react` + `react-dom`| Core UI library                  |
| `react-router-dom`   | Client-side routing              |
| `tailwindcss`        | Utility-first CSS                |
| `lucide-react`       | Icon set                         |
| `clsx`               | Conditional class names          |
| `framer-motion`      | (installed, available for use)   |

---

## 💡 Notes

- All book data is **mock data** — no backend or API required.
- The payment page does **not** process real payments.
- Extend with a real API by replacing `src/data/books.ts` with fetch calls in a service layer.
