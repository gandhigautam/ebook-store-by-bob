import { useState, Fragment } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronRight, Globe, Star, BookOpen, UserPlus, UserCheck } from 'lucide-react';
import { BOOKS, AUTHORS, REVIEWS } from '../data/books';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import FeaturedBookCard from '../components/book/FeaturedBookCard';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, addWriter, removeWriter, isFollowingWriter } = useStore();

  const book = BOOKS.find((b) => b.id === id);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [addedAlert, setAddedAlert] = useState(false);
  const [wishlistAlert, setWishlistAlert] = useState<string | null>(null);
  const [writerAlert, setWriterAlert] = useState<string | null>(null);

  if (!book) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-semibold mb-4">Book not found</p>
          <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const author = AUTHORS[book.author];
  const reviews = REVIEWS.filter((r) => r.bookId === book.id);
  // Related reads — different books from same categories, excluding current
  const relatedBooks = BOOKS.filter(
    (b) => b.id !== book.id && b.categories.some((c) => book.categories.includes(c))
  ).slice(0, 4);
  const inCart = isInCart(book.id);
  const inWishlist = isInWishlist(book.id);
  const followingWriter = isFollowingWriter(book.author);

  const handleAddToCart = () => {
    addItem(book);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
      setWishlistAlert('Removed from wishlist.');
    } else {
      addToWishlist(book);
      setWishlistAlert('Added to your wishlist!');
    }
    setTimeout(() => setWishlistAlert(null), 2500);
  };

  const handleWriterToggle = () => {
    if (followingWriter) {
      removeWriter(book.author);
      setWriterAlert(`Unfollowed ${book.author}.`);
    } else {
      addWriter(book.author);
      setWriterAlert(`Now following ${book.author}!`);
    }
    setTimeout(() => setWriterAlert(null), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          {book.categories.map((cat, i) => (
            <Fragment key={cat}>
              <Link to="/catalog" className="hover:text-white transition-colors text-blue-400">{cat}</Link>
              {i < book.categories.length - 1 && <span>/</span>}
            </Fragment>
          ))}
          <ChevronRight size={12} />
          <span className="text-neutral-200">{book.title}</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {addedAlert && (
            <Alert type="success" message={`"${book.title}" added to cart!`} className="mb-4" />
          )}
          {wishlistAlert && (
            <Alert type={wishlistAlert.startsWith('Removed') ? 'info' : 'success'} message={wishlistAlert} className="mb-4" />
          )}
          {writerAlert && (
            <Alert type={writerAlert.startsWith('Unfollowed') ? 'info' : 'success'} message={writerAlert} className="mb-4" />
          )}

          {/* Book info panel */}
          <div className="bg-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row gap-6 mb-6">
            {/* Cover */}
            <div
              className="w-48 h-64 shrink-0 mx-auto sm:mx-0 rounded-lg flex flex-col items-center justify-center p-4 shadow-xl"
              style={{ backgroundColor: book.coverColor }}
            >
              <p
                className="text-sm font-black uppercase leading-tight text-center"
                style={{ color: book.coverTextColor }}
              >
                {book.title}
              </p>
              <p
                className="text-xs mt-3 uppercase tracking-widest text-center"
                style={{ color: book.coverTextColor, opacity: 0.8 }}
              >
                {book.author}
              </p>
              {/* barcode decoration */}
              <div className="mt-4 w-16 h-8 opacity-30 flex gap-px">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-current" style={{ height: `${50 + Math.random() * 50}%` }} />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-2xl font-bold leading-tight mb-1">{book.title}</h1>
              <p className="text-neutral-300 text-sm mb-3">by {book.author}</p>

              <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                {book.description}
              </p>

              <p className="text-neutral-400 text-xs mb-3">
                Published by <span className="text-blue-400">{book.publisher}</span>
              </p>

              <div className="text-neutral-400 text-xs mb-1">{book.format}</div>
              <div className="flex gap-2 mb-3">
                {book.categories.map((cat) => (
                  <span key={cat} className="text-blue-400 text-xs hover:text-blue-300 cursor-pointer">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="text-white text-2xl font-bold mb-1">₹{book.price}</div>
              <p className="text-neutral-400 text-xs mb-4">Delivery by {book.deliveryDate}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={inCart}
                  icon={<ShoppingCart size={16} />}
                  className={inCart ? 'bg-green-700 hover:bg-green-700 cursor-default' : ''}
                >
                  {inCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                {inCart && (
                  <Button variant="secondary" onClick={() => navigate('/cart')} iconRight={<ChevronRight size={14} />}>
                    View Cart
                  </Button>
                )}
                <Button
                  variant={inWishlist ? 'secondary' : 'outline'}
                  icon={<Heart size={16} className={inWishlist ? 'fill-red-400 text-red-400' : ''} />}
                  onClick={handleWishlistToggle}
                >
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-400 border-t border-neutral-700 pt-3">
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-blue-400" />
                  <span>Language: <span className="text-white">{book.language}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={13} className="text-yellow-400" />
                  <span>Rating: <span className="text-white">{book.rating}/5</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-blue-400" />
                  <span>Sells: <span className="text-white">{book.salesCount.toLocaleString()} copies sold</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* About the Writer */}
          {author && (
            <div className="bg-neutral-800 rounded-xl p-5 mb-6">
              <h2 className="text-white font-semibold mb-3">About the writer</h2>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 shrink-0 flex items-center justify-center text-white font-bold text-sm">
                  {author.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-white font-medium text-sm">{author.name}</p>
                    <button
                      onClick={handleWriterToggle}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-colors shrink-0 ${
                        followingWriter
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-neutral-500 text-neutral-300 hover:border-blue-500 hover:text-blue-400'
                      }`}
                    >
                      {followingWriter
                        ? <><UserCheck size={12} /> Following</>
                        : <><UserPlus size={12} /> Follow</>
                      }
                    </button>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">{author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-neutral-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Reviews</h2>

            {/* Leave a review */}
            <div className="mb-5 border-b border-neutral-700 pb-5">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Placeholder text"
                maxLength={500}
                rows={3}
                className="w-full bg-neutral-700 border border-neutral-600 rounded text-sm text-white placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-neutral-500 text-xs">{reviewText.length}/500</div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={18} />
                <Button
                  size="sm"
                  iconRight={<ChevronRight size={14} />}
                  disabled={!reviewText.trim() || reviewRating === 0}
                  onClick={() => { setReviewText(''); setReviewRating(0); }}
                >
                  Submit
                </Button>
              </div>
            </div>

            {/* Existing reviews */}
            <div className="space-y-4">
              {reviews.length === 0 && (
                <p className="text-neutral-400 text-sm">No reviews yet. Be the first to review!</p>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-neutral-700 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold text-white">
                      {review.userName[0]}
                    </div>
                    <span className="text-white text-sm font-medium">{review.userName}</span>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-2">{review.comment}</p>
                  <StarRating rating={review.rating} size={13} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar — Related Reads */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-16">
            <h2 className="text-white font-semibold text-sm mb-3">Related Reads</h2>
            <div className="space-y-3">
              {relatedBooks.map((b) => (
                <FeaturedBookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
