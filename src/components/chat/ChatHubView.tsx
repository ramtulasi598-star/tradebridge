import React, { useState } from 'react';
import {
  ChatContact,
  ChatMessageItem,
  INITIAL_CHAT_MEMBERS,
  INITIAL_MESSAGES_MAP
} from '../../data/chatMembers';
import { ChatConversationView } from './ChatConversationView';
import { DealsListView } from '../deals/DealsListView';
import {
  Search,
  MessageSquare,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Users,
  Building2,
  Filter,
  CheckCheck
} from 'lucide-react';

interface ChatHubViewProps {
  initialContactId?: string | null;
  onOpenDealProgress?: (dealId: string) => void;
  onOpenCall?: (dealId: string) => void;
  onRequestCancel?: (dealId: string) => void;
  onOpenRating?: (dealId: string) => void;
  onViewCancellationProgress?: (cancellationId: string) => void;
}

export const ChatHubView: React.FC<ChatHubViewProps> = ({
  initialContactId,
  onOpenDealProgress,
  onOpenCall,
  onRequestCancel,
  onOpenRating,
  onViewCancellationProgress
}) => {
  const [contacts, setContacts] = useState<ChatContact[]>(() => {
    const saved = localStorage.getItem('ks_chat_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MEMBERS;
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessageItem[]>>(() => {
    const saved = localStorage.getItem('ks_chat_messages_map');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES_MAP;
  });

  // Selected chat contact
  const [selectedContactId, setSelectedContactId] = useState<string | null>(initialContactId || null);

  // Active view mode: 'CHATS' or 'DEALS'
  const [activeViewMode, setActiveViewMode] = useState<'CHATS' | 'DEALS'>('CHATS');

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'BUYER' | 'APMC_AGENT' | 'EXPERT' | 'TRANSPORTER'>('ALL');

  const selectedContact = contacts.find(c => c.id === selectedContactId) || null;

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    // Mark as read
    setContacts(prev =>
      prev.map(c => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (chatId: string, text: string, type: ChatMessageItem['type'] = 'TEXT') => {
    const now = Date.now();
    const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isMe = !text.startsWith('Understood') && !text.startsWith('For') && !text.startsWith('Yes,') && !text.startsWith('Today') && !text.startsWith('Received');

    const newMsg: ChatMessageItem = {
      id: `msg-${now}-${Math.random().toString(36).substr(2, 4)}`,
      chatId,
      senderId: isMe ? 'user-farmer-1' : chatId,
      senderName: isMe ? 'Ramesh Naidu' : (contacts.find(c => c.id === chatId)?.name || 'Member'),
      senderRole: isMe ? 'FARMER' : 'BUYER',
      text,
      time: timeStr,
      timestamp: now,
      type,
      isMe
    };

    setMessagesMap(prev => {
      const updated = {
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMsg]
      };
      localStorage.setItem('ks_chat_messages_map', JSON.stringify(updated));
      return updated;
    });

    // Update last message in contacts list
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            unreadCount: isMe ? c.unreadCount : c.unreadCount + 1
          };
        }
        return c;
      });
      localStorage.setItem('ks_chat_contacts', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter contacts by search query & role category
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.cropTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterRole === 'ALL') return true;
    if (filterRole === 'BUYER') return contact.role === 'BUYER' || contact.role === 'TRADER';
    if (filterRole === 'APMC_AGENT') return contact.role === 'APMC_AGENT';
    if (filterRole === 'EXPERT') return contact.role === 'EXPERT';
    if (filterRole === 'TRANSPORTER') return contact.role === 'TRANSPORTER';

    return true;
  });

  const onlineCount = contacts.filter(c => c.online).length;

  // IF A CONTACT IS SELECTED, OPEN THAT CONVERSATION DIRECTLY ("he click one chat there open")
  if (selectedContact) {
    return (
      <ChatConversationView
        contact={selectedContact}
        messages={messagesMap[selectedContact.id] || []}
        onSendMessage={handleSendMessage}
        onBack={() => setSelectedContactId(null)}
        onOpenDealProgress={onOpenDealProgress}
      />
    );
  }

  // CHATS HUB: LIST OF ALL MEMBERS ("the chat bot have so many members")
  return (
    <div className="px-3.5 py-4 space-y-3.5 max-w-md mx-auto text-[#2C1D13] select-none">
      {/* HEADER BANNER */}
      <div className="bg-[#EDE3D5] p-4 rounded-3xl text-[#2C1D13] shadow-md border border-[#D8C7B3] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#1E7C48] font-extrabold uppercase tracking-wider bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} Members Online Now
          </span>
          <span className="text-[11px] font-bold text-[#7A6453]">
            {contacts.length} Total Contacts
          </span>
        </div>

        <div>
          <h1 className="text-base font-extrabold tracking-tight text-[#2C1D13]">
            Agricultural Chat & Deals
          </h1>
          <p className="text-[11px] text-[#6E5544] mt-0.5">
            Tap any buyer, mandi agent, or agri expert to chat directly with privacy-masked calls.
          </p>
        </div>

        {/* VIEW TOGGLE: CHAT MESSENGER vs DEALS PROGRESSION */}
        <div className="flex rounded-xl bg-[#DFD3C3] p-1 border border-[#D8C7B3] gap-1 pt-1">
          <button
            onClick={() => setActiveViewMode('CHATS')}
            className={`flex-1 min-h-[34px] rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeViewMode === 'CHATS'
                ? 'bg-[#1E7C48] text-white shadow-xs'
                : 'text-[#4A3525] hover:text-[#2C1D13]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Messages ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveViewMode('DEALS')}
            className={`flex-1 min-h-[34px] rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeViewMode === 'DEALS'
                ? 'bg-[#1E7C48] text-white shadow-xs'
                : 'text-[#4A3525] hover:text-[#2C1D13]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pre-Booked Deals</span>
          </button>
        </div>
      </div>

      {activeViewMode === 'DEALS' ? (
        <DealsListView
          onOpenChat={dealId => {
            // Find contact for deal and open chat
            const c = contacts.find(contact => contact.dealId === dealId) || contacts[0];
            setSelectedContactId(c.id);
            setActiveViewMode('CHATS');
          }}
          onOpenCall={onOpenCall || (() => {})}
          onRequestCancel={onRequestCancel || (() => {})}
          onOpenRating={onOpenRating || (() => {})}
          onViewCancellationProgress={onViewCancellationProgress || (() => {})}
        />
      ) : (
        <>
          {/* SEARCH BOX */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6453]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search members, buyers, mandis, crops..."
              className="w-full min-h-[44px] pl-9.5 pr-4 rounded-2xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-medium placeholder-[#8D7665] focus:outline-none focus:border-[#1E7C48] focus:ring-1 focus:ring-[#1E7C48] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6453] font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTER CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                filterRole === 'ALL'
                  ? 'bg-[#1E7C48] text-white border-[#18633a] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3525] border-[#D8C7B3] hover:bg-[#DFD3C3]'
              }`}
            >
              All Members ({contacts.length})
            </button>
            <button
              onClick={() => setFilterRole('BUYER')}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                filterRole === 'BUYER'
                  ? 'bg-[#1E7C48] text-white border-[#18633a] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3525] border-[#D8C7B3] hover:bg-[#DFD3C3]'
              }`}
            >
              Buyers & Traders
            </button>
            <button
              onClick={() => setFilterRole('APMC_AGENT')}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                filterRole === 'APMC_AGENT'
                  ? 'bg-[#1E7C48] text-white border-[#18633a] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3525] border-[#D8C7B3] hover:bg-[#DFD3C3]'
              }`}
            >
              APMC Mandi Agents
            </button>
            <button
              onClick={() => setFilterRole('EXPERT')}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                filterRole === 'EXPERT'
                  ? 'bg-[#1E7C48] text-white border-[#18633a] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3525] border-[#D8C7B3] hover:bg-[#DFD3C3]'
              }`}
            >
              Agri Scientists
            </button>
            <button
              onClick={() => setFilterRole('TRANSPORTER')}
              className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap transition-all border ${
                filterRole === 'TRANSPORTER'
                  ? 'bg-[#1E7C48] text-white border-[#18633a] shadow-xs'
                  : 'bg-[#EDE3D5] text-[#4A3525] border-[#D8C7B3] hover:bg-[#DFD3C3]'
              }`}
            >
              Logistics
            </button>
          </div>

          {/* MEMBERS LIST */}
          <div className="space-y-2.5">
            {filteredContacts.length === 0 ? (
              <div className="bg-[#EDE3D5] p-6 rounded-2xl text-center border border-[#D8C7B3] space-y-2">
                <Users className="w-8 h-8 text-[#7A6453] mx-auto" />
                <p className="text-xs font-bold text-[#4A3525]">No members matching "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRole('ALL');
                  }}
                  className="text-xs font-extrabold text-[#1E7C48] underline"
                >
                  Clear search and show all members
                </button>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact.id)}
                  className="bg-[#EDE3D5] hover:bg-[#E5D7C4] active:bg-[#DFD3C3] p-3 rounded-2xl border border-[#D8C7B3] shadow-xs cursor-pointer transition-all flex items-start gap-3 relative group"
                >
                  {/* AVATAR */}
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className={`w-11 h-11 rounded-2xl ${contact.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-xs border border-white/30`}
                    >
                      {contact.avatarText}
                    </div>
                    {contact.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#EDE3D5]" />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <h3 className="text-xs font-black text-[#2C1D13] truncate">
                          {contact.name}
                        </h3>
                        {contact.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#7A6453] shrink-0">
                        {contact.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6E5544] font-medium truncate">
                      {contact.businessName}
                    </p>

                    {/* LAST MESSAGE PREVIEW */}
                    <p className="text-[11px] text-[#4A3525] line-clamp-1 leading-snug">
                      {contact.lastMessage}
                    </p>

                    {/* BADGES & TAGS */}
                    <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                      <span className="text-[9px] font-extrabold bg-[#E2D6C5] text-[#4A3525] px-2 py-0.5 rounded-md border border-[#D8C7B3]">
                        {contact.roleBadge.split('·')[0]}
                      </span>

                      {contact.dealCode && (
                        <span className="text-[9px] font-mono font-black bg-[#E1F2E7] text-[#1E7C48] px-2 py-0.5 rounded-md border border-[#79C195]">
                          {contact.dealCode} Pre-Booked
                        </span>
                      )}

                      {contact.cropTags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold bg-[#FAF7F2] text-[#6E5544] px-1.5 py-0.5 rounded-md border border-[#D8C7B3]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* UNREAD BADGE */}
                  {contact.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#1E7C48] text-white flex items-center justify-center font-black text-[10px] shrink-0 self-center shadow-xs">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
