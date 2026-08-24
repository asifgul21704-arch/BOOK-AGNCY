import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem, Coupon } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  coupon: Coupon | null;
  couponCode: string;
  isExpressDelivery: boolean;
  setIsExpressDelivery: (isExpress: boolean) => void;
  addToCart: (book: Book, quantity?: number) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('haqanya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isExpressDelivery, setIsExpressDelivery] = useState<boolean>(false);
  const { success, error } = useToast();

  const freeShippingThreshold = 2000; // Rs. 2,000 for free delivery across Pakistan

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('haqanya_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Cart persistence failed', e);
    }
  }, [items]);

  // Recalculate coupon whenever subtotal changes
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.book.discountPrice || item.book.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (coupon) {
      if (subtotal < coupon.minimumOrder) {
        setCoupon(null);
        setCouponCode('');
        setDiscountAmount(0);
      } else {
        let disc = 0;
        if (coupon.type === 'percentage') {
          disc = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maximumDiscount && disc > coupon.maximumDiscount) {
            disc = coupon.maximumDiscount;
          }
        } else {
          disc = coupon.value;
        }
        setDiscountAmount(disc);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, coupon]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryFee = isExpressDelivery
    ? 350
    : subtotal >= freeShippingThreshold || subtotal === 0
    ? 0
    : 199;

  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const addToCart = (book: Book, quantity = 1) => {
    if (book.stock <= 0) {
      error(`Sorry, "${book.title}" is currently out of stock.`);
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.bookId === book.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > book.stock) {
          error(`Only ${book.stock} copies of "${book.title}" available in stock.`);
          updated[existingIndex].quantity = book.stock;
        } else {
          updated[existingIndex].quantity = newQty;
          success(`Updated "${book.title}" quantity in your cart.`);
        }
        return updated;
      } else {
        success(`Added "${book.title}" to your cart.`);
        return [...prev, { bookId: book.id, book, quantity: Math.min(quantity, book.stock) }];
      }
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.bookId === bookId) {
          const clamped = Math.min(quantity, item.book.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (bookId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.bookId === bookId);
      if (target) {
        success(`Removed "${target.book.title}" from cart.`);
      }
      return prev.filter((i) => i.bookId !== bookId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });
      const data = await res.json();

      if (data.success && data.data) {
        setCoupon(data.data.coupon);
        setCouponCode(code.trim().toUpperCase());
        setDiscountAmount(data.data.discount);
        success(data.message || 'Coupon applied successfully!');
        return { success: true, message: data.message };
      } else {
        error(data.message || 'Invalid coupon code.');
        return { success: false, message: data.message };
      }
    } catch (err: any) {
      error('Could not validate coupon.');
      return { success: false, message: err.message || 'Server error' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
    success('Coupon removed.');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discount: discountAmount,
        deliveryFee,
        total,
        freeShippingThreshold,
        freeShippingRemaining,
        coupon,
        couponCode,
        isExpressDelivery,
        setIsExpressDelivery,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
