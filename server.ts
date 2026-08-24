import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { processAIChat } from './server/ai.js';
import { Book, Order, User } from './server/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for dev
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Simple Token Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Allow guest or check if optional
      return next();
    }

    // Token format: "user_<id>" or demo token
    const userId = token.replace('Bearer ', '').trim();
    const user = db.users.find((u) => u.id === userId || `usr-${u.id}` === userId || u.email === userId);
    if (user) {
      (req as any).user = user;
    }
    next();
  };

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = (req as any).user;
    if (!user || (user.role !== 'Super Admin' && user.role !== 'Store Admin' && user.role !== 'Manager')) {
      return res.status(403).json({ success: false, message: 'Access denied: Admin permissions required.' });
    }
    next();
  };

  app.use(authenticateToken);

  // ==========================================
  // 1. PUBLIC STORE SETTINGS
  // ==========================================
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json({ success: true, data: db.settings });
  });

  // ==========================================
  // 2. AUTHENTICATION ROUTES
  // ==========================================
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      role: 'Customer',
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Initial audit
    db.addAuditLog('system', 'System', 'New Customer Registration', `User registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Maktaba Haqanya.',
      data: {
        user: newUser,
        token: newUser.id
      }
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, isAdminLogin } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    if (isAdminLogin && user.role === 'Customer') {
      return res.status(403).json({ success: false, message: 'Unauthorized: This account does not have Admin access.' });
    }

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user,
        token: user.id
      }
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    res.json({ success: true, data: user });
  });

  app.put('/api/auth/profile', requireAuth, (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { name, phone, avatar, addresses } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (addresses) user.addresses = addresses;
    user.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'Profile updated successfully!', data: user });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    // Simulate recovery email
    res.json({
      success: true,
      message: `If an account exists for ${email}, a password reset link has been dispatched.`
    });
  });

  // ==========================================
  // 3. BOOK CATALOG ROUTES
  // ==========================================
  app.get('/api/books', (req: Request, res: Response) => {
    const {
      search,
      category,
      author,
      publisher,
      language,
      minPrice,
      maxPrice,
      inStock,
      featured,
      bestSeller,
      newArrival,
      sortBy,
      page,
      limit
    } = req.query;

    const result = db.getBooks({
      search: search as string,
      category: category as string,
      author: author as string,
      publisher: publisher as string,
      language: language as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      featured: featured === 'true',
      bestSeller: bestSeller === 'true',
      newArrival: newArrival === 'true',
      sortBy: sortBy as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 24
    });

    res.json({ success: true, data: result });
  });

  app.get('/api/books/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const book = db.getBookByIdOrSlug(idOrSlug);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    // Related books
    const related = db.books
      .filter((b) => b.id !== book.id && (b.category === book.category || b.author === book.author))
      .slice(0, 4);

    // Frequently bought together
    const frequentlyBought = db.books
      .filter((b) => b.id !== book.id && b.category === book.category)
      .slice(0, 2);

    res.json({
      success: true,
      data: {
        book,
        relatedBooks: related,
        frequentlyBoughtTogether: frequentlyBought
      }
    });
  });

  // ==========================================
  // 4. CATEGORIES ROUTES
  // ==========================================
  app.get('/api/categories', (req: Request, res: Response) => {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  });

  app.get('/api/categories/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const cat = db.categories.find((c) => c.slug === slug || c.id === slug);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    const { books } = db.getBooks({ category: cat.name });
    res.json({ success: true, data: { category: cat, books } });
  });

  // ==========================================
  // 5. COUPONS & PROMOTIONS
  // ==========================================
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const validation = db.validateCoupon(code, Number(subtotal) || 0);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    res.json({
      success: true,
      message: validation.message,
      data: {
        discount: validation.discount,
        coupon: validation.coupon
      }
    });
  });

  // ==========================================
  // 6. ORDERS & CHECKOUT
  // ==========================================
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      deliveryMethod,
      couponCode,
      paymentMethod
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !items || !items.length || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Incomplete order payload.' });
    }

    // Recalculate prices strictly on server
    let subtotal = 0;
    const verifiedItems = [];

    for (const it of items) {
      const b = db.books.find((book) => book.id === it.bookId);
      if (!b) {
        return res.status(400).json({ success: false, message: `Book ${it.bookId} no longer exists in catalog.` });
      }
      if (b.stock < it.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${b.title}". Only ${b.stock} available.`
        });
      }
      const unitPrice = b.discountPrice || b.price;
      const lineTotal = unitPrice * it.quantity;
      subtotal += lineTotal;
      verifiedItems.push({
        bookId: b.id,
        title: b.title,
        author: b.author,
        coverImage: b.coverImage,
        price: unitPrice,
        quantity: it.quantity,
        totalPrice: lineTotal
      });
    }

    // Calculate coupon discount
    let discount = 0;
    if (couponCode) {
      const val = db.validateCoupon(couponCode, subtotal);
      if (val.valid) {
        discount = val.discount;
        if (val.coupon) {
          val.coupon.usedCount += 1;
        }
      }
    }

    // Delivery fee
    const isExpress = deliveryMethod === 'Express Delivery';
    let deliveryFee = 0;
    if (isExpress) {
      deliveryFee = db.settings.deliveryChargesExpress;
    } else {
      deliveryFee = subtotal >= db.settings.freeDeliveryThreshold ? 0 : db.settings.deliveryChargesStandard;
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);

    const currentUser = (req as any).user;

    const order = db.createOrder({
      userId: currentUser ? currentUser.id : undefined,
      customerName,
      customerEmail,
      customerPhone,
      items: verifiedItems,
      shippingAddress,
      deliveryMethod: isExpress ? 'Express Delivery' : 'Standard Delivery',
      subtotal,
      discount,
      couponCode,
      deliveryFee,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Credit/Debit Card (Online)' ? 'Paid' : 'Pending',
      orderStatus: 'Pending'
    });

    db.addAuditLog(
      currentUser ? currentUser.id : 'guest',
      customerName,
      'Order Placed',
      `New order ${order.orderNumber} placed for Rs. ${total.toLocaleString()}`
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order
    });
  });

  app.get('/api/orders', requireAuth, (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const userOrders = db.orders.filter(
      (o) => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
    );
    res.json({ success: true, data: userOrders });
  });

  app.get('/api/orders/:idOrNumber', (req: Request, res: Response) => {
    const { idOrNumber } = req.params;
    const order = db.orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  });

  // ==========================================
  // 7. REVIEWS & RATINGS
  // ==========================================
  app.get('/api/reviews/book/:bookId', (req: Request, res: Response) => {
    const { bookId } = req.params;
    const bookReviews = db.reviews.filter((r) => r.bookId === bookId && r.status === 'approved');
    res.json({ success: true, data: bookReviews });
  });

  app.post('/api/reviews', requireAuth, (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Book ID, rating (1-5), and review text are required.' });
    }

    const book = db.books.find((b) => b.id === bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    // Check if user previously bought
    const hasBought = db.orders.some(
      (o) =>
        (o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()) &&
        o.items.some((it) => it.bookId === bookId)
    );

    const newRev: typeof db.reviews[0] = {
      id: `rev-${Date.now()}`,
      bookId,
      userId: user.id,
      userName: user.name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      verifiedPurchase: hasBought,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newRev);

    // Recalculate book rating
    const approvedReviews = db.reviews.filter((r) => r.bookId === bookId && r.status === 'approved');
    const totalScore = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    book.rating = Number((totalScore / approvedReviews.length).toFixed(1));
    book.reviewCount = approvedReviews.length;

    res.status(201).json({
      success: true,
      message: 'Thank you! Your book review has been published.',
      data: newRev
    });
  });

  // ==========================================
  // 8. AI BOOK ASSISTANT
  // ==========================================
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required.' });
    }

    const currentUser: User | undefined = (req as any).user;
    const userEmail = currentUser ? currentUser.email : undefined;

    try {
      const aiResponse = await processAIChat(prompt, userEmail);
      res.json({
        success: true,
        data: aiResponse
      });
    } catch (err: any) {
      console.error('AI chat endpoint error:', err);
      res.status(500).json({
        success: false,
        message: 'AI Assistant temporarily unavailable. Please try again shortly.'
      });
    }
  });

  // ==========================================
  // 9. ADMIN / OWNER DASHBOARD APIS
  // ==========================================
  app.get('/api/admin/dashboard', requireAdmin, (req: Request, res: Response) => {
    const totalRevenue = db.orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const todayDate = new Date().toISOString().split('T')[0];
    const todaySales = db.orders
      .filter((o) => o.createdAt.startsWith(todayDate) && o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = db.orders.length;
    const pendingOrders = db.orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const deliveredOrders = db.orders.filter((o) => o.orderStatus === 'Delivered').length;
    const cancelledOrders = db.orders.filter((o) => o.orderStatus === 'Cancelled').length;

    const totalBooks = db.books.length;
    const lowStockBooks = db.books.filter((b) => b.stock > 0 && b.stock <= 15).length;
    const outOfStockBooks = db.books.filter((b) => b.stock === 0).length;
    const totalCustomers = db.users.filter((u) => u.role === 'Customer').length;

    // Monthly breakdown for chart
    const monthlyData = [
      { name: 'Sep', revenue: 64000, orders: 38 },
      { name: 'Oct', revenue: 92000, orders: 54 },
      { name: 'Nov', revenue: 118000, orders: 72 },
      { name: 'Dec', revenue: 145000, orders: 89 },
      { name: 'Jan', revenue: 184000, orders: 110 },
      { name: 'Feb', revenue: 212000, orders: 128 }
    ];

    // Category sales distribution
    const categoryStats = db.categories.map((c) => ({
      name: c.name,
      count: db.books.filter((b) => b.category.toLowerCase() === c.name.toLowerCase()).length
    }));

    res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          todaySales,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          totalBooks,
          lowStockBooks,
          outOfStockBooks,
          totalCustomers
        },
        monthlyData,
        categoryStats,
        recentOrders: db.orders.slice(0, 5)
      }
    });
  });

  // Admin Book CRUD
  app.get('/api/admin/books', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.books });
  });

  app.post('/api/admin/books', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const bookData = req.body;

    if (!bookData.title || !bookData.author || !bookData.price || !bookData.category) {
      return res.status(400).json({ success: false, message: 'Title, Author, Price, and Category are required.' });
    }

    const slug = bookData.slug || bookData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBook = db.createBook({
      ...bookData,
      slug,
      originalTitle: bookData.originalTitle || undefined,
      binding: bookData.binding || 'Hardcover',
      publicationYear: bookData.publicationYear ? Number(bookData.publicationYear) : new Date().getFullYear(),
      createdAt: bookData.createdAt || new Date().toISOString(),
      coverImage: bookData.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      images: bookData.images && bookData.images.length ? bookData.images : [bookData.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
      sku: bookData.sku || `MH-BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
      isbn: bookData.isbn || `978-969-${Math.floor(100000 + Math.random() * 900000)}`,
      price: Number(bookData.price),
      discountPrice: bookData.discountPrice ? Number(bookData.discountPrice) : undefined,
      stock: Number(bookData.stock) || 0,
      pages: Number(bookData.pages) || 200,
      tags: Array.isArray(bookData.tags) ? bookData.tags : [bookData.category],
      featured: Boolean(bookData.featured || bookData.isFeatured),
      bestSeller: Boolean(bookData.bestSeller || bookData.isBestseller),
      newArrival: Boolean(bookData.newArrival || bookData.isNewArrival)
    });

    db.addAuditLog(admin.id, admin.name, 'Book Created', `Added new book "${newBook.title}" (Rs. ${newBook.price})`);

    res.status(201).json({ success: true, message: 'Book created successfully!', data: newBook });
  });

  app.put('/api/admin/books/:id', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.isFeatured !== undefined && updates.featured === undefined) updates.featured = updates.isFeatured;
    if (updates.isBestseller !== undefined && updates.bestSeller === undefined) updates.bestSeller = updates.isBestseller;
    if (updates.isNewArrival !== undefined && updates.newArrival === undefined) updates.newArrival = updates.isNewArrival;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : undefined;
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.pages !== undefined) updates.pages = Number(updates.pages);
    if (updates.publicationYear !== undefined) updates.publicationYear = Number(updates.publicationYear);

    const updated = db.updateBook(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    db.addAuditLog(admin.id, admin.name, 'Book Updated', `Modified details for "${updated.title}"`);
    res.json({ success: true, message: 'Book updated successfully!', data: updated });
  });

  app.delete('/api/admin/books/:id', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const book = db.books.find((b) => b.id === id);
    const success = db.deleteBook(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    db.addAuditLog(admin.id, admin.name, 'Book Deleted', `Deleted book "${book?.title || id}"`);
    res.json({ success: true, message: 'Book deleted successfully from catalog.' });
  });

  // Admin Inventory
  app.get('/api/admin/inventory', requireAdmin, (req: Request, res: Response) => {
    const inventory = db.books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      sku: b.sku,
      category: b.category,
      price: b.price,
      stock: b.stock,
      status: b.stock === 0 ? 'Out of Stock' : b.stock <= 15 ? 'Low Stock' : 'In Stock'
    }));

    res.json({
      success: true,
      data: {
        inventory,
        logs: db.inventoryLogs
      }
    });
  });

  app.post('/api/admin/inventory/adjust', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { bookId, quantityChanged, change, reason } = req.body;
    const delta = quantityChanged !== undefined ? quantityChanged : change;

    if (!bookId || delta === undefined || !reason) {
      return res.status(400).json({ success: false, message: 'Book ID, quantity adjustment, and reason are required.' });
    }

    const updated = db.adjustStock(bookId, Number(delta), reason, admin.name);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    db.addAuditLog(
      admin.id,
      admin.name,
      'Stock Adjusted',
      `Adjusted stock for "${updated.title}" by ${quantityChanged > 0 ? '+' : ''}${quantityChanged}. Reason: ${reason}`
    );

    res.json({ success: true, message: 'Stock updated successfully!', data: updated });
  });

  // Admin Orders Management
  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.orders });
  });

  app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const { status, note, courier, trackingNumber } = req.body;

    const updated = db.updateOrderStatus(id, status, note, courier, trackingNumber);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    db.addAuditLog(
      admin.id,
      admin.name,
      'Order Status Changed',
      `Order ${updated.orderNumber} updated to status "${status}"`
    );

    res.json({ success: true, message: `Order status updated to ${status}.`, data: updated });
  });

  // Admin Categories
  app.get('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.getCategories() });
  });

  app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = db.createCategory({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      status: 'active'
    });

    db.addAuditLog(admin.id, admin.name, 'Category Created', `Added category "${newCat.name}"`);
    res.status(201).json({ success: true, message: 'Category created successfully!', data: newCat });
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const updated = db.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    db.addAuditLog(admin.id, admin.name, 'Category Updated', `Updated category "${updated.name}"`);
    res.json({ success: true, message: 'Category updated!', data: updated });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const success = db.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    db.addAuditLog(admin.id, admin.name, 'Category Deleted', `Deleted category ID ${id}`);
    res.json({ success: true, message: 'Category deleted!' });
  });

  // Admin Customers
  app.get('/api/admin/customers', requireAdmin, (req: Request, res: Response) => {
    const customers = db.users
      .filter((u) => u.role === 'Customer')
      .map((u) => {
        const userOrders = db.orders.filter((o) => o.userId === u.id || o.customerEmail.toLowerCase() === u.email.toLowerCase());
        const totalSpend = userOrders.reduce((sum, o) => sum + o.total, 0);
        return {
          ...u,
          orderCount: userOrders.length,
          totalSpend
        };
      });
    res.json({ success: true, data: customers });
  });

  app.put('/api/admin/customers/:id/status', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    const { status } = req.body;
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }
    user.status = status;
    db.addAuditLog(admin.id, admin.name, 'Customer Status Changed', `Customer ${user.email} status set to ${status}`);
    res.json({ success: true, message: 'Customer status updated!', data: user });
  });

  // Admin Coupons
  app.get('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.coupons });
  });

  app.post('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { code, type, value, minimumOrder, maximumDiscount, expiryDate, usageLimit } = req.body;

    if (!code || !value) {
      return res.status(400).json({ success: false, message: 'Code and discount value are required.' });
    }

    const newCoupon: typeof db.coupons[0] = {
      id: `cp-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type: type || 'percentage',
      value: Number(value),
      minimumOrder: Number(minimumOrder) || 0,
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : undefined,
      expiryDate: expiryDate || '2027-12-31T23:59:59.000Z',
      usageLimit: Number(usageLimit) || 500,
      usedCount: 0,
      active: true
    };

    db.coupons.push(newCoupon);
    db.addAuditLog(admin.id, admin.name, 'Coupon Created', `Created coupon ${newCoupon.code}`);
    res.status(201).json({ success: true, message: 'Coupon created successfully!', data: newCoupon });
  });

  app.delete('/api/admin/coupons/:id', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { id } = req.params;
    db.coupons = db.coupons.filter((c) => c.id !== id);
    db.addAuditLog(admin.id, admin.name, 'Coupon Deleted', `Deleted coupon ID ${id}`);
    res.json({ success: true, message: 'Coupon deleted!' });
  });

  // Admin Reviews
  app.get('/api/admin/reviews', requireAdmin, (req: Request, res: Response) => {
    const reviewsWithBook = db.reviews.map((r) => {
      const b = db.books.find((book) => book.id === r.bookId);
      return {
        ...r,
        bookTitle: b ? b.title : 'Unknown Book'
      };
    });
    res.json({ success: true, data: reviewsWithBook });
  });

  app.put('/api/admin/reviews/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const review = db.reviews.find((r) => r.id === id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    review.status = status;
    res.json({ success: true, message: 'Review status updated.', data: review });
  });

  app.delete('/api/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    db.reviews = db.reviews.filter((r) => r.id !== id);
    res.json({ success: true, message: 'Review deleted.' });
  });

  // Admin Settings
  app.get('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.settings });
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    db.settings = {
      ...db.settings,
      ...req.body
    };
    db.addAuditLog(admin.id, admin.name, 'Settings Updated', 'Store configuration & location updated');
    res.json({ success: true, message: 'Store settings saved successfully!', data: db.settings });
  });

  // Admin Audit Logs
  app.get('/api/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
    res.json({ success: true, data: db.auditLogs });
  });

  // Bulk CSV Export
  app.get('/api/admin/export-csv', requireAdmin, (req: Request, res: Response) => {
    const header = 'Title,Author,Category,Price,DiscountPrice,Stock,SKU,ISBN,Language,Publisher\n';
    const rows = db.books
      .map(
        (b) =>
          `"${b.title.replace(/"/g, '""')}","${b.author.replace(/"/g, '""')}","${b.category}",${b.price},${b.discountPrice || ''},${b.stock},"${b.sku}","${b.isbn}","${b.language}","${b.publisher.replace(/"/g, '""')}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="maktaba_haqanya_books.csv"');
    res.send(header + rows);
  });

  // Bulk CSV Import (JSON or Text payload)
  app.post('/api/admin/import-csv', requireAdmin, (req: Request, res: Response) => {
    const admin: User = (req as any).user;
    const { csvText } = req.body;

    if (!csvText) {
      return res.status(400).json({ success: false, message: 'CSV text content is required.' });
    }

    try {
      const lines = csvText.split('\n').filter((l: string) => l.trim().length > 0);
      if (lines.length < 2) {
        return res.status(400).json({ success: false, message: 'CSV must contain a header and at least one row.' });
      }

      let importedCount = 0;
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p: string) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 4) {
          const title = parts[0];
          const author = parts[1];
          const category = parts[2] || 'Islamic Studies & Seerah';
          const price = Number(parts[3]) || 500;
          const discountPrice = parts[4] ? Number(parts[4]) : undefined;
          const stock = parts[5] ? Number(parts[5]) : 25;
          const sku = parts[6] || `MH-IMP-${Math.floor(1000 + Math.random() * 9000)}`;
          const isbn = parts[7] || `978-969-${Math.floor(100000 + Math.random() * 900000)}`;
          const language = (parts[8] as any) || 'Urdu';
          const publisher = parts[9] || 'Maktaba Haqanya Press';

          if (title && author) {
            db.createBook({
              title,
              slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
              author,
              publisher,
              isbn,
              category,
              description: `Imported book: ${title} by ${author}. High-quality print edition.`,
              price,
              discountPrice,
              stock,
              sku,
              images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
              coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
              language,
              pages: 350,
              tags: [category, 'Imported'],
              featured: false,
              bestSeller: false,
              newArrival: true
            });
            importedCount++;
          }
        }
      }

      db.addAuditLog(admin.id, admin.name, 'CSV Bulk Import', `Imported ${importedCount} books via CSV`);

      res.json({
        success: true,
        message: `Successfully imported ${importedCount} books into catalog!`,
        importedCount
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: `Failed to parse CSV: ${err.message}` });
    }
  });

  // ==========================================
  // 10. VITE MIDDLEWARE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(` Maktaba Haqanya Server running on http://0.0.0.0:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Books in catalog: ${db.books.length}`);
    console.log(` Admin account: admin@maktabahaqanya.pk / admin123`);
    console.log(` Customer account: customer@gmail.com / customer123`);
    console.log(`=========================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
});
