import React, { useState } from 'react';
import { CropListing } from '../../types/marketplace';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { matchListingWithBuyers, formatINR } from '../../utils/matchingEngine';
import { X, CheckCircle, Truck, MapPin, ShieldCheck, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface MatchingBuyersModalProps {
  listing: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSent: () => void;
}

export const MatchingBuyersModal: React.FC<MatchingBuyersModalProps> = ({
  listing,
  isOpen,
  onClose,
  onRequestSent
}) => {
  const { requirements, createSellRequest } = useMarketplace();
  const { language } = useAuth();
  const t = TRANSLATIONS[language];

  const [requestQty, setRequestQty] = useState<number>(listing?.availableQuantityKg || 500);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const matches = matchListingWithBuyers(listing, requirements);

  const handleSendRequest = (reqId: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const targetReq = requirements.find(r => r.id === reqId);
    if (!targetReq) {
      setErrorMsg('Requirement not found.');
      setIsSubmitting(false);
      return;
    }

    const qtyToSend = Math.min(requestQty, targetReq.remainingQuantityKg, listing.availableQuantityKg);
    const result = createSellRequest(listing.id, reqId, qtyToSend);

    setIsSubmitting(false);

    if (result.success) {
      onRequestSent();
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C1D13] w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#D8C7B3]">
        {/* Header */}
        <div className="sticky top-0 bg-[#EDE3D5]/95 backdrop-blur-xs px-5 py-4 border-b border-[#D8C7B3] flex items-center justify-between z-10 text-[#2C1D13]">
          <div>
            <h2 className="text-base font-extrabold text-[#2C1D13]">
              {matches.length} {t.matchingBuyersFound}
            </h2>
            <p className="text-xs text-[#6E5544]">
              For: {listing.cropName} · Grade {listing.grade} · <strong className="text-[#1E7C48]">{listing.availableQuantityKg} kg</strong> available
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Neutral Business Rule Notice (Rule 33) */}
          <div className="bg-[#EDE3D5] border border-[#D8C7B3] rounded-2xl p-3 text-xs text-[#4A3525] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#1E7C48] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#2C1D13]">Transparent Information:</strong> We do not choose a buyer for you. Compare current buyer procurement prices, estimated road freight, and remaining quantities below, then choose who to request.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-100 border border-red-300 rounded-xl p-3 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* List of Matched Buyers */}
          {matches.length === 0 ? (
            <div className="text-center py-8 text-[#6E5544] text-xs">
              No buyers currently requesting {listing.cropName} Grade {listing.grade}. Check general mandi prices in the Markets tab.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map(m => {
                const req = m.requirement;
                const isSelected = selectedReqId === req.id;

                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl border p-4 transition-all bg-[#FAF7F2] ${
                      isSelected
                        ? 'border-[#1E7C48] bg-[#EDE3D5] ring-2 ring-[#79C195]'
                        : 'border-[#D8C7B3] hover:border-[#8C5E3C]'
                    }`}
                  >
                    {/* Top Row: Business Name & Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-extrabold text-[#2C1D13]">
                            {req.businessName}
                          </h3>
                          {req.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {t.verifiedBadge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#6E5544] mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1E7C48]" />
                          <span>{req.marketName} ({req.location.area}, {req.location.state})</span>
                          <span>·</span>
                          <span className="font-medium text-[#4A3525]">{m.distanceKm} km away</span>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-1 rounded-lg border border-[#79C195]">
                          {m.score}% Match
                        </span>
                      </div>
                    </div>

                    {/* Price & Freight Strip */}
                    <div className="grid grid-cols-3 gap-2 bg-[#EDE3D5] p-3 rounded-xl mb-3 text-center border border-[#D8C7B3]">
                      <div>
                        <span className="text-[10px] text-[#6E5544] uppercase font-semibold block">
                          Buyer Offer
                        </span>
                        <span className="text-sm font-black text-[#2C1D13] tabular-nums">
                          ₹{req.buyingPricePerKg}/kg
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6E5544] uppercase font-semibold block">
                          {t.estimatedFreight}
                        </span>
                        <span className="text-sm font-semibold text-[#4A3525] tabular-nums">
                          ₹{m.estimatedFreightPerKg.toFixed(1)}/kg
                        </span>
                      </div>
                      <div className="bg-[#FAF7F2] border border-[#79C195] rounded-lg py-0.5">
                        <span className="text-[10px] text-[#1E7C48] uppercase font-bold block">
                          {t.estimatedNetRealization}
                        </span>
                        <span className="text-sm font-black text-[#1E7C48] tabular-nums">
                          ₹{m.estimatedNetPricePerKg}/kg
                        </span>
                      </div>
                    </div>

                    {/* Volume Progress Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[11px] text-[#6E5544] font-medium">
                        <span>
                          {t.requiredQuantity}: <strong className="text-[#2C1D13]">{req.requiredQuantityKg} kg</strong>
                        </span>
                        <span>
                          {t.prebookedQuantity}: <strong className="text-[#1E7C48]">{req.prebookedQuantityKg} kg</strong>
                        </span>
                        <span>
                          {t.remainingQuantity}: <strong className="text-[#A3661C]">{req.remainingQuantityKg} kg</strong>
                        </span>
                      </div>
                      <div className="w-full bg-[#E5D7C4] h-2 rounded-full overflow-hidden flex border border-[#D8C7B3]">
                        <div
                          className="bg-[#1E7C48] h-full"
                          style={{ width: `${(req.prebookedQuantityKg / req.requiredQuantityKg) * 100}%` }}
                        />
                        <div
                          className="bg-[#A3661C] h-full"
                          style={{ width: `${(req.remainingQuantityKg / req.requiredQuantityKg) * 100}%` }}
                        />
                      </div>
                    </div>

                    {req.additionalRequirements && (
                      <p className="text-[11px] text-[#6E5544] mb-3 italic">
                        &ldquo;{req.additionalRequirements}&rdquo;
                      </p>
                    )}

                    {/* Request to Sell Trigger Button */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#D8C7B3]">
                      <div className="text-xs text-[#A3661C] flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>1-hr buyer response window</span>
                      </div>

                      <button
                        onClick={() => handleSendRequest(req.id)}
                        disabled={isSubmitting || listing.availableQuantityKg <= 0}
                        className="min-h-[44px] px-4 py-2 bg-[#1E7C48] hover:bg-[#165f37] disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      >
                        <span>{t.requestToSell}</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
