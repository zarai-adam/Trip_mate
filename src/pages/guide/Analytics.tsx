import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Info
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { apiFetch } from "@/lib/api";
import { format, subDays, startOfDay } from "date-fns";

const COLORS = ["#2F4F4F", "#8FBC8F", "#EDC9AF", "#D2B48C", "#4A7c59"];

export default function GuideAnalytics() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch("/api/analytics/guide");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!data) return null;

  // Aggregate views by day for the line chart
  const viewsByDay = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, "MMM dd");
    const count = data.charts.viewsOverTime.filter((v: any) => 
      format(new Date(v.createdAt), "MMM dd") === dateStr
    ).length;
    return { date: dateStr, views: count };
  });

  const metrics = [
    { 
      label: "Profile Views", 
      value: data.metrics.profileViews, 
      sub: "Last 30 days", 
      icon: <Eye className="text-forest" />,
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Conversion Rate", 
      value: `${data.metrics.conversionRate.toFixed(1)}%`, 
      sub: "Views to Bookings", 
      icon: <TrendingUp className="text-sage" />,
      trend: "+2.4%",
      trendUp: true
    },
    { 
      label: "Total Revenue", 
      value: `$${data.metrics.revenue.toLocaleString()}`, 
      sub: "Confirmed bookings", 
      icon: <DollarSign className="text-forest" />,
      trend: "+$450",
      trendUp: true
    },
    { 
      label: "Avg Rating", 
      value: data.metrics.avgRating.toFixed(1), 
      sub: "Lifetime average", 
      icon: <Star className="text-yellow-500" fill="currentColor" />,
      trend: "Stable",
      trendUp: true
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-4xl font-black text-forest mb-2">Guide Analytics</h1>
        <p className="text-gray-400 font-medium italic">Data-driven insights to grow your adventure business.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-sage/10 shadow-sleek relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               {m.icon}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-offwhite rounded-xl">
                 {m.icon}
              </div>
              <div>
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.label}</div>
                 <div className="text-xs font-bold text-gray-300">{m.sub}</div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black text-forest">{m.value}</div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${m.trendUp ? "bg-sage/10 text-sage" : "bg-red-50 text-red-400"}`}>
                {m.trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {m.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Views Line Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-forest flex items-center gap-2">
              <LineChartIcon size={20} className="text-sage" /> Profile Engagement
            </h3>
            <select className="bg-offwhite border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-3 py-1.5 focus:ring-0">
               <option>Last 30 Days</option>
               <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontWeight: 700 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#2F4F4F" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: "#8FBC8F", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings per Trip Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek">
          <h3 className="text-xl font-black text-forest flex items-center gap-2 mb-8">
            <BarChartIcon size={20} className="text-sage" /> Performance per Trip
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.bookingsPerTrip}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                  hide
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                />
                <Tooltip 
                  cursor={{ fill: "#F9FAFB" }}
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontWeight: 700 }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#8FBC8F" 
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Trend Line Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek">
          <h3 className="text-xl font-black text-forest flex items-center gap-2 mb-8">
            <Star size={20} className="text-sage" /> Quality Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                  tickFormatter={(val) => format(new Date(val), "MMM dd")}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#9CA3AF" }}
                />
                <Tooltip 
                  labelFormatter={(val) => format(new Date(val), "PPP")}
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontWeight: 700 }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="rating" 
                  stroke="#EDC9AF" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: "#D2B48C", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explorer Countries Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek">
          <h3 className="text-xl font-black text-forest flex items-center gap-2 mb-8">
            <PieChartIcon size={20} className="text-sage" /> Global Reach
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.explorerCountries}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.charts.explorerCountries.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {data.charts.explorerCountries.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-sm">
                    No booking data yet
                </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {data.charts.explorerCountries.map((c: any, i: number) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tips Section */}
      <div className="bg-forest p-10 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div className="w-24 h-24 bg-sage/20 rounded-[2rem] flex items-center justify-center shrink-0">
             <Lightbulb size={48} className="text-sand" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
               <TrendingUp size={14} className="text-sand" /> Pro Optimizer
            </div>
            <h2 className="text-3xl font-black tracking-tight">How to boost your growth</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sand font-black text-[10px] uppercase tracking-widest">
                    <Info size={14} /> Performance Insight
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    Guides who respond within <span className="text-sand font-bold">2 hours</span> get 3x more bookings. Your current response time is {data.metrics.acceptanceRate > 80 ? "excellent" : "longer than average"}.
                  </p>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sand font-black text-[10px] uppercase tracking-widest">
                    <TrendingUp size={14} /> Optimization Tip
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">
                    {data.metrics.mostPopularTrip !== "N/A" ? (
                        <>Your <strong>&quot;{data.metrics.mostPopularTrip}&quot;</strong> expedition is trending! Consider creating a similar variation for a different season.</>
                    ) : (
                        "Adding at least 10 high-quality photos to your trips can increase views by 45% based on platform trends."
                    )}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-8 rounded-3xl border border-sage/10 shadow-sleek">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-sage">
               <Users size={24} />
            </div>
            <div>
               <h4 className="font-black text-forest">Booking Acceptance Rate</h4>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Efficiency of your workflow</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <div className="text-3xl font-black text-forest">{data.metrics.acceptanceRate.toFixed(0)}%</div>
               <div className="text-[10px] font-black text-sage uppercase tracking-widest">High Potential</div>
            </div>
            <div className="w-24 h-3 bg-offwhite rounded-full overflow-hidden">
               <div className="h-full bg-sage rounded-full" style={{ width: `${data.metrics.acceptanceRate}%` }}></div>
            </div>
         </div>
      </div>
    </div>
  );
}
