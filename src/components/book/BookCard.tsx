import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import StarRating from '../ui/StarRating';
import clsx from 'clsx';

interface BookCardProps {
  book: Book;
  className?: string;
}

/** Compact book cover with colored background — matches the dark-UI screenshot style */
function BookCover({ book, height = 'h-44' }: { book: Book; height?: string }) {
  return (
    <div
      className={`relative ${height} flex flex-col items-center justify-center p-3`}
      style={{ backgroundColor: book.coverColor }}
    >
      {/* Badge */}
      {book.badge && (
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wide bg-black/40 text-white px-1.5 py-0.5 rounded">
          {book.badge}
        </span>
      )}
      {/* Title on cover */}
      <div className="text-center px-2" style={{ color: book.coverTextColor }}>
        <p className="text-[11px] font-black uppercase leading-tight tracking-wide line-clamp-3">{book.title}</p>
        <p className="text-[9px] mt-2 opacity-80 uppercase tracking-widest">{book.author}</p>
      </div>
    </div>
  );
}

export default function BookCard({ book, className }: BookCardProps) {
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(book.id);

  return (
    <div
      className={clsx(
        'bg-neutral-800 rounded-lg overflow-hidden cursor-pointer hover:ring-1 hover:ring-blue-500 transition-all duration-200 group',
        className
      )}
    >
      {/* Cover */}
      <div onClick={() => navigate(`/book/${book.id}`)}>
        <BookCover book={book} />
      </div>

      {/* Info */}
      <div className="p-3" onClick={() => navigate(`/book/${book.id}`)}>
        <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2 hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-blue-400 text-[11px] mt-0.5">by {book.author}</p>
        <p className="text-neutral-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">{book.shortDescription}</p>

        <div className="flex items-center gap-1 mt-1.5">
          <StarRating rating={book.rating} size={11} />
        </div>

        <div className="text-neutral-400 text-[10px] mt-1">{book.format}</div>
        <div className="text-[10px] text-blue-400 mt-0.5">{book.categories.join(', ')}</div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-white text-sm font-bold">₹{book.price}</span>
            {book.originalPrice && (
              <span className="text-neutral-500 text-xs line-through ml-1">₹{book.originalPrice}</span>
            )}
            <p className="text-neutral-400 text-[10px]">Delivery by {book.deliveryDate}</p>
          </div>
        </div>
      </div>

      {/* Add to cart hover overlay */}
      <div className="px-3 pb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem(book);
          }}
          className={clsx(
            'w-full text-xs py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors',
            inCart
              ? 'bg-green-700 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}
        >
          <ShoppingCart size={12} />
          {inCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
