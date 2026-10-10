import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  Clock,
  Zap,
  TrendingUp,
  CheckCircle2,
  Building2,
  Sparkles,
  X,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';

// Format seconds into MM:SS
export const formatCycleTimer = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const MandiCycleBanner: React.FC = () => {
  const {
    mandiCycleSecondsLeft,
    triggerMandiCycleNow,
    lastCycleSummary,
    activeCycleToast,
    dismissCycleToast
  } = useMarketplace();

  const [showInfoModal, setShowInfoModal] = useState(false);

  const formattedTime = formatCycleTimer(mandiCycleSecondsLeft);
  const progressPercent = Math.max(0, Math.min(100, ((480 - mandiCycleSecondsLeft) / 480) * 100));

  return (
    <>
      {/* 1. COMPACT STREAMLINED 8-MINUTE MANDI CYCLE STRIP */}
      <div className="bg-[#FAF7F2] border-y border-[#D8C7B3] px-3.5 py-2 shadow-xs">
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Left: Cycle Icon & Live Countdown */}
          <div
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-lg bg-[#E1F2E7] text-[#1E7C48] flex items-center justify-center font-bold">
                <Clock className="w-3.5 h-3.5 animate-spin-slow" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#2C1D13] tracking-tight">
                  8-Min Mandi Cycle:
                </span>
                <span className="font-mono font-black text-[#1E7C48] bg-[#E1F2E7] px-1.5 py-0.2 rounded-md border border-[#79C195]">
                  {formattedTime}
                </span>
              </div>
              <div className="text-[10px] text-[#6E5544] flex items-center gap-1">
                <span>Marketer intake & price surge cycle</span>
                <Info className="w-2.5 h-2.5 text-[#8C5E3C] inline" />
              </div>
            </div>
          </div>

          {/* Right: Fast-Forward Button */}
          <button
            type="button"
            onClick={triggerMandiCycleNow}
            title="Fast-forward and trigger the 8-minute marketer acceptance and price surge cycle now"
            className="min-h-[30px] px-2.5 py-1 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>Sync Now</span>
          </button>
        </div>

        {/* Tiny subtle progress line */}
        <div className="w-full bg-[#E5D7C4] h-1 rounded-full mt-1.5 overflow-hidden">
          <div
            className="bg-[#1E7C48] h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. FLOATING REAL-TIME CELEBRATION TOAST WHEN 8-MINUTE CYCLE FIRES */}
      {activeCycleToast && (
        <div className="fixed top-14 inset-x-3 sm:inset-x-auto sm:right-4 sm:w-[410px] z-50 animate-in slide-in-from-top-3 duration-300">
          <div className="bg-[#FAF7F2] text-[#2C1D13] rounded-3xl p-4 shadow-2xl border-2 border-[#1E7C48] space-y-3 relative">
            <button
              onClick={dismissCycleToast}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-[#6E5544] hover:bg-[#EDE3D5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Header */}
            <div className="flex items-center gap-2 pr-6">
              <div className="w-8 h-8 rounded-xl bg-[#E1F2E7] text-[#1E7C48] flex items-center justify-center shrink-0 border border-[#79C195]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1E7C48] uppercase tracking-wider flex items-center gap-1.5">
                  ⏱️ 8-Minute Mandi Cycle Completed!
                </h4>
                <p className="text-[11px] text-[#6E5544]">
                  Cycle #{activeCycleToast.cycleNumber} · Trader accepted crop & prices increased
                </p>
              </div>
            </div>

            {/* Marketer Crop Acceptance Card */}
            <div className="bg-[#E1F2E7] p-3 rounded-2xl border border-[#79C195] space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#1E7C48] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Marketer Accepted Crop
                </span>
                <span className="font-mono text-[10px] text-[#1E7C48] font-bold">
                  {activeCycleToast.dealCode}
                </span>
              </div>
              <div className="text-xs text-[#2C1D13] font-bold">
                {activeCycleToast.marketerName}
              </div>
              <div className="text-[11px] text-[#1E7C48] font-semibold">
                Accepted <strong>{activeCycleToast.acceptedQuantityKg} kg</strong> of {activeCycleToast.acceptedCropName} at{' '}
                <strong className="text-sm">₹{activeCycleToast.acceptedPricePerKg}/kg</strong>!
              </div>
            </div>

            {/* Price Surge Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#6E5544] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#1E7C48]" />
                Mandi Price Surge (Buyer Trade Demand):
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {activeCycleToast.priceIncreases.map(pi => (
                  <div
                    key={pi.cropName}
                    className="bg-[#EDE3D5] p-2 rounded-xl border border-[#D8C7B3] text-xs"
                  >
                    <span className="text-[10px] text-[#6E5544] font-bold block truncate">
                      {pi.cropName}
                    </span>
                    <span className="font-mono font-black text-[#1E7C48] block text-xs">
                      ₹{pi.newPrice}/kg
                    </span>
                    <span className="text-[9px] font-bold text-[#1E7C48] block">
                      +₹{pi.increase}/kg 📈
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dismiss Footer */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[#8C5E3C] font-mono">
                Next cycle in 08:00
              </span>
              <button
                type="button"
                onClick={dismissCycleToast}
                className="px-3 py-1 bg-[#1E7C48] hover:bg-[#165f37] text-white font-extrabold rounded-lg text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPLANATORY INFO MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] text-[#2C1D13] w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#D8C7B3] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E1F2E7] text-[#1E7C48] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-[#2C1D13]">
                  8-Minute Mandi Cycle Engine
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-full hover:bg-[#EDE3D5] text-[#6E5544]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#6E5544] leading-relaxed">
              <p>
                Every <strong>8 minutes</strong>, TradeBridge's automated APMC clearing engine runs two critical actions:
              </p>
              <div className="bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E7C48] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C1D13]">1. Wholesale Marketer Intake:</strong>
                    <div className="text-[11px]">
                      Licensed APMC marketers accept fresh farmer crop harvests, locking pre-booked tonnage and generating deals.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1E7C48] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2C1D13]">2. Dynamic Price Surge:</strong>
                    <div className="text-[11px]">
                      Because wholesale demand surges upon intake, APMC commodity prices increase in real-time.
                    </div>
                  </div>
                </div>
              </div>

              {lastCycleSummary && (
                <div className="bg-[#E1F2E7] p-3 rounded-2xl border border-[#79C195] space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#1E7C48] tracking-wider block">
                    Last Completed Cycle (#{lastCycleSummary.cycleNumber}):
                  </span>
                  <div className="text-xs text-[#2C1D13] font-bold">
                    {lastCycleSummary.marketerName} accepted {lastCycleSummary.acceptedQuantityKg} kg of {lastCycleSummary.acceptedCropName} at ₹{lastCycleSummary.acceptedPricePerKg}/kg.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="flex-1 min-h-[42px] bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerMandiCycleNow();
                  setShowInfoModal(false);
                }}
                className="flex-1 min-h-[42px] bg-[#1E7C48] hover:bg-[#165f37] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Run Cycle Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
