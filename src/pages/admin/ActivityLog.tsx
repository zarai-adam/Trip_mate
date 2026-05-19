import React, { useState, useEffect } from "react";
import { History, Shield, Users, MapPin, Calendar, Clock, Terminal } from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";

const ActivityLogPage = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch("/api/admin/activity-log")
            .then(res => res.ok ? res.json() : [])
            .then(data => setLogs(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setLogs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <PageTransition>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter transition-colors">Audit Logs</h1>
                        <p className="text-sm font-bold text-[var(--color-text-muted)] mt-1 italic transition-colors">Complete platform history and administrative actions.</p>
                    </div>
                </div>
                
                <div className="bg-[var(--color-bg-primary)] rounded-[3rem] p-8 border border-[var(--color-border)] shadow-sm space-y-6 transition-colors">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex-shrink-0" />
                                <div className="flex-1 space-y-2 py-2">
                                    <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4" />
                                    <div className="h-2 bg-[var(--color-bg-tertiary)] rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : logs.length > 0 ? (
                        logs.map((log, idx) => (
                            <div key={log.id} className="flex items-start gap-4 group">
                                <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] group-hover:bg-forest group-hover:text-white transition-all shadow-sm`}>
                                    {getActivityIcon(log.action)}
                                </div>
                                <div className="flex-1 min-w-0 border-b border-[var(--color-border)] pb-4 group-last:border-0 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-[var(--color-text-primary)] leading-snug transition-colors">
                                                <span className="text-forest dark:text-sage">{log.actor?.firstName} {log.actor?.lastName}</span>
                                                <span className="text-[var(--color-text-muted)] font-medium opacity-60"> executed </span>
                                                <span className="bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-lg text-[var(--color-text-primary)] uppercase text-[10px] font-black tracking-widest transition-colors font-mono">{log.action}</span>
                                            </p>
                                            <p className="text-xs text-[var(--color-text-muted)] font-medium transition-colors">
                                                Target: <span className="text-forest dark:text-sage font-bold">{log.targetType}</span> <span className="font-mono text-[10px] opacity-40">({log.targetId.slice(0,8)})</span>
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest whitespace-nowrap ml-4 opacity-50">
                                            {formatDate(log.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState 
                            icon={Terminal}
                            title="No activity recorded"
                            description="Audit trail is empty. All platform actions will be logged here in real-time."
                            actionLabel="Go to Dashboard"
                            onAction={() => {}}
                        />
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

const getActivityIcon = (action: string) => {
    if (action?.includes("USER")) return <Users size={18} />;
    if (action?.includes("GUIDE")) return <Shield size={18} />;
    if (action?.includes("TRIP")) return <MapPin size={18} />;
    if (action?.includes("BOOKING")) return <Calendar size={18} />;
    return <Clock size={16} />;
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

export default ActivityLogPage;
