import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import type { PaymentDetails } from '../types';

type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Wallet';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: ReactNode }[] = [
  { id: 'Credit Card', label: 'Credit Card', icon: <CreditCard size={14} /> },
  { id: 'Debit Card', label: 'Debit card', icon: <CreditCard size={14} /> },
  { id: 'UPI', label: 'UPI', icon: <Smartphone size={14} /> },
  { id: 'Wallet', label: 'Wallet', icon: <Wallet size={14} /> },
];

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 6);
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { totalAmount, lastOrder, clearCart, setLastOrder } = useCart();
  const { addOrder } = useStore();
  const [method, setMethod] = useState<PaymentMethod>('Credit Card');
  const [details, setDetails] = useState<Omit<PaymentDetails, 'method'>>({
    cardNumber: '',
    nameOnCard: '',
    cvv: '',
    expiry: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const payableAmount = lastOrder?.totalAmount ?? totalAmount;

  const update = (field: keyof typeof details) => (value: string) =>
    setDetails((prev) => ({ ...prev, [field]: value }));

  const validate = (): string => {
    if (method === 'Credit Card' || method === 'Debit Card') {
      if (!details.cardNumber || details.cardNumber.replace(/\D/g, '').length < 16)
        return 'Please enter a valid 16-digit card number.';
      if (!details.nameOnCard?.trim()) return 'Please enter the name on card.';
      if (!details.cvv || details.cvv.length < 3) return 'Please enter a valid CVV.';
      if (!details.expiry || details.expiry.length < 7) return 'Please enter a valid expiry date (MM/YYYY).';
    }
    if (method === 'UPI') {
      if (!details.upiId?.trim()) return 'Please enter your UPI ID.';
    }
    return '';
  };

  const handlePay = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2000));

    // Finalise order and persist to orders list
    if (lastOrder) {
      const confirmedOrder = { ...lastOrder, status: 'confirmed' as const, paymentMethod: method };
      setLastOrder(confirmedOrder);
      addOrder(confirmedOrder);       // ← persisted to localStorage via StoreContext
    }
    clearCart();
    setLoading(false);
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 40%, #0d3347 70%, #0a1f35 100%)',
      }}
    >
      {/* Decorative floating books */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Top-left abstract circle */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-900/30" />
        {/* Top-right circle */}
        <div className="absolute -top-10 right-32 w-32 h-32 rounded-full bg-blue-900/40" />

        {/* Floating books (CSS-drawn) */}
        <div className="absolute top-16 left-1/3 w-28 h-36 bg-orange-700 rounded shadow-2xl transform -rotate-12 opacity-90" />
        <div className="absolute top-10 left-1/3 w-4 h-8 bg-orange-900 rounded opacity-70" />

        <div className="absolute top-8 right-24 w-10 h-14 bg-teal-700 rounded shadow-xl transform rotate-6 opacity-80" />
        <div className="absolute top-20 right-16 w-8 h-12 bg-teal-900 rounded opacity-60" />

        <div className="absolute bottom-20 left-12 w-32 h-20 bg-yellow-700/60 rounded shadow-xl transform rotate-3" />
        <div className="absolute bottom-12 right-12 w-44 h-28 bg-amber-800/50 rounded shadow-xl" />

        {/* Scattered diamonds / stars decorations */}
        {[
          { top: '15%', left: '15%', size: 10, color: '#f59e0b' },
          { top: '30%', right: '10%', size: 8, color: '#3b82f6' },
          { top: '60%', left: '8%', size: 12, color: '#f59e0b' },
          { top: '75%', right: '20%', size: 10, color: '#14b8a6' },
          { top: '20%', right: '35%', size: 8, color: '#f59e0b' },
        ].map((d, i) => (
          <div
            key={i}
            className="absolute rotate-45"
            style={{ top: d.top, left: d.left, right: (d as any).right, width: d.size, height: d.size, background: d.color, opacity: 0.7 }}
          />
        ))}

        {/* Wavy lines */}
        <svg className="absolute bottom-32 left-16 opacity-30" width="120" height="40" viewBox="0 0 120 40">
          <path d="M0 20 Q30 0 60 20 Q90 40 120 20" stroke="#f59e0b" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Payment Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-neutral-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-neutral-600 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-600">
            <h2 className="text-white font-semibold text-base">Complete Payment</h2>
            <div className="text-right">
              <p className="text-neutral-400 text-xs">Payable Amount:</p>
              <p className="text-white font-bold text-lg">₹{payableAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex">
            {/* Method tabs */}
            <div className="w-32 shrink-0 border-r border-neutral-600 py-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => { setMethod(pm.id); setError(''); }}
                  className={`w-full text-left text-xs px-3 py-2.5 flex items-center gap-2 transition-colors ${
                    method === pm.id
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {pm.icon}
                  {pm.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="flex-1 p-5 space-y-3">
              {(method === 'Credit Card' || method === 'Debit Card') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 text-xs mb-1 block">Card Number</label>
                      <input
                        type="text"
                        value={details.cardNumber || ''}
                        onChange={(e) => update('cardNumber')(formatCardNumber(e.target.value))}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        maxLength={19}
                        className="w-full bg-neutral-700 border border-neutral-600 rounded text-white text-xs placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-xs mb-1 block">Name on Card</label>
                      <input
                        type="text"
                        value={details.nameOnCard || ''}
                        onChange={(e) => update('nameOnCard')(e.target.value)}
                        placeholder="Name"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded text-white text-xs placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 text-xs mb-1 block">CVV</label>
                      <input
                        type="password"
                        value={details.cvv || ''}
                        onChange={(e) => update('cvv')(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="XXX"
                        maxLength={3}
                        className="w-full bg-neutral-700 border border-neutral-600 rounded text-white text-xs placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-xs mb-1 block">Date of Expiry</label>
                      <input
                        type="text"
                        value={details.expiry || ''}
                        onChange={(e) => update('expiry')(formatExpiry(e.target.value))}
                        placeholder="MM/YYYY"
                        maxLength={7}
                        className="w-full bg-neutral-700 border border-neutral-600 rounded text-white text-xs placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {method === 'UPI' && (
                <div>
                  <label className="text-neutral-400 text-xs mb-1 block">UPI ID</label>
                  <input
                    type="text"
                    value={details.upiId || ''}
                    onChange={(e) => update('upiId')(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full bg-neutral-700 border border-neutral-600 rounded text-white text-xs placeholder-neutral-500 px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-neutral-500 text-xs mt-2">
                    Enter your registered UPI ID and confirm payment in your UPI app.
                  </p>
                </div>
              )}

              {method === 'Wallet' && (
                <div className="space-y-2">
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map((w) => (
                    <label key={w} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="wallet" className="text-blue-500" />
                      <span className="text-neutral-300 text-sm">{w}</span>
                    </label>
                  ))}
                </div>
              )}

              {error && <Alert type="error" message={error} onDismiss={() => setError('')} />}

              <Button
                className="w-full mt-2"
                onClick={handlePay}
                loading={loading}
                iconRight={!loading ? <CreditCard size={15} /> : undefined}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
