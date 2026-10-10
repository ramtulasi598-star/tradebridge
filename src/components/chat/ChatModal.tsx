import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { Deal } from '../../types/marketplace';
import { X, Send, Phone, PhoneOff, Mic, MicOff, Shield } from 'lucide-react';

interface ChatModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  openCallDirectly?: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  deal,
  isOpen,
  onClose,
  openCallDirectly = false
}) => {
  const { getChatMessages, sendMessage } = useMarketplace();
  const { currentUser, role, language } = useAuth();
  const t = TRANSLATIONS[language];

  const [messageText, setMessageText] = useState('');
  const [isCalling, setIsCalling] = useState(openCallDirectly);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openCallDirectly) {
      setIsCalling(true);
    }
  }, [openCallDirectly]);

  // Call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(s => s + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const messages = deal ? getChatMessages(deal.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen || !deal) return null;

  const counterpartyName = role === 'FARMER' ? deal.buyerBusinessName : deal.farmerName;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(deal.id, messageText.trim(), 'TEXT');
    setMessageText('');
  };

  const handleStartCall = () => {
    setIsCalling(true);
    sendMessage(deal.id, `📞 Masked voice call initiated with ${counterpartyName}.`, 'CALL_LOG');
  };

  const handleEndCall = () => {
    setIsCalling(false);
    sendMessage(deal.id, `📞 Call ended. Duration: ${callDuration}s.`, 'CALL_LOG');
  };

  const formatCallTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C1D13] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl h-[88vh] sm:h-[650px] flex flex-col shadow-2xl border border-[#D8C7B3] overflow-hidden">
        {/* Header */}
        <div className="bg-[#EDE3D5] px-4 py-3 border-b border-[#D8C7B3] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E5D7C4] text-[#1E7C48] flex items-center justify-center font-extrabold text-sm border border-[#D8C7B3]">
              {counterpartyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#2C1D13] leading-tight">
                {counterpartyName}
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-[#6E5544] font-mono">
                <span className="text-[#1E7C48] font-bold">{deal.dealCode}</span>
                <span>·</span>
                <span>{deal.cropName} ({deal.quantityKg} kg)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCalling && (
              <button
                onClick={handleStartCall}
                className="w-9 h-9 rounded-xl bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#1E7C48] flex items-center justify-center transition-colors border border-[#D8C7B3]"
                title="Initiate privacy-masked call"
              >
                <Phone className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center transition-colors border border-[#D8C7B3]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Privacy Call Active Overlay */}
        {isCalling ? (
          <div className="flex-1 bg-gradient-to-b from-[#7D5331] to-[#452814] text-white flex flex-col items-center justify-between p-6">
            <div className="text-center pt-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[11px] text-[#00E599] font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Masked VOIP Bridge · Phone Number Hidden</span>
              </div>
              <h3 className="text-xl font-bold pt-4 text-white">{counterpartyName}</h3>
              <p className="text-sm text-amber-200 font-mono">{formatCallTime(callDuration)}</p>
            </div>

            <div className="flex items-center gap-6 pb-8">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-amber-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Privacy Call Guarantee Notice */}
            <div className="bg-[#EDE3D5] border-b border-[#D8C7B3] px-4 py-2 text-[11px] text-[#4A3525] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#1E7C48]" />
                <span>Secure deal-linked chat · Phone privacy protected</span>
              </span>
              <span className="font-extrabold text-[#1E7C48]">
                ₹{deal.pricePerKg}/kg
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#F5EFEB]">
              {messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;

                if (msg.type === 'SYSTEM' || msg.type === 'CALL_LOG') {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 bg-[#EDE3D5] border border-[#D8C7B3] rounded-full text-[11px] text-[#6E5544] font-medium leading-normal">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                        isMe
                          ? 'bg-[#1E7C48] text-white rounded-br-xs shadow-sm'
                          : 'bg-[#EDE3D5] border border-[#D8C7B3] text-[#2C1D13] rounded-bl-xs shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-[#8C5E3C] mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-[#EDE3D5] border-t border-[#D8C7B3] flex items-center gap-2">
              <input
                type="text"
                placeholder={t.typeMessage}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="flex-1 min-h-[44px] px-3.5 rounded-xl border border-[#D8C7B3] text-xs text-[#2C1D13] placeholder-[#8C5E3C] focus:outline-hidden focus:border-[#1E7C48] bg-[#FAF7F2]"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="min-h-[44px] min-w-[44px] bg-[#1E7C48] hover:bg-[#165f37] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-sm font-bold"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
