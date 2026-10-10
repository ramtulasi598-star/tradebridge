export type UserRole = 'FARMER' | 'BUYER';

export type LanguageCode = 'en' | 'te' | 'hi';

export interface LocationInfo {
  country: string;
  state: string;
  district: string;
  area: string;
  pincode?: string;
  distanceKm?: number; // relative to user
}

export interface UserProfile {
  id: string;
  mobile: string;
  name: string;
  role: UserRole;
  language: LanguageCode;
  location: LocationInfo;
  businessName?: string;
  businessType?: 'WHOLESALER' | 'COMMISSION_AGENT' | 'PROCESSOR' | 'EXPORTER' | 'RETAILER';
  isVerified?: boolean;
  gstNumber?: string;
  apmcLicense?: string;
  ratingAvg: number;
  ratingCount: number;
  avatarUrl?: string;
}

export type QualityGradeCode = 'A' | 'B' | 'C';

export interface QualityGrade {
  code: QualityGradeCode;
  name: string;
  description: string;
  criteria: string[];
}

export interface CropInfo {
  id: string;
  nameKey: string; // for i18n
  category: string;
  unit: 'kg' | 'quintal';
  icon: string;
  grades: QualityGrade[];
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  totalQuantityKg: number;
  availableQuantityKg: number;
  lockedPendingKg: number;
  prebookedQuantityKg: number;
  location: LocationInfo;
  videoUrl?: string;
  videoDurationSeconds?: number;
  status: 'AVAILABLE' | 'PARTIALLY_BOOKED' | 'FULLY_BOOKED' | 'SOLD_OUT' | 'ARCHIVED';
  expectedPricePerKg?: number;
  createdAt: number;
  updatedAt: number;
}

export interface MarketRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  businessName: string;
  isVerified: boolean;
  marketName: string;
  location: LocationInfo;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  buyingPricePerKg: number;
  requiredQuantityKg: number;
  prebookedQuantityKg: number;
  remainingQuantityKg: number;
  minOrderQuantityKg: number;
  maxOrderQuantityKg: number;
  additionalRequirements?: string;
  updatedAt: number; // timestamp
}

export interface MarketPrice {
  id: string;
  marketName: string;
  location: LocationInfo;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  currentPricePerKg: number;
  yesterdayPricePerKg: number;
  minPricePerKg: number;
  maxPricePerKg: number;
  sevenDayTrend: number[]; // e.g. [22, 23, 23, 24, 25, 25, 26]
  updatedAt: number;
  isVerified: boolean;
  source: string;
  isEstimate?: boolean;
}

export interface SingleMarketCropPrice {
  cropId: string;
  cropName: string;
  cropIcon: string;
  grade: QualityGradeCode;
  pricePerKg: number;
  yesterdayPrice: number;
  minPrice: number;
  maxPrice: number;
  openQuantityKg?: number; // Required remaining quantity open for buying
  dailyArrivalsKg: number; // Daily import/arrival volume
  prebookedKg: number;    // Pre-booked quantity today
  thirtyDayImportTons?: number; // Total tons imported over the past 30 days
  thirtyDayPrebookedKg?: number; // Total kg prebooked over the past 30 days
  thirtyDayTrend: {
    dayIndex?: number;
    date?: string;
    dayLabel: string;
    dayOfWeek?: string;
    price: number;
    minPrice?: number;
    maxPrice?: number;
    change?: number;
    changePercent?: number;
    arrivalsKg?: number;
    prebookedKg?: number;
  }[]; // 30-day historical prices & volumes
}

export interface MarketHub {
  id: string;
  marketName: string;
  localName?: string; // e.g. "మదనపల్లె టమాటా మార్కెట్ యార్డ్"
  state: string;
  district: string;
  area: string;
  distanceKm: number;
  dailyTotalImportTons: number; // e.g. 520 Tons daily import
  totalPrebookedKg: number;     // e.g. 35,000 kg prebooked today
  verifiedAPMC: boolean;
  bulletin?: string;            // e.g. "High Demand: Tomato Grade A needed for interstate dispatch"
  isFollowing?: boolean;
  highDemand?: boolean;
  cropPrices: SingleMarketCropPrice[];
}

