import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { TRANSLATIONS } from '../../data/translations';
import { LanguageCode, UserRole } from '../../types/marketplace';
import { formatCountdown } from '../../utils/matchingEngine';
import { TradeBridgeLogo } from './TradeBridgeLogo';
import {
  Sprout,
  Bell,
  Wifi,
  WifiOff,
  CheckCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface HeaderProps {
  onDealConfirmed?: (dealId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onDealConfirmed }) => {
  const { role, switchRole, language, setLanguage, currentUser, lowConnectivityMode, setLowConnectivityMode, openLoginModal } = useAuth();
  const { notifications, sellRequests, respondToSellRequest, markNotificationAsRead, clearAllNotifications } = useMarketplace();
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time second tick for countdown in notifications
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS[language];

  // Pending sell requests
  const pendingRequests = sellRequests.filter(r => r.status === 'PENDING');
  const unreadCount = notifications.filter(n => !n.read).length + pendingRequests.length;

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
  };

  const handleAcceptRequest = (requestId: string) => {
    const res = respondToSellRequest(requestId, 'ACCEPT');
    if (res.success && res.dealId && onDealConfirmed) {
      onDealConfirmed(res.dealId);
      setShowNotifications(false);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    respondToSellRequest(requestId, 'REJECT', 'Intake fulfilled');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#7D5331] via-[#8C5E3C] to-[#6E4627] text-white shadow-md border-b border-[#603B1E]">
      {/* Main Mobile App Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <TradeBridgeLogo variant="full" size="sm" textColor="light" />
          <span className="text-[10px] font-bold text-amber-100 bg-[#5C391E] px-2 py-0.5 rounded-full border border-[#9C6D47] hidden sm:inline-block">
            {role === 'FARMER' ? '🌾 Farmer' : '🏢 Buyer'}
          </span>
        </div>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-1.5">
          {/* Low Connectivity Mode Toggle */}
          <button
            onClick={() => setLowConnectivityMode(!lowConnectivityMode)}
            title={lowConnectivityMode ? t.offlineNotice : 'Toggle Low Network Mode'}
            className={`min-h-[36px] px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${
              lowConnectivityMode
                ? 'bg-amber-300 text-amber-950 font-bold'
                : 'text-amber-100 hover:bg-[#6D4320]/60'
            }`}
          >
            {lowConnectivityMode ? <WifiOff className="w-3.5 h-3.5 text-amber-950" /> : <Wifi className="w-3.5 h-3.5" />}
          </button>

          {/* Trilingual Language Selector */}
          <div className="flex items-center bg-[#633C1B]/80 p-0.5 rounded-lg border border-[#9C6D47]/60">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-1.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                language === 'en' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('te')}
              className={`px-1.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                language === 'te' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              తె
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-1.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                language === 'hi' ? 'bg-[#1E7C48] text-white shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              हि
            </button>
          </div>

          {/* Notifications Bell (With pending sell requests count) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="min-h-[40px] min-w-[40px] rounded-xl bg-[#633C1B]/80 hover:bg-[#5C3617] text-amber-100 flex items-center justify-center relative transition-colors border border-[#9C6D47]/60"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-amber-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Account & Login / Switch Button */}
            <button
              type="button"
              onClick={openLoginModal}
              title={`${currentUser.name} (${role}) · Tap to change profile or crop`}
              className="min-h-[40px] px-2 rounded-xl bg-[#633C1B]/80 hover:bg-[#5C3617] text-amber-100 flex items-center gap-1.5 transition-colors border border-[#9C6D47]/60 text-xs font-bold cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#E1F2E7] text-[#1E7C48] flex items-center justify-center font-black text-[11px] shrink-0 overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <span className="hidden sm:inline-block max-w-[70px] truncate text-[11px] font-extrabold text-amber-100">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* NOTIFICATIONS MOBILE MODAL / SHEET (Opens only when notification symbol is clicked) */}
            {showNotifications && (
              <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
                onClick={() => setShowNotifications(false)}
              >
                <div
                  className="bg-[#EDE3D5] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-[#D8C7B3] overflow-hidden text-[#2C1D13] animate-in slide-in-from-bottom-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#D8C7B3] bg-[#E3D3BF]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#7D5331] text-amber-100 flex items-center justify-center border border-[#603B1E]">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#2C1D13] text-sm">
                          Notifications & Requests
                        </h3>
                        <span className="text-[10px] text-[#6E5544] font-medium">
                          {unreadCount} pending items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] text-[#00E599] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="w-8 h-8 rounded-full bg-[#2A2038] hover:bg-[#342845] text-slate-300 flex items-center justify-center border border-violet-800/40"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                <div className="max-h-[380px] overflow-y-auto space-y-3 no-scrollbar py-2.5 px-3">
                  {/* SPECIAL SECTION: PENDING SELL REQUESTS IN NOTIFICATIONS (User Requirement) */}
                  {pendingRequests.length > 0 && (
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8C7B3] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C1D13]">
                          <Clock className="w-4 h-4 text-[#1E7C48] animate-spin" />
                          <span>Pending Sell Requests (1-Hr SLA)</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-white bg-[#1E7C48] px-2 py-0.5 rounded-full">
                          {pendingRequests.length} Pending
                        </span>
                      </div>

                      {pendingRequests.map(req => {
                        const msLeft = req.expiresAt - now;
                        const { formatted, isUrgent, isCritical } = formatCountdown(msLeft);

                        return (
                          <div
                            key={req.id}
                            className="bg-[#EDE3D5] p-3 rounded-xl border border-[#D8C7B3] shadow-xs space-y-2"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className="font-extrabold text-xs text-[#2C1D13]">
                                  {req.cropName} (Grade {req.grade})
                                </span>
                                <p className="text-[11px] text-[#6E5544]">
                                  {role === 'BUYER' ? `From Farmer: ${req.farmerName}` : `To: ${req.buyerBusinessName}`}
                                </p>
                              </div>

                              {/* Countdown Clock in Notification */}
                              <div className="text-right shrink-0">
                                <span
                                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                    isCritical
                                      ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                                      : isUrgent
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-[#E1F2E7] text-[#1E7C48] border border-[#79C195]'
                                  }`}
                                >
                                  {formatted}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-[#6E5544] bg-[#F5EFEB] p-1.5 rounded-lg border border-[#D8C7B3]">
                              <span>Qty: <strong className="text-[#2C1D13]">{req.requestedQuantityKg} kg</strong></span>
                              <span>Offered: <strong className="text-[#1E7C48]">₹{req.offeredPricePerKg}/kg</strong></span>
                            </div>

                            {/* Action Buttons inside Notification for Buyer */}
                            {role === 'BUYER' ? (
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                <button
                                  onClick={() => handleAcceptRequest(req.id)}
                                  className="min-h-[34px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-xs transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.id)}
                                  className="min-h-[34px] bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-[#D8C7B3] transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <p className="text-[10px] text-[#1E7C48] text-center font-medium bg-[#E1F2E7] py-1 rounded border border-[#79C195]">
                                Waiting for buyer response within 60 mins
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Standard Notifications */}
                  {notifications.length === 0 && pendingRequests.length === 0 ? (
                    <p className="text-xs text-[#6E5544] py-6 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-[#EDE3D5]/60 border-[#D8C7B3]/60 text-[#765D4B]'
                            : 'bg-[#FAF7F2] border-[#D8C7B3] text-[#2C1D13] font-medium shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-extrabold text-[#2C1D13]">{n.title}</span>
                          <span className="text-[10px] text-[#765D4B]">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#6E5544] leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Role Switcher Pill - Strictly Farmer and Buyer */}
          <div className="relative">
            <button
              onClick={() => handleRoleChange(role === 'FARMER' ? 'BUYER' : 'FARMER')}
              className="min-h-[38px] px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm border border-emerald-400/40 active:scale-95 transition-all"
              title="Click to switch between Farmer and Buyer view"
            >
              <span>{role === 'FARMER' ? '🌾 Farmer' : '🏢 Buyer'}</span>
              <span className="text-[10px] text-emerald-100 font-semibold bg-emerald-800/60 px-1.5 py-0.5 rounded-md">
                ⇄ Switch
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
