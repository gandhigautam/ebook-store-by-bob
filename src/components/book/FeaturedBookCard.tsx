import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import StarRating from '../ui/StarRating';

interface FeaturedBookCardProps {
  book: Book;
}

export default function FeaturedBookCard({ book }: FeaturedBookCardProps) {
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(book.id);

  return (
    <div
      className="flex gap-4 bg-neutral-800 rounded-lg overflow-hidden hover:ring-1 hover:ring-blue-500 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      {/* Cover */}
      <div
        className="w-24 h-32 shrink-0 flex flex-col items-center justify-center p-2"
        style={{ backgroundColor: book.coverColor }}
      >
        <p
          className="text-[10px] font-black uppercase leading-tight tracking-wide text-center line-clamp-3"
          style={{ color: book.coverTextColor }}
        >
          {book.title}
        </p>
        <p
          className="text-[8px] mt-1 uppercase tracking-widest text-center"
          style={{ color: book.coverTextColor, opacity: 0.8 }}
        >
          {book.author}
        </p>
      </div>

      {/* Info */}
      <div className="py-3 pr-3 flex-1 min-w-0">
        <h3 className="text-white text-sm font-semibold leading-tight hover:text-blue-400 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-blue-400 text-xs mt-0.5">by {book.author}</p>
        <p className="text-neutral-400 text-xs mt-1 line-clamp-2 leading-relaxed">{book.shortDescription}</p>
        <StarRating rating={book.rating} size={11} />
        <div className="text-neutral-400 text-[10px] mt-1">{book.format}</div>
        <div className="text-[10px] text-blue-400">{book.categories.join(', ')}</div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-white text-sm font-bold">₹{book.price}</span>
            <p className="text-neutral-400 text-[10px]">Delivery by {book.deliveryDate}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(book);
            }}
            className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              inCart ? 'bg-green-700 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ShoppingCart size={11} />
            {inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