export type SellRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface SellRequest {
  id: string;
  listingId: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: LocationInfo;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  marketRequirementId: string;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  requestedQuantityKg: number;
  offeredPricePerKg: number;
  status: SellRequestStatus;
  createdAt: number;
  expiresAt: number; // 24 hours for buyer offers (1000 * 3600 * 24), or 1 hour for sell requests
  respondedAt?: number;
  rejectionReason?: string;
  dealId?: string;
  requestType?: 'BUYER_TO_FARMER' | 'FARMER_TO_BUYER';
}

export interface MarketRequest {
  id: string;
  marketId: string;
  marketName: string;
  marketArea: string;
  marketDistrict: string;
  farmerId: string;
  farmerName: string;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  quantityKg: number;
  acceptedPricePerKg: number;
  totalAmount: number;
  farmerLocation: LocationInfo;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: number;
  expiresAt: number; // Exactly 1 hour from creation (1000 * 3600)
  notes?: string;
}

export type DealStatus = 
  | 'CONFIRMED'
  | 'PRE_BOOKED'
  | 'PICKUP_OR_DELIVERY'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLATION_REQUESTED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface Deal {
  id: string;
  dealCode: string; // e.g. #AGRI123456
  sellRequestId: string;
  listingId: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  farmerLocation: LocationInfo;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  buyerMobile: string;
  buyerLocation: LocationInfo;
  cropId: string;
  cropName: string;
  grade: QualityGradeCode;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: DealStatus;
  confirmedAt: number;
  completedAt?: number;
  cancelledAt?: number;
  videoUrl?: string;
  farmerRated?: boolean;
  buyerRated?: boolean;
}

export type CancellationReasonCode = 
  | 'QUANTITY_UNAVAILABLE'
  | 'QUALITY_MISMATCH'
  | 'TRANSPORTATION_PROBLEM'
  | 'BUYER_CHANGED_REQUIREMENT'
  | 'FARMER_CHANGED_DECISION'
  | 'OTHER';

export interface CancellationRequest {
  id: string;
  dealId: string;
  dealCode: string;
  requestedByUserId: string;
  requestedByRole: UserRole;
  requestedByName: string;
  reasonCode: CancellationReasonCode;
  reasonNotes?: string;
  otherPartyAgreed: boolean;
  otpCode?: string; // Generated OTP for verification
  status: 'PENDING_APPROVAL' | 'OTP_PENDING' | 'VERIFIED_CANCELLED' | 'REJECTED' | 'DISPUTED';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  dealId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole | 'SYSTEM';
  content: string;
  type: 'TEXT' | 'SYSTEM' | 'CALL_LOG';
  timestamp: number;
}

export interface RatingReview {
  id: string;
  dealId: string;
  fromUserId: string;
  toUserId: string;
  toUserName: string;
  toUserRole: UserRole;
  stars: number;
  reviewText?: string;
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SELL_REQUEST' | 'REMINDER_30M' | 'REMINDER_10M' | 'REMINDER_5M' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCEL_REQUEST' | 'OTP' | 'COMPLETED' | 'PRICE_ALERT';
  dealId?: string;
  requestId?: string;
  read: boolean;
  timestamp: number;
}

export interface DisputeRecord {
  id: string;
  dealId: string;
  dealCode: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByRole: UserRole;
  reason: string;
  description: string;
  evidenceNotes?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED_CANCELLED' | 'RESOLVED_UPHELD';
  adminDecision?: string;
  createdAt: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: number;
  action: string;
  entityType: 'DEAL' | 'LISTING' | 'REQUEST' | 'CANCELLATION' | 'PRICE' | 'VERIFICATION' | 'DISPUTE';
  entityId: string;
  details: string;
  performedBy: string;
}
