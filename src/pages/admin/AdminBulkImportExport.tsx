import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileSpreadsheet, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminBulkImportExport: React.FC = () => {
  const [importType, setImportType] = useState<'books' | 'categories'>('books');
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const { token } = useAuth();
  const { success, error } = useToast();

  const handleExport = async (type: 'books' | 'orders' | 'customers') => {
    setExporting(type);
    try {
      const res = await fetch(`/api/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Convert to CSV
        const items = data.data;
        if (!items || items.length === 0) {
          error('No records to export.');
          return;
        }

        const headers = Object.keys(items[0]).join(',');
        const rows = items.map((obj: any) =>
          Object.values(obj)
            .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
            .join(',')
        );
        const csvContent = [headers, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `maktaba_haqanya_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        success(`${type.toUpperCase()} exported to CSV!`);
      } else {
        error(data.message || 'Export failed.');
      }
    } catch {
      error('Failed to generate CSV export.');
    } finally {
      setExporting(null);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) {
      error('Please paste CSV contents or upload a file.');
      return;
    }

    setImporting(true);
    try {
      const res = await fetch('/api/admin/import/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ csvContent: csvText })
      });

      const data = await res.json();
      if (data.success) {
        success(`Successfully processed bulk CSV import (${data.data?.imported || 0} books)!`);
        setCsvText('');
      } else {
        error(data.message || 'CSV Import failed.');
      }
    } catch {
      error('Network error during CSV import.');
    } finally {
      setImporting(false);
    }
  };

  const sampleCsvFormat = `title,author,publisher,category,language,price,stock,isbn,description
Tafheem-ul-Quran (6 Volumes),Syed Abul A'la Maududi,Idara Tarjuman-ul-Quran,Quran & Tafseer,Urdu,7500,15,978-969-407-001,Masterpiece Urdu translation and comprehensive commentary.
Sahih Bukhari (Mukhtasar Urdu),Imam Muhammad al-Bukhari,Darussalam Pakistan,Hadith Studies,Urdu,4200,20,978-969-407-002,Complete authenticated prophetic traditions with Urdu annotations.
Kulliyat-e-Iqbal (Urdu),Allama Muhammad Iqbal,Sang-e-Meel Publications,Urdu Literature,Urdu,2400,30,978-969-407-003,Bang-e-Dra, Bal-e-Jibril, Zarb-e-Kaleem, and Armughan-e-Hijaz.`;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-serif-heading text-white">
          CSV Bulk Data Import &amp; Export
        </h1>
        <p className="text-xs text-slate-400">
          Export catalog inventory, customer orders, or import multi-title publisher batches
        </p>
      </div>

      {/* Export Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Download className="w-4 h-4 text-emerald-400" /> Export Store Database Records (CSV Format)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Books Inventory Catalog</span>
              <p className="text-[11px] text-slate-400 mt-1">Export all titles, ISBNs, current warehouse stock, and prices.</p>
            </div>
            <button
              onClick={() => handleExport('books')}
              disabled={exporting === 'books'}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting === 'books' ? 'Exporting...' : 'Export Books CSV'}</span>
            </button>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Customer Orders &amp; Dispatches</span>
              <p className="text-[11px] text-slate-400 mt-1">Export nationwide order history, TCS tracking codes, and totals.</p>
            </div>
            <button
              onClick={() => handleExport('orders')}
              disabled={exporting === 'orders'}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting === 'orders' ? 'Exporting...' : 'Export Orders CSV'}</span>
            </button>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Registered Customers</span>
              <p className="text-[11px] text-slate-400 mt-1">Export reader directory, email addresses, and phone contacts.</p>
            </div>
            <button
              onClick={() => handleExport('customers')}
              disabled={exporting === 'customers'}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting === 'customers' ? 'Exporting...' : 'Export Readers CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Upload className="w-4 h-4 text-emerald-400" /> Bulk Import Books via CSV
        </h3>

        <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Paste CSV Raw Text (comma separated with header)
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={sampleCsvFormat}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-[11px]"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCsvText(sampleCsvFormat)}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Load Sample Template
            </button>

            <button
              type="submit"
              disabled={importing || !csvText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{importing ? 'Processing Import...' : 'Import Books Batch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
