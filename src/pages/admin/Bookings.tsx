import React, { useState, useEffect } from "react";
import { Calendar, Search, ArrowUpRight, Sparkles } from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const BookingsPage = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const res = await apiFetch("/api/admin/bookings");
                if (!res.ok) throw new Error("Failed to fetch bookings");
                const data = await res.json();
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Reservations</h1>
                        <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Track all platform transactions and booking statuses.</p>
                    </div>
                </div>

                <div className="bg-[var(--color-bg-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-sm overflow-hidden text-[14px] transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--color-bg-secondary)]">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Explorer</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Trip</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} />
                                    ))
                                ) : bookings.length > 0 ? (
                                    bookings.map(b => (
                                        <tr key={b.id} className="hover:bg-[var(--color-bg-secondary)] transition-colors group">
                                            <td className="px-8 py-5 text-[var(--color-text-muted)] font-mono text-[10px] opacity-50 uppercase tracking-tighter">{b.id.slice(0,8)}</td>
                                            <td className="px-8 py-5 font-bold text-[var(--color-text-primary)] whitespace-nowrap transition-colors">{b.explorer.firstName} {b.explorer.lastName}</td>
                                            <td className="px-8 py-5 font-bold text-[var(--color-text-secondary)] truncate max-w-[200px] transition-colors">{b.trip.title}</td>
                                            <td className="px-8 py-5 text-[var(--color-text-muted)] font-medium transition-colors">{new Date(b.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    b.status === "CONFIRMED" 
                                                        ? "bg-forest/10 text-forest border-forest/10 dark:text-sage" 
                                                        : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border-transparent"
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-[var(--color-text-muted)] hover:text-forest transition-all hover:scale-110">
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState 
                                                icon={Calendar}
                                                title="No reservations yet"
                                                description="Platform is quiet today. Expect bookings as soon as guides publish new trips!"
                                                actionLabel="View Trips"
                                                onAction={() => {}} // Redirect to trips
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

export default BookingsPage;
