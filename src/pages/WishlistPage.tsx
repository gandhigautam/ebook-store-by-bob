import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useStore();
  const { addItem, isInCart } = useCart();

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">My Wishlist</h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/catalog')}
            iconRight={<ChevronRight size={14} />}
          >
            Browse Books
          </Button>
        </div>

        {wishlist.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart size={56} className="text-neutral-600 mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-neutral-400 text-sm mb-6 max-w-xs">
              Browse the catalog and hit "Add to Wishlist" on any book you love.
            </p>
            <Button onClick={() => navigate('/catalog')} iconRight={<ChevronRight size={16} />}>
              Discover Books
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlist.map(({ book, addedAt }) => {
              const inCart = isInCart(book.id);
              const addedDate = new Date(addedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              });

              return (
                <div
                  key={book.id}
                  className="bg-neutral-800 rounded-xl border border-neutral-700 flex gap-4 p-4"
                >
                  {/* Cover — clickable */}
                  <div
                    className="w-16 h-22 shrink-0 rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer"
                    style={{ backgroundColor: book.coverColor, minHeight: '88px' }}
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <p
                      className="text-[9px] font-black uppercase leading-tight text-center"
                      style={{ color: book.coverTextColor }}
                    >
                      {book.title}
                    </p>
                    <p
                      className="text-[7px] mt-1 uppercase tracking-wider text-center"
                      style={{ color: book.coverTextColor, opacity: 0.8 }}
                    >
                      {book.author}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-white text-sm font-semibold leading-tight hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      {book.title}
                    </h3>
                    <p className="text-blue-400 text-xs mt-0.5">by {book.author}</p>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{book.shortDescription}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white font-bold text-sm">₹{book.price}</span>
                      {book.originalPrice && (
                        <span className="text-neutral-500 text-xs line-through">₹{book.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-neutral-500 text-[10px] mt-0.5">Added on {addedDate}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <button
                      onClick={() => { addItem(book); }}
                      disabled={inCart}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors ${
                        inCart
                          ? 'bg-green-700 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <ShoppingCart size={12} />
                      {inCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(book.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-neutral-600 text-neutral-400 hover:border-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
