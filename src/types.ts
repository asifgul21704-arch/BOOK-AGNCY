export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Super Admin' | 'Store Admin' | 'Manager' | 'Customer';
  avatar?: string;
  addresses?: Address[];
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number; // in PKR
  discountPrice?: number; // in PKR
  stock: number;
  sku: string;
  images: string[];
  coverImage: string;
  language: 'Urdu' | 'English' | 'Arabic' | 'Persian' | 'Sindhi' | 'Pashto';
  pages: number;
  edition?: string;
  binding?: string;
  publicationYear?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  bookCount?: number;
}

export interface CartItem {
  bookId: string;
  book: Book;
  quantity: number;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export type PaymentMethod = 'Cash on Delivery' | 'Credit/Debit Card (Online)' | 'Bank Transfer / JazzCash / EasyPaisa';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: {
    province: string;
    city: string;
    area: string;
    address: string;
    postalCode?: string;
    instructions?: string;
  };
  deliveryMethod: 'Standard Delivery' | 'Express Delivery';
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  courier?: string;
  timeline: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface InventoryLog {
  id: string;
  bookId: string;
  bookTitle: string;
  previousStock: number;
  newStock: number;
  quantityChanged: number;
  reason: string;
  adminName: string;
  createdAt: string;
}

export type StockAuditLog = InventoryLog;

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo: string;
  storeDescription: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  province: string;
  googleMapsUrl: string;
  openingHours: string;
  deliveryChargesStandard: number;
  deliveryChargesExpress: number;
  freeDeliveryThreshold: number;
  currency: string;
  currencySymbol: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}
