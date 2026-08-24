import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StockAuditLog } from '../../types';
import { FileText, RefreshCw, ShieldCheck, Clock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<StockAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif-heading text-white">
            System &amp; Inventory Audit Trail
          </h1>
          <p className="text-xs text-slate-400">
            Immutable timeline of inventory changes, order updates, and administrative actions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-2 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-500 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Admin / User</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Stock Delta</th>
                <th className="p-3.5">Audit Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">{log.performedBy}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    {log.previousStock !== undefined && log.newStock !== undefined ? (
                      <span className={log.newStock >= log.previousStock ? 'text-emerald-400' : 'text-rose-400'}>
                        {log.previousStock} → {log.newStock} ({log.newStock >= log.previousStock ? `+${log.newStock - log.previousStock}` : log.newStock - log.previousStock})
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-sm">
                    {log.reason || 'System operation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
