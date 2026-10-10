/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/layout/Header';
import { BottomNav, TabId } from './components/layout/BottomNav';
import { HomeView } from './components/home/HomeView';
import { MarketsView } from './components/markets/MarketsView';
import { DealsListView } from './components/deals/DealsListView';
import { ProfileView } from './components/profile/ProfileView';
import { UploadListingModal } from './components/sell/UploadListingModal';
import { MatchingBuyersModal } from './components/matching/MatchingBuyersModal';
import { CancellationModal } from './components/deals/CancellationModal';
import { RatingModal } from './components/deals/RatingModal';
import { ChatModal } from './components/chat/ChatModal';
import { ChatHubView } from './components/chat/ChatHubView';
import { CropListing, Deal } from './types/marketplace';
import { LoginOnboardingModal, OnboardingData } from './components/auth/LoginOnboardingModal';
import { MandiCycleBanner } from './components/common/MandiCycleBanner';

const MainAppContent: React.FC = () => {
  const { role, isLoggedIn, isLoginModalOpen, setIsLoginModalOpen, completeOnboarding } = useAuth();
  const { listings, deals, registerOnboardingListing } = useMarketplace();

  const [activeTab, setActiveTab] = useState<TabId>('HOME');

  const handleOnboardingSuccess = (data: OnboardingData) => {
    completeOnboarding(data);
    if (data.role === 'FARMER') {
      registerOnboardingListing({
        cropName: data.cropName,
        quantityKg: data.quantityKg,
        grade: data.grade,
        location: data.location,
        farmerName: data.name,
        farmerMobile: data.mobile
      });
    }
  };

  // Selected chat contact for direct navigation
  const [selectedChatContactId, setSelectedChatContactId] = useState<string | null>(null);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [matchingListing, setMatchingListing] = useState<CropListing | null>(null);
  const [selectedDealForChat, setSelectedDealForChat] = useState<Deal | null>(null);
  const [openCallDirectly, setOpenCallDirectly] = useState(false);
  const [selectedDealForCancel, setSelectedDealForCancel] = useState<Deal | null>(null);
  const [activeCancellationId, setActiveCancellationId] = useState<string | null>(null);
  const [selectedDealForRating, setSelectedDealForRating] = useState<Deal | null>(null);

  // Quick navigation handlers
  const handleOpenMatchingBuyers = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setMatchingListing(listing);
    }
  };

  const handleListingCreated = (newListingId: string) => {
    const listing = listings.find(l => l.id === newListingId);
    if (listing) {
      setMatchingListing(listing);
    }
  };

  const handleDealConfirmed = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedChatContactId(deal.buyerId || 'user-buyer-1');
    }
    setActiveTab('CHATS');
  };

  const handleOpenChat = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedChatContactId(deal.buyerId || 'user-buyer-1');
    }
    setActiveTab('CHATS');
  };

  const handleOpenCall = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDealForChat(deal);
      setOpenCallDirectly(true);
    }
  };

  const handleRequestCancel = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDealForCancel(deal);
      setActiveCancellationId(null);
    }
  };

  const handleViewCancellationProgress = (cancellationId: string) => {
    setActiveCancellationId(cancellationId);
    const deal = deals[0]; // fallback
    setSelectedDealForCancel(deal);
  };

  const handleOpenRating = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDealForRating(deal);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DFD3C3] via-[#ECE3D6] to-[#D5C5B0] flex justify-center selection:bg-amber-200 selection:text-amber-950">
      {/* Mobile-First Smartphone Container in Light Brown Theme */}
      <div className="w-full max-w-md min-h-screen bg-[#F5EFEB] text-[#2C1D13] flex flex-col shadow-2xl relative border-x border-[#D8C7B3] overflow-x-hidden">
        {/* Top Header with light brown & emerald theme + pending requests in notifications */}
        <Header onDealConfirmed={handleDealConfirmed} />

        {/* 8-Minute Mandi Trade & Price Cycle Live Counter & Alerts */}
        <MandiCycleBanner />

        {/* Main Mobile Screen View */}
        <main className="flex-1 w-full pb-20">
          {activeTab === 'HOME' && (
            <HomeView
              onOpenSellModal={() => setShowUploadModal(true)}
              onOpenMatchingBuyers={handleOpenMatchingBuyers}
              onNavigateToMarkets={() => setActiveTab('MARKETS')}
              onDealConfirmed={handleDealConfirmed}
            />
          )}

          {activeTab === 'MARKETS' && <MarketsView />}

          {activeTab === 'CHATS' && (
            <ChatHubView
              initialContactId={selectedChatContactId}
              onOpenDealProgress={handleOpenChat}
              onOpenCall={handleOpenCall}
              onRequestCancel={handleRequestCancel}
              onOpenRating={handleOpenRating}
              onViewCancellationProgress={handleViewCancellationProgress}
            />
          )}

          {activeTab === 'PROFILE' && (
            <ProfileView
              onOpenSellModal={() => setShowUploadModal(true)}
              onSelectListing={handleOpenMatchingBuyers}
              onNavigateToMarkets={() => setActiveTab('MARKETS')}
              onOpenDealChat={handleOpenChat}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'CHATS') {
              // Reset direct selection if user clicked bottom nav directly
              setSelectedChatContactId(null);
            }
            setActiveTab(tab);
          }}
          onOpenSellModal={() => setShowUploadModal(true)}
        />

        {/* MODAL 1: Upload Crop Video & Listing (Strictly No Farmer Price Input) */}
        <UploadListingModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onListingCreated={handleListingCreated}
        />

        {/* MODAL 2: Scored Matching Buyers (Shows buyer offers, freight, and net realization) */}
        <MatchingBuyersModal
          listing={matchingListing}
          isOpen={!!matchingListing}
          onClose={() => setMatchingListing(null)}
          onRequestSent={() => {
            setMatchingListing(null);
            setActiveTab('HOME');
          }}
        />

        {/* MODAL 3: In-App Deal Chat & Privacy-Masked Audio Calling */}
        <ChatModal
          deal={selectedDealForChat}
          isOpen={!!selectedDealForChat}
          onClose={() => {
            setSelectedDealForChat(null);
            setOpenCallDirectly(false);
          }}
          openCallDirectly={openCallDirectly}
        />

        {/* MODAL 4: Mutual Cancellation Protection & OTP Verification */}
        <CancellationModal
          deal={selectedDealForCancel}
          cancellationId={activeCancellationId}
          isOpen={!!selectedDealForCancel}
          onClose={() => {
            setSelectedDealForCancel(null);
            setActiveCancellationId(null);
          }}
        />

        {/* MODAL 5: 5-Star Rating & Written Feedback Dialog */}
        <RatingModal
          deal={selectedDealForRating}
          isOpen={!!selectedDealForRating}
          onClose={() => setSelectedDealForRating(null)}
        />

        {/* INITIAL MANDI ONBOARDING & LOGIN SCREEN (Asks name, role, crop name, qty, quality, location, mobile & SMS OTP) */}
        <LoginOnboardingModal
          isOpen={!isLoggedIn || isLoginModalOpen}
          onSuccess={handleOnboardingSuccess}
          onClose={() => setIsLoginModalOpen(false)}
          canCloseWithoutLogin={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <MainAppContent />
      </MarketplaceProvider>
    </AuthProvider>
  );
}
