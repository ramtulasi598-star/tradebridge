import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { Home, Store, Plus, MessageSquare, User } from 'lucide-react';

export type TabId = 'HOME' | 'MARKETS' | 'CHATS' | 'PROFILE';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenSellModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, onOpenSellModal }) => {
  const { language } = useAuth();
  const t = TRANSLATIONS[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#EDE3D5]/95 backdrop-blur-md border-t border-[#D8C7B3] pb-safe shadow-xl">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('HOME')}
          className={`flex flex-col items-center justify-center min-h-[48px] w-full transition-colors relative ${
            activeTab === 'HOME' ? 'text-[#1E7C48] font-extrabold' : 'text-[#7A6453] hover:text-[#2C1D13]'
          }`}
          aria-label={t.navHome}
        >
          <Home className={`w-5 h-5 ${activeTab === 'HOME' ? 'stroke-[2.5] text-[#1E7C48]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 truncate">
            {t.navHome}
          </span>
          {activeTab === 'HOME' && <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] mt-0.5 shadow-xs" />}
        </button>

        {/* Tab 2: Markets */}
        <button
          onClick={() => onSelectTab('MARKETS')}
          className={`flex flex-col items-center justify-center min-h-[48px] w-full transition-colors relative ${
            activeTab === 'MARKETS' ? 'text-[#1E7C48] font-extrabold' : 'text-[#7A6453] hover:text-[#2C1D13]'
          }`}
          aria-label={t.navMarkets}
        >
          <Store className={`w-5 h-5 ${activeTab === 'MARKETS' ? 'stroke-[2.5] text-[#1E7C48]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 truncate">
            {t.navMarkets}
          </span>
          {activeTab === 'MARKETS' && <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] mt-0.5 shadow-xs" />}
        </button>

        {/* Tab 3: Center Plus Action (Sell Crop Video) */}
        <div className="flex justify-center items-center">
          <button
            onClick={onOpenSellModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 via-[#1E7C48] to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/20 active:scale-95 transition-transform border border-emerald-400/40"
            aria-label={t.navSell}
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Tab 4: Chats & Calls */}
        <button
          onClick={() => onSelectTab('CHATS')}
          className={`flex flex-col items-center justify-center min-h-[48px] w-full transition-colors relative ${
            activeTab === 'CHATS' ? 'text-[#1E7C48] font-extrabold' : 'text-[#7A6453] hover:text-[#2C1D13]'
          }`}
          aria-label={t.navChats}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'CHATS' ? 'stroke-[2.5] text-[#1E7C48]' : 'stroke-[1.75]'}`} />
            <span className="absolute -top-1 -right-2 bg-[#1E7C48] text-white text-[9px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 truncate">
            {t.navChats}
          </span>
          {activeTab === 'CHATS' && <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] mt-0.5 shadow-xs" />}
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onSelectTab('PROFILE')}
          className={`flex flex-col items-center justify-center min-h-[48px] w-full transition-colors relative ${
            activeTab === 'PROFILE' ? 'text-[#1E7C48] font-extrabold' : 'text-[#7A6453] hover:text-[#2C1D13]'
          }`}
          aria-label={t.navProfile}
        >
          <User className={`w-5 h-5 ${activeTab === 'PROFILE' ? 'stroke-[2.5] text-[#1E7C48]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5 truncate">
            {t.navProfile}
          </span>
          {activeTab === 'PROFILE' && <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] mt-0.5 shadow-xs" />}
        </button>
      </div>
    </nav>
  );
};
