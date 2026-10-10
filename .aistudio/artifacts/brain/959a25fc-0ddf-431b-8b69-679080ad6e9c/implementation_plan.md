# KisanSetu (किसानसेतु / కిసాన్ సేతు) — India-Wide Agricultural Marketplace Architecture Blueprint

> **System Purpose**: A mobile-first, high-trust pan-India agricultural trading exchange designed to eliminate monopsonistic local middlemen. Farmers discover transparent market prices across APMC mandis and private buyers, upload video-verified crop listings with quality grades, and initiate 1-hour time-boxed sell requests with strictly enforced concurrency quantity locking, mutual OTP cancellation protection, and end-to-end deal lifecycle tracking.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core design decisions are established for the initial production architecture. Please review and click **Proceed** to authorize Phase 1 implementation.

- **Confirmed Decision 1 (Brand & Identity)**: **KisanSetu** (किसानसेतु / కిసాన్ సేతు), embodying a direct digital bridge between rural cultivators and verified commercial buyers. Built mobile-first with high-contrast daylight ergonomics, touch-target discipline ($\ge 48\text{px}$), and trilingual localization (English, Telugu, Hindi) with instant language switching.
- **Confirmed Decision 2 (Zero-Price-Input Farmer Rule)**: The farmer never sets a selling price. The farmer specifies Crop Name, Uploads Inspection Video, Available Quantity (kg/quintals/crates), Quality Grade (A/B/C), and Geo-Location. Real-time market clearing is driven by transparent buyer bids and mandi prices.
- **Confirmed Decision 3 (Strict Concurrency & Quantity Locking)**: Quantity locking is enforced at the database transaction layer using atomic balance decrements (`available_qty` $\rightarrow$ `locked_pending_qty` $\rightarrow$ `prebooked_qty`). Prevents double-booking across concurrent buyers.
- **Confirmed Decision 4 (1-Hour Response SLA & Mutual Cancellation Protection)**: Every farmer request starts an exact 60:00 server-backed countdown timer with automated buyer reminder triggers at 30m, 10m, and 5m. Confirmed deals can never be unilaterally cancelled; mutual cancellation requires a 6-digit OTP verified transaction release.
- **Confirmed Decision 5 (Real-Time Full-Stack Engine)**: Node.js Express full-stack architecture with WebSockets (`ws`), transactional state store, and persistent audit logs, serving mobile and desktop viewports seamlessly.

---

## 1. Overview & Core Concept

### What It Does
KisanSetu connects smallholder and commercial farmers directly with agricultural traders, wholesale buyers, food processors, and APMC commission agents across India. Farmers record/upload short harvest videos, specify crop grade and volume, and immediately inspect transparent area-wise market bids across Chittoor, Tirupati, Nellore, Hyderabad, Bengaluru, Azadpur, Vashi, and beyond.

### Target Personas
1. **Small & Medium Farmers**: Mobile-first users who need simple language, voice/visual clarity, large touch targets, transparent mandi comparisons, and zero financial exploitation.
2. **Buyers / Traders / Mandi Aggregators**: Bulk agricultural procurers who specify exact grade criteria, minimum/maximum intake volumes, buying prices per kg/quintal, and require guaranteed volume fulfillment without double-selling.
3. **Mandi Officers & Admin Overseers**: Platform guardians who verify buyer credentials (GST, FSSAI, APMC trader licenses), monitor price trends, audit suspicious price reporting, resolve disputes, and maintain fair trading rules.

### Key Value Delivered
- **Elimination of Middleman Information Asymmetry**: Farmers see what buyers 100km or 1000km away are actually paying right now.
- **No Unrealistic Price Guarantees**: Factual price reporting with last-updated freshness timestamps and estimated net prices (accounting for road freight estimates).
- **Hard Trading Guarantees**: 1-hour response countdowns, atomic quantity locking, and OTP-backed mutual cancellation guarantees.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Ergonomics (Mobile-First Agricultural Theme)
- **Design Philosophy**: High-legibility utilitarian agricultural mobile app following the universal frontend design constitution and mobile touch ergonomics.
- **Color Palette (60-30-10 Rule)**:
  - *Dominant Canvas (60%)*: Crisp sunlight-friendly background (`#F8FAF8` off-white / `#0B130E` dark mode) with warm earthen undertones.
  - *Structural Surfaces (30%)*: Muted sage/emerald cards (`#FFFFFF` with `#E2EBE2` hairline borders; `#142218` in dark mode).
  - *Action Accent (10%)*: Deep agricultural emerald green (`#15803D` / `#16A34A`) for primary actions; Amber (`#D97706`) for 1-hour countdowns; Crimson (`#DC2626`) for disputes/cancellations.
