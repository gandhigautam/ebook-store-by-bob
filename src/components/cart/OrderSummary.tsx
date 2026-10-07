import { useState } from 'react';
import { Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface OrderSummaryProps {
  onCheckout?: () => void;
  checkoutLabel?: string;
  loading?: boolean;
  showCoupon?: boolean;
}

export default function OrderSummary({
  onCheckout,
  checkoutLabel = 'Proceed to Checkout',
  loading = false,
  showCoupon = true,
}: OrderSummaryProps) {
  const { subtotal, tax, deliveryCharges, discount, totalAmount, applyCoupon, coupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput.trim());
    setAlert({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) setCouponInput('');
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-4 space-y-3">
      {/* Book image decoration */}
      <div className="h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-teal-900 mb-4 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, #0d9488 0%, transparent 50%)`
          }}
        />
        <div className="relative flex gap-2">
          <div className="w-10 h-14 bg-orange-700 rounded-sm shadow-lg transform -rotate-6" />
          <div className="w-10 h-14 bg-blue-800 rounded-sm shadow-lg" />
          <div className="w-10 h-14 bg-yellow-700 rounded-sm shadow-lg transform rotate-6" />
        </div>
      </div>

      <h3 className="text-white font-semibold text-sm">Grand Total</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-neutral-300">
          <span>Price ({useCart().items.length} items)</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-300">
          <span>Tax</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-300">
          <span>Delivery Charges</span>
          <span className="text-green-400">{deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}</span>
        </div>
      </div>

      {/* Coupon */}
      {showCoupon && (
        <div className="pt-2 border-t border-neutral-700">
          {coupon ? (
            <div className="flex items-center gap-2 text-green-400 text-xs">
              <Tag size={12} />
              <span>Coupon <strong>{coupon}</strong> applied</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Apply Coupon"
                className="flex-1 bg-neutral-700 border border-neutral-600 rounded text-xs text-white placeholder-neutral-500 px-3 py-1.5 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <Button size="sm" onClick={handleApplyCoupon}>Apply</Button>
            </div>
          )}
          {alert && (
            <Alert type={alert.type} message={alert.message} className="mt-2 text-xs py-2" />
          )}
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-400">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-white border-t border-neutral-600 pt-3">
        <span>Total Amount</span>
        <span>₹{totalAmount.toLocaleString()}</span>
      </div>

      {onCheckout && (
        <Button
          className="w-full mt-1"
          onClick={onCheckout}
          loading={loading}
          iconRight={<span>▶</span>}
        >
          {checkoutLabel}
        </Button>
      )}
    </div>
  );
}
