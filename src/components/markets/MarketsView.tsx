import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { INITIAL_MARKET_HUBS, INITIAL_CROPS } from '../../data/initialData';
import { MarketHub, SingleMarketCropPrice, QualityGradeCode } from '../../types/marketplace';
import { formatCountdown } from '../../utils/matchingEngine';
import { MarketRequestModal } from './MarketRequestModal';
import { MarketHistoryGraph } from './MarketHistoryGraph';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Calendar,
  Building2,
  Scale,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

export const MarketsView: React.FC = () => {
  const { requirements, marketRequests, followedMarketIds, toggleFollowMarket } = useMarketplace();
  const { language, currentUser } = useAuth();
  const t = TRANSLATIONS[language];

  // Tick state to update live countdown timers every second
  const [tick, setTick] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'HIGH_DEMAND' | 'DISTRICT' | 'FOLLOWING'>('ALL');

  // Market Request Modal States (Directly requested: farmer satisfied with price -> send request)
  const [requestingMarket, setRequestingMarket] = useState<MarketHub | null>(null);
  const [requestCropId, setRequestCropId] = useState<string | undefined>(undefined);
  const [requestPrice, setRequestPrice] = useState<number | undefined>(undefined);
  const [requestGrade, setRequestGrade] = useState<QualityGradeCode | undefined>(undefined);

  const handleOpenMarketRequest = (
    market: MarketHub,
    cropId?: string,
    price?: number,
    grade?: QualityGradeCode
  ) => {
    setRequestingMarket(market);
    setRequestCropId(cropId);
    setRequestPrice(price);
    setRequestGrade(grade);
  };

  // Inspected Market for "View Details & Price History"
  const [inspectedMarket, setInspectedMarket] = useState<MarketHub | null>(null);

  // Inspected crop within the detailed view
  const [inspectedCropId, setInspectedCropId] = useState<string>('crop-tomato');
  const [chartMode, setChartMode] = useState<'PRICE' | 'VOLUME'>('PRICE');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Filtered Markets Calculation
  const filteredMarkets = INITIAL_MARKET_HUBS.filter(hub => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = hub.marketName.toLowerCase().includes(q) || 
                          (hub.localName && hub.localName.toLowerCase().includes(q)) ||
                          hub.district.toLowerCase().includes(q) ||
                          hub.state.toLowerCase().includes(q);
      const matchesCrop = hub.cropPrices.some(c => c.cropName.toLowerCase().includes(q));
      if (!matchesName && !matchesCrop) return false;
    }

    // 2. Crop Filter Pill
    if (selectedCropFilter !== 'ALL') {
      const hasCrop = hub.cropPrices.some(c => c.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase()));
      if (!hasCrop) return false;
    }

    // 3. Category Filter Pill
    if (selectedCategoryFilter === 'HIGH_DEMAND') {
      if (!hub.highDemand) return false;
    } else if (selectedCategoryFilter === 'DISTRICT') {
      const userDistrict = currentUser?.location?.district?.toLowerCase() || 'chittoor';
      if (!hub.district.toLowerCase().includes(userDistrict)) return false;
    } else if (selectedCategoryFilter === 'FOLLOWING') {
      if (!followedMarketIds.includes(hub.id)) return false;
    }

    return true;
  });

  // Crop filter pill items
  const cropFilterPills = [
    { id: 'ALL', label: 'All Crops', icon: '🌾' },
    { id: 'Tomato', label: 'Tomato', icon: '🍅' },
    { id: 'Onion', label: 'Onion', icon: '🧅' },
    { id: 'Chilli', label: 'Red Chilli', icon: '🌶️' },
    { id: 'Potato', label: 'Potato', icon: '🥔' },
    { id: 'Wheat', label: 'Wheat', icon: '🌾' },
    { id: 'Maize', label: 'Maize', icon: '🌽' },
    { id: 'Cotton', label: 'Cotton', icon: '☁️' },
    { id: 'Turmeric', label: 'Turmeric', icon: '🟡' },
    { id: 'Garlic', label: 'Garlic', icon: '🧄' },
    { id: 'Ginger', label: 'Ginger', icon: '🫚' },
    { id: 'Mango', label: 'Mango', icon: '🥭' }
  ];

  // Market Category filter pills
  const marketCategoryPills = [
    { id: 'ALL', label: 'All Markets', icon: null },
    { id: 'HIGH_DEMAND', label: 'High Demand', icon: '🔥' },
    { id: 'DISTRICT', label: 'In My District', icon: '📍' },
    { id: 'FOLLOWING', label: 'Following', icon: '⭐' }
  ];

  // Deep dive calculations for inspected market
  const selectedCropPriceInfo: SingleMarketCropPrice | undefined = inspectedMarket
    ? inspectedMarket.cropPrices.find(c => c.cropId === inspectedCropId) || inspectedMarket.cropPrices[0]
    : undefined;

  const historyPrices = selectedCropPriceInfo ? selectedCropPriceInfo.thirtyDayTrend.map(p => p.price) : [];
  const minPrice30D = historyPrices.length > 0 ? Math.min(...historyPrices) : 0;
  const maxPrice30D = historyPrices.length > 0 ? Math.max(...historyPrices) : 0;
  const avgPrice30D = historyPrices.length > 0 
    ? Math.round((historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length) * 10) / 10 
    : 0;
  const monthDelta = selectedCropPriceInfo && historyPrices.length > 0 
    ? selectedCropPriceInfo.pricePerKg - historyPrices[0] 
    : 0;

  const inspectedDay = selectedCropPriceInfo && (hoveredDayIndex !== null 
    ? selectedCropPriceInfo.thirtyDayTrend[hoveredDayIndex] 
    : selectedCropPriceInfo.thirtyDayTrend[selectedCropPriceInfo.thirtyDayTrend.length - 1]);

  // Buyer requirements operating in the inspected market
  const inspectedMarketBuyers = inspectedMarket 
    ? requirements.filter(r => 
        r.marketName.toLowerCase().includes(inspectedMarket.area.toLowerCase()) ||
        r.marketName.toLowerCase().includes(inspectedMarket.district.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#2C1D13] px-3.5 py-4 space-y-4 pb-24">
      {/* =========================================================================
          VIEW A: MAIN MARKET BROWSER (LIGHT BROWN THEME)
         ========================================================================= */}
      {!inspectedMarket ? (
        <div className="space-y-3.5">
          {/* ACTIVE MANDI SLOT REQUESTS BANNER (1-Hour Time Limit Window) */}
          {marketRequests && marketRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#79C195] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E7C48] animate-pulse" />
                  <h3 className="text-xs font-black text-[#2C1D13] uppercase tracking-wider">
                    Your Active Mandi Slot Requests ({marketRequests.filter(r => r.status === 'PENDING').length})
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
                  ⏱️ 1-Hour Time Limit
                </span>
              </div>

              <div className="space-y-2">
                {marketRequests.filter(r => r.status === 'PENDING').map(req => {
                  const msLeft = req.expiresAt - tick;
                  const { formatted, isUrgent, isCritical } = formatCountdown(msLeft);

                  return (
                    <div
                      key={req.id}
                      className="bg-[#EDE3D5] rounded-2xl p-3 border border-[#D8C7B3] flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-[#2C1D13]">{req.marketName}</span>
                          <span className="text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-1.5 py-0.2 rounded border border-[#79C195]">
                            Grade {req.grade}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6E5544] mt-0.5">
                          {req.quantityKg} kg {req.cropName} · Accepted Mandi Price: <strong>₹{req.acceptedPricePerKg}/kg</strong> (Total: ₹{req.totalAmount.toLocaleString('en-IN')})
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-mono font-black block ${
                          isCritical ? 'text-red-600 animate-pulse' : isUrgent ? 'text-orange-600' : 'text-[#1E7C48]'
                        }`}>
                          ⏱️ {formatted}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8C5E3C]">
                          Awaiting Mandi Slot
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 1. TOP SEARCH INPUT PILL */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#8C5E3C]" />
            </div>
            <input
              type="text"
              placeholder="Search markets or crops (Tomato, Wheat, Onion)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full min-h-[46px] pl-10 pr-4 bg-[#FAF7F2] text-[#2C1D13] placeholder-[#917765] text-xs rounded-full border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48] transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7A6453] hover:text-[#2C1D13]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 2. FIRST FILTER STRIP: CROP FILTER PILLS (HORIZONTAL SCROLL) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {cropFilterPills.map(pill => {
              const isActive = selectedCropFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCropFilter(pill.id)}
                  className={`min-h-[36px] px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#1E7C48] text-white font-extrabold shadow-sm'
                      : 'bg-[#EDE3D5] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                  }`}
                >
                  <span className="text-sm">{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. SECOND FILTER STRIP: MARKET CATEGORY PILLS (HORIZONTAL SCROLL) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {marketCategoryPills.map(pill => {
              const isActive = selectedCategoryFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategoryFilter(pill.id as any)}
                  className={`min-h-[34px] px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#A3661C] text-white font-extrabold shadow-sm'
                      : 'bg-[#EDE3D5] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                  }`}
                >
                  <span>{pill.label}</span>
                  {pill.icon && <span>{pill.icon}</span>}
                </button>
              );
            })}
          </div>

          {/* 4. MARKET CARDS LISTING (EXACT CARD DESIGN FROM USER SCREENSHOT) */}
          <div className="space-y-4 pt-1">
            {filteredMarkets.length === 0 ? (
              <div className="bg-[#EDE3D5] rounded-3xl p-8 text-center space-y-2 border border-[#D8C7B3]">
                <Search className="w-8 h-8 text-[#8C5E3C] mx-auto" />
                <p className="text-sm font-bold text-[#2C1D13]">No markets found</p>
                <p className="text-xs text-[#6E5544]">
                  Try adjusting your search query or crop filter.
                </p>
              </div>
            ) : (
              filteredMarkets.map(market => {
                const isFollowing = followedMarketIds.includes(market.id);

                return (
                  <div
                    key={market.id}
                    className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#D8C7B3] shadow-md space-y-3.5"
                  >
                    {/* Header Row: Market Name, Telugu Local Subname, Location, and Following Button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        {/* Market English Name */}
                        <h2 className="text-base font-extrabold text-[#2C1D13] tracking-tight truncate">
                          {market.marketName}
                        </h2>

                        {/* Local Telugu/Regional Language Subtitle */}
                        {market.localName && (
                          <p className="text-xs font-semibold text-[#1E7C48] tracking-wide">
                            {market.localName}
                          </p>
                        )}

                        {/* Location Details with commodities count */}
                        <div className="flex items-center gap-1.5 text-xs text-[#6E5544] pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
                          <span className="truncate">
                            {market.district}, {market.state}
                          </span>
                          <span>•</span>
                          <span className="text-[#4A3525] font-semibold shrink-0">
                            {market.cropPrices.length} Commodities
                          </span>
                        </div>
                      </div>

                      {/* Golden Star Following Button */}
                      <button
                        onClick={() => toggleFollowMarket(market.id)}
                        className={`min-h-[34px] px-3 rounded-full text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
                          isFollowing
                            ? 'bg-[#FDF2E2] text-[#A3661C] border border-[#E2BA7C] shadow-2xs'
                            : 'bg-[#EDE3D5] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-[#A3661C] text-[#A3661C]' : 'text-[#8C5E3C]'}`} />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </button>
                    </div>

                    {/* Section Label: CROPS BUYING IN THIS MANDI */}
                    <div className="pt-1">
                      <h3 className="text-[11px] font-extrabold text-[#6E5544] tracking-wider uppercase">
                        CROPS BUYING IN THIS MANDI:
                      </h3>
                    </div>

                    {/* 2x2 Grid of Crop Price Boxes */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {market.cropPrices.slice(0, 4).map(crop => {
                        const openQty = crop.openQuantityKg || Math.max(2500, crop.dailyArrivalsKg - crop.prebookedKg);

                        return (
                          <div
                            key={crop.cropId}
                            className="bg-[#EDE3D5] rounded-2xl p-3 border border-[#D8C7B3] space-y-1.5 transition-colors hover:border-[#1E7C48]"
                          >
                            {/* Top Row: Crop Name & Current Price */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-extrabold text-[#2C1D13] truncate">
                                {crop.cropName}
                              </span>
                              <span className="text-sm font-black text-[#1E7C48] tabular-nums shrink-0">
                                ₹{crop.pricePerKg}/kg
                              </span>
                            </div>

                            {/* Bottom Row: Grade, Open Quantity, & Quick Request */}
                            <div className="flex items-center justify-between gap-1 text-xs pt-0.5">
                              <span className="text-[#6E5544] font-medium text-[11px]">
                                Grade {crop.grade} · {openQty.toLocaleString('en-IN')} kg
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenMarketRequest(market, crop.cropId, crop.pricePerKg, crop.grade);
                                }}
                                className="text-[10px] font-black text-[#1E7C48] bg-[#FAF7F2] hover:bg-[#E1F2E7] px-2 py-0.5 rounded-lg border border-[#79C195] flex items-center gap-1 transition-colors shrink-0"
                                title="Request slot for this crop"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Request</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Market Bulletin Pill */}
                    <div className="bg-[#EDE3D5] rounded-2xl p-2.5 border border-[#D8C7B3] flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-[#1E7C48] shrink-0" />
                      <p className="text-[#6E5544] truncate text-[11px]">
                        <strong className="text-[#2C1D13]">Bulletin:</strong> {market.bulletin || `High Demand: ${market.cropPrices[0]?.cropName} Grade A needed for wholesale supply.`}
                      </p>
                    </div>

                    {/* REQUEST TO MARKET: FARMER SATISFIED WITH PRICE -> SENDS REQUEST (1-HOUR LIMIT) */}
                    <button
                      type="button"
                      onClick={() => handleOpenMarketRequest(market)}
                      className="w-full min-h-[44px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Request to Market (Satisfied with Price · 1-Hr Limit)</span>
                    </button>

                    {/* View Details & Daily Price Graph Action Link */}
                    <button
                      type="button"
                      onClick={() => {
                        setInspectedMarket(market);
                        setInspectedCropId(market.cropPrices[0]?.cropId || 'crop-tomato');
                        setHoveredDayIndex(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full min-h-[44px] bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-[#D8C7B3] active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      <TrendingUp className="w-4 h-4 text-[#1E7C48]" />
                      <span>View Daily Price Graph & History (Every Day)</span>
                      <ChevronRight className="w-4 h-4 text-[#1E7C48]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW B: DETAILED APMC DEEP DIVE & 30-DAY PRICE / VOLUME HISTORY
           ========================================================================= */
        <div className="space-y-4 animate-in fade-in">
          {/* Back Button */}
          <button
            onClick={() => setInspectedMarket(null)}
            className="min-h-[40px] px-3.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#D8C7B3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#1E7C48]" />
            <span>Back to All Markets</span>
          </button>

          {/* Inspected Market Header Banner */}
          <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#D8C7B3] shadow-md space-y-3 text-[#2C1D13]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-extrabold text-[#2C1D13]">
                  {inspectedMarket.marketName}
                </h1>
                {inspectedMarket.localName && (
                  <p className="text-xs font-semibold text-[#1E7C48] mt-0.5">
                    {inspectedMarket.localName}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#6E5544] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
                  <span>{inspectedMarket.area}, {inspectedMarket.district}, {inspectedMarket.state}</span>
                  <span>•</span>
                  <span className="text-[#4A3525] font-semibold">{inspectedMarket.distanceKm} km away</span>
                </div>
              </div>

              {inspectedMarket.verifiedAPMC && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-1 rounded-full border border-[#79C195]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  APMC Licensed
                </span>
              )}
            </div>

            {/* Daily Inflow & Pre-Booking Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-center text-xs">
              <div>
                <span className="text-[10px] text-[#6E5544] uppercase font-bold block flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3 text-[#1E7C48]" /> Daily Import
                </span>
                <span className="text-sm font-black text-[#2C1D13] tabular-nums">
                  {inspectedMarket.dailyTotalImportTons} Tons
                </span>
                <span className="text-[10px] text-[#8C5E3C] block">
                  Arrivals today
                </span>
              </div>

              <div className="bg-[#FAF7F2] rounded-xl py-1 border border-[#79C195]">
                <span className="text-[10px] text-[#1E7C48] uppercase font-bold block flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#1E7C48]" /> Pre-Booked
                </span>
                <span className="text-sm font-black text-[#1E7C48] tabular-nums">
                  {(inspectedMarket.totalPrebookedKg / 1000).toFixed(1)} Tons
                </span>
                <span className="text-[10px] text-[#1E7C48] font-semibold block">
                  {Math.round((inspectedMarket.totalPrebookedKg / (inspectedMarket.dailyTotalImportTons * 1000)) * 100)}% pre-booked
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#A3661C] uppercase font-bold block flex items-center justify-center gap-1">
                  <Scale className="w-3 h-3 text-[#A3661C]" /> Open Spot
                </span>
                <span className="text-sm font-black text-[#A3661C] tabular-nums">
                  {(inspectedMarket.dailyTotalImportTons - inspectedMarket.totalPrebookedKg / 1000).toFixed(1)} Tons
                </span>
                <span className="text-[10px] text-[#8C5E3C] block">
                  Open for buying
                </span>
              </div>
            </div>

            {/* DIRECT REQUEST TO MARKET BUTTON (1-HOUR LIMIT) */}
            <button
              type="button"
              onClick={() => handleOpenMarketRequest(
                inspectedMarket,
                inspectedCropId,
                selectedCropPriceInfo?.pricePerKg,
                selectedCropPriceInfo?.grade
              )}
              className="w-full min-h-[46px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Slot Request to {inspectedMarket.marketName} (1-Hour Limit)</span>
            </button>
          </div>

          {/* Commodity Selector Pills for This Mandi */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-[#4A3525] uppercase tracking-wide">
              Select Commodity to Inspect 30-Day History:
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {inspectedMarket.cropPrices.map(crop => {
                const isSelected = crop.cropId === inspectedCropId;
                return (
                  <button
                    key={crop.cropId}
                    onClick={() => {
                      setInspectedCropId(crop.cropId);
                      setHoveredDayIndex(null);
                    }}
                    className={`min-h-[38px] px-3.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#1E7C48] text-white font-extrabold shadow-sm'
                        : 'bg-[#EDE3D5] text-[#4A3525] border border-[#D8C7B3] hover:text-[#2C1D13]'
                    }`}
                  >
                    <span>{crop.cropIcon}</span>
                    <span>{crop.cropName}</span>
                    <span className="opacity-80">₹{crop.pricePerKg}/kg</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 30-Day History Visual Inspection & Every-Single-Day Graph & Ledger */}
          {selectedCropPriceInfo && inspectedMarket && (
            <MarketHistoryGraph
              cropName={selectedCropPriceInfo.cropName}
              cropIcon={selectedCropPriceInfo.cropIcon}
              marketName={inspectedMarket.marketName}
              data={selectedCropPriceInfo.thirtyDayTrend as any}
              currentPrice={selectedCropPriceInfo.pricePerKg}
            />
          )}

          {/* Verified Buyers Procuring in This Mandi */}
          {inspectedMarketBuyers.length > 0 && (
            <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#D8C7B3] shadow-md space-y-3 text-[#2C1D13]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#1E7C48]" />
                  <h3 className="text-xs font-bold text-[#2C1D13] uppercase tracking-wide">
                    Verified Buyers at {inspectedMarket.marketName.split(' ')[0]}
                  </h3>
                </div>
                <span className="text-[10px] text-[#6E5544] font-semibold">
                  {inspectedMarketBuyers.length} Demands
                </span>
              </div>

              <div className="space-y-2">
                {inspectedMarketBuyers.map(demand => (
                  <div
                    key={demand.id}
                    className="p-3 bg-[#EDE3D5] rounded-2xl border border-[#D8C7B3] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-[#2C1D13]">{demand.cropName} (Gr {demand.grade})</span>
                        <p className="text-[11px] text-[#6E5544]">{demand.businessName}</p>
                      </div>
                      <span className="font-black text-[#1E7C48] text-sm tabular-nums">
                        ₹{demand.buyingPricePerKg}/kg
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#4A3525] pt-1">
                      <span>Target: <strong className="text-[#2C1D13]">{demand.requiredQuantityKg} kg</strong></span>
                      <span>Prebooked: <strong className="text-[#1E7C48]">{demand.prebookedQuantityKg} kg</strong></span>
                      <span>Remaining: <strong className="text-[#A3661C]">{demand.remainingQuantityKg} kg</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MARKET REQUEST MODAL (FARMER SATISFIED WITH PRICE -> 1-HOUR TIME LIMIT) */}
      {requestingMarket && (
        <MarketRequestModal
          market={requestingMarket}
          initialCropId={requestCropId}
          initialPrice={requestPrice}
          initialGrade={requestGrade}
          onClose={() => setRequestingMarket(null)}
        />
      )}
    </div>
  );
};
