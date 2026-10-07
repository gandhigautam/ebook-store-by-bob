import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { lastOrder } = useCart();

  // If no order, redirect home
  useEffect(() => {
    if (!lastOrder) {
      setTimeout(() => navigate('/'), 1500);
    }
  }, [lastOrder, navigate]);

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">Redirecting…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 40%, #0d3347 70%, #0a1f35 100%)',
      }}
    >
      {/* Decorative background — same as payment page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-900/30" />
        <div className="absolute -top-10 right-32 w-32 h-32 rounded-full bg-blue-900/40" />
        <div className="absolute top-16 left-1/3 w-28 h-36 bg-orange-700 rounded shadow-2xl transform -rotate-12 opacity-90" />
        <div className="absolute top-8 right-24 w-10 h-14 bg-teal-700 rounded shadow-xl transform rotate-6 opacity-80" />
        <div className="absolute bottom-20 left-12 w-32 h-20 bg-yellow-700/60 rounded shadow-xl transform rotate-3" />
        <div className="absolute bottom-12 right-12 w-44 h-28 bg-amber-800/50 rounded shadow-xl" />
        {[
          { top: '15%', left: '15%', size: 10, color: '#f59e0b' },
          { top: '30%', right: '10%', size: 8, color: '#3b82f6' },
          { top: '60%', left: '8%', size: 12, color: '#f59e0b' },
          { top: '75%', right: '20%', size: 10, color: '#14b8a6' },
        ].map((d, i) => (
          <div
            key={i}
            className="absolute rotate-45"
            style={{ top: d.top, left: d.left, right: (d as any).right, width: d.size, height: d.size, background: d.color, opacity: 0.7 }}
          />
        ))}
        <svg className="absolute bottom-32 left-16 opacity-30" width="120" height="40" viewBox="0 0 120 40">
          <path d="M0 20 Q30 0 60 20 Q90 40 120 20" stroke="#f59e0b" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Confirmation modal */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-neutral-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-600 p-6">
          {/* Success icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>

          {/* Message */}
          <p className="text-white text-center font-semibold text-sm mb-5">
            Your purchase of the<br />following reads is successful
          </p>

          {/* Purchased items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {lastOrder.items.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="flex gap-3 bg-neutral-700/50 rounded-lg p-3 cursor-pointer hover:bg-neutral-700 transition-colors"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* Mini cover */}
                <div
                  className="w-14 h-20 shrink-0 rounded flex flex-col items-center justify-center p-1.5"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <p
                    className="text-[8px] font-black uppercase leading-tight text-center"
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

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-blue-400 text-[10px] mt-0.5">by {book.author}</p>
                  <p className="text-neutral-400 text-[10px] mt-1 line-clamp-2">{book.shortDescription}</p>
                  <div className="text-neutral-400 text-[10px] mt-1">{book.format}</div>
                  <div className="text-blue-400 text-[10px]">{book.categories.join(', ')}</div>
                  <p className="text-white text-xs font-bold mt-1">
                    ₹{book.price * quantity}
                    {quantity > 1 && <span className="text-neutral-500 font-normal ml-1">×{quantity}</span>}
                  </p>
                  <p className="text-neutral-400 text-[10px]">Delivery by {book.deliveryDate}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order details */}
          <div className="text-xs text-neutral-400 space-y-1 border-t border-neutral-600 pt-3 mb-5">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="text-neutral-200 font-mono">{lastOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="text-neutral-200">{lastOrder.paymentMethod || 'Online'}</span>
            </div>
            <div className="flex justify-between font-semibold text-white mt-2">
              <span>Total Paid</span>
              <span>₹{lastOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full"
            onClick={() => navigate('/catalog')}
            iconRight={<ChevronRight size={15} />}
          >
            Continue your Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