- **Typography**: Clean humanist sans (`Plus Jakarta Sans` or `Manrope`) paired with tabular numerals (`tabular-nums`) for currency (₹) and metric measurements (kg, Qtl).
- **Anti-Slop Discipline**: Zero unboxed pill sandwiches. Metadata rendered as unboxed text separated by subtle middots (`·`). No arbitrary "innovation scores" or decorative pulsing dots. Clean tabular headers and natural human labels.

### Visual Architecture Diagram

```
+--------------------------------------------------------------------------+
|  [Logo] KisanSetu किसानसेतु         [Language: EN | తె | हि]     [User Switch]  |
+--------------------------------------------------------------------------+
|  TOP SEARCH & REGIONAL MANDI TICKER (Transparent Freshness & Freight Est.) |
|  "Tomato (Grade A) · Hyderabad: ₹26/kg (15m ago) · Chittoor: ₹22/kg"      |
+--------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------+  +--------------------------------+ |
|  | FARMER ACTIVE VIEW              |  | BUYER & MARKET DISCOVERY       | |
|  | - My Crop: Tomato (500 kg, Gr A)|  | - Hyderabad Market: Needs 5k | |
|  | - Video Inspection Clip         |  |   ₹26/kg · Rem: 3,000 kg       | |
|  | - Status: 3 Matching Buyers     |  | - Bengaluru Market: ₹28/kg     | |
|  | - Active: #AGRI-8821 (32m left) |  |   Est Freight: ₹3/kg -> Net ₹25| |
|  +---------------------------------+  +--------------------------------+ |
|                                                                          |
|  [+ UPLOAD CROP VIDEO] Large Floating / Thumb-Zone Action Button         |
+--------------------------------------------------------------------------+
|  BOTTOM NAVIGATION (Touch Target >= 48px)                                 |
|  [ 🏠 HOME ]   [ 📊 MARKETS ]   [ ➕ SELL ]   [ 💬 CHATS ]   [ 👤 PROFILE ] |
+--------------------------------------------------------------------------+
```

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Why | Rejected Alternative |
| :--- | :--- | :--- | :--- |
| **Price Determination** | Farmer posts **zero price**; matches against buyer/market published bids. | Prevents unrealistic farmer asking prices while empowering farmers to pick the highest real cash bid. | Traditional classifieds where farmers post arbitrary prices that go unsold. |
| **Response Window** | Hard **60-minute countdown SLA** per sell request. | Eliminates buyer ghosting and frees the farmer's produce quickly if uninterested. | Indefinite pending requests that hold perishable goods hostage. |
| **Quantity Allocation** | Two-phase lock: `available` $\rightarrow$ `locked_pending` (for 1 hr) $\rightarrow$ `prebooked` upon accept. | Guarantees neither farmer nor buyer double-commit fresh harvest to multiple parties. | Optimistic unreserved requests leading to frequent fulfillment failures. |
| **Cancellation** | Two-party mutual consent + 6-digit OTP verification. | Prevents sudden price-drop buyer bailouts or farmer reneging after transport is booked. | One-click unilateral cancellation buttons. |
| **Low Connectivity** | Client-side video chunking, offline local price caching, progressive image preview. | Rural network conditions often experience 2G/3G packet drops. | High-bitrate uncompressed video uploads that fail repeatedly. |

---

## 4. Complete System Architecture & Engineering Specifications (Items A through N)

### A. Refined Product Requirements
1. **Farmer Role**: OTP authentication, location hierarchy (India $\rightarrow$ State $\rightarrow$ District $\rightarrow$ Mandal/Taluk $\rightarrow$ Village), zero-price video crop listing, nationwide mandi price browser, freight net estimator, 1-click sell request, active request countdown viewer, mutual cancellation requester, deal tracker, buyer rating.
2. **Buyer/Trader Role**: Business profile with APMC/GST verification, publish crop procurement requirements (Target crop, grade, required volume, unit price ₹/kg, min/max lot size, validity), inbox for incoming sell requests with 60-min timer, accept/reject controls, mutual cancellation approval with OTP generation, completed deal rating.
3. **Admin Role**: Platform oversight, user credential verification, price reporting audits (flagging outlier bids), dispute arbitration console, audit log explorer, ban/suspend abusive accounts.

---

### B. Complete User Journeys

