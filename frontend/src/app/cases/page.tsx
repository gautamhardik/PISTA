"use client";

import { useEffect, useState } from "react";
import { api, type CaseItem } from "@/lib/api";
import { PageHeader, StatusBadge } from "@/components/ui/primitives";
import { ParticleField } from "@/components/visuals/ParticleField";
import {
  Search,
  Filter,
  Layers,
  Clock,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  History,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuditEvent {
  id: number;
  case_id: string;
  event_type: string;
  previous_status?: string;
  new_status?: string;
  actor: string;
  reason?: string;
  note?: string;
  created_at: string;
}

export default function CasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Case Detail Drawer & Audit Trail
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [investigatorNote, setInvestigatorNote] = useState("");
  const [resolutionReason, setResolutionReason] = useState("customer_verified");

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.cases();
      setCases(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Unable to hydrate cases from PostgreSQL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const openCaseDetail = async (c: CaseItem) => {
    setSelectedCase(c);
    setInvestigatorNote(c.investigator_note || "");
    setResolutionReason(c.resolution || "customer_verified");
    setAuditLoading(true);

    try {
      const audits = await api.caseAudit(c.id);
      setAuditEvents(audits);
    } catch (err) {
      console.error("Failed to load case audit trail", err);
      setAuditEvents([]);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: "review" | "resolved" | "blocked") => {
    if (!selectedCase) return;
    setActionLoading(true);

    try {
      await api.updateCaseStatus(selectedCase.id, newStatus, resolutionReason, investigatorNote);
      await loadCases();
      
      // Refresh audit
      const audits = await api.caseAudit(selectedCase.id);
      setAuditEvents(audits);
      
      setSelectedCase({
        ...selectedCase,
        status: newStatus,
        resolution: resolutionReason,
        investigator_note: investigatorNote,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update case status.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      (c.razorpay_payment_id && c.razorpay_payment_id.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen px-8 lg:px-20 py-12 max-w-6xl mx-auto overflow-hidden">
      <ParticleField mode="queue" className="opacity-35" />

      {/* Ambient background spotlights */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[300px] bg-gradient-to-bl from-[#3395ff]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3395ff]/15 text-[#3395ff] border border-[#3395ff]/30 font-bold uppercase tracking-wider">
                Investigator Studio
              </span>
              <span className="text-xs font-mono text-zinc-500">• {filteredCases.length} Active Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Investigations & Case Triage
            </h1>
          </div>

          <button
            onClick={loadCases}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] hover:border-[#3395ff]/40 text-xs font-mono text-white transition-all flex items-center gap-2 self-start cursor-pointer shadow-sm backdrop-blur-md"
          >
            <Clock className="w-3.5 h-3.5 text-[#3395ff]" />
            <span>Sync Queue</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="card-surface p-4 mb-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Case ID, UUID, or Payment ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 outline-none focus:border-[#C7F36B] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {["all", "open", "review", "resolved", "blocked"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer",
                  statusFilter === status
                    ? "bg-[#C7F36B] text-[#07080a] font-bold shadow-[0_0_12px_rgba(199,243,107,0.4)]"
                    : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Table or Empty State */}
        {loading ? (
          <div className="card-surface p-12 text-center backdrop-blur-2xl bg-[#0f131a]/85">
            <Layers className="w-8 h-8 text-[#C7F36B] animate-pulse mx-auto mb-3" />
            <p className="text-xs font-mono text-zinc-400">Hydrating case records from PostgreSQL…</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="card-surface p-14 text-center backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-base font-bold text-white font-sans mb-1.5">No Investigations Yet</h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto mb-6">
              PISTA hasn&apos;t routed any suspicious transactions to the investigation queue. Analyze a high-risk transaction to begin.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] text-[#07080a] font-bold text-xs shadow-[0_0_16px_rgba(199,243,107,0.3)]"
            >
              <span>Analyze Transaction</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="card-surface backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Case ID</th>
                    <th className="py-3.5 px-4 font-semibold">Transaction UUID</th>
                    <th className="py-3.5 px-4 font-semibold">Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                    <th className="py-3.5 px-4 font-semibold">Policy</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Created</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCases.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => openCaseDetail(c)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-white group-hover:text-[#C7F36B] transition-colors">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {c.transaction_id.slice(0, 12)}…
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        ${c.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#C7F36B]">
                        {c.risk_score.toFixed(1)} / 100
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.05] border border-white/[0.1] text-zinc-200">
                          {c.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                        {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[11px] text-[#3395ff] group-hover:underline">Open Drawer →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Case Detail & Audit Trail Modal / Drawer */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="card-surface w-full max-w-2xl bg-[#0f131a] border-white/[0.15] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white font-sans">Investigation: {selectedCase.id}</h3>
                    <StatusBadge status={selectedCase.status} />
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">Transaction: #{selectedCase.transaction_id}</p>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Case Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Amount</span>
                  <span className="text-white font-semibold">${selectedCase.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Risk Score</span>
                  <span className="text-[#C7F36B] font-bold">{selectedCase.risk_score.toFixed(1)} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Policy Action</span>
                  <span className="text-white font-semibold">{selectedCase.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Created</span>
                  <span className="text-zinc-300">{new Date(selectedCase.created_at).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Investigator Action Triage Form */}
              <div className="p-4 rounded-xl bg-[#14171A] border border-white/[0.08] mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C7F36B] font-bold mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C7F36B]" />
                  <span>Investigator Resolution Controls</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Resolution Category</label>
                    <select
                      value={resolutionReason}
                      onChange={(e) => setResolutionReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white outline-none focus:border-[#C7F36B]"
                    >
                      <option value="customer_verified" className="bg-[#0f131a]">Customer Identity Verified (False Positive)</option>
                      <option value="confirmed_fraud" className="bg-[#0f131a]">Confirmed Fraud / Stolen Instrument</option>
                      <option value="chargeback_dispute" className="bg-[#0f131a]">Chargeback / Payment Dispute</option>
                      <option value="benign_anomaly" className="bg-[#0f131a]">Benign Behavioral Anomaly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Investigator Audit Note</label>
                    <textarea
                      value={investigatorNote}
                      onChange={(e) => setInvestigatorNote(e.target.value)}
                      placeholder="Enter operational rationale, proof documents, or verification callback notes…"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-sans text-white placeholder-zinc-500 outline-none focus:border-[#C7F36B]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handleUpdateStatus("resolved")}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve as Legitimate</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus("blocked")}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm & Block</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus("review")}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Escalate / Re-Open</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Case Audit Trail Log */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#3395ff]" />
                  <span>Case Audit Event Trail</span>
                </h4>

                {auditLoading ? (
                  <p className="text-xs font-mono text-zinc-500">Loading audit history…</p>
                ) : auditEvents.length === 0 ? (
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-500">
                    Case initiated automatically upon high-risk decision threshold. No manual transitions recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2 font-mono text-xs">
                    {auditEvents.map((evt) => (
                      <div key={evt.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{evt.actor}</span>
                            <span className="text-zinc-500">→</span>
                            <span className="text-[#C7F36B]">{evt.event_type}</span>
                            {evt.new_status && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.06] text-zinc-300">
                                {evt.previous_status} → {evt.new_status}
                              </span>
                            )}
                          </div>
                          {evt.note && <p className="text-zinc-400 font-sans text-xs mt-1">&ldquo;{evt.note}&rdquo;</p>}
                        </div>
                        <span className="text-[10px] text-zinc-500 flex-shrink-0">
                          {new Date(evt.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
