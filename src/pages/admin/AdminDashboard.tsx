import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { apiFetch } from "@/lib/api";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Shield, 
  Search,
  MoreVertical,
  Activity,
  ArrowRight
} from "lucide-react";
import Logo from "@/components/Logo";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Application {
  id: string;
  userId: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  travelExperience: string;
  countriesVisited: string[];
  specialties: string[];
  languagesSpoken: string[];
  whyBecomeGuide: string;
  portfolioUrls: string[];
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "applications" | "stats">("stats");
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "stats") {
        const res = await apiFetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } else if (activeTab === "users") {
        const res = await apiFetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === "applications") {
        const res = await apiFetch("/api/admin/applications");
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const res = await apiFetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminId: currentUser.id })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reviewApplication = async (appId: string, status: "APPROVED" | "REJECTED") => {
    const reviewNotes = prompt(`Enter review notes for this ${status.toLowerCase()} application:`);
    if (reviewNotes === null) return;

    try {
      const res = await apiFetch(`/api/admin/applications/${appId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes, adminId: currentUser.id })
      });
      if (res.ok) {
        setApplications(applications.map(a => a.id === appId ? { ...a, status } : a));
        if (status === "APPROVED") {
           // Refresh users list if we were on it
           fetchData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-offwhite py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <Logo className="mb-2" showTagline={false} />
          <div className="flex items-center gap-2 mt-2">
            <Shield size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Control Center</span>
          </div>
          <p className="text-gray-500 font-medium ml-1 mt-4">Manage Trip Mate ecosystem and verify guides.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-2">
            {[
              { id: "stats", label: "Overview", icon: Activity },
              { id: "users", label: "User Management", icon: Users },
              { id: "applications", label: "Guide Applications", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
                  activeTab === tab.id 
                    ? "bg-forest text-offwhite shadow-xl shadow-forest/20" 
                    : "bg-white text-gray-400 hover:text-forest hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "stats" && stats && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  <StatsCard label="Total Users" value={stats.userCount} icon={Users} color="forest" />
                  <StatsCard label="Active Trips" value={stats.tripCount} icon={ArrowRight} color="sage" />
                  <StatsCard label="Total Bookings" value={stats.bookingCount} icon={CheckCircle} color="earth" />
                  <StatsCard label="Pending Guides" value={stats.pendingApps} icon={AlertCircle} color="red-500" />
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      className="bg-transparent border-none focus:ring-0 w-full font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">User</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Role</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Joined</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-forest">{user.firstName} {user.lastName}</span>
                                <span className="text-xs text-gray-400">{user.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                                user.role === "ADMIN" ? "bg-red-50 text-red-600" : 
                                user.role === "GUIDE" ? "bg-forest/10 text-forest" : 
                                "bg-gray-100 text-gray-500"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-green-500" : user.status === "PENDING" ? "bg-amber-500" : "bg-red-500"}`} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{user.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              {user.role !== "ADMIN" && (
                                <select 
                                  className="text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg px-2 py-1 bg-white"
                                  value={user.status}
                                  onChange={(e) => updateUserStatus(user.id, e.target.value)}
                                >
                                  <option value="ACTIVE">Activate</option>
                                  <option value="SUSPENDED">Suspend</option>
                                  <option value="PENDING">Pending</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "applications" && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {applications.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center text-center">
                      <FileText className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="font-bold text-gray-400">No applications found.</p>
                    </div>
                  ) : (
                    applications.map((app) => (
                      <div key={app.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex-shrink-0" />
                            <div>
                              <h3 className="font-black text-xl text-forest tracking-tight italic">
                                {app.user.firstName} {app.user.lastName}
                              </h3>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{app.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <StatusBadge status={app.status} />
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                               Applied on {new Date(app.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-gray-50">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Countries Visited</h4>
                            <p className="text-sm font-medium text-gray-600">{app.countriesVisited?.join(", ")}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Languages</h4>
                            <p className="text-sm font-medium text-gray-600">{app.languagesSpoken?.join(", ")}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Experience</h4>
                            <p className="text-sm leading-relaxed text-gray-600">{app.travelExperience}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {app.specialties?.map(s => (
                                <span key={s} className="px-2 py-1 bg-sage/10 text-forest text-[10px] font-bold rounded-lg uppercase tracking-widest">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Portfolio</h4>
                            <div className="flex flex-wrap gap-2">
                              {app.portfolioUrls?.map((url, idx) => (
                                <a 
                                  key={idx} 
                                  href={url.startsWith('http') ? url : `https://${url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-sage underline"
                                >
                                  Link {idx + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-forest">Statement of Purpose</h4>
                            <p className="text-sm leading-relaxed text-gray-500 italic">"{app.whyBecomeGuide}"</p>
                          </div>
                        </div>

                        {app.status === "PENDING" && (
                          <div className="flex gap-4">
                            <button
                              onClick={() => reviewApplication(app.id, "APPROVED")}
                              className="flex-1 bg-forest text-offwhite py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-forest-light transition-all shadow-xl shadow-forest/20 flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve Guide
                            </button>
                            <button
                              onClick={() => reviewApplication(app.id, "REJECTED")}
                              className="flex-1 bg-white text-red-500 border border-red-100 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
    <div className={`w-12 h-12 bg-${color}/10 rounded-2xl flex items-center justify-center`}>
      <Icon className={`w-6 h-6 text-${color}`} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <div className="text-3xl font-black text-forest italic">{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600",
    APPROVED: "bg-green-50 text-green-600",
    REJECTED: "bg-red-50 text-red-600"
  }[status] || "bg-gray-100 text-gray-500";
  
  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${styles}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
