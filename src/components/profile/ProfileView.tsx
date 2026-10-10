import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TRANSLATIONS } from '../../data/translations';
import { INITIAL_CROPS, INITIAL_MARKET_HUBS, SAMPLE_LOCATIONS } from '../../data/initialData';
import { CropListing, MarketHub, QualityGradeCode, Deal } from '../../types/marketplace';
import { CropPostCard } from '../home/CropPostCard';
import { EditListingModal } from '../home/EditListingModal';
import { MarketRequestModal } from '../markets/MarketRequestModal';
import { CropVideoModal } from '../home/CropVideoModal';
import { TradeBridgeLogo } from '../layout/TradeBridgeLogo';
import {
  MapPin,
  Star,
  ShieldCheck,
  Globe,
  Wifi,
  Trash2,
  Plus,
  Video,
  ExternalLink,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  Truck,
  FileText,
  X,
  Play,
  Send,
  ArrowRight,
  ChevronRight,
  PackageCheck,
  CheckCheck
} from 'lucide-react';

interface ProfileViewProps {
  onOpenSellModal: () => void;
  onSelectListing: (listingId: string) => void;
  onNavigateToMarkets?: () => void;
  onOpenDealChat?: (dealId: string) => void;
}

// 4 distinct categories requested: Active Crop, Prebooked Crop, Sold Out, and Followed Markets
type ProfileTab = 'ACTIVE_CROPS' | 'PREBOOKED_CROPS' | 'SOLDOUT_CROPS' | 'FOLLOWED_MARKETS';

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenSellModal,
  onSelectListing,
  onNavigateToMarkets,
  onOpenDealChat
}) => {
  const { currentUser, role, language, setLanguage, lowConnectivityMode, setLowConnectivityMode, openLoginModal, logout } = useAuth();
  const {
    listings,
    requirements,
    deals,
    publishRequirement,
    followedMarketIds,
    toggleFollowMarket
  } = useMarketplace();
  const t = TRANSLATIONS[language];

  // Active Profile Category Tab (Default to ACTIVE_CROPS)
  const [activeSection, setActiveSection] = useState<ProfileTab>('ACTIVE_CROPS');

  // Modals inside Profile
  const [editingPost, setEditingPost] = useState<CropListing | null>(null);
  const [requestingMarket, setRequestingMarket] = useState<MarketHub | null>(null);
  const [activeVideoListing, setActiveVideoListing] = useState<CropListing | null>(null);
  const [selectedReceiptDeal, setSelectedReceiptDeal] = useState<Deal | null>(null);

  // Buyer: Add Requirement Modal state
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [newCropId, setNewCropId] = useState('crop-tomato');
  const [newPrice, setNewPrice] = useState(32);
  const [newQty, setNewQty] = useState(3000);
  const [newNotes, setNewNotes] = useState('');

  // Farmer's listings
  const farmerListings = listings.filter(l => l.farmerId === currentUser.id);

  // Buyer's requirements
  const buyerRequirements = requirements.filter(r => r.buyerId === currentUser.id);

  // User's deals (either as farmer or buyer)
  const userDeals = deals.filter(d => 
    role === 'FARMER' ? d.farmerId === currentUser.id : d.buyerId === currentUser.id
  );

  // 1. ACTIVE CROPS (availableQuantityKg > 0 and status is AVAILABLE)
  const activeFarmerListings = farmerListings.filter(l => 
    l.status === 'AVAILABLE' && (l.availableQuantityKg ?? (l.totalQuantityKg - (l.prebookedQuantityKg || 0))) > 0
  );

  // 2. PRE-BOOKED CROPS (prebookedQuantityKg > 0 or deal status PRE_BOOKED / CONFIRMED)
  const prebookedFarmerListings = farmerListings.filter(l => (l.prebookedQuantityKg || 0) > 0);
  const prebookedDeals = userDeals.filter(d => 
    d.status === 'PRE_BOOKED' || d.status === 'CONFIRMED' || d.status === 'PICKUP_OR_DELIVERY' || d.status === 'RECEIVED'
  );

  // 3. SOLD OUT CROPS (status SOLD_OUT or availableQuantityKg == 0, and completed deals)
  const soldOutFarmerListings = farmerListings.filter(l => 
    l.status === 'SOLD_OUT' || (l.availableQuantityKg === 0 && (l.totalQuantityKg || 0) > 0)
  );
  const soldDeals = userDeals.filter(d => d.status === 'COMPLETED');

  // Summary computed stats
  const totalPrebookedKg = prebookedDeals.reduce((sum, d) => sum + d.quantityKg, 0) ||
    prebookedFarmerListings.reduce((sum, l) => sum + (l.prebookedQuantityKg || 0), 0);
  const totalPrebookedValue = prebookedDeals.reduce((sum, d) => sum + d.totalAmount, 0) || (totalPrebookedKg * 26);

  const totalSoldKg = soldDeals.reduce((sum, d) => sum + d.quantityKg, 0);
  const totalSoldRevenue = soldDeals.reduce((sum, d) => sum + d.totalAmount, 0);

  // 4. FOLLOWED MARKETS
  const followedMarkets = INITIAL_MARKET_HUBS.filter(m => followedMarketIds.includes(m.id));
  const suggestedMarkets = INITIAL_MARKET_HUBS.filter(m => !followedMarketIds.includes(m.id)).slice(0, 3);

  // Handle buyer requirement submit
  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const crop = INITIAL_CROPS.find(c => c.id === newCropId) || INITIAL_CROPS[0];
    publishRequirement({
      marketName: currentUser.location?.area || 'APMC Yard',
      location: currentUser.location || SAMPLE_LOCATIONS[0],
      cropId: newCropId,
      cropName: crop.nameKey,
      grade: 'A',
      buyingPricePerKg: newPrice,
      requiredQuantityKg: newQty,
      minOrderQuantityKg: 100,
      maxOrderQuantityKg: newQty,
      additionalRequirements: newNotes
    });
    setShowAddReqModal(false);
  };

  return (
    <div className="px-3.5 py-4 space-y-4 pb-24 text-[#2C1D13]">
      {/* 1. TOP USER PROFILE HEADER */}
      <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#D8C7B3] shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-[#EDE3D5] text-[#1E7C48] flex items-center justify-center font-extrabold text-2xl overflow-hidden shrink-0 border border-[#D8C7B3] shadow-xs">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-extrabold text-[#2C1D13] truncate">
                {currentUser.name}
              </h1>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                  <ShieldCheck className="w-3 h-3" /> {t.verifiedBadge}
                </span>
              )}
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A3661C] bg-[#FDF2E2] px-2 py-0.5 rounded-full border border-[#E2BA7C]">
                {role}
              </span>
            </div>

            <p className="text-xs text-[#6E5544] font-medium mt-0.5">
              {currentUser.businessName ? `${currentUser.businessName} · ` : ''}{currentUser.mobile}
            </p>

            <div className="flex items-center gap-3 text-xs text-[#6E5544] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1E7C48]" />
                <span>{currentUser.location?.area}, {currentUser.location?.district}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-[#A3661C]">
                <Star className="w-3.5 h-3.5 fill-[#A3661C] text-[#A3661C]" />
                <span>{currentUser.ratingAvg.toFixed(1)} ({currentUser.ratingCount} trades)</span>
              </span>
            </div>
          </div>
        </div>

        {/* TradeBridge Official B2B Verification Banner */}
        <div className="mt-3.5 pt-3 border-t border-[#D8C7B3] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TradeBridgeLogo variant="icon" size="sm" />
            <div>
              <span className="text-[11px] font-extrabold text-[#2C1D13] block leading-none">
                TradeBridge Verified Member
              </span>
              <span className="text-[9px] text-[#6E5544]">
                B2B Agri-Tech Marketplace Certified
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
            ID: #TB-2026-AP88
          </span>
        </div>

        {/* Quick Account Switch / Re-login Actions */}
        <div className="mt-3 pt-3 border-t border-[#D8C7B3] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={openLoginModal}
            className="flex-1 min-h-[36px] px-3 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#D8C7B3] transition-colors cursor-pointer"
          >
            <span>🔁 Change User / Crop Details</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="min-h-[36px] px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 border border-red-200 transition-colors cursor-pointer"
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR-CATEGORY TABS (ACTIVE CROP | PREBOOKED CROP | SOLED OUT | FOLLOWED MARKETS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#EDE3D5] p-1.5 rounded-2xl border border-[#D8C7B3]">
        {/* TAB 1: ACTIVE CROP */}
        <button
          onClick={() => setActiveSection('ACTIVE_CROPS')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeSection === 'ACTIVE_CROPS'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#4A3525] hover:text-[#2C1D13] hover:bg-[#E5D7C4]'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>🌾</span>
            <span>Active Crops</span>
          </div>
          <span className="text-[10px] opacity-90 font-mono">
            ({role === 'FARMER' ? activeFarmerListings.length : buyerRequirements.length})
          </span>
        </button>

        {/* TAB 2: PREBOOKED CROP */}
        <button
          onClick={() => setActiveSection('PREBOOKED_CROPS')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeSection === 'PREBOOKED_CROPS'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#4A3525] hover:text-[#2C1D13] hover:bg-[#E5D7C4]'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>🤝</span>
            <span>Pre-booked</span>
          </div>
          <span className="text-[10px] opacity-90 font-mono">
            ({prebookedFarmerListings.length + prebookedDeals.length})
          </span>
        </button>

        {/* TAB 3: SOLED OUT (SOLD OUT) */}
        <button
          onClick={() => setActiveSection('SOLDOUT_CROPS')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeSection === 'SOLDOUT_CROPS'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#4A3525] hover:text-[#2C1D13] hover:bg-[#E5D7C4]'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>✅</span>
            <span>Sold Out</span>
          </div>
          <span className="text-[10px] opacity-90 font-mono">
            ({soldOutFarmerListings.length + soldDeals.length})
          </span>
        </button>

        {/* TAB 4: FOLLOWED MARKETS */}
        <button
          onClick={() => setActiveSection('FOLLOWED_MARKETS')}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
            activeSection === 'FOLLOWED_MARKETS'
              ? 'bg-[#1E7C48] text-white shadow-md'
              : 'text-[#4A3525] hover:text-[#2C1D13] hover:bg-[#E5D7C4]'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>🏛️</span>
            <span>Followed Mandis</span>
          </div>
          <span className="text-[10px] opacity-90 font-mono">
            ({followedMarkets.length})
          </span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: "ACTIVE CROP" (ACTIVE LISTED CROPS WITH NORMAL LITE BROWN DESIGN)
         ========================================================================= */}
      {activeSection === 'ACTIVE_CROPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#2C1D13]">
                {role === 'FARMER' ? `Active Listed Crops (${activeFarmerListings.length})` : `My Procurement Bids (${buyerRequirements.length})`}
              </h2>
              <p className="text-[11px] text-[#6E5544]">
                {role === 'FARMER' ? 'Live harvests ready for buyer booking and mandi sales' : 'Active buying requirements posted across mandis'}
              </p>
            </div>

            {role === 'FARMER' ? (
              <button
                onClick={onOpenSellModal}
                className="min-h-[38px] px-3.5 py-1.5 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Crop</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddReqModal(true)}
                className="min-h-[38px] px-3.5 py-1.5 bg-[#1E7C48] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Post Bid
              </button>
            )}
          </div>

          {/* Farmer Listings: rendered with CropPostCard in normal lite brown */}
          {role === 'FARMER' && (
            <div className="space-y-4">
              {activeFarmerListings.length === 0 ? (
                <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-dashed border-[#D8C7B3] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EDE3D5] text-[#1E7C48] mx-auto flex items-center justify-center border border-[#D8C7B3]">
                    <Video className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-[#6E5544] max-w-xs mx-auto">
                    You currently have no active crop harvests. Upload a crop with quantity and benchmark price to match with buyers.
                  </p>
                  <button
                    onClick={onOpenSellModal}
                    className="min-h-[42px] px-5 py-2 bg-[#1E7C48] text-white font-extrabold rounded-xl text-xs shadow-md"
                  >
                    Upload Active Crop Now
                  </button>
                </div>
              ) : (
                activeFarmerListings.map(listing => (
                  <CropPostCard
                    key={listing.id}
                    listing={listing}
                    role="FARMER"
                    isOwner={true}
                    onOpenVideo={(l) => setActiveVideoListing(l)}
                    onEditPost={(l) => setEditingPost(l)}
                    onSelectListing={(id) => onSelectListing(id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Buyer Requirements */}
          {role === 'BUYER' && (
            <div className="space-y-3">
              {buyerRequirements.length === 0 ? (
                <div className="bg-[#FAF7F2] rounded-3xl p-6 text-center text-xs text-[#6E5544] border border-[#D8C7B3]">
                  No procurement bids posted yet. Click "Post Bid" above.
                </div>
              ) : (
                buyerRequirements.map(req => (
                  <div key={req.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8C7B3] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-[#2C1D13]">
                          {req.cropName} (Grade {req.grade})
                        </span>
                        <p className="text-xs text-[#6E5544]">{req.marketName}</p>
                      </div>
                      <span className="text-base font-black text-[#1E7C48] tabular-nums">
                        ₹{req.buyingPricePerKg}/kg
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6E5544] pt-2 border-t border-[#D8C7B3]">
                      <span>Target: <strong className="tabular-nums text-[#2C1D13]">{req.requiredQuantityKg} kg</strong></span>
                      <span>Pre-booked: <strong className="text-[#1E7C48] tabular-nums">{req.prebookedQuantityKg} kg</strong></span>
                      <span>Remaining: <strong className="text-[#A3661C] tabular-nums">{req.remainingQuantityKg} kg</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: "PREBOOKED CROP" (PRE-BOOKED LOTS & BUYER CONTRACTS)
         ========================================================================= */}
      {activeSection === 'PREBOOKED_CROPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#2C1D13]">
                Pre-booked Crops ({prebookedFarmerListings.length} Lots · {prebookedDeals.length} Orders)
              </h2>
              <p className="text-[11px] text-[#6E5544]">
                Harvests locked by buyers prior to mandi pickup or farm delivery
              </p>
            </div>
          </div>

          {/* Stat Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#FCD34D] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#B45309] uppercase tracking-wider block">
                Total Pre-Booked
              </span>
              <span className="text-lg font-black text-[#B45309] tabular-nums mt-0.5 block">
                {totalPrebookedKg.toLocaleString('en-IN')} kg
              </span>
              <span className="text-[10px] text-[#6E5544]">
                Reserved Volume
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#2C1D13] uppercase tracking-wider block">
                Locked Value
              </span>
              <span className="text-lg font-black text-[#1E7C48] tabular-nums mt-0.5 block">
                ₹{totalPrebookedValue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#1E7C48] font-bold">
                ✓ Price Protected
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#6E5544] uppercase tracking-wider block">
                Active Contracts
              </span>
              <span className="text-lg font-black text-[#2C1D13] tabular-nums mt-0.5 block">
                {prebookedDeals.length} Buyer Orders
              </span>
              <span className="text-[10px] text-[#6E5544]">
                Advance Confirmed
              </span>
            </div>
          </div>

          {/* A. Pre-booked Crop Lots */}
          {role === 'FARMER' && prebookedFarmerListings.length > 0 && (
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-black text-[#4A3525] uppercase tracking-wider flex items-center gap-1.5">
                <span>🌾 Pre-booked Crop Lots ({prebookedFarmerListings.length})</span>
              </h3>
              <div className="space-y-4">
                {prebookedFarmerListings.map(listing => (
                  <CropPostCard
                    key={`prebook-${listing.id}`}
                    listing={listing}
                    role="FARMER"
                    isOwner={true}
                    onOpenVideo={(l) => setActiveVideoListing(l)}
                    onEditPost={(l) => setEditingPost(l)}
                    onSelectListing={(id) => onSelectListing(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* B. Pre-booked Buyer Agreements / Deals */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-[#4A3525] uppercase tracking-wider flex items-center gap-1.5">
              <span>🤝 Confirmed Pre-booking Buyer Contracts ({prebookedDeals.length})</span>
            </h3>

            {prebookedDeals.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#D8C7B3] text-center text-xs text-[#6E5544]">
                No pre-booked contracts at this moment.
              </div>
            ) : (
              prebookedDeals.map(deal => (
                <div
                  key={deal.id}
                  className="bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 border border-[#D8C7B3] shadow-md space-y-3 transition-all hover:border-[#1E7C48]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-[#2C1D13]">
                        {deal.dealCode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FCD34D]">
                        <Clock className="w-3 h-3" /> Pre-Booked Locked
                      </span>
                    </div>

                    <span className="text-[11px] text-[#6E5544]">
                      {new Date(deal.confirmedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3]">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#2C1D13]">
                        {deal.cropName} (Grade {deal.grade})
                      </h4>
                      <p className="text-xs text-[#6E5544] mt-0.5">
                        {role === 'FARMER' ? `Buyer: ${deal.buyerName} (${deal.buyerBusinessName})` : `Farmer: ${deal.farmerName}`}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-[#6E5544] mt-1">
                        <MapPin className="w-3 h-3 text-[#1E7C48] shrink-0" />
                        <span className="truncate">
                          {role === 'FARMER' ? `${deal.buyerLocation.area}, ${deal.buyerLocation.district}` : `${deal.farmerLocation.area}, ${deal.farmerLocation.district}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#1E7C48] tabular-nums block">
                        ₹{deal.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] font-semibold text-[#6E5544]">
                        {deal.quantityKg} kg @ ₹{deal.pricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6E5544] pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#1E7C48]" />
                      <span>Transport Truck Loading Scheduled</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#B45309]">Advance Confirmed</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#D8C7B3]">
                    {onOpenDealChat && (
                      <button
                        onClick={() => onOpenDealChat(deal.id)}
                        className="flex-1 min-h-[36px] bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#D8C7B3] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#1E7C48]" />
                        <span>Chat With Buyer</span>
                      </button>
                    )}

                    <a
                      href={`tel:${role === 'FARMER' ? deal.buyerMobile : deal.farmerMobile}`}
                      className="min-h-[36px] px-3.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#1E7C48] font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#D8C7B3] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => setSelectedReceiptDeal(deal)}
                      className="min-h-[36px] px-3 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#6E5544] font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#D8C7B3] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Agreement</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: "SOLED OUT" (SOLD OUT CROPS & COMPLETED SETTLEMENTS)
         ========================================================================= */}
      {activeSection === 'SOLDOUT_CROPS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#2C1D13]">
                Sold Out Crops ({soldOutFarmerListings.length} Lots · {soldDeals.length} Completed Trades)
              </h2>
              <p className="text-[11px] text-[#6E5544]">
                Completed transactions with electronic mandi scale verification & direct payout
              </p>
            </div>
          </div>

          {/* Stat Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#79C195] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#1E7C48] uppercase tracking-wider block">
                Total Sold
              </span>
              <span className="text-base font-black text-[#1E7C48] tabular-nums mt-0.5 block">
                {totalSoldKg.toLocaleString('en-IN')} kg
              </span>
              <span className="text-[10px] text-[#6E5544]">
                100% Fulfilled
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#2C1D13] uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-base font-black text-[#2C1D13] tabular-nums mt-0.5 block">
                {soldDeals.length} Trades
              </span>
              <span className="text-[10px] text-[#6E5544]">
                Verified Mandi
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
              <span className="text-[10px] font-extrabold text-[#2C1D13] uppercase tracking-wider block">
                Payout Settled
              </span>
              <span className="text-base font-black text-[#1E7C48] tabular-nums mt-0.5 block">
                ₹{totalSoldRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#1E7C48] font-bold">
                ✓ Bank Direct
              </span>
            </div>
          </div>

          {/* A. Sold Out Crop Listings (if any) */}
          {role === 'FARMER' && soldOutFarmerListings.length > 0 && (
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-black text-[#4A3525] uppercase tracking-wider flex items-center gap-1.5">
                <span>🌾 Sold Out Crop Lots ({soldOutFarmerListings.length})</span>
              </h3>
              <div className="space-y-4">
                {soldOutFarmerListings.map(listing => (
                  <CropPostCard
                    key={`sold-${listing.id}`}
                    listing={listing}
                    role="FARMER"
                    isOwner={true}
                    onOpenVideo={(l) => setActiveVideoListing(l)}
                    onEditPost={(l) => setEditingPost(l)}
                    onSelectListing={(id) => onSelectListing(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* B. Completed Sold Deals with Weighslips & Bank Settlements */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-[#4A3525] uppercase tracking-wider flex items-center gap-1.5">
              <span>✅ Delivered & Settled Trades ({soldDeals.length})</span>
            </h3>

            {soldDeals.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#D8C7B3] text-center text-xs text-[#6E5544]">
                No completed trades yet. Once an order is delivered and verified, it will show here.
              </div>
            ) : (
              soldDeals.map(deal => (
                <div
                  key={deal.id}
                  className="bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 border border-[#D8C7B3] shadow-md space-y-3 transition-all hover:border-[#1E7C48]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-[#2C1D13]">
                        {deal.dealCode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
                        <CheckCircle2 className="w-3 h-3" /> Sold & Settled
                      </span>
                    </div>

                    <span className="text-[11px] text-[#6E5544]">
                      {new Date(deal.confirmedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3]">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#2C1D13]">
                        {deal.cropName} (Grade {deal.grade})
                      </h4>
                      <p className="text-xs text-[#6E5544] mt-0.5">
                        {role === 'FARMER' ? `Buyer: ${deal.buyerName} (${deal.buyerBusinessName})` : `Farmer: ${deal.farmerName}`}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-[#6E5544] mt-1">
                        <MapPin className="w-3 h-3 text-[#1E7C48] shrink-0" />
                        <span className="truncate">
                          {role === 'FARMER' ? `${deal.buyerLocation.area}, ${deal.buyerLocation.district}` : `${deal.farmerLocation.area}, ${deal.farmerLocation.district}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-[#1E7C48] tabular-nums block">
                        ₹{deal.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] font-semibold text-[#6E5544]">
                        {deal.quantityKg} kg @ ₹{deal.pricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6E5544] pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#1E7C48]" />
                      <span>Delivered & Mandi Scale Verified</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#A3661C] font-bold">
                      <Star className="w-3 h-3 fill-[#A3661C]" />
                      <span>5.0 Rating</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#D8C7B3]">
                    {onOpenDealChat && (
                      <button
                        onClick={() => onOpenDealChat(deal.id)}
                        className="flex-1 min-h-[36px] bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#D8C7B3] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#1E7C48]" />
                        <span>Chat / History</span>
                      </button>
                    )}

                    <a
                      href={`tel:${role === 'FARMER' ? deal.buyerMobile : deal.farmerMobile}`}
                      className="min-h-[36px] px-3.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#1E7C48] font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#D8C7B3] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <button
                      onClick={() => setSelectedReceiptDeal(deal)}
                      className="min-h-[36px] px-3 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#6E5544] font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-[#D8C7B3] transition-colors"
                      title="View Mandi Weighslip Receipt"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mandi Receipt</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: "FOLLOWED MARKETS" (FOLLOWED APMC MANDIS)
         ========================================================================= */}
      {activeSection === 'FOLLOWED_MARKETS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#2C1D13]">
                My Followed APMC Mandis ({followedMarkets.length})
              </h2>
              <p className="text-[11px] text-[#6E5544]">
                Live arrivals, today's rates, and 1-hour fast slot requests
              </p>
            </div>

            {onNavigateToMarkets && (
              <button
                onClick={onNavigateToMarkets}
                className="text-xs font-bold text-[#1E7C48] hover:underline flex items-center gap-1"
              >
                <span>All Mandis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Followed Mandis List */}
          <div className="space-y-3.5">
            {followedMarkets.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#D8C7B3] text-center space-y-3">
                <Building2 className="w-10 h-10 text-[#8C5E3C] mx-auto opacity-70" />
                <p className="text-xs text-[#6E5544] max-w-xs mx-auto">
                  You are not following any mandis yet. Follow markets below to get real-time price alerts and send direct slot requests.
                </p>
              </div>
            ) : (
              followedMarkets.map(market => (
                <div
                  key={market.id}
                  className="bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 border border-[#D8C7B3] shadow-md space-y-3.5 transition-all hover:border-[#1E7C48]"
                >
                  {/* Top Market Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-extrabold text-[#2C1D13] tracking-tight truncate">
                          {market.marketName}
                        </h3>
                        {market.verifiedAPMC && (
                          <span className="text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                            APMC Mandi
                          </span>
                        )}
                      </div>

                      {market.localName && (
                        <p className="text-xs font-semibold text-[#1E7C48]">
                          {market.localName}
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-[#6E5544] pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
                        <span>{market.area}, {market.district}</span>
                        <span>•</span>
                        <span className="text-[#4A3525] font-semibold">{market.distanceKm} km away</span>
                      </div>
                    </div>

                    {/* Following Star Toggle */}
                    <button
                      onClick={() => toggleFollowMarket(market.id)}
                      className="min-h-[34px] px-3 rounded-full text-xs font-extrabold flex items-center gap-1.5 shrink-0 bg-[#FDF2E2] text-[#A3661C] border border-[#E2BA7C] shadow-2xs hover:bg-[#FBE9CE] transition-all"
                    >
                      <Star className="w-3.5 h-3.5 fill-[#A3661C] text-[#A3661C]" />
                      <span>Following</span>
                    </button>
                  </div>

                  {/* Bulletin Banner */}
                  {market.bulletin && (
                    <div className="bg-[#EDE3D5] p-2.5 rounded-xl border border-[#D8C7B3] text-xs text-[#6E5544] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#1E7C48] shrink-0" />
                      <span className="truncate">{market.bulletin}</span>
                    </div>
                  )}

                  {/* 2x2 Grid of Crop Prices in this Mandi */}
                  <div>
                    <h4 className="text-[10px] font-extrabold text-[#6E5544] tracking-wider uppercase mb-1.5">
                      Live Mandi Rates Today:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {market.cropPrices.slice(0, 4).map(c => {
                        const delta = c.pricePerKg - c.yesterdayPrice;
                        return (
                          <div
                            key={c.cropId}
                            className="bg-[#EDE3D5] p-2.5 rounded-xl border border-[#D8C7B3] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{c.cropIcon}</span>
                              <div>
                                <span className="text-xs font-bold text-[#2C1D13] block leading-tight">{c.cropName}</span>
                                <span className="text-[10px] text-[#6E5544]">Grade {c.grade}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-black text-[#1E7C48] tabular-nums block">
                                ₹{c.pricePerKg}/kg
                              </span>
                              <span className={`text-[10px] font-bold ${delta >= 0 ? 'text-[#1E7C48]' : 'text-red-600'}`}>
                                {delta >= 0 ? `+₹${delta}` : `-₹${Math.abs(delta)}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Bar: Request to Market (1-Hour Limit) */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#D8C7B3]">
                    <button
                      onClick={() => setRequestingMarket(market)}
                      className="flex-1 min-h-[38px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request to Market (1-Hr Limit)</span>
                    </button>

                    {onNavigateToMarkets && (
                      <button
                        onClick={onNavigateToMarkets}
                        className="min-h-[38px] px-3.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#4A3525] rounded-xl text-xs font-bold border border-[#D8C7B3] transition-colors"
                      >
                        View Rates
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Suggested Mandis to Follow */}
          {suggestedMarkets.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-extrabold text-[#4A3525] uppercase tracking-wider">
                Suggested Mandis Nearby:
              </h3>
              <div className="space-y-2">
                {suggestedMarkets.map(m => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#D8C7B3] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <span className="text-xs font-extrabold text-[#2C1D13] block">
                        {m.marketName}
                      </span>
                      <span className="text-[11px] text-[#6E5544]">
                        {m.district}, {m.state} · {m.distanceKm} km away
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFollowMarket(m.id)}
                      className="min-h-[32px] px-3 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PREFERENCES & NETWORK SETTINGS CARD */}
      <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#D8C7B3] shadow-md space-y-4">
        <h2 className="text-sm font-extrabold text-[#2C1D13]">
          Preferences & Network Settings
        </h2>

        {/* Language selector */}
        <div className="flex items-center justify-between py-2 border-b border-[#D8C7B3]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#8C5E3C]" />
            <span className="text-xs font-semibold text-[#4A3525]">{t.selectLanguage}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#EDE3D5] p-1 rounded-xl border border-[#D8C7B3]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
                language === 'en' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
                language === 'te' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
                language === 'hi' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Low Connectivity Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#8C5E3C]" />
            <div>
              <span className="text-xs font-semibold text-[#2C1D13] block">{t.offlineMode}</span>
              <span className="text-[11px] text-[#6E5544]">Pre-caches Mandi prices for rural 2G speeds</span>
            </div>
          </div>

          <button
            onClick={() => setLowConnectivityMode(!lowConnectivityMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              lowConnectivityMode ? 'bg-[#1E7C48]' : 'bg-[#D8C7B3]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                lowConnectivityMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODALS & OVERLAYS
         ========================================================================= */}

      {/* Modal 1: Edit Post Modal (Farmer edits post details) */}
      {editingPost && (
        <EditListingModal
          listing={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Modal 2: Market Request Modal (Farmer requests slot to followed mandi) */}
      {requestingMarket && (
        <MarketRequestModal
          market={requestingMarket}
          onClose={() => setRequestingMarket(null)}
        />
      )}


      {/* Modal 4: Digital Receipt / Mandi Bill Popup */}
      {selectedReceiptDeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#D8C7B3] space-y-4 text-[#2C1D13]">
            <div className="flex items-center justify-between border-b border-[#D8C7B3] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E7C48]" />
                <h3 className="text-base font-black">Digital Mandi Weighslip</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptDeal(null)}
                className="text-[#8C5E3C] hover:text-[#2C1D13]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#EDE3D5] p-3.5 rounded-2xl border border-[#D8C7B3] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6E5544]">Deal Code:</span>
                <span className="font-mono font-black">{selectedReceiptDeal.dealCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5544]">Crop & Grade:</span>
                <span className="font-bold">{selectedReceiptDeal.cropName} (Grade {selectedReceiptDeal.grade})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5544]">Net Weight:</span>
                <span className="font-bold text-[#1E7C48]">{selectedReceiptDeal.quantityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5544]">Mandi Rate:</span>
                <span className="font-bold">₹{selectedReceiptDeal.pricePerKg}/kg</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D8C7B3] text-sm">
                <span className="font-black">Total Payout:</span>
                <span className="font-black text-[#1E7C48]">₹{selectedReceiptDeal.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#6E5544] text-center italic">
              Verified by APMC Electronic Weighbridge & TradeBridge Escrow
            </div>

            <button
              onClick={() => setSelectedReceiptDeal(null)}
              className="w-full min-h-[42px] bg-[#1E7C48] text-white font-extrabold rounded-xl text-xs shadow-md"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Buyer Post Procurement Bid */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#EDE3D5] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#D8C7B3] space-y-4 text-[#2C1D13]">
            <h3 className="text-base font-extrabold text-[#2C1D13]">
              Publish New Crop Procurement Bid
            </h3>

            <form onSubmit={handleCreateRequirement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">Crop</label>
                <select
                  value={newCropId}
                  onChange={e => setNewCropId(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold"
                >
                  {INITIAL_CROPS.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#FAF7F2] text-[#2C1D13]">{c.nameKey}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">Buying Price (₹/kg)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  required
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">Required Quantity (kg)</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={e => setNewQty(Number(e.target.value))}
                  required
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Crate transport required, cash at scale"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs placeholder-[#917765]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="flex-1 min-h-[44px] bg-[#FAF7F2] hover:bg-[#E8DFD2] text-[#4A3525] rounded-xl text-xs font-semibold border border-[#D8C7B3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] bg-[#1E7C48] hover:bg-[#165f37] text-white font-extrabold rounded-xl text-xs shadow-md"
                >
                  Publish Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN REALISTIC CROP VIDEO INSPECTION MODAL */}
      <CropVideoModal
        listing={activeVideoListing}
        isOpen={!!activeVideoListing}
        onClose={() => setActiveVideoListing(null)}
      />
    </div>
  );
};
