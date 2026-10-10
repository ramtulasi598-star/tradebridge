import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { formatCountdown, formatINR } from '../../utils/matchingEngine';
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const ActiveRequestsSection: React.FC<{ onDealConfirmed?: (dealId: string) => void }> = ({ onDealConfirmed }) => {
  const { sellRequests, respondToSellRequest } = useMarketplace();
  const { role, language } = useAuth();
  const t = TRANSLATIONS[language];

  // Tick state to force UI update every second for countdowns
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingRequests = sellRequests.filter(r => r.status === 'PENDING');

  if (pendingRequests.length === 0) {
    return null;
  }

  const handleAccept = (requestId: string) => {
    const res = respondToSellRequest(requestId, 'ACCEPT');
    if (res.success && res.dealId && onDealConfirmed) {
      onDealConfirmed(res.dealId);
    }
  };

  const handleReject = (requestId: string) => {
    respondToSellRequest(requestId, 'REJECT', 'Quantity intake fulfilled');
  };

  return (
    <div className="bg-[#EDE3D5] border border-[#D8C7B3] rounded-3xl p-4 sm:p-5 mb-4 shadow-md text-[#2C1D13]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1E7C48] animate-pulse" />
          <h2 className="text-sm font-extrabold text-[#2C1D13]">
            {t.pendingRequestsTitle}
          </h2>
        </div>
        <span className="text-[11px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
          {pendingRequests.length} active
        </span>
      </div>

      <p className="text-xs text-[#6E5544] mb-3 leading-relaxed">
        {t.buyerMustRespond}
      </p>

      <div className="space-y-3">
        {pendingRequests.map(req => {
          const msLeft = req.expiresAt - now;
          const { formatted, isUrgent, isCritical } = formatCountdown(msLeft);
          const minutesLeft = Math.floor(msLeft / (1000 * 60));

          return (
            <div
              key={req.id}
              className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#D8C7B3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Column: Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-extrabold text-[#2C1D13]">
                    {req.cropName}
                  </span>
                  <span className="text-xs font-bold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                    Grade {req.grade}
                  </span>
                  <span className="text-xs text-[#8D7665]">·</span>
                  <span className="text-xs font-bold text-[#1E7C48] tabular-nums">
                    {req.requestedQuantityKg} kg
                  </span>
                  <span className="text-xs text-[#8D7665]">·</span>
                  <span className="text-xs font-bold text-[#2C1D13] tabular-nums">
                    ₹{req.offeredPricePerKg}/kg
                  </span>
                </div>

                <div className="text-xs text-[#6E5544] flex items-center gap-2">
                  <span>
                    {role === 'BUYER' ? `Farmer: ${req.farmerName} (${req.farmerLocation.area})` : `Buyer: ${req.buyerBusinessName}`}
                  </span>
                  <span className="text-[#8D7665]">·</span>
                  <span className="text-[#1E7C48] font-bold tabular-nums">
                    Total: {formatINR(req.requestedQuantityKg * req.offeredPricePerKg)}
                  </span>
                </div>

                {/* Reminder Milestones & SLA Indicator */}
                <div className="flex items-center gap-2 pt-1 text-[11px] flex-wrap">
                  {req.requestType === 'BUYER_TO_FARMER' || (req.expiresAt - req.createdAt > 3600 * 1000 * 2) ? (
                    <span className="text-[#1E7C48] font-extrabold bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1E7C48]" />
                      <span>24-Hour Buyer Offer Window</span>
                    </span>
                  ) : minutesLeft <= 5 ? (
                    <span className="text-red-700 font-bold flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                      <AlertCircle className="w-3.5 h-3.5" /> {t.reminder5m}
                    </span>
                  ) : minutesLeft <= 10 ? (
                    <span className="text-orange-700 font-bold flex items-center gap-1 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                      <AlertCircle className="w-3.5 h-3.5" /> {t.reminder10m}
                    </span>
                  ) : minutesLeft <= 30 ? (
                    <span className="text-amber-800 font-bold bg-[#FDF2E2] px-2 py-0.5 rounded-full border border-[#E2BA7C]">
                      {t.reminder30m}
                    </span>
                  ) : (
                    <span className="text-[#1E7C48] font-bold bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                      1-Hour Mandi Window
                    </span>
                  )}
                  <span className="text-[#7A6453]">
                    Produce locked
                  </span>
                </div>
              </div>

              {/* Right Column: Countdown Clock & Actions */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D8C7B3]">
                {/* Live Countdown Display */}
                <div className="flex items-center gap-1.5 self-start sm:self-end">
                  <Clock className={`w-4 h-4 ${isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-[#1E7C48]'}`} />
                  <span
                    className={`text-base font-extrabold font-mono tracking-tight tabular-nums ${
                      isCritical ? 'text-red-600 animate-pulse' : isUrgent ? 'text-orange-600' : 'text-[#1E7C48]'
                    }`}
                  >
                    {formatted}
                  </span>
                </div>

                {/* Action Buttons for Buyer */}
                {role === 'BUYER' ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 sm:flex-none min-h-[40px] px-4 py-1.5 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.acceptRequest}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="min-h-[40px] px-3 py-1.5 bg-[#EDE3D5] hover:bg-[#DFD3C3] text-[#4A3525] rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-[#D8C7B3]"
                    >
                      <XCircle className="w-3.5 h-3.5" /> {t.rejectRequest}
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#7A6453] bg-[#EDE3D5] px-3 py-1 rounded-xl border border-[#D8C7B3] text-center sm:text-right font-medium">
                    Waiting for buyer response...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
