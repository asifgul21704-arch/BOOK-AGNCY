import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Book, Category } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Calendar,
  Layers,
  Copy,
  ArrowUpDown,
  TrendingUp,
  Package,
  Clock,
  Eye,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

// Curated Islamic Book Cover presets
const COVER_PRESETS = [
  {
    name: 'Classic Quran / Tafseer',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Prophetic Hadith & Sunnah',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Seerah & Islamic History',
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Urdu Literature & Poetry',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Fiqh, Fatwa & Law',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Arabic Grammar & Dars-e-Nizami',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Islamic Philosophy & Thought',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Modern Islamic Self Development',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
  }
];

export const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | 'thisyear'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'title-asc'>('date-desc');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('Darussalam Pakistan');
  const [category, setCategory] = useState('Quran & Tafseer');
  const [subcategory, setSubcategory] = useState('');
  const [language, setLanguage] = useState<'Urdu' | 'Arabic' | 'English' | 'Persian' | 'Sindhi' | 'Pashto' | 'Bilingual'>('Urdu');
  const [isbn, setIsbn] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(1000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(20);
  const [binding, setBinding] = useState<string>('Hardcover');
  const [pages, setPages] = useState<number>(450);
  const [edition, setEdition] = useState('Deluxe Edition');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [uploadDate, setUploadDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  // Image Upload State
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [coverImage, setCoverImage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Badges
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const { token } = useAuth();
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();

  const fetchBooksAndCats = async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes] = await Promise.all([
        fetch('/api/books?limit=200'),
        fetch('/api/categories')
      ]);
      const booksData = await booksRes.json();
      const catsData = await catsRes.json();

      if (booksData.success && booksData.data.books) {
        setBooks(booksData.data.books);
      }
      if (catsData.success && catsData.data) {
        setCategories(catsData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksAndCats();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingBook(null);
    setTitle('');
    setOriginalTitle('');
    setAuthor('');
    setPublisher('Darussalam Pakistan');
    setCategory(categories[0]?.name || 'Quran & Tafseer');
    setSubcategory('');
    setLanguage('Urdu');
    setIsbn(`978-969-${Math.floor(100000 + Math.random() * 900000)}`);
    setSku(`MH-BOOK-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice(1200);
    setDiscountPrice(undefined);
    setStock(25);
    setBinding('Hardcover / Mujallad');
    setPages(450);
    setEdition('1st Deluxe Edition');
    setPublicationYear(new Date().getFullYear());
    setUploadDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setTags('Islamic, Urdu, Darussalam');
    setCoverImage(COVER_PRESETS[0].url);
    setUploadedFileName(null);
    setImageTab('upload');
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Book) => {
    setEditingBook(b);
    setTitle(b.title);
    setOriginalTitle(b.originalTitle || '');
    setAuthor(b.author);
    setPublisher(b.publisher);
    setCategory(b.category);
    setSubcategory(b.subcategory || '');
    setLanguage((b.language as any) || 'Urdu');
    setIsbn(b.isbn || '');
    setSku(b.sku || `MH-BOOK-${b.id.slice(-4)}`);
    setPrice(b.price);
    setDiscountPrice(b.discountPrice);
    setStock(b.stock);
    setBinding(b.binding || 'Hardcover');
    setPages(b.pages || 400);
    setEdition(b.edition || '');
    setPublicationYear(b.publicationYear || (b.createdAt ? new Date(b.createdAt).getFullYear() : 2024));
    setUploadDate(b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
    setDescription(b.description || '');
    setTags(b.tags ? b.tags.join(', ') : '');
    setCoverImage(b.coverImage || COVER_PRESETS[0].url);
    setUploadedFileName(null);
    setImageTab('url');
    setIsFeatured(!!(b.isFeatured || b.featured));
    setIsBestseller(!!(b.isBestseller || b.bestSeller));
    setIsNewArrival(!!(b.isNewArrival || b.newArrival));
    setModalOpen(true);
  };

  const handleDuplicate = (b: Book) => {
    setEditingBook(null);
    setTitle(`${b.title} (Copy / Volume 2)`);
    setOriginalTitle(b.originalTitle || '');
    setAuthor(b.author);
    setPublisher(b.publisher);
    setCategory(b.category);
    setSubcategory(b.subcategory || '');
    setLanguage(b.language as any);
    setIsbn(`978-969-${Math.floor(100000 + Math.random() * 900000)}`);
    setSku(`MH-BOOK-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice(b.price);
    setDiscountPrice(b.discountPrice);
    setStock(b.stock || 20);
    setBinding(b.binding || 'Hardcover');
    setPages(b.pages || 400);
    setEdition(b.edition || 'New Edition');
    setPublicationYear(new Date().getFullYear());
    setUploadDate(new Date().toISOString().slice(0, 10));
    setDescription(b.description || '');
    setTags(b.tags ? b.tags.join(', ') : '');
    setCoverImage(b.coverImage);
    setUploadedFileName(null);
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(true);
    setModalOpen(true);
    success(`Duplicated "${b.title}". You can modify details and save.`);
  };

  // Image file handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('Image size exceeds 5MB limit.');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
        success(`Loaded image: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      error('Please enter book title and author name.');
      return;
    }
    if (!category) {
      error('Please select a book category.');
      return;
    }

    setSubmitting(true);
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const bookData = {
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      author: author.trim(),
      publisher: publisher.trim(),
      category,
      subcategory: subcategory.trim() || undefined,
      language,
      isbn: isbn.trim(),
      sku: sku.trim() || undefined,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      binding,
      pages: Number(pages),
      edition: edition.trim(),
      publicationYear: Number(publicationYear),
      createdAt: uploadDate ? new Date(uploadDate).toISOString() : new Date().toISOString(),
      description: description.trim(),
      tags: parsedTags.length > 0 ? parsedTags : [category, language],
      coverImage: coverImage.trim() || COVER_PRESETS[0].url,
      images: [coverImage.trim() || COVER_PRESETS[0].url],
      featured: isFeatured,
      isFeatured,
      bestSeller: isBestseller,
      isBestseller,
      newArrival: isNewArrival,
      isNewArrival
    };

    try {
      const url = editingBook ? `/api/admin/books/${editingBook.id}` : '/api/admin/books';
      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      const data = await res.json();
      if (data.success) {
        success(editingBook ? `Updated "${title}" successfully!` : `Published "${title}" to catalog!`);
        setModalOpen(false);
        fetchBooksAndCats();
      } else {
        error(data.message || 'Failed to save book.');
      }
    } catch (err: any) {
      error(err.message || 'Error occurred while saving book.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId: string, bookTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}" from Maktaba Haqanya catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        success('Book removed from catalog.');
        setBooks((prev) => prev.filter((b) => b.id !== bookId));
      } else {
        error(data.message);
      }
    } catch {
      error('Failed to delete book.');
    }
  };

  // Quick inline stock updater
  const handleQuickStock = async (bookId: string, change: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const newStock = Math.max(0, book.stock + change);

    try {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, stock: newStock } : b))
        );
        success(`Stock updated for ${book.title} (${newStock} units)`);
      }
    } catch {
      error('Failed to update stock.');
    }
  };

  // Quick inline badge toggler
  const handleQuickToggleBadge = async (bookId: string, badge: 'featured' | 'bestSeller' | 'newArrival') => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const currentVal = !!(book as any)[badge];
    const updates = { [badge]: !currentVal };

    try {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, ...updates } : b))
        );
        success(`Updated ${badge} badge for "${book.title}"`);
      }
    } catch {
      error('Failed to update badge.');
    }
  };

  // Bulk actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBooks.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected books from catalog?`)) return;

    try {
      for (const id of selectedIds) {
        await fetch(`/api/admin/books/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      success(`Successfully deleted ${selectedIds.length} books.`);
      setSelectedIds([]);
      fetchBooksAndCats();
    } catch {
      error('Failed to complete bulk deletion.');
    }
  };

  // Filter & Sort Logic
  const filteredBooks = books
    .filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        (b.isbn && b.isbn.includes(search)) ||
        (b.publisher && b.publisher.toLowerCase().includes(search.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesLang = selectedLanguage === 'All' || b.language === selectedLanguage;

      let matchesDate = true;
      if (dateFilter !== 'all' && b.createdAt) {
        const bookDate = new Date(b.createdAt).getTime();
        const now = new Date().getTime();
        if (dateFilter === '7days') {
          matchesDate = now - bookDate <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === '30days') {
          matchesDate = now - bookDate <= 30 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === 'thisyear') {
          matchesDate = new Date(b.createdAt).getFullYear() === new Date().getFullYear();
        }
      }

      return matchesSearch && matchesCat && matchesLang && matchesDate;
    })
    .sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const aPrice = a.discountPrice || a.price;
      const bPrice = b.discountPrice || b.price;

      switch (sortBy) {
        case 'date-desc':
          return bDate - aDate;
        case 'date-asc':
          return aDate - bDate;
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return bDate - aDate;
      }
    });

  // Calculate catalog stats
  const totalBooksCount = books.length;
  const inStockCount = books.filter((b) => b.stock > 15).length;
  const lowStockCount = books.filter((b) => b.stock > 0 && b.stock <= 15).length;
  const outOfStockCount = books.filter((b) => b.stock === 0).length;
  const totalInventoryValue = books.reduce((acc, b) => acc + (b.discountPrice || b.price) * b.stock, 0);

  // Helper date formatter
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString.slice(0, 10);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
              Maktaba Haqanya Admin Portal
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white mt-1">
            Books &amp; Products Management
          </h1>
          <p className="text-xs text-slate-400">
            Publish Islamic titles, upload book covers, manage upload dates, stock levels, and pricing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBooksAndCats}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 backdrop-blur-md transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreate}
            id="btn-admin-add-book"
            className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 border border-white/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add New Book / Product
          </button>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Titles</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white">{totalBooksCount}</div>
          <span className="text-[10px] text-slate-400">Active in Store</span>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">In Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{inStockCount}</div>
          <span className="text-[10px] text-slate-400">Ready to dispatch</span>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Low Stock</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{lowStockCount}</div>
          <span className="text-[10px] text-slate-400">&le; 15 copies left</span>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Out of Stock</span>
            <X className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{outOfStockCount}</div>
          <span className="text-[10px] text-slate-400">Needs restock</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Catalog Worth</span>
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="text-lg font-black text-white truncate">Rs. {totalInventoryValue.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Inventory value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/[0.04] backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title, author, publisher, ISBN..."
            className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0b0c1e] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Language Dropdown */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-[#0b0c1e] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Languages</option>
          <option value="Urdu">Urdu</option>
          <option value="Arabic">Arabic</option>
          <option value="English">English</option>
          <option value="Persian">Persian</option>
          <option value="Sindhi">Sindhi</option>
          <option value="Pashto">Pashto</option>
          <option value="Bilingual">Bilingual</option>
        </select>

        {/* Upload Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-fuchsia-400 hidden sm:block" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="bg-[#0b0c1e] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Upload Date: All Time</option>
            <option value="7days">Uploaded Last 7 Days</option>
            <option value="30days">Uploaded Last 30 Days</option>
            <option value="thisyear">Uploaded This Year</option>
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0b0c1e] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date-desc">Upload Date: Newest First</option>
            <option value="date-asc">Upload Date: Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="title-asc">Title: A-Z Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-950/70 border border-indigo-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center gap-2 text-indigo-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>{selectedIds.length} books selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-400 uppercase bg-white/[0.02] border-b border-white/10 font-bold tracking-wider">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === filteredBooks.length}
                    className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-0"
                  />
                </th>
                <th className="p-3.5">Book / Product</th>
                <th className="p-3.5">Category &amp; Lang</th>
                <th className="p-3.5">Upload Date</th>
                <th className="p-3.5">Price (PKR)</th>
                <th className="p-3.5">Stock Level</th>
                <th className="p-3.5">Display Badges</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                      <span>Loading Maktaba Haqanya product catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="font-semibold text-white">No products found matching your filters</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting search keywords or upload date filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(b.id)}
                        onChange={() => handleToggleSelect(b.id)}
                        className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-0"
                      />
                    </td>

                    {/* Book Info */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-11 h-16 object-cover rounded-lg shadow-md border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/books/${b.slug || b.id}`}
                            target="_blank"
                            className="font-bold text-white hover:text-indigo-300 block truncate transition-colors text-sm"
                            title={b.title}
                          >
                            {b.title}
                          </Link>
                          {b.originalTitle && (
                            <span className="text-slate-300 text-[11px] block font-serif-heading truncate">
                              {b.originalTitle}
                            </span>
                          )}
                          <span className="text-slate-400 text-[11px] block">By {b.author}</span>
                          <span className="text-slate-500 text-[10px] block font-mono">
                            {b.publisher} • ISBN: {b.isbn || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Lang */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200 block">{b.category}</span>
                      <span className="text-slate-400 text-[11px]">
                        {b.language} • {b.binding || 'Hardcover'}
                      </span>
                      {b.pages && <span className="text-slate-500 text-[10px] block">{b.pages} pages</span>}
                    </td>

                    {/* Upload Date */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>{formatDate(b.createdAt)}</span>
                      </div>
                      {b.publicationYear && (
                        <span className="text-[10px] text-slate-500 block">
                          Pub. Year: {b.publicationYear}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="p-3.5">
                      <span className="font-bold text-white block text-sm">
                        Rs. {(b.discountPrice || b.price).toLocaleString()}
                      </span>
                      {b.discountPrice && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 line-through text-[10px]">
                            Rs. {b.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">
                            Save {Math.round(((b.price - b.discountPrice) / b.price) * 100)}%
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Stock with quick buttons */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            b.stock === 0
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : b.stock <= 15
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {b.stock === 0 ? 'Out of Stock' : `${b.stock} copies`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuickStock(b.id, -1)}
                          disabled={b.stock <= 0}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] flex items-center justify-center border border-white/10 disabled:opacity-30"
                          title="Decrease Stock (-1)"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleQuickStock(b.id, 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] flex items-center justify-center border border-white/10"
                          title="Increase Stock (+1)"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickStock(b.id, 10)}
                          className="px-1.5 h-5 rounded bg-white/5 hover:bg-white/15 text-indigo-300 text-[10px] font-bold flex items-center justify-center border border-white/10"
                          title="Restock (+10)"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Interactive Badges */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickToggleBadge(b.id, 'featured')}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold border transition-colors ${
                            b.featured || b.isFeatured
                              ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50'
                              : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'
                          }`}
                          title="Toggle Featured on Home"
                        >
                          ★ Featured
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickToggleBadge(b.id, 'bestSeller')}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold border transition-colors ${
                            b.bestSeller || b.isBestseller
                              ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                              : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'
                          }`}
                          title="Toggle Bestseller"
                        >
                          🔥 Best
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickToggleBadge(b.id, 'newArrival')}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold border transition-colors ${
                            b.newArrival || b.isNewArrival
                              ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                              : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'
                          }`}
                          title="Toggle New Arrival"
                        >
                          ✨ New
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/books/${b.slug || b.id}`}
                        target="_blank"
                        className="inline-flex p-1.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-lg border border-white/10 transition-colors"
                        title="View Live Product Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(b)}
                        className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-lg border border-white/10 transition-colors"
                        title="Duplicate / Clone this book"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 bg-white/5 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 rounded-lg border border-white/10 transition-colors"
                        title="Edit book details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        className="p-1.5 bg-white/5 hover:bg-rose-500/30 text-slate-400 hover:text-rose-400 rounded-lg border border-white/10 transition-colors"
                        title="Delete book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Showing <strong className="text-white">{filteredBooks.length}</strong> of{' '}
            <strong className="text-white">{books.length}</strong> total books in catalog
          </span>
          <span className="text-[11px]">
            Maktaba Haqanya Central Database • Updated in real-time
          </span>
        </div>
      </div>

      {/* CREATE / EDIT BOOK MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div
            className="bg-[#0c0d22]/95 border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-slate-100 max-h-[92vh] overflow-y-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                    {editingBook ? 'Edit Catalog Entry' : 'New Book Publication'}
                  </span>
                </div>
                <h3 className="font-bold text-xl sm:text-2xl font-serif-heading text-white mt-0.5">
                  {editingBook ? `Edit: ${editingBook.title}` : 'Add New Book to Maktaba Haqanya'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* SECTION 1: Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> 1. Title &amp; Scholar Attribution
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Book Title (English / Roman Urdu) *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Tafheem-ul-Quran (6 Volumes)"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Original Arabic / Urdu Title (کتاب کا اصلی نام)
                    </label>
                    <input
                      type="text"
                      value={originalTitle}
                      onChange={(e) => setOriginalTitle(e.target.value)}
                      placeholder="e.g. تفہیم القرآن مکمل چھ جلدیں"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md font-serif-heading text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">
                      Author / Scholar / Translator *
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Syed Abul A'la Maududi"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Publisher / Maktaba *</label>
                    <input
                      type="text"
                      required
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      placeholder="e.g. Darussalam Pakistan / Idara Tarjuman-ul-Quran"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Category, Language & Upload Date */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> 2. Classification, Language &amp; Upload Date
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Language *</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Urdu">Urdu</option>
                      <option value="Arabic">Arabic</option>
                      <option value="English">English</option>
                      <option value="Persian">Persian</option>
                      <option value="Sindhi">Sindhi</option>
                      <option value="Pashto">Pashto</option>
                      <option value="Bilingual">Bilingual (Arabic / Urdu)</option>
                    </select>
                  </div>

                  {/* Upload Date Input */}
                  <div>
                    <label className="font-semibold text-indigo-300 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Upload / Added Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      className="w-full bg-white/5 border border-indigo-500/40 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Pricing, Inventory & Specs */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> 3. Pricing, Stock &amp; Physical Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Regular Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Discount Price (PKR)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountPrice || ''}
                      onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Optional discount"
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Binding Type</label>
                    <select
                      value={binding}
                      onChange={(e) => setBinding(e.target.value)}
                      className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Hardcover / Mujallad">Hardcover / Mujallad</option>
                      <option value="Paperback">Paperback</option>
                      <option value="Deluxe Leatherbound">Deluxe Leatherbound</option>
                      <option value="Multi-Volume Box Set">Multi-Volume Box Set</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">ISBN Number</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="978-969-..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="MH-BOOK-..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Pages Count</label>
                    <input
                      type="number"
                      value={pages}
                      onChange={(e) => setPages(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Publication Year</label>
                    <input
                      type="number"
                      value={publicationYear}
                      onChange={(e) => setPublicationYear(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Image Upload & Cover Selection */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> 4. Book Cover Image Selection
                  </h4>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        imageTab === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" /> Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        imageTab === 'url' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        imageTab === 'presets' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Presets
                    </button>
                  </div>
                </div>

                {/* Option A: Direct File Upload */}
                {imageTab === 'upload' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                    <p className="font-semibold text-white text-xs">
                      {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click or Drag & Drop to Upload Cover Image'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, WEBP high resolution book scans (up to 5MB)
                    </p>
                  </div>
                )}

                {/* Option B: Direct URL */}
                {imageTab === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Option C: Curated Islamic Presets */}
                {imageTab === 'presets' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {COVER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          coverImage === preset.url
                            ? 'bg-indigo-600/30 border-indigo-500 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-8 h-10 object-cover rounded shadow" />
                        <span className="text-[10px] font-semibold truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cover Preview */}
                {coverImage && (
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-12 h-16 object-cover rounded-lg shadow-md border border-white/15"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block">Active Cover Preview</span>
                      <span className="text-[11px] text-slate-400 block truncate">{coverImage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCoverImage(COVER_PRESETS[0].url)}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      Reset Default
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 5: Description & Tags */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Book Description / Synopsis</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive overview of chapters, author commentary, themes, and academic significance..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. Tafseer, Maududi, Quranic Sciences, Islamic Classic"
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white placeholder-slate-500"
                  />
                </div>

                {/* Badges Toggle */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-0"
                    />
                    <span className="font-medium text-white">⭐ Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={isBestseller}
                      onChange={(e) => setIsBestseller(e.target.checked)}
                      className="rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-0"
                    />
                    <span className="font-medium text-white">🔥 Bestseller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded bg-white/5 border-white/20 text-indigo-600 focus:ring-0"
                    />
                    <span className="font-medium text-white">✨ New Arrival Badge</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 border border-white/20 disabled:opacity-40"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving Book...
                    </span>
                  ) : editingBook ? (
                    'Save Changes'
                  ) : (
                    'Publish Book to Store'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
