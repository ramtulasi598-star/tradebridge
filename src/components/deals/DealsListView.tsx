import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { Deal } from '../../types/marketplace';
import { formatINR } from '../../utils/matchingEngine';
import {
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  Truck,
  Star,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface DealsListViewProps {
  onOpenChat: (dealId: string) => void;
  onOpenCall: (dealId: string) => void;
  onRequestCancel: (dealId: string) => void;
  onOpenRating: (dealId: string) => void;
  onViewCancellationProgress: (cancellationId: string) => void;
}

export const DealsListView: React.FC<DealsListViewProps> = ({
  onOpenChat,
  onOpenCall,
  onRequestCancel,
  onOpenRating,
  onViewCancellationProgress
}) => {
  const { deals, advanceDealStatus, cancellationRequests } = useMarketplace();
  const { role, language, currentUser } = useAuth();
  const t = TRANSLATIONS[language];

  const [filter, setFilter] = useState<'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ACTIVE');

  // Filter deals based on user role and tab
  const userDeals = deals.filter(d => {
    const isUserDeal = d.farmerId === currentUser.id || d.buyerId === currentUser.id;
    if (!isUserDeal) return false;

    if (filter === 'ACTIVE') {
      return (
        d.status === 'CONFIRMED' ||
        d.status === 'PRE_BOOKED' ||
        d.status === 'PICKUP_OR_DELIVERY' ||
        d.status === 'RECEIVED' ||
        d.status === 'CANCELLATION_REQUESTED' ||
        d.status === 'DISPUTED'
      );
    } else if (filter === 'COMPLETED') {
      return d.status === 'COMPLETED';
    } else {
      return d.status === 'CANCELLED';
    }
  });

  const getStatusBadge = (status: Deal['status']) => {
    switch (status) {
      case 'CONFIRMED':
      case 'PRE_BOOKED':
        return (
          <span className="text-[11px] font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
            ● Advance Secured & Pre-Booked
          </span>
        );
      case 'PICKUP_OR_DELIVERY':
        return (
          <span className="text-[11px] font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> In Transit / Pickup
          </span>
        );
      case 'RECEIVED':
        return (
          <span className="text-[11px] font-extrabold text-[#A3661C] bg-[#FDF2E2] px-2.5 py-0.5 rounded-full border border-[#E2BA7C]">
            ● Quality Inspected & Received
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="text-[11px] font-extrabold text-white bg-[#1E7C48] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'CANCELLATION_REQUESTED':
        return (
          <span className="text-[11px] font-extrabold text-[#A3661C] bg-[#FDF2E2] px-2.5 py-0.5 rounded-full border border-[#E2BA7C] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Cancellation Requested
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-[11px] font-extrabold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Cancelled & Released
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="text-[11px] font-extrabold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Under Dispute Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Filter Controls */}
      <div className="flex items-center bg-[#EDE3D5] p-1 rounded-2xl border border-[#D8C7B3]">
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`flex-1 min-h-[38px] text-xs font-extrabold rounded-xl transition-all ${
            filter === 'ACTIVE'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#6E5544] hover:text-[#2C1D13]'
          }`}
        >
          Active ({deals.filter(d => d.status !== 'COMPLETED' && d.status !== 'CANCELLED').length})
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`flex-1 min-h-[38px] text-xs font-extrabold rounded-xl transition-all ${
            filter === 'COMPLETED'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#6E5544] hover:text-[#2C1D13]'
          }`}
        >
          Completed ({deals.filter(d => d.status === 'COMPLETED').length})
        </button>
        <button
          onClick={() => setFilter('CANCELLED')}
          className={`flex-1 min-h-[38px] text-xs font-extrabold rounded-xl transition-all ${
            filter === 'CANCELLED'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#6E5544] hover:text-[#2C1D13]'
          }`}
        >
          Cancelled ({deals.filter(d => d.status === 'CANCELLED').length})
        </button>
      </div>

      {userDeals.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#D8C7B3] text-center text-[#6E5544] text-xs">
          No {filter.toLowerCase()} deals found.
        </div>
      ) : (
        <div className="space-y-3.5">
          {userDeals.map(deal => {
            const activeCancellation = cancellationRequests.find(
              c => c.dealId === deal.id && c.status !== 'VERIFIED_CANCELLED' && c.status !== 'REJECTED'
            );

            const hasRated = role === 'FARMER' ? deal.farmerRated : deal.buyerRated;

            return (
              <div
                key={deal.id}
                className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#D8C7B3] shadow-md space-y-3.5 text-[#2C1D13]"
              >
                {/* Header Row: Deal Code & Status */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-[#2C1D13] font-mono">
                        {deal.dealCode}
                      </span>
                      {getStatusBadge(deal.status)}
                    </div>
                    <p className="text-xs text-[#6E5544] mt-1">
                      Confirmed on: {new Date(deal.confirmedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#1E7C48] tabular-nums">
                      {formatINR(deal.totalAmount)}
                    </span>
                    <span className="text-xs text-[#6E5544] block">
                      ({deal.quantityKg} kg × ₹{deal.pricePerKg}/kg)
                    </span>
                  </div>
                </div>

                {/* Parties Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-xs">
                  <div>
                    <span className="text-[#6E5544] font-bold block text-[10px] uppercase">
                      Farmer / Seller
                    </span>
                    <span className="font-extrabold text-[#2C1D13]">
                      {deal.farmerName}
                    </span>
                    <p className="text-[#6E5544] text-[11px] mt-0.5">
                      {deal.farmerLocation.area}, {deal.farmerLocation.district}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#6E5544] font-bold block text-[10px] uppercase">
                      Buyer / Market
                    </span>
                    <span className="font-extrabold text-[#2C1D13]">
                      {deal.buyerBusinessName} ({deal.buyerName})
                    </span>
                    <p className="text-[#6E5544] text-[11px] mt-0.5">
                      {deal.buyerLocation.area}, {deal.buyerLocation.state}
                    </p>
                  </div>
                </div>

                {/* Crop & Quantity Row */}
                <div className="flex items-center justify-between text-xs text-[#4A3525] border-t border-[#D8C7B3] pt-2.5">
                  <div>
                    <strong className="text-[#2C1D13]">{deal.cropName}</strong> · Grade {deal.grade} · <span className="font-bold tabular-nums text-[#2C1D13]">{deal.quantityKg} kg</span>
                  </div>
                  <div className="text-[#1E7C48] font-bold">
                    Agreed Rate: ₹{deal.pricePerKg}/kg
                  </div>
                </div>

                {/* Ongoing Cancellation Request Warning Strip */}
                {activeCancellation && (
                  <div className="bg-[#FDF2E2] border border-[#E2BA7C] rounded-2xl p-3 text-xs text-[#A3661C] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#A3661C] shrink-0" />
                      <span>
                        Cancellation requested by {activeCancellation.requestedByName} ({activeCancellation.reasonCode}).
                      </span>
                    </div>
                    <button
                      onClick={() => onViewCancellationProgress(activeCancellation.id)}
                      className="px-3 py-1.5 bg-[#A3661C] text-white font-extrabold rounded-xl text-xs shrink-0"
                    >
                      Confirm OTP
                    </button>
                  </div>
                )}

                {/* Interactive Action Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D8C7B3] flex-wrap">
                  {/* Communication Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(deal.id)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#D8C7B3] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-[#1E7C48]" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => onOpenCall(deal.id)}
                      className="min-h-[40px] px-3.5 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#D8C7B3] transition-colors"
                      title={t.callMaskingNotice}
                    >
                      <Phone className="w-4 h-4 text-[#1E7C48]" />
                      <span>Call (Masked)</span>
                    </button>
                  </div>

                  {/* Lifecycle Progression & Mutual Cancellation Triggers */}
                  <div className="flex items-center gap-2">
                    {/* Advance Status button */}
                    {deal.status !== 'COMPLETED' && deal.status !== 'CANCELLED' && deal.status !== 'DISPUTED' && (
                      <button
                        onClick={() => advanceDealStatus(deal.id)}
                        className="min-h-[40px] px-4 py-1.5 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        {deal.status === 'CONFIRMED' || deal.status === 'PRE_BOOKED' ? (
                          <>
                            <Truck className="w-4 h-4" /> Start Dispatch
                          </>
                        ) : deal.status === 'PICKUP_OR_DELIVERY' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Confirm Received
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Complete Deal
                          </>
                        )}
                      </button>
                    )}

                    {/* Request Mutual Cancellation */}
                    {deal.status !== 'COMPLETED' && deal.status !== 'CANCELLED' && !activeCancellation && (
                      <button
                        onClick={() => onRequestCancel(deal.id)}
                        className="min-h-[40px] px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors border border-red-300"
                      >
                        {t.requestCancellation}
                      </button>
                    )}

                    {/* Rate Deal */}
                    {deal.status === 'COMPLETED' && !hasRated && (
                      <button
                        onClick={() => onOpenRating(deal.id)}
                        className="min-h-[40px] px-4 py-1.5 bg-[#A3661C] hover:bg-[#8B5616] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Star className="w-4 h-4 fill-white" /> {t.rateTransaction}
                      </button>
                    )}

                    {deal.status === 'COMPLETED' && hasRated && (
                      <span className="text-xs font-bold text-[#1E7C48] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {t.alreadyRated}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
