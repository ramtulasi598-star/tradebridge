import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { ShieldCheck, Building2, TrendingUp, AlertTriangle, ListFilter, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    requirements,
    marketPrices,
    deals,
    disputes,
    auditLogs,
    toggleBuyerVerification,
    updateMarketPrice,
    resolveDispute
  } = useMarketplace();
  const { language } = useAuth();
  const t = TRANSLATIONS[language];

  const [activeAdminTab, setActiveAdminTab] = useState<'BUYERS' | 'PRICES' | 'DISPUTES' | 'AUDIT'>('BUYERS');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);

  // Group requirements by buyer to list buyers
  const buyersMap = new Map();
  requirements.forEach(r => {
    if (!buyersMap.has(r.buyerId)) {
      buyersMap.set(r.buyerId, {
        buyerId: r.buyerId,
        buyerName: r.buyerName,
        businessName: r.businessName,
        isVerified: r.isVerified,
        marketName: r.marketName,
        state: r.location.state
      });
    }
  });
  const buyersList = Array.from(buyersMap.values());

  const handleSavePrice = (id: string) => {
    if (newPriceInput > 0) {
      updateMarketPrice(id, newPriceInput);
      setEditingPriceId(null);
    }
  };

  return (
    <div className="px-3.5 py-4 space-y-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <span>{t.adminTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            APMC regulatory compliance, dispute arbitration, and price integrity ledger.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminTab('BUYERS')}
          className={`min-h-[40px] px-4 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeAdminTab === 'BUYERS' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.verifyBuyersTab} ({buyersList.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('PRICES')}
          className={`min-h-[40px] px-4 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeAdminTab === 'PRICES' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.mandiPricesTab} ({marketPrices.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('DISPUTES')}
          className={`min-h-[40px] px-4 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeAdminTab === 'DISPUTES' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.disputesTab} ({disputes.filter(d => d.status === 'OPEN').length})
        </button>
        <button
          onClick={() => setActiveAdminTab('AUDIT')}
          className={`min-h-[40px] px-4 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeAdminTab === 'AUDIT' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.auditLogsTab} ({auditLogs.length})
        </button>
      </div>

      {/* 1. Buyer Verification Desk */}
      {activeAdminTab === 'BUYERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">
            Agricultural Buyer & Trader KYC Verification
          </h2>
          <div className="divide-y divide-slate-100">
            {buyersList.map(b => (
              <div key={b.buyerId} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{b.businessName}</span>
                    <span className="text-xs text-slate-500">({b.buyerName})</span>
                    {b.isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {b.marketName} · {b.state} · APMC License Verified
                  </p>
                </div>

                <button
                  onClick={() => toggleBuyerVerification(b.buyerId)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    b.isVerified
                      ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {b.isVerified ? 'Revoke Status' : t.approveBuyer}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Mandi Spot Price Editor */}
      {activeAdminTab === 'PRICES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">
            APMC Daily Bulletin Rate Oversight
          </h2>
          <div className="space-y-3">
            {marketPrices.map(p => (
              <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-slate-900">
                    {p.cropName} (Grade {p.grade})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {p.marketName} · {p.location.state}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {editingPriceId === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={newPriceInput}
                        onChange={e => setNewPriceInput(Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs border rounded bg-white font-bold"
                      />
                      <button
                        onClick={() => handleSavePrice(p.id)}
                        className="px-2 py-1 bg-emerald-700 text-white text-xs rounded font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPriceId(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-black text-slate-900 tabular-nums">
                        ₹{p.currentPricePerKg}/kg
                      </span>
                      <button
                        onClick={() => {
                          setEditingPriceId(p.id);
                          setNewPriceInput(p.currentPricePerKg);
                        }}
                        className="text-xs text-emerald-700 font-semibold hover:underline"
                      >
                        Edit Rate
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dispute Resolution Desk */}
      {activeAdminTab === 'DISPUTES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">
            Active Disputes & Arbitration Cases
          </h2>
          {disputes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              Zero active disputes. All transactions proceeding with mutual consensus.
            </p>
          ) : (
            <div className="space-y-3">
              {disputes.map(d => (
                <div key={d.id} className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-950 font-mono">
                      Deal {d.dealCode} · Raised by {d.raisedByName} ({d.raisedByRole})
                    </span>
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Complaint:</strong> {d.description}
                  </p>
                  {d.status === 'OPEN' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-red-100">
                      <button
                        onClick={() => resolveDispute(d.id, 'RESOLVED_CANCELLED', 'Admin confirmed produce release.')}
                        className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg"
                      >
                        Approve Cancellation & Release Produce
                      </button>
                      <button
                        onClick={() => resolveDispute(d.id, 'RESOLVED_UPHELD', 'Admin upheld deal commitment.')}
                        className="px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                      >
                        Enforce Deal Terms
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Concurrency & Audit Logs */}
      {activeAdminTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">
            Immutable Transaction & Concurrency Audit Ledger
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span className="font-mono font-bold text-slate-700">{log.action}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-800 font-medium">{log.details}</p>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Target: {log.entityType} ({log.entityId})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
