export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  coverColor: string;
  coverTextColor: string;
  format: 'Paperback' | 'Hardcover' | 'eBook';
  categories: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  language: string;
  publisher: string;
  deliveryDate: string;
  badge?: 'Bestseller' | 'New' | 'Featured';
  inStock: boolean;
}

export interface Author {
  name: string;
  bio: string;
  avatar?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  addressLine: string;
  email: string;
  city: string;
  pin: string;
  phoneNumber: string;
  state: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  discount: number;
  totalAmount: number;
  coupon?: string;
  paymentMethod: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface WishlistItem {
  book: Book;
  addedAt: string; // ISO date string
}

export interface WriterEntry {
  authorName: string;
  addedAt: string; // ISO date string
}

export interface PaymentDetails {
  method: 'Credit Card' | 'Debit Card' | 'UPI' | 'Wallet';
  cardNumber?: string;
  nameOnCard?: string;
  cvv?: string;
  expiry?: string;
  upiId?: string;
}

export type Category =
  | 'All'
  | 'Romance'
  | 'Mystery'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Historical'
  | 'Biography'
  | 'Self-help'
  | 'Memoir'
  | 'Travel'
  | 'Cooking'
  | "Children's"
  | 'Young Adult'
  | 'Comics & Graphic Novels'
  | 'Poetry'
  | 'Drama'
  | 'Science'
  | 'Philosophy'
  | 'Religion'
  | 'Language Learning';

export type SortOption = 'Relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Rating' | 'New Arrivals';
export type FormatFilter = 'All' | 'Paperback' | 'Hardcover' | 'eBook';
export type LanguageFilter = 'All' | 'English' | 'Hindi' | 'Tamil' | 'Telugu';
