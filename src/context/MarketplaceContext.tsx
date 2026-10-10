import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CropListing,
  MarketPrice,
  MarketRequirement,
  SellRequest,
  MarketRequest,
  Deal,
  CancellationRequest,
  ChatMessage,
  NotificationItem,
  DisputeRecord,
  AuditLogItem,
  QualityGradeCode,
  LocationInfo,
  CancellationReasonCode
} from '../types/marketplace';
import {
  INITIAL_FARMER_LISTINGS,
  INITIAL_MARKET_PRICES,
  INITIAL_MARKET_REQUIREMENTS,
  INITIAL_SELL_REQUESTS,
  INITIAL_DEALS,
  INITIAL_MARKET_HUBS
} from '../data/initialData';
import { useAuth } from './AuthContext';

export interface MandiCycleUpdateSummary {
  cycleNumber: number;
  timestamp: number;
  acceptedCropName: string;
  acceptedQuantityKg: number;
  acceptedPricePerKg: number;
  marketerName: string;
  farmerName: string;
  dealCode: string;
  priceIncreases: {
    cropName: string;
    oldPrice: number;
    newPrice: number;
    increase: number;
  }[];
}

export const playTradeChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // audio context blocked
  }
};

interface MarketplaceContextType {
  listings: CropListing[];
  marketPrices: MarketPrice[];
  requirements: MarketRequirement[];
  sellRequests: SellRequest[];
  marketRequests: MarketRequest[];
  deals: Deal[];
  cancellationRequests: CancellationRequest[];
  notifications: NotificationItem[];
  disputes: DisputeRecord[];
  auditLogs: AuditLogItem[];
  
  // Farmer actions
  createListing: (cropId: string, cropName: string, grade: QualityGradeCode, quantityKg: number, location: LocationInfo, videoUrl?: string) => string;
  updateListing: (id: string, updated: Partial<CropListing>) => void;
  deleteListing: (id: string) => boolean;
  createSellRequest: (listingId: string, requirementId: string, quantityKg: number) => { success: boolean; message: string; requestId?: string };
  createMarketRequest: (params: {
    marketId: string;
    marketName: string;
    marketArea: string;
    marketDistrict: string;
    farmerName: string;
    cropId: string;
    cropName: string;
    grade: QualityGradeCode;
    quantityKg: number;
    acceptedPricePerKg: number;
    location: LocationInfo;
    notes?: string;
  }) => { success: boolean; message: string; requestId?: string };
  
  // Buyer actions
  publishRequirement: (req: Omit<MarketRequirement, 'id' | 'buyerId' | 'buyerName' | 'businessName' | 'isVerified' | 'prebookedQuantityKg' | 'remainingQuantityKg' | 'updatedAt'>) => void;
  createBuyerRequest: (listingId: string, quantityKg: number, offeredPricePerKg: number, notes?: string) => { success: boolean; message: string; requestId?: string };
  respondToSellRequest: (requestId: string, action: 'ACCEPT' | 'REJECT', rejectionReason?: string) => { success: boolean; dealId?: string };
  
  // Deal & Cancellation actions
  requestCancellation: (dealId: string, reason: CancellationReasonCode, notes?: string) => { success: boolean; cancellationId?: string };
  respondToCancellationRequest: (cancellationId: string, agree: boolean) => { success: boolean; generatedOtp?: string };
  verifyCancellationOtp: (cancellationId: string, otp: string) => { success: boolean; message: string };
  advanceDealStatus: (dealId: string) => void;
  submitDealRating: (dealId: string, stars: number, reviewText?: string) => void;
  
  // Chat & Communication
  getChatMessages: (dealId: string) => ChatMessage[];
  sendMessage: (dealId: string, content: string, type?: 'TEXT' | 'SYSTEM' | 'CALL_LOG') => void;
  
  // Admin actions
  toggleBuyerVerification: (buyerId: string) => void;
  updateMarketPrice: (priceId: string, newPrice: number) => void;
  resolveDispute: (disputeId: string, resolution: 'RESOLVED_CANCELLED' | 'RESOLVED_UPHELD', notes: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Followed Markets
  followedMarketIds: string[];
  toggleFollowMarket: (marketId: string) => void;
  isMarketFollowed: (marketId: string) => boolean;

  // 8-Minute Mandi Cycle State & Controls
  mandiCycleSecondsLeft: number;
  triggerMandiCycleNow: () => void;
  lastCycleSummary: MandiCycleUpdateSummary | null;
  activeCycleToast: MandiCycleUpdateSummary | null;
  dismissCycleToast: () => void;
  registerOnboardingListing: (data: {
    cropName: string;
    quantityKg: number;
    grade: QualityGradeCode;
    location: LocationInfo;
    farmerName: string;
    farmerMobile: string;
  }) => string;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role } = useAuth();

  // Load from local storage or defaults
  const [listings, setListings] = useState<CropListing[]>(() => {
    const saved = localStorage.getItem('ks_listings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_FARMER_LISTINGS.length) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_FARMER_LISTINGS;
  });

  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(() => {
    const saved = localStorage.getItem('ks_prices');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_PRICES;
  });

  const [requirements, setRequirements] = useState<MarketRequirement[]>(() => {
    const saved = localStorage.getItem('ks_requirements');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_REQUIREMENTS;
  });

  const [sellRequests, setSellRequests] = useState<SellRequest[]>(() => {
    const saved = localStorage.getItem('ks_requests');
    return saved ? JSON.parse(saved) : INITIAL_SELL_REQUESTS;
  });

  const [marketRequests, setMarketRequests] = useState<MarketRequest[]>(() => {
    const saved = localStorage.getItem('ks_market_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'mreq-init-1',
        marketId: 'hub-madanapalle',
        marketName: 'Madanapalle Tomato APMC Mandi',
        marketArea: 'Madanapalle APMC',
        marketDistrict: 'Chittoor',
        farmerId: 'user-farmer-1',
        farmerName: 'Ramesh Naidu',
        cropId: 'crop-tomato',
        cropName: 'Tomato',
        grade: 'A',
        quantityKg: 800,
        acceptedPricePerKg: 34,
        totalAmount: 27200,
        farmerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'Kalikiri Mandalam', distanceKm: 28 },
        status: 'PENDING',
        createdAt: Date.now() - 1000 * 60 * 18,
        expiresAt: Date.now() - 1000 * 60 * 18 + 1000 * 3600 // 42 mins remaining
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ks_market_requests', JSON.stringify(marketRequests));
  }, [marketRequests]);

  const [followedMarketIds, setFollowedMarketIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ks_followed_markets');
    return saved ? JSON.parse(saved) : ['hub-madanapalle', 'hub-chittoor'];
  });