#### 1. Farmer Journey
```
[Login / OTP] 
       │
       ▼
[Tap "+"] ──► [Record/Upload Crop Video] ──► [Select Crop, Qty (kg), Grade (A/B/C)]
                                                          │
                                                          ▼
[Review Matches Engine] ◄────────────── [Listing Published (Price = Auto-Market)]
       │
       ├─► Inspect Market A: ₹24/kg (Local - 15 km)
       └─► Inspect Market B: ₹28/kg (Distant - Net ₹25 after freight)
       │
       ▼
[Press "Request to Sell" to Market B]
       │
       ▼
[State: REQUEST_SENT / PENDING_1_HOUR]
       │
       ├──► Buyer Accepts (within 60 min) ──► [DEAL CONFIRMED / PRE-BOOKED]
       │                                              │
       │                                              ├──► Dispatch / Delivery
       │                                              ├──► Mutual Cancel Request (Requires OTP)
       │                                              └──► Mark Complete ──► [Rate Buyer]
       │
       └──► Buyer Rejects OR Timer Reaches 00:00 ──► [EXPIRED / RELEASED]
                                                          │
                                                          └──► Pick Alternative Buyer
```

#### 2. Buyer Journey
```
[Login / Business Verification]
       │
       ▼
[Post Requirement]: Tomato Gr A, ₹26/kg, Need 5,000 kg, Min 200 kg, Max 2,000 kg
       │
       ▼
[Push Notification / Alert]: "New Sell Request from Farmer Ramesh (500 kg)"
       │
       ▼
[Open Request Details]: Inspect Crop Video Clip, Farmer Rating, Distance
       │
       ├─► [REJECT]: Request terminated, quantity restored to farmer immediately.
       │
       └─► [ACCEPT within 60 min countdown]:
                 │
                 ▼
          [Deal #AGRI123456 Created]
          - Pre-booked Qty increases by 500 kg
          - Remaining needed reduces to 4,500 kg
          - Direct in-app chat & masked call enabled
                 │
                 ▼
          [Delivery Verified] ──► [Deal Completed] ──► [Rate Farmer]
```

#### 3. Admin Journey
```
[Admin Console Secure Auth]
       │
       ├─► [Verify Buyers / Mandi Licenses] (Audit GST / Mandi Pass)
       ├─► [Market Price Freshness Sentinel] (Flag prices older than 24h)
       ├─► [Dispute Resolution Console] (Review evidence when mutual cancellation fails)
       └─► [Audit Logs & Transaction Concurrency Monitor]
```

---

### C. Complete Screen Map & Navigation Architecture

```
KisanSetu Application Shell
├── 1. Auth Flow
│   ├── /login (Mobile Number Input + OTP Form)
│   ├── /onboarding (Role Selection: Farmer vs Buyer vs Admin)
│   └── /profile-setup (Location: State, District, Mandal, Village)
│
├── 2. Primary Tab Navigation (Fixed Bottom Bar)
│   ├── Tab 1: HOME (/home)
│   │   ├── Active Sell Requests (Live 60-min countdown banners)
│   │   ├── My Crop Listings (Video thumbnail, Grade, Available Qty)
│   │   ├── Live Mandi Ticker (Top price movers & regional benchmarks)
│   │   └── Suggested Buyer Matches for current farmer crops
│   │
│   ├── Tab 2: MARKETS (/markets)
│   │   ├── India-wide Search Bar (Hierarchical: State > District > Market)
│   │   ├── Crop Filter Pills (Tomato, Onion, Potato, Cotton, Chilli, etc.)
│   │   ├── Market Detail View (/markets/:id)
│   │   │   ├── Mandi General Rates vs Verified Buyer Live Requirements
│   │   │   ├── Remaining Volume Progress Bar (Pre-booked vs Needed)
│   │   │   └── Estimated Freight & Net Realization Calculator
│   │   └── Price Trend Chart (7-day historical mandi rates with caveat disclaimer)
│   │
│   ├── Tab 3: UPLOAD / SELL [+][Center Thumb Action] (/sell/create)
│   │   ├── Step 1: Camera Video Capture / File Picker (with quality preview)
│   │   ├── Step 2: Crop Selector & Variety
│   │   ├── Step 3: Quantity Input (kg / quintal)
│   │   ├── Step 4: Quality Grade (Grade A: Premium, Grade B: Standard, Grade C: Fair)
│   │   └── Step 5: Geo-Location Confirm & Publish
│   │
│   ├── Tab 4: CHATS & CALLS (/communication)
│   │   ├── Active Conversations list (grouped by Deal ID #AGRI...)
│   │   └── Deal Chat Room (/communication/:dealId)
│   │       ├── Live Deal Card (Status, Price, Qty, Pre-booked status)
│   │       ├── Text & System Status Updates
│   │       └── Privacy-Masked Call Trigger
│   │
│   └── Tab 5: PROFILE (/profile)
│       ├── Profile Header & Trust Verification Badge
│       ├── My Active Deals & Deal History (Confirmed, Completed, Cancelled)
│       ├── Language Switcher Modal (English, తెలుగు, हिन्दी)
│       └── Dispute / Report Center
│
└── 3. Admin Dashboard (/admin - Role Protected)
    ├── /admin/verifications (Pending buyer business proof approvals)
    ├── /admin/markets (APMC & spot price management & override)
    ├── /admin/deals (Global state monitor & stuck timer intervention)
    ├── /admin/disputes (Evidence review & arbitration)
    └── /admin/audit-logs (Security & concurrency ledger)
```

