import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItemComponent from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import type { Address } from '../types';

const EMPTY_ADDRESS: Address = {
  firstName: '',
  lastName: '',
  addressLine: '',
  email: '',
  city: '',
  pin: '',
  phoneNumber: '',
  state: '',
  country: 'India',
};

const SAVED_ADDRESS: Address = {
  firstName: 'Rahul',
  lastName: 'Sharma',
  addressLine: 'Flat 4B, Green Park Colony',
  email: 'rahul.sharma@email.com',
  city: 'Mumbai',
  pin: '400001',
  phoneNumber: '9876543210',
  state: 'Maharashtra',
  country: 'India',
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  prefix?: string;
}

function Field({ label, value, onChange, placeholder, type = 'text', required, className = '', prefix }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-neutral-400 text-xs">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="bg-neutral-700 border border-r-0 border-neutral-600 rounded-l text-neutral-300 text-xs px-2 py-2 h-8 flex items-center">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-neutral-700 border border-neutral-600 text-white text-xs placeholder-neutral-500 px-3 py-2 h-8 focus:outline-none focus:border-blue-500 transition-colors w-full ${prefix ? 'rounded-r' : 'rounded'}`}
          required={required}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, setLastOrder, subtotal, tax, discount, deliveryCharges } = useCart();
  const [useSaved, setUseSaved] = useState(false);
  const [address, setAddress] = useState<Address>({ ...EMPTY_ADDRESS });
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  // Populate from saved address when checkbox toggled
  const handleUseSaved = (checked: boolean) => {
    setUseSaved(checked);
    setAddress(checked ? { ...SAVED_ADDRESS } : { ...EMPTY_ADDRESS });
    setErrors({});
  };

  const update = (field: keyof Address) => (value: string) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const required: (keyof Address)[] = ['firstName', 'lastName', 'addressLine', 'email', 'city', 'pin', 'phoneNumber', 'state'];
    const newErrors: Partial<Record<keyof Address, string>> = {};
    required.forEach((f) => {
      if (!address[f].trim()) newErrors[f] = 'Required';
    });
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = () => {
    if (!validate()) return;
    // Store order in context for payment page to access
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      address,
      subtotal,
      tax,
      deliveryCharges,
      discount,
      totalAmount,
      paymentMethod: '',
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    };
    setLastOrder(order);
    navigate('/payment');
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-blue-400">Non-Fiction</span>
          <ChevronRight size={12} />
          <span className="text-blue-400">Self Help</span>
          <ChevronRight size={12} />
          <span className="text-blue-400">Joy of Minimalism</span>
          <ChevronRight size={12} />
          <span className="text-neutral-200">Checkout</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-10">
        <h1 className="text-white font-semibold text-xl mb-6">Shopping Cart</h1>

        {/* Cart items summary */}
        <div className="bg-neutral-800 rounded-xl p-5 mb-6">
          {items.map((item) => (
            <CartItemComponent key={item.book.id} item={item} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Address Form */}
          <div className="flex-1 min-w-0 bg-neutral-800 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Home size={15} className="text-blue-400" /> Address
            </h2>

            {/* Use Saved Address */}
            <label className="flex items-center gap-2 text-neutral-300 text-xs mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={useSaved}
                onChange={(e) => handleUseSaved(e.target.checked)}
                className="rounded border-neutral-600 bg-neutral-700 text-blue-500 focus:ring-blue-500"
              />
              Use Saved Address
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field
                label="First Name"
                value={address.firstName}
                onChange={update('firstName')}
                placeholder="First Name"
                required
                className={errors.firstName ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="Last Name"
                value={address.lastName}
                onChange={update('lastName')}
                placeholder="Last Name"
                required
                className={errors.lastName ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="Address"
                value={address.addressLine}
                onChange={update('addressLine')}
                placeholder="Address Line 2"
                required
                className={`col-span-2 sm:col-span-1 ${errors.addressLine ? 'ring-1 ring-red-500 rounded' : ''}`}
              />
              <Field
                label="e-mail"
                value={address.email}
                onChange={update('email')}
                placeholder="e-mail"
                type="email"
                required
                className={errors.email ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="City"
                value={address.city}
                onChange={update('city')}
                placeholder="City"
                required
                className={errors.city ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="Pin"
                value={address.pin}
                onChange={update('pin')}
                placeholder="000000"
                required
                className={errors.pin ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="Phone Number"
                value={address.phoneNumber}
                onChange={update('phoneNumber')}
                placeholder="1234567890"
                type="tel"
                required
                prefix="+91"
                className={`col-span-2 sm:col-span-1 ${errors.phoneNumber ? 'ring-1 ring-red-500 rounded' : ''}`}
              />
              <Field
                label="State"
                value={address.state}
                onChange={update('state')}
                placeholder="State"
                required
                className={errors.state ? 'ring-1 ring-red-500 rounded' : ''}
              />
              <Field
                label="Country"
                value={address.country}
                onChange={update('country')}
                placeholder="India"
              />
            </div>

            {/* Inline validation errors summary */}
            {Object.keys(errors).length > 0 && (
              <p className="text-red-400 text-xs mt-3">Please fill all required fields correctly.</p>
            )}
          </div>

          {/* Grand Total */}
          <div className="lg:w-72 shrink-0">
            <OrderSummary
              onCheckout={handlePayNow}
              checkoutLabel="Pay Now"
              showCoupon
            />
          </div>
        </div>
      </div>
    </div>
  );
}
