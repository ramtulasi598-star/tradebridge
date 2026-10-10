import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_CROPS } from '../../data/initialData';
import { MarketHub, QualityGradeCode } from '../../types/marketplace';
import {
  X,
  Send,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
  Scale,
  Award,
  AlertCircle
} from 'lucide-react';

interface MarketRequestModalProps {
  market: MarketHub;
  initialCropId?: string;
  initialPrice?: number;
  initialGrade?: QualityGradeCode;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MarketRequestModal: React.FC<MarketRequestModalProps> = ({
  market,
  initialCropId,
  initialPrice,
  initialGrade = 'A',
  onClose,
  onSuccess
}) => {
  const { createMarketRequest } = useMarketplace();
  const { currentUser } = useAuth();

  // Find crop price info from market if available
  const defaultCropId = initialCropId || market.cropPrices[0]?.cropId || 'crop-tomato';
  const defaultCropObj = market.cropPrices.find(c => c.cropId === defaultCropId) || market.cropPrices[0];
  const defaultPrice = initialPrice || defaultCropObj?.pricePerKg || 32;

  // Form states as requested: Your Name, Crop, Quantity, Location
  const [farmerName, setFarmerName] = useState<string>(currentUser.name || 'Ramesh Naidu');
  const [selectedCropId, setSelectedCropId] = useState<string>(defaultCropId);
  const [selectedGrade, setSelectedGrade] = useState<QualityGradeCode>(initialGrade);
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [acceptedPricePerKg, setAcceptedPricePerKg] = useState<number>(defaultPrice);
  const [farmerArea, setFarmerArea] = useState<string>(currentUser.location?.area || 'Kalikiri Mandalam');
  const [farmerDistrict, setFarmerDistrict] = useState<string>(currentUser.location?.district || market.district);
  const [farmerState, setFarmerState] = useState<string>(currentUser.location?.state || market.state);
  const [notes, setNotes] = useState<string>('');
  
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Handle crop change to auto-update market price for that crop in this market
  const handleCropChange = (newCropId: string) => {
    setSelectedCropId(newCropId);
    const foundInMarket = market.cropPrices.find(c => c.cropId === newCropId);
    if (foundInMarket) {
      setAcceptedPricePerKg(foundInMarket.pricePerKg);
      setSelectedGrade(foundInMarket.grade);
    }
  };

  const currentCropInfo = INITIAL_CROPS.find(c => c.id === selectedCropId) || INITIAL_CROPS[0];
  const totalAmount = quantityKg * acceptedPricePerKg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const res = createMarketRequest({
      marketId: market.id,
      marketName: market.marketName,
      marketArea: market.area,
      marketDistrict: market.district,
      farmerName,
      cropId: currentCropInfo.id,
      cropName: currentCropInfo.nameKey,
      grade: selectedGrade,
      quantityKg,
      acceptedPricePerKg,
      location: {
        country: 'India',
        state: farmerState,
        district: farmerDistrict,
        area: farmerArea,
        distanceKm: market.distanceKm || 0
      },
      notes: notes.trim() ? notes : undefined
    });

    if (res.success) {
      setIsSubmitted(true);
      setSuccessMsg(res.message);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#EDE3D5] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#D8C7B3] max-h-[90vh] overflow-y-auto space-y-4 text-[#2C1D13]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8C7B3]">
          <div>
            <span className="text-[10px] text-[#1E7C48] font-extrabold uppercase tracking-wider bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
              🌾 Farmer to Mandi Slot Request
            </span>
            <h2 className="text-base font-extrabold text-[#2C1D13] mt-1">
              Request to {market.marketName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#6E5544] mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
              <span>{market.area}, {market.district} ({market.distanceKm} km away)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#1E7C48] mx-auto animate-bounce" />
            <h3 className="text-base font-black text-[#2C1D13]">
              Slot Request Sent Successfully!
            </h3>
            <p className="text-xs text-[#6E5544] max-w-sm mx-auto">
              {successMsg}
            </p>
            <div className="inline-flex items-center gap-2 bg-[#E1F2E7] text-[#1E7C48] px-3 py-1.5 rounded-xl border border-[#79C195] text-xs font-bold">
              <Clock className="w-4 h-4 animate-spin" />
              <span>1-Hour Countdown Active: 60:00</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1-Hour Time Limit Notice Banner */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#79C195] text-xs text-[#2C1D13] space-y-1">
              <div className="flex items-center gap-1.5 text-[#1E7C48] font-extrabold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>1-Hour Time Limit Window Rule</span>
              </div>
              <p className="text-[11px] text-[#6E5544] leading-relaxed">
                Because you are satisfied with this market's rate of <strong>₹{acceptedPricePerKg}/kg</strong>, this request reserves an arrival slot. The APMC yard commission agents will confirm intake within <strong>1 Hour (60 minutes)</strong>.
              </p>
            </div>

            {/* Field 1: Your Name */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Your Full Name (Farmer / Producer) *
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
              />
            </div>

            {/* Field 2: Crop & Grade Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Select Crop *
                </label>
                <select
                  value={selectedCropId}
                  onChange={e => handleCropChange(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
                >
                  {market.cropPrices.map(c => (
                    <option key={c.cropId} value={c.cropId}>
                      {c.cropIcon} {c.cropName} (₹{c.pricePerKg}/kg)
                    </option>
                  ))}
                  {INITIAL_CROPS.filter(c => !market.cropPrices.some(mc => mc.cropId === c.id)).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.nameKey} (Other)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Quality Grade *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['A', 'B', 'C'] as QualityGradeCode[]).map(gradeCode => (
                    <button
                      key={gradeCode}
                      type="button"
                      onClick={() => setSelectedGrade(gradeCode)}
                      className={`min-h-[42px] rounded-xl text-xs font-bold border transition-all ${
                        selectedGrade === gradeCode
                          ? 'bg-[#1E7C48] text-white border-[#1E7C48] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#4A3525] border-[#D8C7B3] hover:bg-[#E5D7C4]'
                      }`}
                    >
                      Grade {gradeCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: Quantity (kg) with Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#4A3525]">
                  Quantity to Supply (kg) *
                </label>
                <span className="text-[11px] text-[#8C5E3C] font-semibold">
                  {(quantityKg / 100).toFixed(1)} Quintals
                </span>
              </div>
              <input
                type="number"
                min="50"
                step="50"
                required
                value={quantityKg}
                onChange={e => setQuantityKg(Math.max(50, Number(e.target.value)))}
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold tabular-nums focus:outline-none focus:border-[#1E7C48]"
              />
              <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
                {[500, 1000, 2000, 5000].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantityKg(qty)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      quantityKg === qty
                        ? 'bg-[#1E7C48] text-white border-[#1E7C48]'
                        : 'bg-[#FAF7F2] text-[#6E5544] border-[#D8C7B3] hover:bg-[#E5D7C4]'
                    }`}
                  >
                    {qty.toLocaleString('en-IN')} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Field 4: Location (Area, District, State) */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Your Farm / Dispatch Location *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Village / Mandalam"
                  value={farmerArea}
                  onChange={e => setFarmerArea(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
                />
                <input
                  type="text"
                  required
                  placeholder="District"
                  value={farmerDistrict}
                  onChange={e => setFarmerDistrict(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
                />
              </div>
            </div>

            {/* Market Rate Summary & Total Amount */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8C7B3] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E5544]">Satisfied Mandi Price:</span>
                <span className="text-sm font-black text-[#1E7C48]">
                  ₹{acceptedPricePerKg}/kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D8C7B3]">
                <span className="text-xs font-extrabold text-[#2C1D13]">Total Expected Payout:</span>
                <span className="text-base font-black text-[#1E7C48] tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Optional Delivery / Vehicle Notes */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Transport / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bringing in mini-truck (AP03 TC 1234) by 4:00 PM"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full min-h-[40px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs focus:outline-none focus:border-[#1E7C48]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full min-h-[46px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Send Request to Market (1-Hour Limit)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
