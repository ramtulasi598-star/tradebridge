import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { Deal } from '../../types/marketplace';
import { X, Star, CheckCircle } from 'lucide-react';

interface RatingModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ deal, isOpen, onClose }) => {
  const { submitDealRating } = useMarketplace();
  const { role, language } = useAuth();
  const t = TRANSLATIONS[language];

  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !deal) return null;

  const targetName = role === 'FARMER' ? deal.buyerBusinessName : deal.farmerName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDealRating(deal.id, stars, reviewText);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C1D13] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#D8C7B3]">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8C7B3]">
          <div>
            <h2 className="text-base font-extrabold text-[#2C1D13]">{t.rateTransaction}</h2>
            <p className="text-xs text-[#6E5544] font-mono">Deal <strong className="text-[#1E7C48]">{deal.dealCode}</strong></p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-[#1E7C48] mx-auto" />
            <h3 className="text-sm font-bold text-[#2C1D13]">Thank you! Rating recorded.</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="text-center">
              <p className="text-xs text-[#4A3525] mb-2">
                Rate trading experience with <strong className="text-[#2C1D13]">{targetName}</strong>:
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setStars(val)}
                    onMouseEnter={() => setHoverStars(val)}
                    onMouseLeave={() => setHoverStars(stars)}
                    className="p-1 focus:outline-hidden transition-transform active:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        val <= (hoverStars || stars)
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-[#E5D7C4] text-[#D8C7B3]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#4A3525]">
                {t.reviewComment}
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="e.g. Prompt weighing, accurate quality inspection, on-time payment..."
                className="w-full p-3 rounded-xl border border-[#D8C7B3] text-xs text-[#2C1D13] placeholder-[#8C5E3C] bg-[#FAF7F2] focus:outline-hidden focus:border-[#1E7C48]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
            >
              {t.submitRating}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
