export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'Super Admin' | 'Store Admin' | 'Manager' | 'Customer';
  avatar?: string;
  addresses?: Array<{
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
  }>;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
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
  publicationYear?: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
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
  price: number; // actual purchased unit price
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
  courier?: string; // TCS, Leopard, M&P, Trax, DHL
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
  userId: string;
  userName: string;
  rating: number; // 1 - 5
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10%, or 200 for Rs. 200 off
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
