import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { CropListing } from '../../types/marketplace';
import { INITIAL_CROPS } from '../../data/initialData';
import { EditListingModal } from './EditListingModal';
import { CropPostCard } from './CropPostCard';
import { CropVideoModal } from './CropVideoModal';
import {
  Plus,
  TrendingUp,
  MapPin,
  Video,
  Play,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Layers,
  Filter,
  Pencil
} from 'lucide-react';

interface HomeViewProps {
  onOpenSellModal: () => void;
  onOpenMatchingBuyers: (listingId: string) => void;
  onNavigateToMarkets: () => void;
  onDealConfirmed: (dealId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenSellModal,
  onOpenMatchingBuyers
}) => {
  const { listings, marketPrices, updateListing, createBuyerRequest } = useMarketplace();
  const { currentUser, role, language } = useAuth();
  const t = TRANSLATIONS[language];

  // Farmer listings vs All available listings for Buyers
  const farmerListings = listings.filter(l => l.farmerId === currentUser.id);
  const allAvailableListings = listings.filter(l => l.availableQuantityKg > 0);

  // States for Crop selection, category filters, and interactive Quality Grades
  const [selectedCropId, setSelectedCropId] = useState<string>('crop-tomato');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL'); // 'ALL' | 'A' | 'B' | 'C'
  const [cropCategory, setCropCategory] = useState<string>('ALL');
  const [cropSearch, setCropSearch] = useState<string>('');
  const [showAllCropsGrid, setShowAllCropsGrid] = useState<boolean>(false);

  // State for Farmer editing uploaded post
  const [editingPost, setEditingPost] = useState<CropListing | null>(null);

  // Filtered crops for selection
  const filteredCrops = INITIAL_CROPS.filter(crop => {
    const matchCat = cropCategory === 'ALL' || crop.category.toLowerCase().includes(cropCategory.toLowerCase());
    const matchSearch = !cropSearch.trim() || crop.nameKey.toLowerCase().includes(cropSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered listings based on selected crop AND selected grade
  const displayedFarmerListings = farmerListings.filter(l => {
    const matchCrop = selectedCropId === 'ALL' || l.cropId === selectedCropId;
    const matchGrade = selectedGrade === 'ALL' || l.grade === selectedGrade;
    return matchCrop && matchGrade;
  });

  const displayedAvailableListings = allAvailableListings.filter(l => {
    const matchCrop = selectedCropId === 'ALL' || l.cropId === selectedCropId;
    const matchGrade = selectedGrade === 'ALL' || l.grade === selectedGrade;
    return matchCrop && matchGrade;
  });

  const activeCropForGrades = INITIAL_CROPS.find(c => c.id === selectedCropId) || INITIAL_CROPS[0];
  const activeGradeObj = activeCropForGrades.grades.find(g => g.code === selectedGrade);

  // States for Farmer editing expected price
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [tempExpectedPrice, setTempExpectedPrice] = useState<number>(0);

  // States for Buyer sending request to farmer
  const [targetListingForBuyer, setTargetListingForBuyer] = useState<CropListing | null>(null);
  const [buyerReqQty, setBuyerReqQty] = useState<number>(300);
  const [buyerOfferedPrice, setBuyerOfferedPrice] = useState<number>(26);
  const [buyerNotes, setBuyerNotes] = useState<string>('');
  const [buyerRequestSuccessMsg, setBuyerRequestSuccessMsg] = useState<string | null>(null);

  // Full-screen realistic video inspection modal
  const [activeVideoListing, setActiveVideoListing] = useState<CropListing | null>(null);

  // Helper to find market modal rate for a crop
  const getMarketRateForCrop = (cropId: string): number => {
    const prices = marketPrices.filter(p => p.cropId === cropId);
    if (prices.length === 0) return 25;
    const avg = prices.reduce((sum, p) => sum + p.currentPricePerKg, 0) / prices.length;
    return Math.round(avg * 10) / 10;
  };

  const handleSaveExpectedPrice = (listingId: string) => {
    if (tempExpectedPrice > 0) {
      updateListing(listingId, { expectedPricePerKg: tempExpectedPrice });
      setEditingListingId(null);
    }
  };

  const handleOpenBuyerRequestModal = (listing: CropListing) => {
    setTargetListingForBuyer(listing);
    setBuyerReqQty(Math.min(listing.availableQuantityKg, 500));
    setBuyerOfferedPrice(listing.expectedPricePerKg ? listing.expectedPricePerKg + 2 : 26);
    setBuyerNotes('');
    setBuyerRequestSuccessMsg(null);
  };

  const handleSendBuyerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetListingForBuyer) return;

    const res = createBuyerRequest(
      targetListingForBuyer.id,
      buyerReqQty,
      buyerOfferedPrice,
      buyerNotes
    );

    if (res.success) {
      setBuyerRequestSuccessMsg(res.message);
      setTimeout(() => {
        setTargetListingForBuyer(null);
        setBuyerRequestSuccessMsg(null);
      }, 1800);
    }
  };

  // Categories list
  const categories = [
    { id: 'ALL', label: 'All Crops' },
    { id: 'Vegetables', label: 'Vegetables' },
    { id: 'Fruits', label: 'Fruits' },
    { id: 'Cereals', label: 'Cereals & Grains' },
    { id: 'Spices', label: 'Spices' },
    { id: 'Oilseeds', label: 'Oilseeds' }
  ];

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#2C1D13] px-3.5 py-4 space-y-4 pb-20">
      {/* 1. TOP BANNER: USER IDENTITY & CROP NAMES AND GRADES (Light Brown Theme) */}
      <div className="bg-[#EDE3D5] text-[#2C1D13] rounded-3xl p-4 shadow-md border border-[#D8C7B3] space-y-3.5">
        {/* User Identity & Location Header */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#1E7C48] font-extrabold uppercase tracking-wider bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
              {role === 'FARMER' ? '🌾 Farmer Dashboard' : '🏢 Buyer Procurement Hub'}
            </span>
            <h1 className="text-base font-extrabold tracking-tight text-[#2C1D13] mt-1.5">
              {role === 'FARMER' ? t.welcomeFarmer : t.welcomeBuyer}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#6E5544] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
              <span>{currentUser.location?.area}, {currentUser.location?.district}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#8C5E3C] font-semibold uppercase tracking-wider block">AGMARK Certified</span>
            <div className="flex items-center gap-1 text-xs font-black text-[#1E7C48] justify-end mt-0.5">
              <Award className="w-3.5 h-3.5" />
              <span>Quality Standards</span>
            </div>
          </div>
        </div>

        {/* CROP NAMES & QUALITY GRADES SHOWCASE (In Light Brown Theme) */}
        <div className="bg-[#E5D7C4] rounded-2xl p-3 border border-[#D2BFAB] space-y-2.5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E7C48] animate-pulse"></span>
              <span className="text-xs font-black text-[#2C1D13]">
                Crops & Quality Grades ({INITIAL_CROPS.length} Crops Available)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAllCropsGrid(!showAllCropsGrid)}
                className="text-[11px] font-bold text-[#1E7C48] bg-[#F5EFEB] hover:bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#D2BFAB] flex items-center gap-1 transition-all"
              >
                <Layers className="w-3 h-3" />
                <span>{showAllCropsGrid ? 'Scroll View' : 'All Crops Grid'}</span>
              </button>
              {selectedCropId !== 'ALL' && (
                <button
                  onClick={() => setSelectedCropId('ALL')}
                  className="text-[11px] font-bold text-[#8C5E3C] hover:text-[#1E7C48] transition-colors"
                >
                  View All
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCropCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                  cropCategory === cat.id
                    ? 'bg-[#2C1D13] text-white shadow-xs'
                    : 'bg-[#F5EFEB] text-[#6E5544] hover:text-[#2C1D13] border border-[#D8C7B3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8C5E3C] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder="Search among 30+ crops (e.g. Tomato, Potato, Apple, Chilli)..."
              className="w-full bg-[#FAF7F2] border border-[#D8C7B3] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2C1D13] placeholder-[#8C5E3C] focus:outline-none focus:border-[#1E7C48]"
            />
            {cropSearch && (
              <button
                onClick={() => setCropSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C5E3C] hover:text-[#2C1D13]"
              >
                ×
              </button>
            )}
          </div>

          {/* ALL CROPS PRESENTATION: Grid View or Horizontal Scroll */}
          {showAllCropsGrid ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-[#D8C7B3] rounded-xl bg-[#FAF7F2]">
              <button
                onClick={() => {
                  setSelectedCropId('ALL');
                  setShowAllCropsGrid(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border ${
                  selectedCropId === 'ALL'
                    ? 'bg-[#1E7C48] text-white border-[#1E7C48]'
                    : 'bg-[#F5EFEB] text-[#2C1D13] border-[#D8C7B3] hover:bg-[#EDE3D5]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🌾</span>
                  <span>All Crops</span>
                </div>
                <span className="text-[10px] opacity-80">{INITIAL_CROPS.length}</span>
              </button>
              {filteredCrops.map(crop => {
                const isSelected = selectedCropId === crop.id;
                const mRate = getMarketRateForCrop(crop.id);
                return (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setShowAllCropsGrid(false);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border ${
                      isSelected
                        ? 'bg-[#1E7C48] text-white border-[#1E7C48] shadow-sm'
                        : 'bg-[#F5EFEB] text-[#2C1D13] border-[#D8C7B3] hover:bg-[#EDE3D5]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-base shrink-0">{crop.icon || '🌱'}</span>
                      <span className="truncate">{crop.nameKey}</span>
                    </div>
                    <span className={`text-[10px] shrink-0 font-mono font-extrabold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-[#E1F2E7] text-[#1E7C48]'
                    }`}>
                      ₹{mRate}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Horizontal Crop Names Chips (Expanded with rates) */
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              <button
                onClick={() => setSelectedCropId('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedCropId === 'ALL'
                    ? 'bg-[#1E7C48] text-white font-extrabold shadow-sm'
                    : 'bg-[#F5EFEB] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                }`}
              >
                <span>🌾</span>
                <span>All Crops</span>
              </button>
              {filteredCrops.map(crop => {
                const isSelected = selectedCropId === crop.id;
                const mRate = getMarketRateForCrop(crop.id);
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1E7C48] text-white font-black shadow-sm ring-1 ring-[#1E7C48]'
                        : 'bg-[#F5EFEB] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                    }`}
                  >
                    <span className="text-sm">{crop.icon || '🌱'}</span>
                    <span className="truncate max-w-[120px]">{crop.nameKey}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-extrabold ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-[#E1F2E7] text-[#1E7C48]'
                    }`}>
                      ₹{mRate}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* DETAILED QUALITY GRADES FOR ACTIVE CROP - FULLY INTERACTIVE ON CLICK */}
          <div className="space-y-2 pt-2 border-t border-[#D2BFAB]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#4A3525] flex items-center gap-1">
                <span>{activeCropForGrades.icon || '🌱'}</span>
                <span>{activeCropForGrades.nameKey} Quality Grades:</span>
                <span className="text-[10px] text-[#8C5E3C] font-normal italic">
                  (Click any grade to filter & inspect)
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                {selectedGrade !== 'ALL' && (
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="text-[10px] text-[#8C5E3C] hover:text-[#1E7C48] font-bold underline"
                  >
                    Reset Filter
                  </button>
                )}
                <span className="text-[10px] text-[#1E7C48] font-extrabold bg-[#F5EFEB] px-2 py-0.5 rounded-full border border-[#79C195]">
                  Mandi Benchmark: ₹{getMarketRateForCrop(activeCropForGrades.id)}/kg
                </span>
              </div>
            </div>

            {/* Clickable Grade Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {activeCropForGrades.grades.map(grade => {
                const isGradeA = grade.code === 'A';
                const isGradeB = grade.code === 'B';
                const isSelected = selectedGrade === grade.code;
                const baseRate = getMarketRateForCrop(activeCropForGrades.id);
                const gradeRate = isGradeA
                  ? Math.round(baseRate * 1.15)
                  : isGradeB
                  ? baseRate
                  : Math.max(5, Math.round(baseRate * 0.85));

                return (
                  <button
                    key={grade.code}
                    type="button"
                    onClick={() => {
                      if (selectedGrade === grade.code) {
                        setSelectedGrade('ALL'); // Toggle off if clicked again
                      } else {
                        setSelectedGrade(grade.code); // Select this grade!
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer relative group text-left sm:text-center ${
                      isSelected
                        ? 'ring-2 ring-[#1E7C48] bg-[#E1F2E7] border-[#1E7C48] shadow-sm transform scale-[1.02]'
                        : isGradeA
                        ? 'bg-[#FAF7F2] border-[#79C195] text-[#1E7C48] hover:bg-[#EAF5EE]'
                        : isGradeB
                        ? 'bg-[#FAF7F2] border-[#E2BA7C] text-[#A3661C] hover:bg-[#FDF6ED]'
                        : 'bg-[#FAF7F2] border-[#C8B49E] text-[#6E4627] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    {/* Active checkmark pill if selected */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#1E7C48] text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}

                    <div className="flex items-center justify-between sm:justify-center gap-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide ${
                          isSelected
                            ? 'bg-[#1E7C48] text-white shadow-2xs'
                            : isGradeA
                            ? 'bg-[#E1F2E7] text-[#1E7C48] border border-[#79C195]'
                            : isGradeB
                            ? 'bg-[#FDF2E2] text-[#A3661C] border border-[#E2BA7C]'
                            : 'bg-[#EFE7DC] text-[#6E4627] border border-[#C8B49E]'
                        }`}
                      >
                        Grade {grade.code}
                      </span>
                      <span className="text-[10px] font-mono font-black text-[#1E7C48] hidden sm:inline">
                        ₹{gradeRate}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#6E5544] block mt-1 truncate">
                      {isGradeA ? 'Premium Export' : isGradeB ? 'Standard Mandi' : 'Processing'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-[#1E7C48] block sm:hidden mt-0.5">
                      Est. ₹{gradeRate}/kg
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Selected Grade Specifications & Actions Drawer */}
            {selectedGrade !== 'ALL' && activeGradeObj && (
              <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#1E7C48] space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-white bg-[#1E7C48] px-2 py-0.5 rounded-full">
                        Grade {activeGradeObj.code} Active Filter
                      </span>
                      <span className="font-extrabold text-[#2C1D13]">{activeGradeObj.name}</span>
                    </div>
                    <p className="text-[11px] text-[#6E5544] mt-1 italic">
                      {activeGradeObj.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="text-[#8C5E3C] hover:text-[#2C1D13] p-1 rounded-lg"
                    title="Clear filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grade AGMARK Criteria Tags */}
                {activeGradeObj.criteria && activeGradeObj.criteria.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeGradeObj.criteria.map((crit, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-[#EDE3D5] text-[#4A3525] px-2 py-0.5 rounded-lg border border-[#D8C7B3] flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-[#1E7C48]" />
                        <span>{crit}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick actions for this grade */}
                <div className="flex items-center justify-between pt-1 border-t border-[#D8C7B3] text-[11px]">
                  <span className="text-[#6E5544]">
                    Filtering {role === 'FARMER' ? displayedFarmerListings.length : displayedAvailableListings.length} matching Grade {selectedGrade} lots
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedGrade('ALL')}
                      className="text-[#8C5E3C] font-bold hover:underline"
                    >
                      Show All Grades
                    </button>
                    {role === 'FARMER' && (
                      <button
                        onClick={onOpenSellModal}
                        className="bg-[#1E7C48] text-white font-extrabold px-2.5 py-1 rounded-lg hover:bg-[#165f37] transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" /> List Grade {selectedGrade} Lot
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. FARMER VIEW: STREAMLINED ACTION BAR (Header text removed as requested, keeping clean lots counter & Add button) */}
      {role === 'FARMER' && (
        <div className="space-y-4">
          {/* Clean Action Bar (Replaces bulky H2 header) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6E5544]">
                {displayedFarmerListings.length} {displayedFarmerListings.length === 1 ? 'Lot' : 'Lots'} Listed
                {selectedCropId !== 'ALL' && ` for ${activeCropForGrades.nameKey}`}
              </span>
              {selectedGrade !== 'ALL' && (
                <span className="text-[11px] font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
                  <span>Grade {selectedGrade}</span>
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="hover:text-red-600 text-xs font-black ml-0.5"
                    title="Remove grade filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={onOpenSellModal}
              className="text-xs font-extrabold text-white bg-[#1E7C48] hover:bg-[#165f37] px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Crop
            </button>
          </div>

          {displayedFarmerListings.length === 0 ? (
            <div className="bg-[#EDE3D5] rounded-3xl p-6 border border-dashed border-[#D8C7B3] text-center space-y-3 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#E5D7C4] text-[#1E7C48] mx-auto flex items-center justify-center border border-[#D8C7B3]">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#6E5544] max-w-xs mx-auto">
                {selectedGrade !== 'ALL'
                  ? `No Grade ${selectedGrade} lots found for ${activeCropForGrades.nameKey}. Upload a Grade ${selectedGrade} lot or clear filter.`
                  : selectedCropId === 'ALL'
                  ? 'No crops listed yet. Upload a short crop video, quantity, and grade to compare with market rates.'
                  : `No ${activeCropForGrades.nameKey} lots listed yet. Upload your crop or view all crops.`}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={onOpenSellModal}
                  className="min-h-[44px] px-5 py-2 bg-[#1E7C48] hover:bg-[#165f37] text-white font-extrabold rounded-xl text-xs shadow-md transition-colors"
                >
                  {t.uploadCropTitle}
                </button>
                {selectedGrade !== 'ALL' && (
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="min-h-[44px] px-4 py-2 bg-[#FAF7F2] text-[#2C1D13] font-bold rounded-xl text-xs border border-[#D8C7B3] hover:bg-[#EDE3D5] transition-colors"
                  >
                    View All Grades
                  </button>
                )}
                {selectedCropId !== 'ALL' && selectedGrade === 'ALL' && (
                  <button
                    onClick={() => setSelectedCropId('ALL')}
                    className="min-h-[44px] px-4 py-2 bg-[#FAF7F2] text-[#2C1D13] font-bold rounded-xl text-xs border border-[#D8C7B3] hover:bg-[#EDE3D5] transition-colors"
                  >
                    View All Crops
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedFarmerListings.map(listing => (
                <CropPostCard
                  key={listing.id}
                  listing={listing}
                  role="FARMER"
                  isOwner={listing.farmerId === currentUser.id}
                  onOpenVideo={(l) => setActiveVideoListing(l)}
                  onEditPost={(l) => setEditingPost(l)}
                  onSelectListing={(id) => onOpenMatchingBuyers(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. BUYER VIEW: SHOW FARMER CROP LISTINGS WITH "REQUEST OPTION TO SEND THE FARMER" */}
      {role === 'BUYER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1E7C48]" />
              <h2 className="text-sm font-extrabold text-[#2C1D13]">
                Available Farmer Harvests Across India
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedGrade !== 'ALL' && (
                <span className="text-[11px] font-extrabold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
                  <span>Grade {selectedGrade}</span>
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="hover:text-red-600 text-xs font-black ml-0.5"
                    title="Remove grade filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <span className="text-[11px] text-[#6E5544] font-semibold">
                {displayedAvailableListings.length} lots available
              </span>
            </div>
          </div>

          {displayedAvailableListings.length === 0 ? (
            <div className="bg-[#EDE3D5] rounded-3xl p-6 border border-dashed border-[#D8C7B3] text-center space-y-3 shadow-md">
              <p className="text-xs text-[#6E5544] max-w-xs mx-auto">
                {selectedGrade !== 'ALL'
                  ? `No Grade ${selectedGrade} lots currently available for ${activeCropForGrades.nameKey}. Reset grade filter or explore other crops.`
                  : `No lots currently available for ${activeCropForGrades.nameKey}. Check other crops or reset to All Crops.`}
              </p>
              <div className="flex items-center justify-center gap-2">
                {selectedGrade !== 'ALL' && (
                  <button
                    onClick={() => setSelectedGrade('ALL')}
                    className="px-4 py-2 bg-[#FAF7F2] text-[#1E7C48] font-bold rounded-xl text-xs border border-[#79C195] hover:bg-[#EDE3D5] transition-colors"
                  >
                    View All Grades
                  </button>
                )}
                <button
                  onClick={() => setSelectedCropId('ALL')}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#2C1D13] font-bold rounded-xl text-xs border border-[#D8C7B3] hover:bg-[#EDE3D5] transition-colors"
                >
                  View All Crops
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedAvailableListings.map(listing => (
                <CropPostCard
                  key={listing.id}
                  listing={listing}
                  role="BUYER"
                  isOwner={listing.farmerId === currentUser.id}
                  onOpenVideo={(l) => setActiveVideoListing(l)}
                  onRequestBuyerOffer={(l) => handleOpenBuyerRequestModal(l)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: BUYER SENDING DIRECT PROCUREMENT REQUEST TO FARMER */}
      {targetListingForBuyer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#EDE3D5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#D8C7B3] space-y-4 text-[#2C1D13]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C7B3]">
              <div>
                <h3 className="text-base font-extrabold text-[#2C1D13]">
                  Send Offer to Farmer
                </h3>
                <p className="text-xs text-[#6E5544]">
                  Farmer: {targetListingForBuyer.farmerName} · {targetListingForBuyer.cropName} (Gr {targetListingForBuyer.grade})
                </p>
              </div>
              <button
                onClick={() => setTargetListingForBuyer(null)}
                className="w-8 h-8 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {buyerRequestSuccessMsg ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#1E7C48] mx-auto" />
                <h4 className="text-sm font-extrabold text-[#2C1D13]">{buyerRequestSuccessMsg}</h4>
                <p className="text-xs text-[#6E5544]">Produce is locked. 24-hour response countdown started.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBuyerRequest} className="space-y-3.5">
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8C7B3] text-xs text-[#4A3525] space-y-1">
                  <span className="font-extrabold text-[#1E7C48]">24-Hour Response SLA Rule</span>
                  <p className="text-[11px] leading-relaxed text-[#6E5544]">
                    Once sent, the requested quantity is temporarily locked and the farmer receives a notification with a <strong>24-hour response countdown</strong> to review and accept.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">
                    Requested Quantity (kg) — Max {targetListingForBuyer.availableQuantityKg} kg
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={targetListingForBuyer.availableQuantityKg}
                    value={buyerReqQty}
                    onChange={e => setBuyerReqQty(Number(e.target.value))}
                    required
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">
                    Offered Buying Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={buyerOfferedPrice}
                    onChange={e => setBuyerOfferedPrice(Number(e.target.value))}
                    required
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3525] mb-1">
                    Delivery / Terms Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Farmgate pickup in crates, cash settlement at weighing"
                    value={buyerNotes}
                    onChange={e => setBuyerNotes(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs placeholder-[#917765]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[44px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-all"
                  >
                    Send Request to Farmer (24-Hour Time Limit)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: FARMER EDITING POST DETAILS */}
      {editingPost && (
        <EditListingModal
          listing={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* FULL-SCREEN REALISTIC CROP VIDEO INSPECTION MODAL */}
      <CropVideoModal
        listing={activeVideoListing}
        isOpen={!!activeVideoListing}
        onClose={() => setActiveVideoListing(null)}
        onPrebook={(l) => {
          setActiveVideoListing(null);
          handleOpenBuyerRequestModal(l);
        }}
      />
    </div>
  );
};
