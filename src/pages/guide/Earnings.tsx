import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Compass, 
  ArrowRight, 
  Loader2, 
  CheckCircle,
  Award,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

export default function Earnings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchEarnings = async () => {
      setIsLoading(true);
      try {
        if (!user.id) return;
        const res = await apiFetch(`/api/bookings?guideId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out only APPROVED bookings to compute earnings
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to calculate earnings logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEarnings();
  }, [user.id]);

  const approvedBookings = bookings.filter(b => b.status === "APPROVED");
  
  // Sum up total earnings. Each booking has a trip, whose price we sum.
  const totalEarnings = approvedBookings.reduce((sum, b) => {
    const tripPrice = b.trip?.price || b.trip?.pricePerPerson || 0;
    return sum + Number(tripPrice);
  }, 0);

  // Approximate platform fee (15%)
  const platformFee = totalEarnings * 0.15;
  const netEarnings = totalEarnings - platformFee;

  return (
    <div className="max-w-5xl">
      <div className="text-left mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tighter">Earnings Ledger</h1>
        <p className="text-gray-500 font-medium font-sans">Analyze bookings income, check payout milestones and inspect revenues.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Compiling financial indexes...</span>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Key Metric Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-sage/10 relative overflow-hidden"
            >
              <div className="absolute right-6 top-6 w-12 h-12 bg-forest/5 text-forest rounded-2xl flex items-center justify-center">
                <DollarSign size={22} className="stroke-[2.5]" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Bookings Gross</div>
              <div className="text-4xl font-black font-heading text-forest mb-2">${totalEarnings.toLocaleString()}</div>
              <div className="text-xs font-medium text-gray-400">Total gross bookings revenue before platform share.</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-forest p-8 rounded-[2.5rem] shadow-sleek relative text-white"
            >
              <div className="absolute right-6 top-6 w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                <TrendingUp size={22} className="stroke-[2.5]" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">My Net Earnings</div>
              <div className="text-4xl font-black font-heading text-white mb-2">${netEarnings.toLocaleString()}</div>
              <div className="text-xs font-medium text-emerald-100/70">85% guide revenue payout cleared.</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-sage/10 relative overflow-hidden"
            >
              <div className="absolute right-6 top-6 w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center">
                <Users size={22} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Approved Cohorts</div>
              <div className="text-4xl font-black font-heading text-forest mb-2">{approvedBookings.length}</div>
              <div className="text-xs font-medium text-gray-400">Total active bookings waiting in accepted state.</div>
            </motion.div>
          </div>

          {/* Interactive Chart & Target Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sleek border border-sage/10 lg:col-span-12 text-left space-y-6">
              <h3 className="text-xl font-black text-forest uppercase tracking-tight">Financial Flow</h3>
              {approvedBookings.length === 0 ? (
                <div className="py-12 text-center text-gray-400 italic font-medium text-sm">
                  No payout data yet. Approve some booking requests to track yields.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="pb-4">Explorer</th>
                        <th className="pb-4">Expedition</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-right">Yield Gross</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {approvedBookings.map((b) => (
                        <tr key={b.id} className="text-gray-600 font-medium">
                          <td className="py-4 font-bold text-forest flex items-center gap-2">
                            <div className="w-8 h-8 bg-sage/10 text-sage rounded-full flex items-center justify-center text-xs font-black">
                              {b.explorer?.name ? b.explorer.name[0].toUpperCase() : "T"}
                            </div>
                            {b.explorer?.name || "Fellow Traveler"}
                          </td>
                          <td className="py-4 max-w-xs truncate">{b.trip?.title || "TBD"}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <CheckCircle size={10} /> {b.status}
                            </span>
                          </td>
                          <td className="py-4 text-right font-black text-forest">
                            +${Number(b.trip?.price || b.trip?.pricePerPerson || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
