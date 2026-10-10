import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CropListing, QualityGradeCode } from '../../types/marketplace';
import { INITIAL_CROPS } from '../../data/initialData';
import {
  X,
  Save,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Tag,
  Scale
} from 'lucide-react';

interface EditListingModalProps {
  listing: CropListing;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  listing,
  onClose,
  onSuccess
}) => {
  const { updateListing } = useMarketplace();

  // Form states initialized with existing post details
  const [selectedCropId, setSelectedCropId] = useState<string>(listing.cropId);
  const [selectedGrade, setSelectedGrade] = useState<QualityGradeCode>(listing.grade);
  const [totalQuantityKg, setTotalQuantityKg] = useState<number>(listing.totalQuantityKg);
  const [availableQuantityKg, setAvailableQuantityKg] = useState<number>(listing.availableQuantityKg);
  const [expectedPricePerKg, setExpectedPricePerKg] = useState<number>(listing.expectedPricePerKg || 25);
  const [area, setArea] = useState<string>(listing.location.area);
  const [district, setDistrict] = useState<string>(listing.location.district);
  const [state, setState] = useState<string>(listing.location.state);
  
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const selectedCropObj = INITIAL_CROPS.find(c => c.id === selectedCropId) || INITIAL_CROPS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateListing(listing.id, {
      cropId: selectedCropId,
      cropName: selectedCropObj.nameKey,
      grade: selectedGrade,
      totalQuantityKg,
      availableQuantityKg: Math.min(availableQuantityKg, totalQuantityKg),
      expectedPricePerKg,
      location: {
        ...listing.location,
        area,
        district,
        state
      }
    });

    setIsSaved(true);
    if (onSuccess) {
      onSuccess();
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#EDE3D5] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#D8C7B3] max-h-[90vh] overflow-y-auto space-y-4 text-[#2C1D13]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8C7B3]">
          <div>
            <span className="text-[10px] text-[#1E7C48] font-extrabold uppercase tracking-wider bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195]">
              ✏️ Edit Uploaded Post
            </span>
            <h2 className="text-base font-extrabold text-[#2C1D13] mt-1">
              Change Harvest Post Details
            </h2>
            <p className="text-xs text-[#6E5544]">
              Update your crop variety, grade, harvest quantity, or expected price anytime.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#1E7C48] mx-auto animate-bounce" />
            <h3 className="text-base font-black text-[#2C1D13]">
              Post Details Updated Successfully!
            </h3>
            <p className="text-xs text-[#6E5544]">
              Your harvest post has been updated across the marketplace.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Field: Crop Selection */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Crop Name / Variety *
              </label>
              <select
                value={selectedCropId}
                onChange={e => setSelectedCropId(e.target.value)}
                className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
              >
                {INITIAL_CROPS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.nameKey} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Field: Quality Grade */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Quality Grade *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'B', 'C'] as QualityGradeCode[]).map(gradeCode => (
                  <button
                    key={gradeCode}
                    type="button"
                    onClick={() => setSelectedGrade(gradeCode)}
                    className={`min-h-[40px] rounded-xl text-xs font-bold border transition-all ${
                      selectedGrade === gradeCode
                        ? 'bg-[#1E7C48] text-white border-[#1E7C48] shadow-xs'
                        : 'bg-[#FAF7F2] text-[#4A3525] border-[#D8C7B3] hover:bg-[#E5D7C4]'
                    }`}
                  >
                    Grade {gradeCode} {gradeCode === 'A' ? '(Premium)' : gradeCode === 'B' ? '(Standard)' : '(Processing)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Field: Quantities */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Total Harvest (kg) *
                </label>
                <input
                  type="number"
                  min="10"
                  required
                  value={totalQuantityKg}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setTotalQuantityKg(val);
                    if (availableQuantityKg > val) setAvailableQuantityKg(val);
                  }}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold tabular-nums focus:outline-none focus:border-[#1E7C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] mb-1">
                  Available Quantity (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalQuantityKg}
                  required
                  value={availableQuantityKg}
                  onChange={e => setAvailableQuantityKg(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold tabular-nums focus:outline-none focus:border-[#1E7C48]"
                />
              </div>
            </div>

            {/* Field: Expected Target Price */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Your Expected Target Price (₹/kg) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C5E3C]">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={expectedPricePerKg}
                  onChange={e => setExpectedPricePerKg(Number(e.target.value))}
                  className="w-full min-h-[42px] pl-8 pr-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-sm font-bold tabular-nums focus:outline-none focus:border-[#1E7C48]"
                />
              </div>
            </div>

            {/* Field: Location */}
            <div>
              <label className="block text-xs font-bold text-[#4A3525] mb-1">
                Location Details *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Village / Mandalam"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
                />
                <input
                  type="text"
                  required
                  placeholder="District"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-bold focus:outline-none focus:border-[#1E7C48]"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full min-h-[46px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Post Details</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
