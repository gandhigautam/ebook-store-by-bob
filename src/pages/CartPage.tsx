import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItemComponent from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import Button from '../components/ui/Button';
import { BOOKS } from '../data/books';
import FeaturedBookCard from '../components/book/FeaturedBookCard';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const recommended = BOOKS.filter(
    (b) => !items.some((i) => i.book.id === b.id)
  ).slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="text-neutral-600 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-neutral-400 text-sm mb-6">Add some books to get started.</p>
          <Button onClick={() => navigate('/catalog')} iconRight={<ChevronRight size={16} />}>
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-200">Shopping Cart</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-10">
        <h1 className="text-white font-semibold text-xl mb-6">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 min-w-0 bg-neutral-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-400 text-xs">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              <button
                onClick={clearCart}
                className="text-red-400 text-xs hover:text-red-300 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <CartItemComponent key={item.book.id} item={item} />
            ))}

            <div className="mt-4 pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/catalog')}
                className="flex-1 sm:flex-none"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => navigate('/checkout')}
                iconRight={<ChevronRight size={16} />}
                className="flex-1 sm:flex-none sm:ml-auto"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-72 shrink-0">
            <OrderSummary
              onCheckout={() => navigate('/checkout')}
              checkoutLabel="Proceed to Checkout"
            />
          </div>
        </div>

        {/* You Might Also Like */}
        {recommended.length > 0 && (
          <section className="mt-10">
            <h2 className="text-white font-semibold text-sm mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((book) => (
                <FeaturedBookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