---

### D. Complete Database Schema (Normalized PostgreSQL / Relational Spec)

```sql
-- 1. USERS & PROFILES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('FARMER', 'BUYER', 'ADMIN')),
    full_name VARCHAR(100) NOT NULL,
    language_pref VARCHAR(10) DEFAULT 'en' CHECK (language_pref IN ('en', 'te', 'hi')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(50) DEFAULT 'India',
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    sub_district_mandal VARCHAR(50) NOT NULL,
    area_village VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE farmer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id),
    land_size_acres DECIMAL(6,2),
    avatar_url TEXT,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0
);

CREATE TABLE buyer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50) CHECK (business_type IN ('WHOLESALER', 'PROCESSOR', 'COMMISSION_AGENT', 'EXPORTER', 'RETAILER')),
    location_id UUID REFERENCES locations(id),
    gst_number VARCHAR(20),
    apmc_license_no VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0
);

-- 2. CROPS & QUALITY GRADES
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_te VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    standard_unit VARCHAR(10) DEFAULT 'kg',
    category VARCHAR(50) NOT NULL,
    icon_url TEXT
);

CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    grade_code VARCHAR(10) NOT NULL CHECK (grade_code IN ('A', 'B', 'C')),
    specifications_json JSONB NOT NULL,
    UNIQUE (crop_id, grade_code)
);

-- 3. CROP LISTINGS (FARMER - ZERO PRICE INPUT)
CREATE TABLE crop_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    grade_code VARCHAR(10) NOT NULL,
    total_quantity_kg DECIMAL(12,2) NOT NULL CHECK (total_quantity_kg > 0),
    available_quantity_kg DECIMAL(12,2) NOT NULL CHECK (available_quantity_kg >= 0),
    locked_pending_kg DECIMAL(12,2) DEFAULT 0.00 CHECK (locked_pending_kg >= 0),
    prebooked_quantity_kg DECIMAL(12,2) DEFAULT 0.00 CHECK (prebooked_quantity_kg >= 0),
    location_id UUID REFERENCES locations(id),
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'PARTIALLY_BOOKED', 'FULLY_BOOKED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_quantity_sum CHECK (available_quantity_kg + locked_pending_kg + prebooked_quantity_kg = total_quantity_kg)
);

CREATE TABLE crop_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES crop_listings(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INT,
    file_size_bytes BIGINT,
    compression_status VARCHAR(20) DEFAULT 'READY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MARKETS & BUYER REQUIREMENTS
CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    location_id UUID REFERENCES locations(id),
    market_type VARCHAR(50) DEFAULT 'APMC_MANDI' CHECK (market_type IN ('APMC_MANDI', 'PRIVATE_MARKET', 'DIRECT_YARD')),
    is_verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE market_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    market_id UUID REFERENCES markets(id),
    crop_id UUID REFERENCES crops(id),
    grade_code VARCHAR(10) NOT NULL,
    buying_price_per_kg DECIMAL(10,2) NOT NULL CHECK (buying_price_per_kg > 0),
    required_quantity_kg DECIMAL(12,2) NOT NULL CHECK (required_quantity_kg > 0),
    prebooked_quantity_kg DECIMAL(12,2) DEFAULT 0.00 CHECK (prebooked_quantity_kg >= 0),
    remaining_quantity_kg DECIMAL(12,2) NOT NULL CHECK (remaining_quantity_kg >= 0),
    min_order_quantity_kg DECIMAL(12,2) DEFAULT 50.00,
    max_order_quantity_kg DECIMAL(12,2),
    additional_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_market_quantities CHECK (prebooked_quantity_kg + remaining_quantity_kg = required_quantity_kg)
);

CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id UUID REFERENCES markets(id),
    crop_id UUID REFERENCES crops(id),
    grade_code VARCHAR(10) NOT NULL,
    modal_price_per_kg DECIMAL(10,2) NOT NULL,
    min_price_per_kg DECIMAL(10,2) NOT NULL,
    max_price_per_kg DECIMAL(10,2) NOT NULL,
    recorded_date DATE NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'APMC_DAILY_BULLETIN',
    is_estimate BOOLEAN DEFAULT FALSE,
    UNIQUE(market_id, crop_id, grade_code, recorded_date)
);

-- 5. SELL REQUESTS (1-HOUR COUNTDOWN)
CREATE TABLE sell_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES crop_listings(id) ON DELETE RESTRICT,
    farmer_id UUID REFERENCES users(id),
    buyer_id UUID REFERENCES users(id),
    requirement_id UUID REFERENCES market_requirements(id),
    requested_quantity_kg DECIMAL(12,2) NOT NULL CHECK (requested_quantity_kg > 0),
    offered_price_per_kg DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- EXACTLY created_at + INTERVAL '1 hour'
    responded_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- 6. DEALS & PRE-BOOKINGS
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. #AGRI123456
    sell_request_id UUID UNIQUE REFERENCES sell_requests(id),
    farmer_id UUID REFERENCES users(id),
    buyer_id UUID REFERENCES users(id),
    crop_id UUID REFERENCES crops(id),
    grade_code VARCHAR(10) NOT NULL,
    quantity_kg DECIMAL(12,2) NOT NULL,
    agreed_price_per_kg DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(14,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'CONFIRMED' CHECK (status IN (
        'CONFIRMED',
        'PRE_BOOKED',
        'DISPATCHED',
        'RECEIVED',
        'COMPLETED',
        'CANCELLATION_REQUESTED',
        'CANCELLED',
        'DISPUTED'
    )),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MUTUAL CANCELLATIONS & OTP
CREATE TABLE cancellation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id) ON DELETE RESTRICT,
    requested_by_user_id UUID REFERENCES users(id),
    reason_code VARCHAR(50) NOT NULL CHECK (reason_code IN (
        'QUANTITY_UNAVAILABLE',
        'QUALITY_MISMATCH',
        'TRANSPORTATION_PROBLEM',
        'BUYER_CHANGED_REQUIREMENT',
        'FARMER_CHANGED_DECISION',
        'OTHER'
    )),
    reason_details TEXT,
    other_party_agreed BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'PENDING_APPROVAL' CHECK (status IN (
        'PENDING_APPROVAL',
        'OTP_PENDING',
        'CANCELLED',
        'REJECTED',
        'DISPUTED'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE otp_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('LOGIN', 'CANCELLATION_CONFIRM', 'DELIVERY_CONFIRM')),
    entity_id UUID, -- deal_id or cancellation_id
    otp_hash VARCHAR(128) NOT NULL,
    attempts INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CHATS & REAL-TIME COMMUNICATIONS
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID UNIQUE REFERENCES deals(id),
    farmer_id UUID REFERENCES users(id),
    buyer_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    message_type VARCHAR(20) DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'SYSTEM_UPDATE', 'STATUS_CHANGE', 'CALL_LOG')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. RATINGS, REVIEWS & DISPUTES
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    written_review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(deal_id, from_user_id)
);

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    raised_by_user_id UUID REFERENCES users(id),
    reason_category VARCHAR(50) NOT NULL,
    evidence_urls JSONB,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED_CANCELLED', 'RESOLVED_ENFORCED', 'DISMISSED')),
    admin_notes TEXT,
    resolved_by_admin_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    prev_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### E. Comprehensive API Specification

| Endpoint | Method | Role | Description & Payload |
| :--- | :--- | :--- | :--- |
| `/api/auth/send-otp` | `POST` | Public | Initiates SMS OTP for mobile number. |
| `/api/auth/verify-otp` | `POST` | Public | Validates OTP; returns JWT bearer token + user profile. |
| `/api/listings` | `POST` | Farmer | Uploads crop details (name, qty, grade, location, video_url). **Price input disallowed**. |
| `/api/listings/mine` | `GET` | Farmer | Returns farmer's crop listings with breakdown: available, locked, prebooked. |
| `/api/listings/:id` | `PATCH/DELETE` | Farmer | Edits or withdraws uncommitted listing quantity. |
| `/api/markets/search` | `GET` | All | Hierarchical query (`state`, `district`, `crop`, `grade`); returns spot prices & buyer bids. |
| `/api/requirements` | `POST` | Buyer | Creates procurement requirement (Crop, grade, price/kg, needed qty, min/max). |
| `/api/requirements/active` | `GET` | All | Returns active buyer demands with pre-booked vs remaining quantities. |
| `/api/matching/find-buyers` | `POST` | Farmer | Evaluates farmer's listing ID against buyer demands; returns scored, ranked list. |
| `/api/requests/create` | `POST` | Farmer | Triggers sell request. Starts 60-min timer. Atomically locks quantity. |
| `/api/requests/:id/respond` | `POST` | Buyer | Accept or reject. If accept: transitions to deal and pre-books volume. |
| `/api/requests/active` | `GET` | Both | Returns pending requests with exact remaining milliseconds for sync countdown. |
| `/api/deals/:id` | `GET` | Both/Admin | Deal details, agreement terms, audit timeline, and transport status. |
| `/api/deals/:id/request-cancel`| `POST` | Both | Starts mutual cancellation flow; requires reason category. |
| `/api/deals/:id/respond-cancel`| `POST` | Both | Other party approves/declines; on approve, triggers OTP generation. |
| `/api/deals/:id/verify-cancel-otp`| `POST` | Both | Submits OTP. On success: releases pre-booked quantity and marks `CANCELLED`. |
| `/api/deals/:id/complete` | `POST` | Both | Marks pickup/delivery confirmed; unlocks rating form. |
| `/api/deals/:id/rate` | `POST` | Both | Submits 1-to-5 star rating and review. |
| `/api/disputes` | `POST` | Both | Flags fraudulent behavior, price manipulation, or unilateral breach. |
| `/api/admin/verifications` | `POST` | Admin | Grants or revokes "Verified Buyer" / "Verified Market" credentials. |

---

### F. Deal State Machine & State Transitions

```
                    ┌─────────────────────────┐
                    │   FARMER CROP LISTING   │ (Available Qty: 100%)
                    └────────────┬────────────┘
                                 │
                     Farmer clicks "Request to Sell"
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      REQUEST_SENT       │ ◄─── Atomic Lock:
                    │    (PENDING_1_HOUR)     │      Qty moved from Available to Locked
                    └──────┬────────────┬─────┘
                           │            │
            Buyer Rejects  │            │ Timer Reaches 00:00 (60 mins)
                           ▼            ▼
                    ┌────────────┐┌────────────┐
                    │  REJECTED  ││  EXPIRED   │ ───► Released: Qty restored to Available
                    └────────────┘└────────────┘
                           │ (Buyer Accepts within 60 mins)
                           ▼
                    ┌─────────────────────────┐
                    │     DEAL CONFIRMED      │ ◄─── Unique Deal ID Generated (#AGRI123456)
                    │      (PRE_BOOKED)       │      Qty moved from Locked to Pre-booked
                    └──────┬────────────┬─────┘
                           │            │
        Normal Fulfillment │            │ Cancellation Requested by either party
                           │            ▼
                           │    ┌─────────────────────────┐
                           │    │ CANCELLATION_REQUESTED  │ (No single-click cancel)
                           │    └────────────┬────────────┘
                           │                 │
                           │     Other party agrees to cancel
                           │                 ▼
                           │    ┌─────────────────────────┐
                           │    │    OTP_VERIFICATION     │ (6-digit secure code sent)
                           │    └────────────┬────────────┘
                           │                 │
                           │     OTP successfully verified
                           │                 ▼
                           │    ┌─────────────────────────┐
                           │    │     DEAL CANCELLED      │ ───► Pre-booked quantity released;
                           │    └─────────────────────────┘      Quantities restored to market & farmer
                           │
                           ▼
                    ┌─────────────────────────┐
                    │  PICKUP_OR_DELIVERY     │
                    └────────────┬────────────┘
                                 │
                      Goods inspected & received
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     DEAL COMPLETED      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     MUTUAL RATINGS      │ (Farmer rates Buyer & Buyer rates Farmer)
                    └─────────────────────────┘
```

---

### G. Cancellation Protection State Machine & OTP Protocol

1. **Initiation**: Either party presses **"Request Cancellation"**. Single-click cancellation is strictly forbidden.
2. **Reason Selection**: User selects one mandatory reason (`QUANTITY_UNAVAILABLE`, `QUALITY_MISMATCH`, `TRANSPORTATION_PROBLEM`, `BUYER_CHANGED_REQUIREMENT`, `FARMER_CHANGED_DECISION`, `OTHER`) and submits notes.
3. **Counterparty Notification**: Deal enters `CANCELLATION_REQUESTED`. Counterparty receives immediate push/SMS/in-app alert.
4. **Counterparty Response**:
   - **Disagree**: Deal is NOT cancelled. System opens **Dispute Resolution** dialog. Admin alerted.
   - **Agree**: Counterparty clicks "Agree to Cancel". System generates a cryptographically secure 6-digit OTP sent to the party requesting cancellation.
5. **OTP Verification**: Initiating party submits the OTP. 
6. **Atomic Rollback**:
   - `deals.status = 'CANCELLED'`
   - `crop_listings.available_quantity_kg += deal.quantity_kg`
   - `crop_listings.prebooked_quantity_kg -= deal.quantity_kg`
   - `market_requirements.remaining_quantity_kg += deal.quantity_kg`
   - `market_requirements.prebooked_quantity_kg -= deal.quantity_kg`
   - Audit log recorded with timestamps and reason.

---

### H. Multi-Factor Matching Algorithm Design

When a farmer inspects matches for a listing, the engine computes a **Match Suitability Score (0 to 100)** without ever telling the farmer where they "must" sell:

$$\text{Score} = w_{\text{crop}} \cdot S_{\text{crop}} + w_{\text{grade}} \cdot S_{\text{grade}} + w_{\text{vol}} \cdot S_{\text{vol}} + w_{\text{price}} \cdot S_{\text{price}} + w_{\text{dist}} \cdot S_{\text{dist}}$$

- **1. Crop Match ($S_{\text{crop}} \in \{0, 1\}$)**: Must match exactly (weight = 30%).
- **2. Grade Match ($S_{\text{grade}}$)**: Grade A matches Grade A requirements (1.0). Grade A can fulfill Grade B with farmer consent (0.8). Grade B cannot fulfill Grade A (0.0) (weight = 25%).
- **3. Quantity Fit ($S_{\text{vol}}$)**: Checks if Listing Quantity fits within Buyer's `[min_order_qty, remaining_qty]` (weight = 20%).
- **4. Net Price Realization ($S_{\text{price}}$)**: 
  $$\text{Net Price} = \text{Buyer Offered Price} - \text{Estimated Freight Cost per kg}$$
  High net price yields higher rank (weight = 15%).
- **5. Distance & Logistics ($S_{\text{dist}}$)**: Distance calculated via Haversine or pincode zones (weight = 10%).

*Output presented to Farmer*: "3 suitable buyers found. Highest buyer offer: ₹28/kg in Bengaluru (Est. net ₹25/kg after freight). Nearest buyer: ₹24/kg in Tirupati (15 km)."

---

### I. Recommended Technology Stack

- **Client Frontend**: React 19 + TypeScript + Vite. Mobile-first layout with Tailwind CSS. Lucide icons for high-contrast accessibility. Touch targets $\ge 48\text{px}$.
- **Server Backend**: Node.js + Express 4.x + TypeScript (`tsx`).
- **Real-Time Layer**: Native WebSocket (`ws`) server on port 3000 handling live 1-hour countdown synch, push chat, and instant quantity state broadcasts.
- **Persistence Layer**: Relational data model with transactional locking (`BEGIN` / `FOR UPDATE` semantics) implemented cleanly with atomic persistence guards.
- **Media Engine**: HTML5 MediaStream Camera API for direct field recording + responsive video player + mock progressive compression and chunked upload pipeline.
- **Localization**: Trilingual i18n dictionary system (English, Telugu, Hindi) for all UI labels, error strings, and crop taxonomies.

---

### J. Scalable Project & Clean Architecture Structure

```
├── server.ts                       # Express + WebSocket unified server (Port 3000)
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Core state shell, router, and providers
│   ├── index.css                   # Tailwind v4 import & responsive tokens
│   │
│   ├── components/                 # Reusable UI component library
│   │   ├── layout/                 # Mobile Top App Bar, Bottom Tab Bar, Desktop Container
│   │   ├── common/                 # Buttons, TabularBadges, Modal, CountdownTimer, VideoPlayer
│   │   ├── listings/               # CropListingCard, VideoRecorderModal, GradeSelector
│   │   ├── markets/                # MarketPriceRow, FreightCalculator, VolumeProgressBar
│   │   ├── deals/                  # DealStatusBadge, CancellationModal, OTPModal, RatingDialog
│   │   └── chat/                   # DealChatWindow, SystemEventBubble, CallTrigger
│   │
│   ├── context/                    # React Contexts
│   │   ├── AuthContext.tsx         # Active role switcher (Farmer/Buyer/Admin) + OTP auth
│   │   ├── LanguageContext.tsx     # Trilingual switch (EN/TE/HI) with localized string table
│   │   └── MarketplaceContext.tsx  # Live listings, market requirements, active deals & sync
│   │
│   ├── data/                       # Initial data seeds & regional taxonomies
│   │   ├── cropsData.ts            # Indian crops (Tomato, Onion, Chilli, Rice, Cotton, Mango)
│   │   ├── marketsData.ts          # Major APMC & private yards (Chittoor, Tirupati, Hyderabad, etc.)
│   │   └── translations.ts         # Complete English, Telugu, Hindi translation tables
│   │
│   ├── types/                      # Strict TypeScript entity definitions
│   │   └── marketplace.ts          # Deals, Listings, Requirements, Requests, Audits
│   │
│   └── utils/                      # Helper algorithms
│       ├── matchingEngine.ts       # Multi-factor matching scoring
│       ├── freightEstimator.ts     # Zone & distance-based transportation cost calculation
│       └── formatters.ts           # Indian currency (₹), quintal/kg weights, relative time
│
├── metadata.json                   # AI Studio app metadata
└── package.json                    # Dependencies & scripts
```

---

### K. Security, Anti-Fraud & Quantity Concurrency Architecture

1. **Zero Client Price Injection**: The server rejects any farmer listing creation payload containing a `price` field.
2. **Atomic Balance Invariant**: Every database mutation on quantity strictly respects:
   $$\text{total\_qty} = \text{available\_qty} + \text{locked\_pending\_qty} + \text{prebooked\_qty}$$
   A mutex lock is acquired per `crop_listing_id` and `market_requirement_id` during request initiation and acceptance. If `available_quantity_kg < requested_quantity_kg`, the request fails immediately with `HTTP 409 Conflict`.
3. **Server-Authoritative Clock**: The 1-hour expiration timestamp is set strictly by server clock `NOW() + 3600 seconds`. Client clock tampering cannot extend the countdown.
4. **Anti-Spam & Rate Limiting**: Farmers can only hold a maximum of 3 concurrent `PENDING` requests for the same crop batch.
5. **Private Call Masking**: Calls between farmers and buyers route through platform virtual numbers or simulated secure VOIP bridge without exposing personal mobile numbers on public listings.

---

### L. 14-Phase Implementation & Verification Plan

- **Phase 1: Foundation & Identity**: Configure `metadata.json`, HTML SEO headers, trilingual localization system (EN/TE/HI), mobile navigation bar.
- **Phase 2: Authentication & Profile**: OTP login simulation, role selector (Farmer, Buyer, Admin), location picker (State $\rightarrow$ District $\rightarrow$ Area).
- **Phase 3: Farmer Listing & Video Capture**: Native camera recording, video playback, crop/grade/quantity input (strict zero-price rule).
- **Phase 4: Buyer Requirements & Mandi Prices**: APMC market prices, buyer procurement bids with required/pre-booked/remaining volumes.
- **Phase 5: Search & Matching Engine**: Multi-factor matching algorithm comparing farmer lots with buyer demands, including freight calculation.
- **Phase 6: 1-Hour Request System**: Sell request dispatch, real-time 60:00 synchronized countdown timer, automated 30m/10m/5m alerts.
- **Phase 7: Deals & Pre-Booking**: Acceptance workflow, unique Deal ID generation, atomic transition from locked to pre-booked volume.
- **Phase 8: In-App Chat & Masked Calling**: Deal-linked messaging, system status alerts, phone privacy protection.
- **Phase 9: Mutual Cancellation & OTP**: Cancellation initiation, counterparty consent, 6-digit OTP verification, automatic quantity rollback.
- **Phase 10: Fulfillment & Ratings**: Delivery confirmation, 5-star rating and written review submission, duplicate rating prevention.
- **Phase 11: Real-Time Notification Center**: Push alerts for new bids, reminders, approvals, expirations, and cancellations.
- **Phase 12: Admin Governance Console**: Buyer verification, mandi price overrides, dispute arbitration, transaction audit logs.
- **Phase 13: Offline & Low-Connectivity Resilience**: Offline market price caching, video compression feedback, optimistic updates.
- **Phase 14: Verification & Compilation**: Comprehensive end-to-end testing across scenarios; `compile_applet` validation.

---

### M. Real-World Agricultural Risks & Edge Cases

1. **Perishable Harvest Volatility**: When perishable crops (tomatoes, chillies) are in `PENDING_1_HOUR` status, a buyer who lets the timer expire wastes 1 hour of the farmer's market window. *Mitigation*: Automated buyer reminders at 30, 10, and 5 minutes; buyers with recurring expirations receive a strike and decreased trust score.
2. **Quality Discrepancy at Farmgate**: Buyer arrives and claims tomatoes are Grade B instead of Grade A shown in video. *Mitigation*: The video clip is permanently attached to the Deal ID as cryptographic proof. If mutual cancellation fails, admin inspects video evidence in the Dispute Center.
3. **Network Drops During Harvest Video Upload**: Farmers often experience spotty 4G in fields. *Mitigation*: Client-side compression, frame extraction preview, and local offline resume capability.
4. **Sudden Wholesale Market Crash**: Market price crashes while request is pending. Buyer might attempt unilateral cancellation. *Mitigation*: Unilateral cancellation is impossible; mutual OTP verification or formal dispute arbitration is enforced.

---

### N. Strategic Decision Points & Architecture Questions

1. **SMS Gateway Integration**: For production rollout, should OTP delivery integrate with standard Indian DLT-registered gateways (e.g., Twilio / Fast2SMS / Gupshup)? *(The initial system provides a reliable in-app OTP modal with auto-fill simulation for instant evaluation).*
2. **Transportation Logistics Integration**: Would you like to connect a 3rd-party rural trucking API (e.g., Porter, AgriLogistics) in future phases, or maintain the algorithmic freight rate estimator based on distance ($₹/km/kg$)?
3. **Payment Escrow vs. Farmgate Cash on Delivery**: The system currently tracks deal confirmation and farmgate physical receipt; an optional UPI/escrow payment lock can be integrated into the state machine if required.
