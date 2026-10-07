import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { book, quantity } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-700 last:border-0">
      {/* Cover */}
      <div
        className="w-20 h-28 shrink-0 rounded flex flex-col items-center justify-center p-2"
        style={{ backgroundColor: book.coverColor }}
      >
        <p
          className="text-[9px] font-black uppercase leading-tight text-center line-clamp-3"
          style={{ color: book.coverTextColor }}
        >
          {book.title}
        </p>
        <p
          className="text-[8px] mt-1 uppercase tracking-wider text-center"
          style={{ color: book.coverTextColor, opacity: 0.8 }}
        >
          {book.author}
        </p>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm leading-tight">{book.title}</h3>
        <p className="text-blue-400 text-xs mt-0.5">by {book.author}</p>
        <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{book.shortDescription}</p>
        <div className="text-neutral-400 text-xs mt-1">{book.format}</div>
        <div className="text-blue-400 text-xs">{book.categories.join(', ')}</div>

        <div className="mt-2">
          <span className="text-white font-bold">₹{book.price * quantity}</span>
          {quantity > 1 && (
            <span className="text-neutral-500 text-xs ml-1">(₹{book.price} × {quantity})</span>
          )}
        </div>
        <p className="text-neutral-400 text-xs">Delivery by {book.deliveryDate}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(book.id, quantity - 1)}
            className="w-6 h-6 rounded bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-white transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="text-white text-sm w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(book.id, quantity + 1)}
            className="w-6 h-6 rounded bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-white transition-colors"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={() => removeItem(book.id)}
            className="ml-2 text-red-400 hover:text-red-300 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
