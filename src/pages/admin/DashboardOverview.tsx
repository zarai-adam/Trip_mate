import React, { useState, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight
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
  Bar 
} from "recharts";
import { DashboardStatSkeleton } from "@/components/ui/Skeleton";
import { PageTransition } from "@/components/ui/PageTransition";
import { motion, useSpring, useTransform, animate } from "motion/react";
import { apiFetch } from "@/lib/api";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
};

const DashboardOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [growthData, setGrowthData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, growthRes, bookingsRes, activityRes] = await Promise.all([
          apiFetch("/api/admin/stats"),
          apiFetch("/api/admin/charts/user-growth"),
          apiFetch("/api/admin/charts/bookings"),
          apiFetch("/api/admin/activity-log")
        ]);

        const [statsData, growthData, bookingsData, activityData] = await Promise.all([
          statsRes.ok ? statsRes.json() : null,
          growthRes.ok ? growthRes.json() : [],
          bookingsRes.ok ? bookingsRes.json() : [],
          activityRes.ok ? activityRes.json() : []
        ]);

        if (statsData) setStats(statsData);
        setGrowthData(Array.isArray(growthData) ? growthData : []);
        setBookingData(Array.isArray(bookingsData) ? bookingsData : []);
        setActivity(Array.isArray(activityData) ? activityData : []);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.userCount, 
      trend: `+${stats?.usersThisWeek || 0} weekly`, 
      icon: Users, 
      color: "bg-blue-500", 
      trendColor: "text-blue-500",
      percentage: stats?.userCount ? Math.min(100, Math.round((stats.userCount / 100) * 100)) : 0
    },
    { 
      label: "Active Guides", 
      value: stats?.guideCount, 
      trend: "Global", 
      icon: MapPin, 
      color: "bg-forest", 
      trendColor: "text-forest",
      percentage: stats?.guideCount ? Math.min(100, Math.round((stats.guideCount / 20) * 100)) : 0
    },
    { 
      label: "Active Trips", 
      value: stats?.tripCount, 
      trend: "Public", 
      icon: Calendar, 
      color: "bg-sage", 
      trendColor: "text-sage",
      percentage: stats?.tripCount ? Math.min(100, Math.round((stats.tripCount / 50) * 100)) : 0
    },
    { 
      label: "Bookings", 
      value: stats?.bookingCount, 
      trend: "Monthly", 
      icon: TrendingUp, 
      color: "bg-amber-500", 
      trendColor: "text-amber-500",
      percentage: stats?.bookingCount ? Math.min(100, Math.round((stats.bookingCount / 50) * 100)) : 0
    },
    { 
      label: "Pending Apps", 
      value: stats?.pendingApps, 
      trend: "Priority", 
      icon: AlertCircle, 
      color: "bg-red-500", 
      trendColor: "text-red-500",
      percentage: stats?.pendingApps !== undefined ? Math.max(0, 100 - (stats.pendingApps * 10)) : 100
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-12">
        {/* Top row - stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <DashboardStatSkeleton key={i} />
            ))
          ) : (
            statCards.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--color-bg-primary)] p-6 rounded-[2.5rem] shadow-sm border border-[var(--color-border)] group hover:shadow-xl hover:translate-y-[-4px] transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg shadow-${stat.color.split('-')[1]}/20`}>
                    <stat.icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tight ${stat.trendColor} bg-[var(--color-bg-secondary)] px-2 py-1 rounded-lg`}>
                    <ArrowUpRight size={12} />
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-[var(--color-text-primary)]">
                    <AnimatedNumber value={stat.value ?? 0} />
                  </h3>
                  <div className="mt-4 h-1.5 w-full bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Middle row - activity and actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-[var(--color-bg-primary)] rounded-[3rem] p-8 lg:p-10 border border-[var(--color-border)] shadow-sm flex flex-col transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Live Activity Log</h4>
              <button className="text-xs font-black uppercase tracking-widest text-sage hover:scale-105 transition-transform">Explorer History</button>
            </div>
            <div className="space-y-6 flex-1">
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                   <div key={i} className="flex gap-4 animate-pulse">
                     <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)]" />
                     <div className="flex-1 space-y-2">
                       <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4" />
                       <div className="h-2 bg-[var(--color-bg-tertiary)] rounded w-1/4" />
                     </div>
                   </div>
                 ))
              ) : activity.length > 0 ? (
                activity.slice(0, 6).map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-sm group-hover:bg-forest group-hover:text-white transition-all ${getActivityColor(item.action)}`}>
                      {getActivityIcon(item.action)}
                    </div>
                    <div className="flex-1 min-w-0 border-b border-[var(--color-border)] pb-4 group-last:border-0 transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-[var(--color-text-primary)] leading-snug">
                          <span className="text-forest dark:text-sage">{item.actor?.firstName} {item.actor?.lastName}</span> {formatActionText(item)}
                        </p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap ml-4 opacity-50">{formatTimestamp(item.createdAt)}</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 uppercase font-black tracking-widest opacity-40">{item.targetType}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                   <Clock size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
                   <p className="text-sm font-bold text-gray-400">No activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-lg font-black text-[var(--color-text-primary)] uppercase tracking-tighter px-2">High Priority Tasks</h4>
            
            <ActionCard 
              title={`${stats?.pendingApps || 0} Guide Applications`} 
              desc="New experts waiting for manual ID verification."
              icon={ShieldAlert}
              btn="Launch Verification"
              color="bg-red-500"
              link="/admin/guide-applications"
            />

            <ActionCard 
              title="Content Review System" 
              desc="Published experiences requiring quality assessment."
              icon={MapPin}
              btn="Verify Trips"
              color="bg-amber-500"
              link="/admin/trips"
            />

            <ActionCard 
              title="Reported Interactions" 
              desc="Community flags for safety and policy compliance."
              icon={MessageSquare}
              btn="Moderate Now"
              color="bg-forest"
              link="/admin/reviews"
            />
          </div>
        </div>

        {/* Bottom row - charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          <div className="bg-[var(--color-bg-primary)] rounded-[3rem] p-8 border border-[var(--color-border)] shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">User Archetypes</h4>
              <span className="text-[10px] font-black uppercase bg-sage/10 text-forest dark:text-sage px-3 py-1 rounded-full">Last 30 Days</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', color: 'var(--color-text-primary)' }}
                    itemStyle={{ fontWeight: 800, color: 'var(--color-text-primary)' }}
                    cursor={{ stroke: 'var(--color-sage)', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="explorers" stroke="#86C598" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'var(--color-bg-primary)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="guides" stroke="#166534" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'var(--color-bg-primary)' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-6 justify-center">
              <LegendItem color="bg-sage" label="Explorers" />
              <LegendItem color="bg-forest" label="Guides" />
            </div>
          </div>

          <div className="bg-[var(--color-bg-primary)] rounded-[3rem] p-8 border border-[var(--color-border)] shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Conversion Trends</h4>
              <span className="text-[10px] font-black uppercase bg-sage/10 text-forest dark:text-sage px-3 py-1 rounded-full">Weekly Analytics</span>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }} />
                  <Tooltip 
                     cursor={{ fill: 'var(--color-bg-secondary)', opacity: 0.5 }}
                     contentStyle={{ borderRadius: '1.5rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" fill="#86C598" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="confirmed" fill="#166534" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-6 justify-center">
              <LegendItem color="bg-sage" label="Total Requests" />
              <LegendItem color="bg-forest" label="Confirmed" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm border border-white dark:border-gray-700`}></div>
    <span className="text-[10px] font-black uppercase text-[var(--color-text-muted)] tracking-widest">{label}</span>
  </div>
);

const ActionCard = ({ title, desc, icon: Icon, btn, color, link }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, translateY: -4 }}
    className="bg-[var(--color-bg-primary)] p-6 rounded-[2.5rem] border border-[var(--color-border)] shadow-sm flex flex-col justify-between group h-48 transition-all hover:shadow-xl"
  >
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}/20`}>
        <Icon size={20} />
      </div>
      <ChevronRight size={20} className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
    </div>
    <div>
      <h5 className="text-sm font-black text-[var(--color-text-primary)] mb-1">{title}</h5>
      <p className="text-[10px] font-bold text-[var(--color-text-muted)] leading-tight opacity-70">{desc}</p>
    </div>
    <button className="text-[10px] font-black uppercase tracking-widest text-sage dark:text-sage-light text-left pt-2 hover:translate-x-1 transition-transform">{btn}</button>
  </motion.div>
);

// Helpers
const getActivityIcon = (action: string) => {
  if (action?.includes("USER")) return <Users size={18} className="text-blue-500" />;
  if (action?.includes("GUIDE")) return <ShieldAlert size={18} className="text-forest" />;
  if (action?.includes("TRIP")) return <MapPin size={18} className="text-sage" />;
  if (action?.includes("BOOKING")) return <Calendar size={18} className="text-amber-500" />;
  return <Clock size={16} className="text-gray-400" />;
};

const getActivityColor = (action: string) => {
  if (action?.includes("USER")) return "bg-blue-50 dark:bg-blue-900/20";
  if (action?.includes("GUIDE")) return "bg-forest/10 dark:bg-forest/20";
  if (action?.includes("TRIP")) return "bg-sage/10 dark:bg-sage/20";
  if (action?.includes("BOOKING")) return "bg-amber-50 dark:bg-amber-900/20";
  return "bg-gray-50 dark:bg-gray-900/50";
};

const formatActionText = (item: any) => {
    switch(item.action) {
        case "USER_ACTIVE": return "activated account";
        case "USER_SUSPENDED": return "suspended user account";
        case "GUIDE_APPROVED": return "approved guide application";
        case "GUIDE_REJECTED": return "rejected guide application";
        default: return item.action.toLowerCase().replace(/_/g, " ");
    }
};

const formatTimestamp = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default DashboardOverview;
