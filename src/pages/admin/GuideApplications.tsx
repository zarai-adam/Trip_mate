import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  FileX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const GuideApplications = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/guide-applications?status=${filter === "ALL" ? "" : filter}&search=${searchTerm}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, searchTerm]);

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this guide?")) return;
    try {
      const res = await apiFetch(`/api/admin/guide-applications/${id}/approve`, { method: "PATCH" });
      if (res.ok) {
        setIsDrawerOpen(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    if (!rejectionReason) return alert("Please provide a reason");
    try {
      const res = await apiFetch(`/api/admin/guide-applications/${selectedApp.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (res.ok) {
        setIsRejectModalOpen(false);
        setIsDrawerOpen(false);
        setRejectionReason("");
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Guide Applications</h1>
            <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Verify and welcome new experts to the platform.</p>
          </div>
          
          <div className="flex bg-[var(--color-bg-primary)] rounded-2xl p-1 shadow-sm border border-[var(--color-border)] transition-colors">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? "bg-forest text-white shadow-lg shadow-forest/20" 
                    : "text-[var(--color-text-muted)] hover:text-forest dark:hover:text-sage"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-bg-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] px-5 py-3 rounded-2xl w-full max-w-md border border-transparent focus-within:border-forest transition-colors">
              <Search size={18} className="text-[var(--color-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search by name, email or country..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-[var(--color-text-primary)]"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest">
              <span>{loading ? "..." : apps.length} Applications found</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-bg-secondary)]">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Applicant</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Country</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Submitted</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Specialties</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))
                ) : apps.length > 0 ? (
                  apps.map((app) => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer group"
                      onClick={() => { setSelectedApp(app); setIsDrawerOpen(true); }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden shrink-0">
                            <img src={app.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.user.id}`} alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-text-primary)] transition-colors">{app.user.firstName} {app.user.lastName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] transition-colors">{app.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-[var(--color-text-secondary)]">{app.user.country || "N/A"}</span>
                      </td>
                      <td className="px-8 py-6 text-xs text-[var(--color-text-muted)] font-medium">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {app.specialties?.slice(0, 2).map((s: string) => (
                            <span key={s} className="px-2 py-0.5 bg-forest/10 text-forest dark:text-sage text-[10px] font-bold rounded-lg uppercase tracking-tight">
                              {s}
                            </span>
                          ))}
                          {app.specialties?.length > 2 && <span className="text-[10px] text-[var(--color-text-muted)]">+{app.specialties.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl border border-transparent group-hover:border-[var(--color-border)] group-hover:bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] hover:text-forest transition-all">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState 
                        icon={FileX}
                        title="No applications found"
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

        {/* Detail Drawer */}
        <AnimatePresence>
          {isDrawerOpen && selectedApp && (
            <>
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setIsDrawerOpen(false)}
                 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[var(--color-bg-primary)] shadow-2xl z-[70] overflow-y-auto transition-colors"
              >
                <div className="p-8 border-b border-[var(--color-border)] sticky top-0 bg-[var(--color-bg-primary)]/80 backdrop-blur-md z-10 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter">Application Details</h3>
                      <p className="text-xs font-bold text-[var(--color-text-muted)]">Reference: {selectedApp.id.slice(0,8)}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-3 rounded-2xl bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-all">
                     <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-10">
                  {/* Section 1: Applicant Info */}
                  <div className="bg-[var(--color-bg-secondary)] rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center gap-8 border border-[var(--color-border)] transition-colors">
                     <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[var(--color-bg-primary)] shadow-lg bg-[var(--color-bg-tertiary)] flex-shrink-0">
                        <img src={selectedApp.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedApp.user.id}`} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-2xl font-black text-[var(--color-text-primary)] leading-none mb-2">{selectedApp.user.firstName} {selectedApp.user.lastName}</h4>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)]">
                             <Mail size={14} className="text-forest" />
                             {selectedApp.user.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)]">
                             <MapPin size={14} className="text-forest" />
                             {selectedApp.user.country || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)]">
                             <Phone size={14} className="text-forest" />
                             {selectedApp.user.phoneNumber || "N/A"}
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Section 2: Experience */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sage/10 text-forest flex items-center justify-center">
                         <Globe size={16} />
                      </div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">Travel Experience</h5>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed italic bg-sage/5 dark:bg-forest/5 p-6 rounded-3xl border border-sage/10 dark:border-forest/10 transition-colors">
                         "{selectedApp.travelExperience}"
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Countries Visited</p>
                            <div className="flex flex-wrap gap-2">
                               {selectedApp.countriesVisited?.map((c: string) => (
                                 <span key={c} className="px-3 py-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-xs font-bold text-[var(--color-text-secondary)]">{c}</span>
                               ))}
                            </div>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Languages</p>
                            <div className="flex flex-wrap gap-2">
                               {selectedApp.languagesSpoken?.map((l: string) => (
                                 <span key={l} className="px-3 py-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-xs font-bold text-[var(--color-text-secondary)]">{l}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Specialties */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sage/10 text-forest flex items-center justify-center">
                         <Filter size={16} />
                      </div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">Specialties & Skills</h5>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {selectedApp.specialties?.map((s: string) => (
                         <span key={s} className="px-4 py-2 bg-forest text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                            {s}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* Section 4: Motivation */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sage/10 text-forest flex items-center justify-center">
                         <CheckCircle2 size={16} />
                      </div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-primary)]">Motivation</h5>
                    </div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed">
                       {selectedApp.whyBecomeGuide}
                    </p>
                  </div>

                  {/* Section 5: Admin Actions */}
                  {selectedApp.status === "PENDING" && (
                    <div className="pt-10 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
                      <button 
                        onClick={() => handleApprove(selectedApp.id)}
                        className="h-16 bg-forest text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-forest/20 hover:scale-[1.02] transition-all"
                      >
                        <CheckCircle2 size={20} />
                        Approve Guide
                      </button>
                      <button 
                        onClick={() => setIsRejectModalOpen(true)}
                        className="h-16 bg-white dark:bg-gray-800 border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-black"
                      >
                        <XCircle size={20} />
                        Reject App
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Reject Modal */}
        <AnimatePresence>
          {isRejectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md"
                 onClick={() => setIsRejectModalOpen(false)}
               />
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-[var(--color-bg-primary)] w-full max-w-md rounded-[3rem] p-10 shadow-2xl transition-all"
               >
                  <div className="absolute top-0 right-0 p-8">
                     <button onClick={() => setIsRejectModalOpen(false)} className="text-gray-300 dark:text-gray-600 hover:text-gray-500 transition-colors">
                        <X size={24} />
                     </button>
                  </div>
                  <h4 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter mb-2 transition-colors">Reject Application</h4>
                  <p className="text-sm font-bold text-[var(--color-text-muted)] mb-8 italic transition-colors">Please provide a reason for the rejection. This will be shared with the applicant.</p>
                  
                  <textarea 
                    className="w-full h-40 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[2rem] p-6 text-sm font-medium text-[var(--color-text-primary)] focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all resize-none"
                    placeholder="e.g. Portfolio links are broken, not enough experience..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />

                  <div className="flex gap-4 mt-8">
                     <button 
                       onClick={() => setIsRejectModalOpen(false)}
                       className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleReject}
                       className="flex-none px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 transition-colors active:scale-95"
                     >
                       Confirm Rejection
                     </button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    APPROVED: "bg-forest/10 dark:bg-forest/20 text-forest dark:text-forest-light border-forest/10 dark:border-forest-dark",
    REJECTED: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${styles[status] || "bg-gray-100 text-gray-400"}`}>
      {status}
    </span>
  );
};

export default GuideApplications;