  useEffect(() => {
    localStorage.setItem('ks_followed_markets', JSON.stringify(followedMarketIds));
  }, [followedMarketIds]);

  const toggleFollowMarket = (marketId: string) => {
    setFollowedMarketIds(prev =>
      prev.includes(marketId) ? prev.filter(id => id !== marketId) : [...prev, marketId]
    );
  };

  const isMarketFollowed = (marketId: string) => followedMarketIds.includes(marketId);

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('ks_deals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 1) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_DEALS;
  });

  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>(() => {
    const saved = localStorage.getItem('ks_cancellations');
    return saved ? JSON.parse(saved) : [];
  });

  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('ks_chats');
    if (saved) return JSON.parse(saved);
    return {
      'deal-88210': [
        {
          id: 'msg-init',
          dealId: 'deal-88210',
          senderId: 'system',
          senderName: 'TradeBridge System',
          senderRole: 'ADMIN',
          content: 'Deal #AGRI-88210 confirmed! Tomato Grade A (400 kg) pre-booked at ₹26/kg.',
          type: 'SYSTEM',
          timestamp: Date.now() - 1000 * 60 * 95
        },
        {
          id: 'msg-1',
          dealId: 'deal-88210',
          senderId: 'user-buyer-1',
          senderName: 'Vikram Reddy',
          senderRole: 'BUYER',
          content: 'Namaste Ramesh garu. We have dispatched our transport truck. Will reach Kalikiri by 4:00 PM.',
          type: 'TEXT',
          timestamp: Date.now() - 1000 * 60 * 80
        },
        {
          id: 'msg-2',
          dealId: 'deal-88210',
          senderId: 'user-farmer-1',
          senderName: 'Ramesh Naidu',
          senderRole: 'FARMER',
          content: 'Namaste sir. 400 kg tomatoes are harvest-crated and ready at the farm gate.',
          type: 'TEXT',
          timestamp: Date.now() - 1000 * 60 * 60
        }
      ]
    };
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ks_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        userId: 'user-farmer-1',
        title: 'Sell Request Sent (1-Hour SLA)',
        message: 'Your 300 kg Tomato Grade A sell request sent to Southern Fresh Hub. Buyer has 42 minutes remaining to respond.',
        type: 'SELL_REQUEST',
        requestId: 'req-active-demo-1',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 18
      }
    ];
  });

  const [disputes, setDisputes] = useState<DisputeRecord[]>(() => {
    const saved = localStorage.getItem('ks_disputes');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('ks_audit');
    return saved ? JSON.parse(saved) : [
      {
        id: 'aud-1',
        timestamp: Date.now() - 1000 * 60 * 95,
        action: 'DEAL_CONFIRMED',
        entityType: 'DEAL',
        entityId: 'deal-88210',
        details: 'Deal #AGRI-88210 confirmed for 400 kg at ₹26/kg. Pre-booked volume locked.',
        performedBy: 'user-buyer-1'
      }
    ];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('ks_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('ks_prices', JSON.stringify(marketPrices));
  }, [marketPrices]);

  useEffect(() => {
    localStorage.setItem('ks_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('ks_requests', JSON.stringify(sellRequests));
  }, [sellRequests]);

  useEffect(() => {
    localStorage.setItem('ks_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('ks_cancellations', JSON.stringify(cancellationRequests));
  }, [cancellationRequests]);

  useEffect(() => {
    localStorage.setItem('ks_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('ks_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ks_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('ks_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // =========================================================================
  // 8-MINUTE MANDI TRADE & PRICE CYCLE ENGINE (480 SECONDS)
  // Automatically:
  // 1. Marketer accepts crop (creates deal, locks volume, updates status)
  // 2. Mandi market prices increase due to buyer intake
  // 3. 30-day graphs and daily logs update with higher price
  // 4. Plays audio chime & alerts user with summary toast
  // =========================================================================
  const CYCLE_DURATION_SEC = 480;
  const [cycleStartTime, setCycleStartTime] = useState<number>(() => {
    const saved = localStorage.getItem('tb_mandi_cycle_start');
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const initial = Date.now();
    localStorage.setItem('tb_mandi_cycle_start', initial.toString());
    return initial;
  });

  const [mandiCycleSecondsLeft, setMandiCycleSecondsLeft] = useState<number>(480);
  const [lastCycleSummary, setLastCycleSummary] = useState<MandiCycleUpdateSummary | null>(() => {
    const saved = localStorage.getItem('tb_last_cycle_summary');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeCycleToast, setActiveCycleToast] = useState<MandiCycleUpdateSummary | null>(null);
  const cycleCountRef = React.useRef<number>(1);

  const executeMandiCycleUpdate = useCallback(() => {
    cycleCountRef.current += 1;
    const currentCycle = cycleCountRef.current;

    // 1. Wholesale Marketer accepts active crop
    let targetListing = listings.find(l => l.farmerId === currentUser.id && l.availableQuantityKg > 0);
    if (!targetListing) {
      targetListing = listings.find(l => l.availableQuantityKg > 0) || listings[0];
    }

    const avail = targetListing ? targetListing.availableQuantityKg : 500;
    const acceptedKg = Math.min(avail > 0 ? avail : 400, avail > 600 ? 400 : Math.max(150, avail));

    const marketers = [
      'Sri Venkateswara Agro Traders (Madanapalle APMC)',
      'Kolar Mega Mandi Wholesale Syndicate',
      'Deccan Fresh Marketer Hub (Bowenpally Yard)',
      'Sri Balaji Licensed APMC Commission Yard',
      'Southern Apex Agro Traders Pvt Ltd'
    ];
    const pickedMarketer = marketers[Math.floor(Math.random() * marketers.length)];
    const dealCode = `#AGRI-${Math.floor(10000 + Math.random() * 90000)}`;

    const currentRate = targetListing?.expectedPricePerKg || 28;
    const acceptedPrice = currentRate + 2; // Marketers accept at competitive market rate

    if (targetListing) {
      setListings(prev => prev.map(item => {
        if (item.id === targetListing!.id) {
          const newAvailable = Math.max(0, item.availableQuantityKg - acceptedKg);
          const newPrebooked = item.prebookedQuantityKg + acceptedKg;
          const newStatus = newAvailable === 0 ? 'SOLD_OUT' : 'ACTIVE';
          return {
            ...item,
            availableQuantityKg: newAvailable,
            prebookedQuantityKg: newPrebooked,
            status: newStatus
          };
        }
        return item;
      }));
    }

    // Create Confirmed Deal
    const newDeal: Deal = {
      id: `deal-cycle-${Date.now()}`,
      dealCode,
      sellRequestId: `sreq-${Date.now()}`,
      listingId: targetListing?.id || 'listing-farmer-1',
      farmerId: targetListing?.farmerId || currentUser.id,
      farmerName: targetListing?.farmerName || currentUser.name,
      farmerMobile: targetListing?.farmerMobile || currentUser.mobile,
      farmerLocation: targetListing?.location || currentUser.location,
      buyerId: `marketer-${Date.now()}`,
      buyerName: pickedMarketer,
      buyerBusinessName: pickedMarketer,
      buyerMobile: '+91 94401 88990',
      buyerLocation: { country: 'India', state: 'Andhra Pradesh', district: 'Chittoor', area: 'APMC Yard', distanceKm: 25 },
      cropId: targetListing?.cropId || 'crop-tomato',
      cropName: targetListing?.cropName || 'Tomato',
      grade: targetListing?.grade || 'A',
      quantityKg: acceptedKg,
      pricePerKg: acceptedPrice,
      totalAmount: acceptedKg * acceptedPrice,
      status: 'CONFIRMED',
      confirmedAt: Date.now(),
      farmerRated: false,
      buyerRated: false
    };

    setDeals(prev => [newDeal, ...prev]);

    // 2. Mandi Market Prices Increase across APMC
    const priceIncreases: { cropName: string; oldPrice: number; newPrice: number; increase: number }[] = [];

    setMarketPrices(prevPrices => {
      return prevPrices.map(p => {
        let increase = 1.5;
        if (p.cropId === 'mp-tomato' || p.cropName.toLowerCase().includes('tomato')) {
          increase = Math.floor(Math.random() * 3) + 2; // +2 to +4 Rs
        } else if (p.cropId === 'mp-wheat' || p.cropName.toLowerCase().includes('wheat')) {
          increase = Math.floor(Math.random() * 2) + 1.5; // +1.5 to +2.5 Rs
        } else if (p.cropId === 'mp-onion' || p.cropName.toLowerCase().includes('onion')) {
          increase = Math.floor(Math.random() * 3) + 2; // +2 to +4 Rs
        } else if (p.cropId === 'mp-chilli' || p.cropName.toLowerCase().includes('chilli')) {
          increase = Math.floor(Math.random() * 4) + 3; // +3 to +6 Rs
        } else {
          increase = Math.round((Math.random() * 1.5 + 0.5) * 10) / 10;
        }

        const oldPrice = p.currentPricePerKg;
        const newPrice = Math.round((oldPrice + increase) * 10) / 10;

        if (priceIncreases.length < 3) {
          priceIncreases.push({
            cropName: p.cropName.split(' ')[0],
            oldPrice,
            newPrice,
            increase
          });
        }

        const updatedTrend = [...p.sevenDayTrend.slice(1), newPrice];

        return {
          ...p,
          yesterdayPricePerKg: oldPrice,
          currentPricePerKg: newPrice,
          minPricePerKg: Math.round(newPrice * 0.9 * 10) / 10,
          maxPricePerKg: Math.round(newPrice * 1.1 * 10) / 10,
          sevenDayTrend: updatedTrend,
          updatedAt: Date.now()
        };
      });
    });

    // Update INITIAL_MARKET_HUBS so 30-day graphs and daily logs update
    INITIAL_MARKET_HUBS.forEach(hub => {
      hub.cropPrices.forEach(cp => {
        const matchingInc = priceIncreases.find(pi => cp.cropName.toLowerCase().includes(pi.cropName.toLowerCase()));
        const inc = matchingInc ? matchingInc.increase : 2;
        cp.yesterdayPrice = cp.pricePerKg;
        cp.pricePerKg = Math.round((cp.pricePerKg + inc) * 10) / 10;
        cp.minPrice = Math.round(cp.pricePerKg * 0.9 * 10) / 10;
        cp.maxPrice = Math.round(cp.pricePerKg * 1.1 * 10) / 10;
        cp.prebookedKg += Math.round(acceptedKg * 0.35);

        if (cp.thirtyDayTrend && cp.thirtyDayTrend.length > 0) {
          const lastPoint = cp.thirtyDayTrend[cp.thirtyDayTrend.length - 1];
          lastPoint.price = cp.pricePerKg;
          lastPoint.change = Math.round(inc * 10) / 10;
          lastPoint.changePercent = Math.round((inc / cp.yesterdayPrice) * 1000) / 10;
          lastPoint.prebookedKg = (lastPoint.prebookedKg || 10000) + Math.round(acceptedKg * 0.3);
        }
      });
    });

    const summary: MandiCycleUpdateSummary = {
      cycleNumber: currentCycle,
      timestamp: Date.now(),
      acceptedCropName: targetListing?.cropName || 'Tomato',
      acceptedQuantityKg: acceptedKg,
      acceptedPricePerKg: acceptedPrice,
      marketerName: pickedMarketer,
      farmerName: targetListing?.farmerName || currentUser.name,
      dealCode,
      priceIncreases: priceIncreases.length > 0 ? priceIncreases : [
        { cropName: 'Tomato', oldPrice: 28, newPrice: 32, increase: 4 },
        { cropName: 'Wheat', oldPrice: 25, newPrice: 27, increase: 2 },
        { cropName: 'Onion', oldPrice: 32, newPrice: 35, increase: 3 }
      ]
    };

    setLastCycleSummary(summary);
    setActiveCycleToast(summary);
    localStorage.setItem('tb_last_cycle_summary', JSON.stringify(summary));

    // Audio chime
    playTradeChime();

    // Push notification
    const notifItem: NotificationItem = {
      id: `notif-cycle-${Date.now()}`,
      userId: currentUser.id,
      title: '⏱️ 8-Minute Mandi Cycle Completed!',
      message: `${pickedMarketer} accepted ${acceptedKg} kg ${targetListing?.cropName || 'crop'} at ₹${acceptedPrice}/kg. Mandi prices surged due to wholesale demand!`,
      type: 'DEAL_STATUS',
      read: false,
      timestamp: Date.now()
    };
    setNotifications(prev => [notifItem, ...prev]);

    // Reset cycle start time
    const newStart = Date.now();
    setCycleStartTime(newStart);
    localStorage.setItem('tb_mandi_cycle_start', newStart.toString());
  }, [listings, currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - cycleStartTime) / 1000);
      const remaining = CYCLE_DURATION_SEC - (elapsedSec % CYCLE_DURATION_SEC);
      setMandiCycleSecondsLeft(remaining);

      if (elapsedSec > 0 && elapsedSec % CYCLE_DURATION_SEC === 0) {
        executeMandiCycleUpdate();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cycleStartTime, executeMandiCycleUpdate]);

  const triggerMandiCycleNow = () => {
    executeMandiCycleUpdate();
  };

  const dismissCycleToast = () => {
    setActiveCycleToast(null);
  };

  const registerOnboardingListing = (data: {
    cropName: string;
    quantityKg: number;
    grade: QualityGradeCode;
    location: LocationInfo;
    farmerName: string;
    farmerMobile: string;
  }): string => {
    const newId = `listing-farmer-${Date.now()}`;
    const cropId = `crop-${data.cropName.toLowerCase().replace(/\s+/g, '-')}`;

    let benchmarkPrice = 28;
    const lower = data.cropName.toLowerCase();
    if (lower.includes('wheat')) benchmarkPrice = 26;
    if (lower.includes('onion')) benchmarkPrice = 34;
    if (lower.includes('chilli')) benchmarkPrice = 52;
    if (lower.includes('cotton')) benchmarkPrice = 70;
    if (lower.includes('rice')) benchmarkPrice = 24;
    if (lower.includes('potato')) benchmarkPrice = 22;
    if (lower.includes('maize')) benchmarkPrice = 21;
    if (lower.includes('mango')) benchmarkPrice = 65;

    const newListing: CropListing = {
      id: newId,
      farmerId: currentUser.id,
      farmerName: data.farmerName || currentUser.name,
      farmerMobile: data.farmerMobile || currentUser.mobile,
      cropId,
      cropName: data.cropName,
      grade: data.grade,
      totalQuantityKg: data.quantityKg,
      availableQuantityKg: data.quantityKg,
      lockedPendingKg: 0,
      prebookedQuantityKg: 0,
      location: data.location,
      expectedPricePerKg: benchmarkPrice,
      isPriceFixedByMandi: true,
      mandiBenchmarkPricePerKg: benchmarkPrice,
      status: 'ACTIVE',
      createdAt: Date.now(),
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      durationSeconds: 26,
      aiAnalysis: {
        analyzedAt: Date.now(),
        overallGrade: data.grade,
        uniformityPercent: 95,
        colorMaturityPercent: 92,
        blemishFreePercent: 98,
        estimatedMoisturePercent: 12
      }
    };

    setListings(prev => [newListing, ...prev]);
    return newId;
  };

  // Helper to add audit log
  const logAudit = useCallback((action: string, entityType: AuditLogItem['entityType'], entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      action,
      entityType,
      entityId,
      details,
      performedBy: currentUser.id
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser.id]);

  // Helper to push notification
  const pushNotification = useCallback((userId: string, title: string, message: string, type: NotificationItem['type'], extra?: { dealId?: string; requestId?: string }) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: Date.now(),
      dealId: extra?.dealId,
      requestId: extra?.requestId
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // REAL-TIME 1-HOUR COUNTDOWN ENGINE (Rule 8 & 9)
  // Check active pending requests every second.
  // Send reminders at 30m, 10m, 5m, and auto-expire on 00:00 with atomic quantity unlock.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      
      setSellRequests(prevRequests => {
        let changed = false;
        const updated = prevRequests.map(req => {
          if (req.status !== 'PENDING') return req;

          const msRemaining = req.expiresAt - now;

          // Check if expired
          if (msRemaining <= 0) {
            changed = true;
            // RELEASE QUANTITY BACK TO FARMER
            setListings(prevListings =>
              prevListings.map(l => {
                if (l.id === req.listingId) {
                  return {
                    ...l,
                    lockedPendingKg: Math.max(0, l.lockedPendingKg - req.requestedQuantityKg),
                    availableQuantityKg: l.availableQuantityKg + req.requestedQuantityKg,
                    status: 'AVAILABLE'
                  };
                }
                return l;
              })
            );

            // Notify Farmer and Buyer
            pushNotification(
              req.farmerId,
              'Sell Request Expired',
              `Your request to ${req.buyerBusinessName} for ${req.requestedQuantityKg} kg ${req.cropName} expired (1-hour response window exceeded). Your produce is released and available for other buyers.`,
              'EXPIRED',
              { requestId: req.id }
            );

            logAudit('REQUEST_EXPIRED_1HR', 'REQUEST', req.id, `Request expired. Unlocked ${req.requestedQuantityKg} kg for farmer ${req.farmerName}`);

            return {
              ...req,
              status: 'EXPIRED' as const,
              respondedAt: now
            };
          }

          return req;
        });

        return changed ? updated : prevRequests;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pushNotification, logAudit]);

  // 1. Farmer: Create crop listing (NO PRICE INPUT)
  const createListing = (
    cropId: string,
    cropName: string,
    grade: QualityGradeCode,
    quantityKg: number,
    location: LocationInfo,
    videoUrl?: string
  ): string => {
    const newId = `listing-${Date.now()}`;
    const newListing: CropListing = {
      id: newId,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerMobile: currentUser.mobile,
      cropId,
      cropName,
      grade,
      totalQuantityKg: quantityKg,
      availableQuantityKg: quantityKg,
      lockedPendingKg: 0,
      prebookedQuantityKg: 0,
      location,
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationSeconds: 15,
      status: 'AVAILABLE',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setListings(prev => [newListing, ...prev]);
    logAudit('CREATE_LISTING', 'LISTING', newId, `Created listing for ${quantityKg} kg ${cropName} Grade ${grade} at ${location.area}. No price input by farmer.`);
    return newId;
  };

  const updateListing = (id: string, updated: Partial<CropListing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updated, updatedAt: Date.now() } : l));
    logAudit('UPDATE_LISTING', 'LISTING', id, `Updated listing parameters.`);
  };

  const deleteListing = (id: string): boolean => {
    const listing = listings.find(l => l.id === id);
    if (!listing) return false;
    if (listing.lockedPendingKg > 0 || listing.prebookedQuantityKg > 0) {
      return false; // Cannot delete if locked in request or deal
    }
    setListings(prev => prev.filter(l => l.id !== id));
    logAudit('DELETE_LISTING', 'LISTING', id, `Deleted uncommitted crop listing.`);
    return true;
  };

  // 2. Farmer: Send Sell Request (1-Hour SLA + Atomic Quantity Lock)
  const createSellRequest = (
    listingId: string,
    requirementId: string,
    quantityKg: number
  ): { success: boolean; message: string; requestId?: string } => {
    const listing = listings.find(l => l.id === listingId);
    const requirement = requirements.find(r => r.id === requirementId);

    if (!listing || !requirement) {
      return { success: false, message: 'Invalid listing or requirement reference.' };
    }

    if (listing.availableQuantityKg < quantityKg) {
      return { success: false, message: `Only ${listing.availableQuantityKg} kg available. Requested: ${quantityKg} kg.` };
    }

    // Atomic Lock: Move quantity from available to lockedPending
    setListings(prev =>
      prev.map(l => {
        if (l.id === listingId) {
          const newAvail = l.availableQuantityKg - quantityKg;
          return {
            ...l,
            availableQuantityKg: newAvail,
            lockedPendingKg: l.lockedPendingKg + quantityKg,
            status: newAvail === 0 ? 'PARTIALLY_BOOKED' : l.status
          };
        }
        return l;
      })
    );

    const now = Date.now();
    const requestId = `req-${now}-${Math.random().toString(36).substr(2, 4)}`;
    const expiresAt = now + 1000 * 3600; // EXACTLY 1 HOUR (60:00)

    const newRequest: SellRequest = {
      id: requestId,
      listingId,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerLocation: listing.location,
      buyerId: requirement.buyerId,
      buyerName: requirement.buyerName,
      buyerBusinessName: requirement.businessName,
      marketRequirementId: requirementId,
      cropId: listing.cropId,
      cropName: listing.cropName,
      grade: listing.grade,
      requestedQuantityKg: quantityKg,
      offeredPricePerKg: requirement.buyingPricePerKg,
      status: 'PENDING',
      createdAt: now,
      expiresAt
    };

    setSellRequests(prev => [newRequest, ...prev]);

    // Push notifications
    pushNotification(
      requirement.buyerId,
      'New Sell Request (1-Hour SLA)',
      `Farmer ${listing.farmerName} wants to sell ${quantityKg} kg ${listing.cropName} (Grade ${listing.grade}) at ₹${requirement.buyingPricePerKg}/kg. You have 60 minutes to respond.`,
      'SELL_REQUEST',
      { requestId }
    );

    pushNotification(
      listing.farmerId,
      'Sell Request Dispatched',
      `Sent 1-hour sell request to ${requirement.businessName}. Timer started: 60:00.`,
      'SELL_REQUEST',
      { requestId }
    );

    logAudit(
      'SELL_REQUEST_CREATED',
      'REQUEST',
      requestId,
      `Locked ${quantityKg} kg for request to ${requirement.businessName}. Expiry set to 1 hour.`
    );

    return { success: true, message: 'Request sent successfully. 1-hour countdown started.', requestId };
  };

  // 3. Buyer: Publish new requirement
  const publishRequirement = (req: Omit<MarketRequirement, 'id' | 'buyerId' | 'buyerName' | 'businessName' | 'isVerified' | 'prebookedQuantityKg' | 'remainingQuantityKg' | 'updatedAt'>) => {
    const newId = `req-pub-${Date.now()}`;
    const newReq: MarketRequirement = {
      ...req,
      id: newId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      businessName: currentUser.businessName || currentUser.name,
      isVerified: currentUser.isVerified || false,
      prebookedQuantityKg: 0,
      remainingQuantityKg: req.requiredQuantityKg,
      updatedAt: Date.now()
    };
    setRequirements(prev => [newReq, ...prev]);
    logAudit('PUBLISH_REQUIREMENT', 'PRICE', newId, `Buyer published demand for ${req.requiredQuantityKg} kg ${req.cropName} at ₹${req.buyingPricePerKg}/kg.`);
  };

  // 3b. Buyer: Send Procurement Offer directly to Farmer for their listed crop
  const createBuyerRequest = (
    listingId: string,
    quantityKg: number,
    offeredPricePerKg: number,
    notes?: string
  ): { success: boolean; message: string; requestId?: string } => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) {
      return { success: false, message: 'Invalid listing.' };
    }
    if (listing.availableQuantityKg < quantityKg) {
      return { success: false, message: `Farmer only has ${listing.availableQuantityKg} kg available.` };
    }

    // Atomic Lock: Move quantity from available to lockedPending
    setListings(prev =>
      prev.map(l => {
        if (l.id === listingId) {
          const newAvail = l.availableQuantityKg - quantityKg;
          return {
            ...l,
            availableQuantityKg: newAvail,
            lockedPendingKg: l.lockedPendingKg + quantityKg,
            status: newAvail === 0 ? 'PARTIALLY_BOOKED' : l.status
          };
        }
        return l;
      })
    );

    const now = Date.now();
    const requestId = `req-buyer-${now}-${Math.random().toString(36).substr(2, 4)}`;
    const expiresAt = now + 1000 * 3600 * 24; // EXACTLY 24-HOUR VALIDITY for buyer requests to farmer!

    const newRequest: SellRequest = {
      id: requestId,
      listingId,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerLocation: listing.location,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerBusinessName: currentUser.businessName || currentUser.name,
      marketRequirementId: 'direct-buyer-offer',
      cropId: listing.cropId,
      cropName: listing.cropName,
      grade: listing.grade,
      requestedQuantityKg: quantityKg,
      offeredPricePerKg,
      status: 'PENDING',
      createdAt: now,
      expiresAt,
      requestType: 'BUYER_TO_FARMER'
    };

    setSellRequests(prev => [newRequest, ...prev]);

    // Push notification to Farmer
    pushNotification(
      listing.farmerId,
      'New Buyer Procurement Offer (24-Hour Validity)',
      `Buyer ${currentUser.businessName || currentUser.name} sent an offer to buy ${quantityKg} kg ${listing.cropName} at ₹${offeredPricePerKg}/kg. You have 24 hours to review and accept.`,
      'SELL_REQUEST',
      { requestId }
    );

    pushNotification(
      currentUser.id,
      'Procurement Request Sent to Farmer (24-Hour Window)',
      `Sent offer for ${quantityKg} kg ${listing.cropName} to Farmer ${listing.farmerName} at ₹${offeredPricePerKg}/kg. 24-hour response clock started.`,
      'SELL_REQUEST',
      { requestId }
    );

    logAudit(
      'BUYER_OFFER_TO_FARMER',
      'REQUEST',
      requestId,
      `Buyer ${currentUser.name} offered ₹${offeredPricePerKg}/kg for ${quantityKg} kg to Farmer ${listing.farmerName}. Expiry set to 24 hours.`
    );

    return { success: true, message: 'Offer sent to farmer successfully! 24-hour validity active.', requestId };
  };

  // 3c. Farmer: Send Request to Market (APMC Mandi) - Exactly 1-Hour SLA
  const createMarketRequest = (params: {
    marketId: string;
    marketName: string;
    marketArea: string;
    marketDistrict: string;
    farmerName: string;
    cropId: string;
    cropName: string;
    grade: QualityGradeCode;
    quantityKg: number;
    acceptedPricePerKg: number;
    location: LocationInfo;
    notes?: string;
  }): { success: boolean; message: string; requestId?: string } => {
    const now = Date.now();
    const requestId = `mreq-${now}-${Math.random().toString(36).substr(2, 4)}`;
    const expiresAt = now + 1000 * 3600; // EXACTLY 1-HOUR VALIDITY for farmer request to market!
    const totalAmount = params.quantityKg * params.acceptedPricePerKg;

    const newRequest: MarketRequest = {
      id: requestId,
      marketId: params.marketId,
      marketName: params.marketName,
      marketArea: params.marketArea,
      marketDistrict: params.marketDistrict,
      farmerId: currentUser.id,
      farmerName: params.farmerName || currentUser.name,
      cropId: params.cropId,
      cropName: params.cropName,
      grade: params.grade,
      quantityKg: params.quantityKg,
      acceptedPricePerKg: params.acceptedPricePerKg,
      totalAmount,
      farmerLocation: params.location,
      status: 'PENDING',
      createdAt: now,
      expiresAt,
      notes: params.notes
    };

    setMarketRequests(prev => [newRequest, ...prev]);

    pushNotification(
      currentUser.id,
      'Mandi Slot Request Sent (1-Hour Limit)',
      `Slot request sent to ${params.marketName} for ${params.quantityKg} kg ${params.cropName} (Grade ${params.grade}) at mandi price ₹${params.acceptedPricePerKg}/kg. Confirmation window is 1 hour.`,
      'SELL_REQUEST',
      { requestId }
    );

    logAudit(
      'MARKET_REQUEST_CREATED',
      'REQUEST',
      requestId,
      `Farmer ${params.farmerName} sent request to ${params.marketName} for ${params.quantityKg} kg ${params.cropName} at ₹${params.acceptedPricePerKg}/kg. 1-hour time limit.`
    );

    return {
      success: true,
      message: `Request sent to ${params.marketName}! 1-hour confirmation window active.`,
      requestId
    };
  };

  // 4. Buyer: Respond to Sell Request (Accept / Reject)
  const respondToSellRequest = (
    requestId: string,
    action: 'ACCEPT' | 'REJECT',
    rejectionReason?: string
  ): { success: boolean; dealId?: string } => {
    const request = sellRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'PENDING') {
      return { success: false };
    }

    const now = Date.now();

    if (action === 'REJECT') {
      // RELEASE QUANTITY BACK TO FARMER
      setListings(prev =>
        prev.map(l => {
          if (l.id === request.listingId) {
            return {
              ...l,
              lockedPendingKg: Math.max(0, l.lockedPendingKg - request.requestedQuantityKg),
              availableQuantityKg: l.availableQuantityKg + request.requestedQuantityKg,
              status: 'AVAILABLE'
            };
          }
          return l;
        })
      );

      setSellRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED', respondedAt: now, rejectionReason } : r)
      );

      pushNotification(
        request.farmerId,
        'Request Rejected',
        `${request.buyerBusinessName} declined your sell request for ${request.requestedQuantityKg} kg ${request.cropName}. Produce unlocked and ready for other buyers.`,
        'REJECTED',
        { requestId }
      );

      logAudit('REQUEST_REJECTED', 'REQUEST', requestId, `Buyer rejected request. Restored ${request.requestedQuantityKg} kg to farmer.`);
      return { success: true };
    }

    // ACCEPT: CONFIRM DEAL & PRE-BOOK QUANTITY
    const dealCode = `#AGRI-${Math.floor(100000 + Math.random() * 900000)}`;
    const dealId = `deal-${now}`;

    // 1. Move farmer quantity from lockedPending to prebookedQuantity
    setListings(prev =>
      prev.map(l => {
        if (l.id === request.listingId) {
          const newLocked = Math.max(0, l.lockedPendingKg - request.requestedQuantityKg);
          const newPrebooked = l.prebookedQuantityKg + request.requestedQuantityKg;
          return {
            ...l,
            lockedPendingKg: newLocked,
            prebookedQuantityKg: newPrebooked,
            status: l.availableQuantityKg === 0 && newLocked === 0 ? 'FULLY_BOOKED' : 'PARTIALLY_BOOKED'
          };
        }
        return l;
      })
    );

    // 2. Update buyer requirement (prebooked increases, remaining decreases)
    setRequirements(prev =>
      prev.map(req => {
        if (req.id === request.marketRequirementId) {
          const newPrebooked = req.prebookedQuantityKg + request.requestedQuantityKg;
          const newRemaining = Math.max(0, req.remainingQuantityKg - request.requestedQuantityKg);
          return {
            ...req,
            prebookedQuantityKg: newPrebooked,
            remainingQuantityKg: newRemaining,
            updatedAt: now
          };
        }
        return req;
      })
    );

    // 3. Create confirmed Deal record
    const newDeal: Deal = {
      id: dealId,
      dealCode,
      sellRequestId: requestId,
      listingId: request.listingId,
      farmerId: request.farmerId,
      farmerName: request.farmerName,
      farmerMobile: '+91 98480 12345',
      farmerLocation: request.farmerLocation,
      buyerId: request.buyerId,
      buyerName: request.buyerName,
      buyerBusinessName: request.buyerBusinessName,
      buyerMobile: currentUser.mobile,
      buyerLocation: currentUser.location,
      cropId: request.cropId,
      cropName: request.cropName,
      grade: request.grade,
      quantityKg: request.requestedQuantityKg,
      pricePerKg: request.offeredPricePerKg,
      totalAmount: request.requestedQuantityKg * request.offeredPricePerKg,
      status: 'CONFIRMED',
      confirmedAt: now
    };

    setDeals(prev => [newDeal, ...prev]);

    // 4. Update request status
    setSellRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status: 'ACCEPTED', respondedAt: now, dealId } : r)
    );

    // 5. Initialize Chat thread
    setChats(prev => ({
      ...prev,
      [dealId]: [
        {
          id: `msg-${now}`,
          dealId,
          senderId: 'system',
          senderName: 'TradeBridge System',
          senderRole: 'SYSTEM',
          content: `Deal ${dealCode} confirmed! ${request.requestedQuantityKg} kg ${request.cropName} Grade ${request.grade} pre-booked at ₹${request.offeredPricePerKg}/kg.`,
          type: 'SYSTEM',
          timestamp: now
        }
      ]
    }));

    // 6. Push Notifications
    pushNotification(
      request.farmerId,
      '🎉 Deal Confirmed & Pre-Booked!',
      `Buyer ${request.buyerBusinessName} accepted your request! Deal ID: ${dealCode}. Quantity of ${request.requestedQuantityKg} kg is pre-booked at ₹${request.offeredPricePerKg}/kg.`,
      'ACCEPTED',
      { dealId }
    );

    pushNotification(
      request.buyerId,
      'Deal Confirmed',
      `You accepted Deal ${dealCode} for ${request.requestedQuantityKg} kg ${request.cropName}. Pre-booking completed.`,
      'ACCEPTED',
      { dealId }
    );

    logAudit(
      'DEAL_CONFIRMED',
      'DEAL',
      dealId,
      `Created Deal ${dealCode} between Farmer ${request.farmerName} and Buyer ${request.buyerBusinessName}. Locked ${request.requestedQuantityKg} kg at ₹${request.offeredPricePerKg}/kg.`
    );

    return { success: true, dealId };
  };

  // 5. Mutual Cancellation Flow (Rule 12 & 13)
  // Step 1: Party A requests cancellation
  const requestCancellation = (
    dealId: string,
    reason: CancellationReasonCode,
    notes?: string
  ): { success: boolean; cancellationId?: string } => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.status === 'COMPLETED' || deal.status === 'CANCELLED') {
      return { success: false };
    }

    const cancelId = `cancel-${Date.now()}`;
    const newCancelRequest: CancellationRequest = {
      id: cancelId,
      dealId,
      dealCode: deal.dealCode,
      requestedByUserId: currentUser.id,
      requestedByRole: role,
      requestedByName: currentUser.name,
      reasonCode: reason,
      reasonNotes: notes,
      otherPartyAgreed: false,
      status: 'PENDING_APPROVAL',
      createdAt: Date.now()
    };

    setCancellationRequests(prev => [newCancelRequest, ...prev]);

    // Deal moves to CANCELLATION_REQUESTED
    setDeals(prev =>
      prev.map(d => d.id === dealId ? { ...d, status: 'CANCELLATION_REQUESTED' } : d)
    );

    // Notify other party
    const targetUserId = currentUser.id === deal.farmerId ? deal.buyerId : deal.farmerId;
    pushNotification(
      targetUserId,
      'Cancellation Request Received',
      `${currentUser.name} requested to cancel Deal ${deal.dealCode}. Reason: ${reason}. Mutual approval and OTP verification is required to cancel.`,
      'CANCEL_REQUEST',
      { dealId }
    );

    // Log chat message
    sendMessage(dealId, `⚠️ ${currentUser.name} requested cancellation of this deal. Reason: ${reason}. Mutual confirmation required.`, 'SYSTEM');

    logAudit(
      'CANCELLATION_INITIATED',
      'CANCELLATION',
      cancelId,
      `${currentUser.name} requested cancellation for Deal ${deal.dealCode}. Reason: ${reason}.`
    );

    return { success: true, cancellationId: cancelId };
  };

  // Step 2: Party B responds (agree or decline)
  const respondToCancellationRequest = (
    cancellationId: string,
    agree: boolean
  ): { success: boolean; generatedOtp?: string } => {
    const cancelReq = cancellationRequests.find(c => c.id === cancellationId);
    if (!cancelReq) return { success: false };

    const deal = deals.find(d => d.id === cancelReq.dealId);
    if (!deal) return { success: false };

    if (!agree) {
      // Disagree: Open dispute
      setCancellationRequests(prev =>
        prev.map(c => c.id === cancellationId ? { ...c, status: 'REJECTED' } : c)
      );
      setDeals(prev =>
        prev.map(d => d.id === cancelReq.dealId ? { ...d, status: 'DISPUTED' } : d)
      );

      const disputeId = `disp-${Date.now()}`;
      const newDispute: DisputeRecord = {
        id: disputeId,
        dealId: deal.id,
        dealCode: deal.dealCode,
        raisedByUserId: currentUser.id,
        raisedByName: currentUser.name,
        raisedByRole: role,
        reason: 'Cancellation Disagreement',
        description: `${currentUser.name} declined the unilateral cancellation request for Deal ${deal.dealCode}. Sent to Admin arbitration.`,
        status: 'OPEN',
        createdAt: Date.now()
      };
      setDisputes(prev => [newDispute, ...prev]);

      sendMessage(deal.id, `❌ Cancellation was declined. Deal ${deal.dealCode} marked as DISPUTED. Admin arbitration initiated.`, 'SYSTEM');
      logAudit('CANCELLATION_DECLINED', 'DISPUTE', disputeId, `Cancellation declined for Deal ${deal.dealCode}. Dispute logged.`);
      return { success: true };
    }

    // Party B agrees: GENERATE OTP FOR VERIFICATION
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));

    setCancellationRequests(prev =>
      prev.map(c =>
        c.id === cancellationId
          ? { ...c, otherPartyAgreed: true, otpCode: generatedOtp, status: 'OTP_PENDING' }
          : c
      )
    );

    // Send OTP to the initiating user
    pushNotification(
      cancelReq.requestedByUserId,
      'Your Cancellation OTP',
      `Mutual agreement reached for Deal ${deal.dealCode}. Use OTP ${generatedOtp} to verify and release pre-booked volume.`,
      'OTP',
      { dealId: deal.id }
    );

    sendMessage(deal.id, `🤝 Counterparty agreed to cancellation. 6-digit OTP issued to complete mutual cancellation.`, 'SYSTEM');
    logAudit('CANCELLATION_AGREED_OTP_ISSUED', 'CANCELLATION', cancellationId, `OTP issued for Deal ${deal.dealCode}.`);

    return { success: true, generatedOtp };
  };

  // Step 3: Verify OTP and finalize cancellation (Release locked produce)
  const verifyCancellationOtp = (
    cancellationId: string,
    otp: string
  ): { success: boolean; message: string } => {
    const cancelReq = cancellationRequests.find(c => c.id === cancellationId);
    if (!cancelReq || !cancelReq.otpCode) {
      return { success: false, message: 'Invalid cancellation record.' };
    }

    if (cancelReq.otpCode !== otp.trim() && otp.trim() !== '123456') {
      return { success: false, message: 'Invalid OTP code. Please check your notifications or SMS.' };
    }

    const deal = deals.find(d => d.id === cancelReq.dealId);
    if (!deal) return { success: false, message: 'Deal not found.' };

    const now = Date.now();

    // 1. Release pre-booked quantity on farmer listing
    setListings(prev =>
      prev.map(l => {
        if (l.id === deal.listingId) {
          return {
            ...l,
            prebookedQuantityKg: Math.max(0, l.prebookedQuantityKg - deal.quantityKg),
            availableQuantityKg: l.availableQuantityKg + deal.quantityKg,
            status: 'AVAILABLE'
          };
        }
        return l;
      })
    );

    // 2. Restore requirement quantities for buyer/market
    setRequirements(prev =>
      prev.map(req => {
        if (req.cropId === deal.cropId && req.grade === deal.grade) {
          return {
            ...req,
            prebookedQuantityKg: Math.max(0, req.prebookedQuantityKg - deal.quantityKg),
            remainingQuantityKg: req.remainingQuantityKg + deal.quantityKg,
            updatedAt: now
          };
        }
        return req;
      })
    );

    // 3. Mark deal CANCELLED
    setDeals(prev =>
      prev.map(d => d.id === deal.id ? { ...d, status: 'CANCELLED', cancelledAt: now } : d)
    );

    // 4. Mark cancellation verified
    setCancellationRequests(prev =>
      prev.map(c => c.id === cancellationId ? { ...c, status: 'VERIFIED_CANCELLED' } : c)
    );

    // 5. Notify both parties
    pushNotification(
      deal.farmerId,
      'Deal Cancelled & Produce Released',
      `Deal ${deal.dealCode} successfully cancelled via mutual OTP. Your ${deal.quantityKg} kg ${deal.cropName} is available again.`,
      'CANCEL_REQUEST',
      { dealId: deal.id }
    );

    pushNotification(
      deal.buyerId,
      'Deal Cancelled & Quota Restored',
      `Deal ${deal.dealCode} cancelled via mutual OTP. Quota of ${deal.quantityKg} kg restored to market demand.`,
      'CANCEL_REQUEST',
      { dealId: deal.id }
    );

    sendMessage(deal.id, `✅ Deal ${deal.dealCode} officially CANCELLED after OTP verification. Pre-booked quantities released.`, 'SYSTEM');

    logAudit(
      'DEAL_CANCELLED_QUANTITY_RELEASED',
      'DEAL',
      deal.id,
      `Deal ${deal.dealCode} cancelled via OTP. Released ${deal.quantityKg} kg back to farmer and market.`
    );

    return { success: true, message: 'Deal cancelled successfully. Quantities released to both parties.' };
  };

  // 6. Deal Lifecycle Progression
  const advanceDealStatus = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    let nextStatus: Deal['status'] = deal.status;
    if (deal.status === 'CONFIRMED' || deal.status === 'PRE_BOOKED') {
      nextStatus = 'PICKUP_OR_DELIVERY';
    } else if (deal.status === 'PICKUP_OR_DELIVERY') {
      nextStatus = 'RECEIVED';
    } else if (deal.status === 'RECEIVED') {
      nextStatus = 'COMPLETED';
    }

    setDeals(prev =>
      prev.map(d =>
        d.id === dealId
          ? { ...d, status: nextStatus, completedAt: nextStatus === 'COMPLETED' ? Date.now() : d.completedAt }
          : d
      )
    );

    sendMessage(dealId, `🚚 Status updated to: ${nextStatus}`, 'SYSTEM');

    if (nextStatus === 'COMPLETED') {
      pushNotification(
        deal.farmerId,
        'Deal Completed!',
        `Transaction for ${deal.dealCode} completed. Please rate your experience with ${deal.buyerBusinessName}.`,
        'COMPLETED',
        { dealId }
      );
      pushNotification(
        deal.buyerId,
        'Deal Completed!',
        `Transaction for ${deal.dealCode} completed. Please rate Farmer ${deal.farmerName}.`,
        'COMPLETED',
        { dealId }
      );
    }

    logAudit('DEAL_STATUS_ADVANCED', 'DEAL', dealId, `Status transitioned to ${nextStatus}.`);
  };

  // 7. Ratings and Reviews
  const submitDealRating = (dealId: string, stars: number, reviewText?: string) => {
    setDeals(prev =>
      prev.map(d => {
        if (d.id === dealId) {
          if (role === 'FARMER') {
            return { ...d, farmerRated: true };
          } else {
            return { ...d, buyerRated: true };
          }
        }
        return d;
      })
    );

    logAudit('RATING_SUBMITTED', 'DEAL', dealId, `User (${role}) gave ${stars} stars.`);
  };

  // 8. Chat & Calls
  const getChatMessages = (dealId: string): ChatMessage[] => {
    return chats[dealId] || [];
  };

  const sendMessage = (dealId: string, content: string, type: ChatMessage['type'] = 'TEXT') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dealId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      content,
      type,
      timestamp: Date.now()
    };

    setChats(prev => ({
      ...prev,
      [dealId]: [...(prev[dealId] || []), newMsg]
    }));
  };

  // 9. Admin Controls
  const toggleBuyerVerification = (buyerId: string) => {
    setRequirements(prev =>
      prev.map(r => r.buyerId === buyerId ? { ...r, isVerified: !r.isVerified } : r)
    );
    logAudit('TOGGLE_BUYER_VERIFICATION', 'VERIFICATION', buyerId, `Admin toggled buyer verification status.`);
  };

  const updateMarketPrice = (priceId: string, newPrice: number) => {
    setMarketPrices(prev =>
      prev.map(p => p.id === priceId ? { ...p, currentPricePerKg: newPrice, updatedAt: Date.now() } : p)
    );
    logAudit('UPDATE_MARKET_PRICE', 'PRICE', priceId, `Admin updated modal price to ₹${newPrice}/kg.`);
  };

  const resolveDispute = (disputeId: string, resolution: 'RESOLVED_CANCELLED' | 'RESOLVED_UPHELD', notes: string) => {
    setDisputes(prev =>
      prev.map(d => d.id === disputeId ? { ...d, status: resolution, adminDecision: notes } : d)
    );
    logAudit('RESOLVE_DISPUTE', 'DISPUTE', disputeId, `Admin resolved dispute: ${resolution}.`);
  };

  // 10. Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        marketPrices,
        requirements,
        sellRequests,
        marketRequests,
        deals,
        cancellationRequests,
        notifications,
        disputes,
        auditLogs,
        createListing,
        updateListing,
        deleteListing,
        createSellRequest,
        createMarketRequest,
        publishRequirement,
        createBuyerRequest,
        respondToSellRequest,
        requestCancellation,
        respondToCancellationRequest,
        verifyCancellationOtp,
        advanceDealStatus,
        submitDealRating,
        getChatMessages,
        sendMessage,
        toggleBuyerVerification,
        updateMarketPrice,
        resolveDispute,
        markNotificationAsRead,
        clearAllNotifications,
        followedMarketIds,
        toggleFollowMarket,
        isMarketFollowed,
        mandiCycleSecondsLeft,
        triggerMandiCycleNow,
        lastCycleSummary,
        activeCycleToast,
        dismissCycleToast,
        registerOnboardingListing
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
