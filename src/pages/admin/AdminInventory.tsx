import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Book, StockAuditLog } from '../../types';
import {
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Search,
  History,
  CheckCircle2,
  Package,
  X,
  TrendingUp,
  Boxes,
  ArrowUpDown
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [auditLogs, setAuditLogs] = useState<StockAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState<'All' | 'Low' | 'Out'>('All');

  // Adjustment Modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [adjustmentChange, setAdjustmentChange] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState('New shipment arrived from publisher');
  const [adjusting, setAdjusting] = useState(false);

  const { token } = useAuth();
  const { success, error } = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [booksRes, logsRes] = await Promise.all([
        fetch('/api/books?limit=200'),
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const booksData = await booksRes.json();
      const logsData = await logsRes.json();

      if (booksData.success && booksData.data.books) {
        setBooks(booksData.data.books);
      }
      if (logsData.success && logsData.data) {
        const stockLogs = logsData.data.filter((l: any) => l.action?.toLowerCase().includes('stock'));
        setAuditLogs(stockLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const handleOpenAdjust = (book: Book, defaultDelta = 10) => {
    setSelectedBook(book);
    setAdjustmentChange(defaultDelta);
    setAdjustmentReason(defaultDelta > 0 ? 'New shipment arrived from publisher' : 'Damaged / showroom sample adjustment');
  };

  const handleConfirmAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    setAdjusting(true);
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: selectedBook.id,
          quantityChanged: Number(adjustmentChange),
          reason: adjustmentReason
        })
      });

      const data = await res.json();
      if (data.success) {
        success(`Stock updated for "${selectedBook.title}".`);
        setSelectedBook(null);
        fetchInventory();
      } else {
        error(data.message || 'Failed to adjust stock.');
      }
    } catch {
      error('Network error adjusting stock.');
    } finally {
      setAdjusting(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      (b.isbn && b.isbn.includes(search));

    if (filterStock === 'Low') return matchesSearch && b.stock > 0 && b.stock <= 15;
    if (filterStock === 'Out') return matchesSearch && b.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
              Urdu Bazaar Lahore Warehouse
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white mt-1">
            Warehouse Inventory &amp; Stock Control
          </h1>
          <p className="text-xs text-slate-400">
            Monitor real-time physical stock levels, record publisher deliveries, and manage buffer stock
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-md transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Warehouse Stock
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white/[0.04] backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search warehouse stock by book title, author or ISBN..."
            className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStock('All')}
            className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all ${
              filterStock === 'All'
                ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Stock ({books.length})
          </button>
          <button
            onClick={() => setFilterStock('Low')}
            className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all ${
              filterStock === 'Low'
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-md'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Low Stock (&le; 15)
          </button>
          <button
            onClick={() => setFilterStock('Out')}
            className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all ${
              filterStock === 'Out'
                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50 shadow-md'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-400 uppercase bg-white/[0.02] border-b border-white/10 font-bold tracking-wider">
              <tr>
                <th className="p-3.5">Book Title</th>
                <th className="p-3.5">Publisher &amp; Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Stock Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={b.coverImage} alt="" className="w-9 h-13 object-cover rounded-lg shadow-md border border-white/10 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-white block">{b.title}</span>
                        <span className="text-slate-400 text-[11px] block">{b.author}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-200 block">{b.publisher}</span>
                    <span className="text-slate-400 text-[11px]">{b.category}</span>
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    Rs. {(b.discountPrice || b.price).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className="text-base font-black text-white">{b.stock}</span>
                    <span className="text-[11px] text-slate-400 block">units in storage</span>
                  </td>
                  <td className="p-3.5">
                    {b.stock === 0 ? (
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full">
                        Out of Stock
                      </span>
                    ) : b.stock <= 15 ? (
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        In Stock ({b.stock})
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenAdjust(b, 10)}
                      className="bg-indigo-600/80 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      + Add Stock
                    </button>
                    <button
                      onClick={() => handleOpenAdjust(b, -1)}
                      disabled={b.stock <= 0}
                      className="bg-white/5 hover:bg-white/15 disabled:opacity-30 text-slate-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                    >
                      - Deduct
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0c0d22]/95 border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-5 text-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base font-serif-heading text-white">
                Adjust Physical Stock
              </h3>
              <button onClick={() => setSelectedBook(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <img src={selectedBook.coverImage} alt="" className="w-10 h-14 object-cover rounded shadow" />
              <div className="min-w-0">
                <span className="font-bold text-white text-xs block truncate">{selectedBook.title}</span>
                <span className="text-[11px] text-indigo-300 block">Current Stock: {selectedBook.stock} units</span>
              </div>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Quantity Adjustment (positive to add, negative to deduct) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustmentChange}
                  onChange={(e) => setAdjustmentChange(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Resulting Stock Level: <strong>{Math.max(0, selectedBook.stock + adjustmentChange)}</strong> copies
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Audit Reason / Dispatch Note *
                </label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. New reprint consignment received from Darussalam"
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  {adjusting ? 'Updating Warehouse...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
