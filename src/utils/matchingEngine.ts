import { CropListing, MarketRequirement } from '../types/marketplace';

export interface MatchingResult {
  requirement: MarketRequirement;
  score: number; // 0 to 100
  cropMatch: boolean;
  gradeMatch: boolean;
  quantityFits: boolean;
  estimatedFreightPerKg: number;
  estimatedNetPricePerKg: number;
  distanceKm: number;
  matchReasons: string[];
}

/**
 * Calculates estimated freight cost per kg based on road distance in India.
 * Note: Clearly labeled in UI as an estimate based on standard regional truckloads.
 */
export function estimateFreightPerKg(distanceKm: number): number {
  if (distanceKm <= 25) {
    return 0.8; // Local tractor / mini-truck
  } else if (distanceKm <= 80) {
    return 1.4; // Intra-district transport
  } else if (distanceKm <= 200) {
    return 2.5; // Neighboring district / state border
  } else if (distanceKm <= 550) {
    return 3.6; // Regional hub transport
  } else if (distanceKm <= 1000) {
    return 4.8; // Interstate trunk freight
  } else {
    return 6.2; // Long-distance reefer / national freight
  }
}

/**
 * Multi-Factor Matching Algorithm
 * Factors:
 * 1. Crop ID exact match (30 points)
 * 2. Grade compatibility (25 points)
 * 3. Quantity fulfillment fit within buyer min/max bounds (20 points)
 * 4. Net price realization after transportation (15 points)
 * 5. Proximity and logistics ease (10 points)
 */
export function matchListingWithBuyers(
  listing: CropListing,
  requirements: MarketRequirement[]
): MatchingResult[] {
  const results: MatchingResult[] = [];

  for (const req of requirements) {
    // 1. Crop must match
    const cropMatch = req.cropId === listing.cropId;
    if (!cropMatch) continue;

    // 2. Grade Compatibility
    // Grade A listing can fulfill Grade A, Grade B or Grade C requirement
    // Grade B listing can fulfill Grade B or Grade C requirement
    // Grade C listing can only fulfill Grade C requirement
    let gradeScore = 0;
    let gradeMatch = false;

    if (listing.grade === req.grade) {
      gradeScore = 25;
      gradeMatch = true;
    } else if (listing.grade === 'A' && (req.grade === 'B' || req.grade === 'C')) {
      gradeScore = 20; // Premium crop can downgrade if farmer desires
      gradeMatch = true;
    } else {
      gradeScore = 0;
      gradeMatch = false;
    }

    if (!gradeMatch) continue;

    // 3. Quantity Fit
    // Does the listing available quantity fit into remaining required quantity and min order?
    let qtyScore = 0;
    const fitsMin = listing.availableQuantityKg >= req.minOrderQuantityKg;
    const fitsMax = !req.maxOrderQuantityKg || listing.availableQuantityKg <= req.maxOrderQuantityKg;
    const fitsRemaining = req.remainingQuantityKg > 0;
    const quantityFits = fitsMin && fitsRemaining;

    if (quantityFits) {
      if (listing.availableQuantityKg <= req.remainingQuantityKg) {
        qtyScore = 20;
      } else {
        qtyScore = 15; // Listing has more than remaining, can fulfill partially
      }
    } else {
      qtyScore = 5;
    }

    // 4. Distance & Freight calculation
    const distanceKm = req.location.distanceKm ?? 100;
    const estimatedFreightPerKg = estimateFreightPerKg(distanceKm);
    const estimatedNetPricePerKg = Math.max(1, req.buyingPricePerKg - estimatedFreightPerKg);

    // Score based on net realization
    let priceScore = Math.min(15, Math.max(5, (estimatedNetPricePerKg / 30) * 15));

    // Distance proximity score (closer is better)
    let distScore = 0;
    if (distanceKm <= 50) distScore = 10;
    else if (distanceKm <= 200) distScore = 8;
    else if (distanceKm <= 500) distScore = 5;
    else distScore = 2;

    const totalScore = Math.round(30 + gradeScore + qtyScore + priceScore + distScore);

    const matchReasons: string[] = [];
    matchReasons.push(`Grade ${listing.grade} matched with buyer requirement`);
    if (quantityFits) {
      matchReasons.push(`Your ${listing.availableQuantityKg} kg fits buyer intake (Need: ${req.remainingQuantityKg} kg)`);
    }
    matchReasons.push(`Buyer pays ₹${req.buyingPricePerKg}/kg (Est. net ₹${estimatedNetPricePerKg.toFixed(1)}/kg after ₹${estimatedFreightPerKg.toFixed(1)}/kg freight)`);

    results.push({
      requirement: req,
      score: totalScore,
      cropMatch: true,
      gradeMatch: true,
      quantityFits,
      estimatedFreightPerKg,
      estimatedNetPricePerKg: Number(estimatedNetPricePerKg.toFixed(2)),
      distanceKm,
      matchReasons
    });
  }

  // Sort by highest net realization, then highest total score
  return results.sort((a, b) => b.estimatedNetPricePerKg - a.estimatedNetPricePerKg || b.score - a.score);
}

/**
 * Format milliseconds into countdown MM:SS or HH:MM:SS
 */
export function formatCountdown(msRemaining: number): { formatted: string; isUrgent: boolean; isCritical: boolean } {
  if (msRemaining <= 0) {
    return { formatted: '00:00 (EXPIRED)', isUrgent: true, isCritical: true };
  }

  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    return {
      formatted: `${hh}h ${mm}m ${ss}s`,
      isUrgent: hours < 2,
      isCritical: hours < 1
    };
  }

  return {
    formatted: `${mm}:${ss}`,
    isUrgent: minutes < 10,
    isCritical: minutes < 5
  };
}

/**
 * Format Indian currency
 */
export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}
