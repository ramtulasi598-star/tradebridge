import React, { useState } from 'react';
import { CropListing, QualityGradeCode } from '../../types/marketplace';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  MapPin,
  Video,
  Play,
  Pencil,
  Trash2,
  ExternalLink,
  Send,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

import { RealisticCropVideoPlayer } from './CropVideoModal';

interface CropPostCardProps {
  listing: CropListing;
  role?: 'FARMER' | 'BUYER' | 'ADMIN';
  isOwner?: boolean;
  onOpenVideo?: (listing: CropListing) => void;
  onEditPost?: (listing: CropListing) => void;
  onSelectListing?: (listingId: string) => void; // "View Matching Buyers"
  onRequestBuyerOffer?: (listing: CropListing) => void; // For buyer: "Send Procurement Request"
}

// Crop high-resolution image fallback mapping
const CROP_FALLBACK_IMAGES: Record<string, string> = {
  'crop-tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  'crop-chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
  'crop-potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
  'crop-onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  'crop-capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format&fit=crop&q=80',
  'crop-cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&auto=format&fit=crop&q=80',
  'crop-cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&auto=format&fit=crop&q=80',
  'crop-cotton': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80',
  'crop-rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
  'crop-wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
  'crop-mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop&q=80',
  'crop-apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80',
  'crop-pomegranate': 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=400&auto=format&fit=crop&q=80',
  'crop-turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80',
  'crop-garlic': 'https://images.unsplash.com/photo-1615477040445-be0d0649048a?w=400&auto=format&fit=crop&q=80',
  'crop-ginger': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&auto=format&fit=crop&q=80',
  'crop-banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
  'crop-watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
  'crop-papaya': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&auto=format&fit=crop&q=80',
  'crop-coconut': 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop&q=80',
  'crop-brinjal': 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&auto=format&fit=crop&q=80'
};

// Rich bilingual varieties matching the exact user screenshot pattern "Tomato (టమాటా - Hybrid Sahu)"
const CROP_VARIETY_TITLES: Record<string, string> = {
  'crop-tomato': 'Tomato (టమాటా - Hybrid Sahu)',
  'crop-chilli': 'Green Chilli (పచ్చిమిర్చి - G4 Teja)',
  'crop-potato': 'Potato (బంగాళాదుంప - Kufri Jyoti)',
  'crop-onion': 'Onion (ఉల్లిపాయ - Nasik Red)',
  'crop-capsicum': 'Capsicum (బెంగళూరు మిర్చి - Indra Green)',
  'crop-cabbage': 'Cabbage (క్యాబేజీ - Golden Acre)',
  'crop-cauliflower': 'Cauliflower (కాలీఫ్లవర్ - Pusa Snowball)',
  'crop-brinjal': 'Brinjal (వంకాయ - Bhagyamati)',
  'crop-apple': 'Apple (యాపిల్ - Royal Delicious)',
  'crop-pomegranate': 'Pomegranate (దానిమ్మ - Bhagwa Sindhuri)',
  'crop-cotton': 'Raw Cotton (ప్రత్తి - Bt RCH-2)',
  'crop-rice': 'Paddy Rice (వరి - BPT 5204 Sona Masoori)',
  'crop-wheat': 'Wheat (గోధుమలు - Sharbati 306)',
  'crop-maize': 'Maize (మొక్కజొన్న - Pioneer 3396)',
  'crop-turmeric': 'Turmeric (పసుపు - Salem Supreme)',
  'crop-garlic': 'Garlic (వెల్లుల్లి - Yamuna Safed)',
  'crop-ginger': 'Ginger (అల్లం - Maran High-Grade)',
  'crop-mango': 'Mango (మామిడి - Banganapalle Sahu)',
  'crop-watermelon': 'Watermelon (పుచ్చకాయ - Kiran Hybrid)',
  'crop-papaya': 'Papaya (బొప్పాయి - Red Lady 786)',
  'crop-coconut': 'Coconut (కొబ్బరి - East Coast Tall)'
};

