import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Review, Book } from '../../types';
import { Star, CheckCircle2, Trash2, BookOpen } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/books?limit=100');
        const data = await res.json();
        if (data.success && data.data.books) {
          const allRev: any[] = [];
          data.data.books.forEach((b: Book) => {
            (b.reviews || []).forEach((r: Review) => {
              allRev.push({
                ...r,
                bookId: b.id,
                bookTitle: b.title,
                bookCover: b.coverImage
              });
            });
          });
          setReviews(allRev);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReviews();
  }, []);

  const handleDelete = (revId: string) => {
    setReviews(reviews.filter((r) => r.id !== revId));
    success('Review removed.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif-heading text-white">
          Customer Reviews &amp; Ratings Moderation
        </h1>
        <p className="text-xs text-slate-400">
          Moderate verified reader reviews for authentic Islamic and academic literature
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-500 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Book</th>
                <th className="p-3.5">Reviewer</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Comment</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <img src={r.bookCover} alt="" className="w-7 h-10 object-cover rounded shadow-xs" />
                      <span className="font-bold text-white max-w-[160px] truncate block">
                        {r.bookTitle}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-200 block">{r.userName}</span>
                    {r.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs">
                    <p className="line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 rounded-lg"
                      title="Remove review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
