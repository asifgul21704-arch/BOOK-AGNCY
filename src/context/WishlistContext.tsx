import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haqanya_wishlist');
      return saved ? JSON.parse(saved) : ['book-3', 'book-11'];
    } catch {
      return ['book-3', 'book-11'];
    }
  });

  const { success, info } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('haqanya_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Wishlist save error', e);
    }
  }, [wishlistIds]);

  const isInWishlist = (bookId: string) => wishlistIds.includes(bookId);

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== book.id));
      info(`Removed "${book.title}" from your wishlist.`);
    } else {
      setWishlistIds((prev) => [...prev, book.id]);
      success(`Saved "${book.title}" to your wishlist!`);
    }
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== bookId));
    info('Removed from wishlist.');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
