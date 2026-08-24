import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Order } from '../../types';
import { Users, Search, Mail, Phone, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { token } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchCustomersAndOrders = async () => {
      setLoading(true);
      try {
        const [usersRes, ordersRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();

        if (usersData.success && usersData.data) {
          const orders = ordersData.data || [];
          // Calculate spend and orders count for each user
          const enriched = usersData.data.map((u: User) => {
            const userOrders = orders.filter((o: Order) => o.userId === u.id || o.customerEmail === u.email);
            const totalSpent = userOrders.reduce((sum: number, o: Order) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
            return {
              ...u,
              ordersCount: userOrders.length,
              totalSpent
            };
          });
          setCustomers(enriched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomersAndOrders();
  }, [token]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-heading text-white">
          Customer Accounts &amp; Reader Directory
        </h1>
        <p className="text-xs text-slate-400">
          Manage registered readers across Pakistan, view total order history and delivery profiles
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search readers by name, email, or phone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-500 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact Info</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Orders Placed</th>
                <th className="p-3.5">Total Spent (Paid)</th>
                <th className="p-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                        alt=""
                        className="w-8 h-8 rounded-full border border-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-slate-500 text-[10px]">{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-300 block">{c.email}</span>
                    <span className="text-slate-400 text-[11px] block">{c.phone || 'No phone'}</span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.role === 'Admin' || c.role === 'SuperAdmin'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-white">{c.ordersCount || 0}</span> orders
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400">
                    Rs. {(c.totalSpent || 0).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString()}
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
