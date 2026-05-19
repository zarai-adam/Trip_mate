import React, { useState, useEffect } from "react";
import { Map, Search, ExternalLink, ShieldOff, Eye, MapPin, Sparkles } from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const TripsPage = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/api/admin/trips?status=${filter === "ALL" ? "" : filter}&search=${searchTerm}`);
            if (!res.ok) throw new Error("Failed to fetch trips");
            const data = await res.json();
            setTrips(Array.isArray(data) ? data : []);
        } catch (err) { 
            console.error(err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filter, searchTerm]);

    const updateTripStatus = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to set this trip to ${status}?`)) return;
        try {
            await apiFetch(`/api/admin/trips/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Inventory Control</h1>
                        <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Monitor published trips and manage content quality.</p>
                    </div>
                    <div className="flex bg-[var(--color-bg-primary)] rounded-2xl p-1 shadow-sm border border-[var(--color-border)] overflow-x-auto no-scrollbar transition-colors">
                        {["ALL", "PUBLISHED", "DRAFT", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    filter === f 
                                        ? "bg-sage-dark text-white shadow-lg shadow-sage/20" 
                                        : "text-[var(--color-text-muted)] hover:text-forest dark:hover:text-sage"
                                }`}
                            >
                                {f.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--color-bg-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-sm overflow-hidden text-[14px] transition-colors">
                    <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-[var(--color-bg-secondary)] px-5 py-3 rounded-2xl w-full max-w-md border border-transparent focus-within:border-forest transition-colors">
                            <Search size={18} className="text-[var(--color-text-muted)]" />
                            <input 
                                type="text" 
                                placeholder="Search by title, destination..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-[var(--color-text-primary)]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--color-bg-secondary)]">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Trip Detail</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Guide</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Destination</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Price</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} />
                                    ))
                                ) : trips.length > 0 ? (
                                    trips.map(trip => (
                                        <tr key={trip.id} className="hover:bg-[var(--color-bg-secondary)] transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex-shrink-0">
                                                        <img src={trip.coverImageUrl} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-[var(--color-text-primary)] truncate max-w-[200px] transition-colors">{trip.title}</h4>
                                                        <p className="text-xs text-[var(--color-text-muted)] font-medium transition-colors">{new Date(trip.startDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <img src={trip.guide.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${trip.guide.id}`} className="w-6 h-6 rounded-full border border-[var(--color-border)]" alt="" />
                                                    <span className="font-bold text-[var(--color-text-secondary)] transition-colors">{trip.guide.firstName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1 font-bold text-[var(--color-text-muted)] transition-colors">
                                                    <MapPin size={14} className="text-sage" />
                                                    {trip.destination}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-black text-[var(--color-text-primary)] transition-colors">
                                                ${trip.pricePerPerson}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    trip.status === "PUBLISHED" ? "bg-forest/10 text-forest border-forest/10 dark:text-sage" :
                                                    trip.status === "DRAFT" ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border-[var(--color-border)]" :
                                                    "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50"
                                                }`}>
                                                    {trip.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 isolate opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => window.open(`/trip/${trip.id}`, '_blank')}
                                                        className="p-2 rounded-xl bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-forest transition-all shadow-sm"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {trip.status === "PUBLISHED" ? (
                                                        <button 
                                                            onClick={() => updateTripStatus(trip.id, "CANCELLED")}
                                                            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 transition-all shadow-sm"
                                                            title="Hide Trip"
                                                        >
                                                            <ShieldOff size={16} />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => updateTripStatus(trip.id, "PUBLISHED")}
                                                            className="p-2 rounded-xl bg-forest/10 text-forest hover:bg-forest/20 transition-all shadow-sm"
                                                            title="Publish Trip"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState 
                                                icon={Sparkles}
                                                title="No trips found"
                                                description="Be the first to create an amazing adventure!"
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

export default TripsPage;
