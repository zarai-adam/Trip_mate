import React, { useState, useEffect } from "react";
import { Star, ShieldOff, Trash2, MessageSquare } from "lucide-react";
import { DashboardStatSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch("/api/admin/reviews")
            .then(res => res.ok ? res.json() : [])
            .then(data => setReviews(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setReviews([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Community Feedback</h1>
                        <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Moderate traveler experiences and platform quality.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[14px]">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-64 bg-[var(--color-bg-secondary)] rounded-[3rem] animate-pulse" />
                        ))
                    ) : reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="bg-[var(--color-bg-primary)] p-8 rounded-[3rem] border border-[var(--color-border)] shadow-sm space-y-6 relative group hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden transition-colors">
                                            <img src={review.reviewer.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer.id}`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[var(--color-text-primary)] truncate max-w-[200px] transition-colors">
                                                {review.reviewer.firstName} <span className="font-medium text-[var(--color-text-muted)] opacity-60">on</span> <span className="text-forest dark:text-sage">{review.trip.title}</span>
                                            </p>
                                            <div className="flex gap-0.5 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-400" : "text-[var(--color-border)] transition-colors"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 isolate opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] rounded-xl hover:bg-forest/10 hover:text-forest transition-all shadow-sm">
                                            <ShieldOff size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[var(--color-text-secondary)] italic leading-relaxed font-medium transition-colors">"{review.comment}"</p>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] opacity-50">
                                        Reviewed {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${review.isVisible ? "bg-forest/10 text-forest border-forest/10 dark:text-sage" : "bg-red-50 dark:bg-red-900/10 text-red-500 border-red-500/20"}`}>
                                        {review.isVisible ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState 
                                icon={MessageSquare}
                                title="No feedback yet"
                                description="Your community is still gathering experiences. Feedback will appear here as soon as travelers complete their journeys!"
                                actionLabel="Back to Dashboard"
                                onAction={() => {}}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default ReviewsPage;