export const CropPostCard: React.FC<CropPostCardProps> = ({
  listing,
  role = 'FARMER',
  isOwner = true,
  onOpenVideo,
  onEditPost,
  onSelectListing,
  onRequestBuyerOffer
}) => {
  const { deleteListing, marketPrices } = useMarketplace();
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  // Market price comparison
  const matchedPrice = marketPrices.find(p => p.cropId === listing.cropId);
  const currentMarketRate = matchedPrice ? matchedPrice.currentPricePerKg : (listing.expectedPricePerKg || 32);
  const displayPrice = listing.expectedPricePerKg || currentMarketRate || 32;

  // Exact quantities matching screenshot
  const totalQty = listing.totalQuantityKg || 1000;
  const prebookedQty = listing.prebookedQuantityKg || 0;
  const availableQty = listing.availableQuantityKg ?? Math.max(0, totalQty - prebookedQty);

  // Percent calculations
  const prebookedPercent = totalQty > 0 ? Math.round((prebookedQty / totalQty) * 100) : 0;
  const remainingPercent = totalQty > 0 ? Math.round((availableQty / totalQty) * 100) : (listing.status === 'SOLD_OUT' ? 0 : 100);

  // Title formatting: if custom variety available use it, else default
  const title = CROP_VARIETY_TITLES[listing.cropId] || `${listing.cropName} (Hybrid Variety)`;
  const thumbnailImg = CROP_FALLBACK_IMAGES[listing.cropId] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80';

  // Video duration string (e.g., 0:24)
  const durationSec = listing.videoDurationSeconds || 24;
  const formattedDuration = `0:${durationSec < 10 ? '0' : ''}${durationSec}`;

  // Quality Grade description
  const gradeLabel = listing.grade === 'A'
    ? 'Grade A (Premium)'
    : listing.grade === 'B'
    ? 'Grade B (Standard)'
    : 'Grade C (Fair)';

  const [isInlinePlaying, setIsInlinePlaying] = useState(false);

  const isSoldOut = listing.status === 'SOLD_OUT' || (availableQty === 0 && prebookedQty === 0);
  const isFullyPrebooked = availableQty === 0 && prebookedQty > 0;

  const handleThumbnailClick = () => {
    if (onOpenVideo) {
      onOpenVideo(listing);
    } else {
      setIsInlinePlaying(prev => !prev);
    }
  };

  return (
    <div className="bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 border border-[#D8C7B3] shadow-md text-[#2C1D13] space-y-3.5 transition-all hover:border-[#C2AE97]">
      {/* INLINE REALISTIC VIDEO PLAYER (WHEN PLAYING INLINE) */}
      {isInlinePlaying && (
        <div className="rounded-2xl overflow-hidden border border-[#D8C7B3] shadow-lg mb-3">
          <RealisticCropVideoPlayer
            listing={listing}
            isInline={true}
            autoPlay={true}
            onExpandFullscreen={() => onOpenVideo && onOpenVideo(listing)}
            onClose={() => setIsInlinePlaying(false)}
          />
        </div>
      )}

      {/* 1. TOP ROW: THUMBNAIL + TITLE + LOCATION + PRICE + ACTIVE BADGE */}
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Thumbnail with Video/Camera Icon & Duration Badge */}
        <div
          onClick={handleThumbnailClick}
          className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden relative shrink-0 cursor-pointer group border border-[#D8C7B3] bg-[#EFE5D8] shadow-sm"
          title="Click to play real farm crop inspection video"
        >
          {listing.videoUrl ? (
            <video
              src={listing.videoUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <img
              src={thumbnailImg}
              alt={listing.cropName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Warm Overlay with Video Play Icon & Pulse Indicator */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 flex items-center justify-center transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#1E7C48] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform border border-white/40">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Live REC indicator */}
          <div className="absolute top-1.5 left-1.5 bg-red-600/90 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>REC</span>
          </div>

          {/* Duration Badge (Exact e.g. 0:24 from screenshot) */}
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold tracking-tight shadow-xs border border-white/20">
            {formattedDuration}
          </span>
        </div>

        {/* Center Details: Crop Title, Location, and Price */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-base sm:text-[17px] font-black text-[#2C1D13] leading-snug tracking-tight truncate">
              {title}
            </h3>

            {/* Status Pill (ACTIVE / PRE-BOOKED / SOLD OUT) */}
            {isSoldOut ? (
              <span className="shrink-0 inline-flex items-center text-[10px] font-black tracking-wider uppercase text-[#6E5544] bg-[#EDE3D5] px-2.5 py-0.5 rounded-full border border-[#D8C7B3] shadow-xs">
                SOLD OUT
              </span>
            ) : isFullyPrebooked ? (
              <span className="shrink-0 inline-flex items-center text-[10px] font-black tracking-wider uppercase text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FCD34D] shadow-xs">
                PRE-BOOKED
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center text-[10px] font-black tracking-wider uppercase text-[#1E7C48] bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] shadow-xs">
                ACTIVE
              </span>
            )}
          </div>

          {/* Location with Pin */}
          <div className="flex items-center gap-1.5 text-xs text-[#6E5544] mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
            <span className="truncate">
              {listing.location.area || 'Madanapalle Rural'}, {listing.location.district || 'Chittoor'}
            </span>
          </div>

          {/* Prominent Price in bold green (₹32 / kg) */}
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#1E7C48] tracking-tight">
              ₹{displayPrice}
            </span>
            <span className="text-xs font-semibold text-[#6E5544]">
              / kg
            </span>
            {matchedPrice && matchedPrice.currentPricePerKg !== displayPrice && (
              <span className="ml-2 text-[10px] text-[#5C4533] bg-[#EDE3D5] px-1.5 py-0.5 rounded font-mono border border-[#D8C7B3]">
                Mandi: ₹{matchedPrice.currentPricePerKg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: QUALITY GRADE (Exact layout from screenshot) */}
      <div className="flex items-center justify-between py-2 border-t border-[#D8C7B3]">
        <span className="text-xs sm:text-sm font-extrabold text-[#2C1D13]">
          Quality Grade:
        </span>

        {/* Grade Pill with Star Sparkle */}
        <div className="inline-flex items-center gap-1.5 bg-[#FDF2E2] text-[#A3661C] border border-[#E2BA7C] px-3.5 py-1.5 rounded-xl shadow-xs text-xs sm:text-sm font-black">
          <Sparkles className="w-3.5 h-3.5 text-[#A3661C]" />
          <span>{gradeLabel}</span>
        </div>
      </div>

      {/* 3. THREE-BOX METRIC GRID (TOTAL QTY, PRE-BOOKED, REMAINING) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
        {/* BOX 1: TOTAL QTY (Normal Lite Brown) */}
        <div className="bg-[#EDE3D5] rounded-2xl p-2.5 sm:p-3 border border-[#D8C7B3] text-center flex flex-col items-center justify-center min-h-[76px] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#7A6150] tracking-wider uppercase">
            TOTAL QTY
          </span>
          <span className="text-lg sm:text-xl font-black text-[#2C1D13] tabular-nums mt-1 leading-tight">
            {totalQty.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-semibold text-[#7A6150] mt-0.5">
            kg
          </span>
        </div>

        {/* BOX 2: PRE-BOOKED (Warm Amber / Honey Brown) */}
        <div className="bg-[#FEF3C7] rounded-2xl p-2.5 sm:p-3 border border-[#FCD34D] text-center flex flex-col items-center justify-center min-h-[76px] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-black text-[#B45309] tracking-wider uppercase">
            PRE-BOOKED
          </span>
          <span className="text-lg sm:text-xl font-black text-[#B45309] tabular-nums mt-1 leading-tight">
            {prebookedQty.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-bold text-[#92400E] mt-0.5">
            kg ({prebookedPercent}%)
          </span>
        </div>

        {/* BOX 3: REMAINING (Fresh Agricultural Green) */}
        <div className="bg-[#E1F2E7] rounded-2xl p-2.5 sm:p-3 border border-[#79C195] text-center flex flex-col items-center justify-center min-h-[76px] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-black text-[#1E7C48] tracking-wider uppercase">
            REMAINING
          </span>
          <span className="text-lg sm:text-xl font-black text-[#1E7C48] tabular-nums mt-1 leading-tight">
            {availableQty.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-bold text-[#165f37] mt-0.5">
            kg ({remainingPercent}%)
          </span>
        </div>
      </div>

      {/* 4. DUAL-TONE PROGRESS BAR & LEGEND */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full h-2.5 rounded-full overflow-hidden bg-[#E2D4C3] flex shadow-inner">
          {prebookedPercent > 0 && (
            <div
              style={{ width: `${Math.min(100, prebookedPercent)}%` }}
              className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] h-full transition-all duration-500"
            />
          )}
          {remainingPercent > 0 && (
            <div
              style={{ width: `${Math.min(100, remainingPercent)}%` }}
              className="bg-gradient-to-r from-[#1E7C48] to-[#10B981] h-full transition-all duration-500"
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs font-black pt-0.5">
          <span className="text-[#B45309] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block shadow-xs" />
            <span>{prebookedQty.toLocaleString('en-IN')} kg Booked</span>
          </span>

          <span className="text-[#1E7C48] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E7C48] inline-block shadow-xs" />
            <span>{availableQty.toLocaleString('en-IN')} kg Available</span>
          </span>
        </div>
      </div>

      {/* 5. INTERACTIVE ACTION STRIP */}
      <div className="pt-2 border-t border-[#D8C7B3] flex items-center justify-between gap-2 flex-wrap">
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          {/* Watch Farm Video button */}
          <button
            type="button"
            onClick={handleThumbnailClick}
            className="min-h-[36px] px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EDE3D5] text-[#1E7C48] rounded-xl text-xs font-black flex items-center gap-1.5 border border-[#79C195] transition-colors"
            title="Watch real farm recording and AI quality inspection"
          >
            <Video className="w-3.5 h-3.5 text-[#1E7C48]" />
            <span>Farm Video ({formattedDuration})</span>
          </button>

          {isOwner && onEditPost && (
            <button
              type="button"
              onClick={() => onEditPost(listing)}
              className="min-h-[36px] px-3.5 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#D8C7B3] transition-colors"
              title="Edit crop details, price, quantity, or location"
            >
              <Pencil className="w-3.5 h-3.5 text-[#1E7C48]" />
              <span>Edit Post</span>
            </button>
          )}

          {isOwner && onSelectListing && (
            <button
              type="button"
              onClick={() => onSelectListing(listing.id)}
              className="min-h-[36px] px-3.5 py-1.5 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>View Matching Buyers</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          {isOwner && prebookedQty === 0 && (
            <button
              type="button"
              onClick={() => deleteListing(listing.id)}
              className="min-h-[36px] min-w-[36px] px-2 bg-[#EDE3D5] hover:bg-red-100 text-[#6E5544] hover:text-red-600 rounded-xl flex items-center justify-center border border-[#D8C7B3] transition-colors"
              title="Delete uncommitted crop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions: Buyer Procurement Offer */}
        {role === 'BUYER' && onRequestBuyerOffer && (
          <button
            type="button"
            onClick={() => onRequestBuyerOffer(listing)}
            className="flex-1 sm:flex-none min-h-[38px] px-4 py-1.5 bg-[#1E7C48] hover:bg-[#165f37] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Send Request to Farmer</span>
          </button>
        )}
      </div>
    </div>
  );
};
