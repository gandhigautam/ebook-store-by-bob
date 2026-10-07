import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Settings, LayoutGrid } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <LayoutGrid size={18} className="text-blue-400" />
          <span className="text-white font-semibold text-sm tracking-wide">Book Worm</span>
        </Link>

        <div className="w-px h-5 bg-neutral-600" />

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/orders"
            className="text-neutral-300 text-sm hover:text-white transition-colors"
          >
            My Orders
          </Link>
          <Link
            to="/wishlist"
            className="text-neutral-300 text-sm hover:text-white transition-colors"
          >
            My Wishlist
          </Link>
          <Link
            to="/writers"
            className="text-neutral-300 text-sm hover:text-white transition-colors"
          >
            My Writers
          </Link>
        </nav>

        <div className="flex-1" />

        {/* Cart */}
        <button
          onClick={() => navigate('/cart')}
          className="relative text-neutral-300 hover:text-white transition-colors"
          aria-label="Shopping cart"
        >
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="text-neutral-300 hover:text-white transition-colors" aria-label="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
