import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ChevronRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Order } from '../types';
import Button from '../components/ui/Button';

const STATUS_STYLES: Record<Order['status'], string> = {
  pending: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700',
  confirmed: 'bg-green-900/40 text-green-300 border border-green-700',
  shipped: 'bg-blue-900/40 text-blue-300 border border-blue-700',
  delivered: 'bg-teal-900/40 text-teal-300 border border-teal-700',
};

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-neutral-750 transition-colors"
      >
        {/* Order icon */}
        <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center shrink-0">
          <Package size={18} className="text-blue-400" />
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-mono text-xs font-semibold">{order.id}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-neutral-400 text-xs mt-0.5">
            {formattedDate} · {order.items.length} {order.items.length === 1 ? 'book' : 'books'} · via {order.paymentMethod || 'Online'}
          </p>
        </div>

        {/* Amount + expand toggle */}
        <div className="text-right shrink-0">
          <p className="text-white font-bold text-sm">₹{order.totalAmount.toLocaleString()}</p>
          <span className="text-neutral-500 text-xs">
            {expanded ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />}
          </span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-neutral-700 px-5 py-4 space-y-4">
          {/* Books list */}
          <div className="space-y-3">
            {order.items.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="flex gap-3 cursor-pointer group"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                {/* Mini cover */}
                <div
                  className="w-12 h-16 shrink-0 rounded flex flex-col items-center justify-center p-1"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <p
                    className="text-[8px] font-black uppercase leading-tight text-center"
                    style={{ color: book.coverTextColor }}
                  >
                    {book.title}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold group-hover:text-blue-400 transition-colors line-clamp-1">
                    {book.title}
                  </p>
                  <p className="text-blue-400 text-[11px]">by {book.author}</p>
                  <p className="text-neutral-400 text-[11px]">{book.format}</p>
                  <p className="text-white text-xs font-bold mt-1">
                    ₹{book.price * quantity}
                    {quantity > 1 && <span className="text-neutral-500 font-normal ml-1">×{quantity}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="bg-neutral-700/50 rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Tax</span><span>₹{order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Delivery</span>
              <span className="text-green-400">{order.deliveryCharges === 0 ? 'Free' : `₹${order.deliveryCharges}`}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount{order.coupon ? ` (${order.coupon})` : ''}</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-semibold border-t border-neutral-600 pt-1.5 mt-1">
              <span>Total Paid</span><span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="text-xs text-neutral-400">
            <p className="text-neutral-300 font-medium mb-0.5">Delivered to</p>
            <p>
              {order.address.firstName} {order.address.lastName},{' '}
              {order.address.addressLine}, {order.address.city} – {order.address.pin},{' '}
              {order.address.state}, {order.address.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">My Orders</h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
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

        {orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={56} className="text-neutral-600 mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">No orders yet</h2>
            <p className="text-neutral-400 text-sm mb-6 max-w-xs">
              Once you purchase a book, it will show up here with full order details.
            </p>
            <Button onClick={() => navigate('/catalog')} iconRight={<ChevronRight size={16} />}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
