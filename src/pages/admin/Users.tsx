import React, { useState, useEffect } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  MoreHorizontal, 
  MapPin, 
  Mail, 
  Calendar, 
  Shield, 
  Ban, 
  CheckCircle,
  ArrowRight,
  TrendingDown,
  ChevronDown,
  UserX
} from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const roleFilter = filter === "ALL" ? "" : (["EXPLORER", "GUIDE", "ADMIN"].includes(filter) ? filter : "");
      const statusFilter = filter === "SUSPENDED" ? "SUSPENDED" : "";
      const res = await apiFetch(`/api/admin/users?role=${roleFilter}&status=${statusFilter}&search=${searchTerm}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, searchTerm]);

  const updateUserStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to change this user's status to ${status}?`)) return;
    try {
      const res = await apiFetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Platform Users</h1>
            <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Manage permissions and monitor account activities.</p>
          </div>
          
          <div className="flex bg-[var(--color-bg-primary)] rounded-2xl p-1 shadow-sm border border-[var(--color-border)] transition-colors">
            {["ALL", "EXPLORER", "GUIDE", "ADMIN", "SUSPENDED"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? "bg-sage-dark text-white shadow-lg shadow-sage/20" 
                    : "text-[var(--color-text-muted)] hover:text-forest dark:hover:text-sage"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] px-5 py-3 rounded-2xl w-full max-w-md border border-transparent focus-within:border-forest transition-colors">
              <Search size={18} className="text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-[var(--color-text-primary)]"
              />
            </div>
            <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-sage-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-sage/20">
               Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-bg-secondary)]">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">User Profile</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Country</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Rating</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[14px]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--color-bg-secondary)] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shrunk-0 transition-colors">
                            <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)] transition-colors">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] font-medium transition-colors">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                           user.role === "ADMIN" ? "bg-red-500 text-white" :
                           user.role === "GUIDE" ? "bg-forest/10 text-forest dark:text-sage" :
                           "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}>
                           {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[var(--color-text-secondary)] font-bold whitespace-nowrap transition-colors">
                        {user.country || "-"}
                      </td>
                      <td className="px-8 py-5 text-[var(--color-text-muted)] font-medium whitespace-nowrap opacity-60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-1">
                            <span className="font-bold text-[var(--color-text-primary)]">{user.ratingAverage || "0.0"}</span>
                            <TrendingDown size={14} className="text-sage" />
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                          user.status === "ACTIVE" ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50" :
                          user.status === "SUSPENDED" ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50" :
                          "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 isolate opacity-0 group-hover:opacity-100 transition-opacity">
                           {user.status === "ACTIVE" ? (
                             <button 
                               onClick={() => updateUserStatus(user.id, "SUSPENDED")}
                               className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 transition-all shadow-sm"
                               title="Suspend User"
                             >
                               <Ban size={16} />
                             </button>
                           ) : (
                             <button 
                               onClick={() => updateUserStatus(user.id, "ACTIVE")}
                               className="p-2 rounded-xl bg-forest/10 text-forest hover:bg-forest/20 transition-all shadow-sm"
                               title="Unsuspend User"
                             >
                               <CheckCircle size={16} />
                             </button>
                           )}
                           <button className="p-2 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-all shadow-sm">
                              <MoreHorizontal size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState 
                        icon={UserX}
                        title="No users found"
                        description="Try adjusting your filters or search term."
                        actionLabel="Reset Search"
                        onAction={() => { setSearchTerm(""); setFilter("ALL"); }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UsersPage;
