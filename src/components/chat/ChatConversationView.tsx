import React, { useState, useEffect, useRef } from 'react';
import { ChatContact, ChatMessageItem, QUICK_REPLY_PROMPTS, getAutoReply } from '../../data/chatMembers';
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  CheckCheck,
  Check,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
  Info,
  Clock,
  Truck,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';

interface ChatConversationViewProps {
  contact: ChatContact;
  messages: ChatMessageItem[];
  onSendMessage: (chatId: string, text: string, type?: ChatMessageItem['type']) => void;
  onBack: () => void;
  onOpenDealProgress?: (dealId: string) => void;
  onViewCancellationProgress?: (dealId: string) => void;
}

export const ChatConversationView: React.FC<ChatConversationViewProps> = ({
  contact,
  messages,
  onSendMessage,
  onBack,
  onOpenDealProgress
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Calling simulation state
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(s => s + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    onSendMessage(contact.id, text, 'TEXT');
    setInputText('');

    // Trigger realistic simulated counterparty response after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getAutoReply(contact, text);
      onSendMessage(contact.id, reply, 'TEXT');
    }, 1200);
  };

  const handleVoiceRecordToggle = () => {
    if (isRecordingVoice) {
      // Finish recording and send voice note
      setIsRecordingVoice(false);
      const duration = recordingSeconds || 3;
      onSendMessage(contact.id, `🎤 Voice Note (${duration}s)`, 'VOICE_NOTE');
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onSendMessage(contact.id, `Received your audio message clearly Ramesh garu! Everything is noted.`, 'TEXT');
        }, 1200);
      }, 600);
    } else {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
    }
  };

  const handleStartCall = () => {
    setIsInCall(true);
    onSendMessage(contact.id, `📞 Privacy-Masked voice call connected with ${contact.name}.`, 'CALL_LOG');
  };

  const handleEndCall = () => {
    setIsInCall(false);
    onSendMessage(contact.id, `📞 Call ended. Duration: ${formatTime(callDuration)}.`, 'CALL_LOG');
  };

  const formatTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const quickPrompts = QUICK_REPLY_PROMPTS[contact.role] || QUICK_REPLY_PROMPTS.BUYER;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto bg-[#F5EFEB] text-[#2C1D13] relative select-none">
      {/* CHAT HEADER */}
      <div className="bg-[#EDE3D5] px-3.5 py-2.5 border-b border-[#D8C7B3] flex items-center justify-between shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full text-[#4A3525] hover:bg-[#DFD3C3] active:scale-95 transition-all"
            aria-label="Back to all chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="relative shrink-0">
              <div
                className={`w-9 h-9 rounded-xl ${contact.avatarBg} text-white flex items-center justify-center font-black text-xs shadow-xs border border-white/40`}
              >
                {contact.avatarText}
              </div>
              {contact.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#EDE3D5]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-black text-[#2C1D13] truncate max-w-[170px]">
                  {contact.name}
                </h2>
                {contact.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E7C48] shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-[#7A6453] truncate font-medium">
                {isTyping ? (
                  <span className="text-[#1E7C48] font-bold animate-pulse">Typing reply...</span>
                ) : contact.online ? (
                  <span className="text-[#1E7C48] font-bold">Online · {contact.roleBadge}</span>
                ) : (
                  <span>{contact.lastActive} · {contact.roleBadge}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleStartCall}
            className="p-2 rounded-xl bg-[#E2D6C5] hover:bg-[#D5C5B0] text-[#1E7C48] active:scale-95 transition-all border border-[#CDBBA5]"
            title="Privacy-Masked Audio Call"
            aria-label="Call member"
          >
            <Phone className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => setShowContactInfo(!showContactInfo)}
            className="p-2 rounded-xl bg-[#E2D6C5] hover:bg-[#D5C5B0] text-[#4A3525] active:scale-95 transition-all border border-[#CDBBA5]"
            title="View Contact Details"
            aria-label="Contact info"
          >
            <Info className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ACTIVE DEAL BANNER (If this contact is attached to an active pre-booked deal) */}
      {contact.dealCode && (
        <div className="bg-[#E4F3EA] border-b border-[#A2D4B7] px-3.5 py-2 flex items-center justify-between text-xs text-[#1E7C48] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono font-black text-[11px] bg-[#1E7C48] text-white px-2 py-0.5 rounded-md">
              {contact.dealCode}
            </span>
            <span className="text-[11px] font-bold text-[#14532D] truncate">
              {contact.dealCrop} · {contact.dealQty} kg @ ₹{contact.dealPrice}/kg
            </span>
          </div>
          {onOpenDealProgress && (
            <button
              onClick={() => onOpenDealProgress(contact.dealId || '')}
              className="text-[10px] font-extrabold text-[#1E7C48] underline hover:text-[#14532D] shrink-0"
            >
              View Pre-Booking
            </button>
          )}
        </div>
      )}

      {/* CONTACT INFO DRAWER / POPUP */}
      {showContactInfo && (
        <div className="bg-[#EDE3D5] border-b border-[#D8C7B3] p-3 text-xs space-y-2 animate-in slide-in-from-top-2 shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <h3 className="font-black text-[#2C1D13] text-sm flex items-center gap-1.5">
                {contact.businessName}
                {contact.isVerified && (
                  <span className="text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                    Verified
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#6E5544] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1E7C48]" /> {contact.location}
              </p>
              <p className="text-[11px] text-[#6E5544] font-mono">
                📞 Privacy-Masked Virtual Contact: {contact.phone}
              </p>
            </div>
            <button
              onClick={() => setShowContactInfo(false)}
              className="p-1 text-[#7A6453] hover:text-[#2C1D13]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {contact.cropTags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-bold bg-[#FAF7F2] text-[#4A3525] px-2 py-0.5 rounded-full border border-[#D8C7B3]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES THREAD */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#F5EFEB]">
        {/* Encrypted privacy banner */}
        <div className="text-center my-1">
          <span className="text-[10px] font-bold text-[#7A6453] bg-[#E8DDD0] px-3 py-1 rounded-full border border-[#D8C7B3] inline-flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-[#1E7C48]" />
            Direct TradeBridge Agricultural Messaging · Numbers Masked
          </span>
        </div>

        {messages.map(msg => {
          if (msg.type === 'SYSTEM') {
            return (
              <div key={msg.id} className="text-center my-2">
                <div className="inline-block max-w-[90%] text-[10px] font-bold text-[#4A3525] bg-[#E8DDD0] px-3 py-1.5 rounded-xl border border-[#D8C7B3] shadow-2xs">
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.type === 'CALL_LOG') {
            return (
              <div key={msg.id} className="text-center my-2">
                <div className="inline-block text-[10px] font-bold text-[#1E7C48] bg-[#E1F2E7] px-3 py-1 rounded-full border border-[#79C195]">
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.type === 'VOICE_NOTE') {
            return (
              <div
                key={msg.id}
                className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs border ${
                    msg.isMe
                      ? 'bg-[#1E7C48] text-white rounded-br-xs border-[#18633a]'
                      : 'bg-[#EDE3D5] text-[#2C1D13] rounded-bl-xs border-[#D8C7B3]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        msg.isMe ? 'bg-white/20 text-white' : 'bg-[#D8C7B3] text-[#1E7C48]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-semibold text-xs flex-1">{msg.text}</div>
                  </div>
                  <div
                    className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                      msg.isMe ? 'text-emerald-100' : 'text-[#7A6453]'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          }

          // Regular Text Message
          return (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-xs border leading-relaxed ${
                  msg.isMe
                    ? 'bg-[#1E7C48] text-white rounded-br-xs border-[#18633a]'
                    : 'bg-[#EDE3D5] text-[#2C1D13] rounded-bl-xs border-[#D8C7B3]'
                }`}
              >
                <p className="break-words font-medium">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                    msg.isMe ? 'text-emerald-100' : 'text-[#7A6453]'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Counterparty typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#EDE3D5] text-[#7A6453] rounded-2xl rounded-bl-xs px-3.5 py-2 text-xs border border-[#D8C7B3] shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7C48] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] font-bold text-[#1E7C48] ml-1">{contact.name} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTION REPLIES (1-Tap prompts) */}
      <div className="bg-[#EDE3D5]/80 px-2.5 py-1.5 border-t border-[#D8C7B3] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-[#1E7C48] shrink-0 ml-1" />
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-semibold bg-[#FAF7F2] text-[#2C1D13] hover:bg-[#1E7C48] hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-[#D8C7B3] shadow-2xs active:scale-95 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="bg-[#EDE3D5] p-2.5 border-t border-[#D8C7B3] shrink-0">
        {isRecordingVoice ? (
          <div className="flex items-center justify-between bg-red-50 border border-red-300 rounded-2xl px-3 py-2 text-xs text-red-700 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="font-bold">Recording Voice Note... ({recordingSeconds}s)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecordingVoice(false)}
                className="text-[11px] font-bold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleVoiceRecordToggle}
                className="px-3 py-1 rounded-xl bg-red-600 text-white font-black text-xs shadow-xs"
              >
                Send Voice
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={handleVoiceRecordToggle}
              className="p-2.5 rounded-xl bg-[#E2D6C5] hover:bg-[#D5C5B0] text-[#1E7C48] active:scale-95 transition-all border border-[#CDBBA5]"
              title="Record Voice Note"
              aria-label="Voice Note"
            >
              <Mic className="w-4 h-4 stroke-[2.5]" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${contact.name}...`}
              className="flex-1 min-h-[42px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-xs font-medium placeholder-[#8D7665] focus:outline-none focus:border-[#1E7C48] focus:ring-1 focus:ring-[#1E7C48]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#1E7C48] disabled:bg-[#C5B4A1] text-white active:scale-95 transition-all shadow-xs flex items-center justify-center shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}
      </div>

      {/* PRIVACY-MASKED IN-APP CALL OVERLAY */}
      {isInCall && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#EDE3D5] text-[#2C1D13] w-full max-w-xs rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl border border-[#D8C7B3] space-y-4">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-3xl ${contact.avatarBg} text-white flex items-center justify-center text-2xl font-black shadow-lg border-2 border-white`}
              >
                {contact.avatarText}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#EDE3D5] flex items-center justify-center">
                <Phone className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#2C1D13]">{contact.name}</h3>
              <p className="text-xs text-[#6E5544] font-medium">{contact.businessName}</p>
              <p className="text-[10px] text-[#1E7C48] font-bold mt-1 bg-[#E1F2E7] px-2.5 py-0.5 rounded-full border border-[#79C195] inline-block">
                Masked Direct Agri Bridge
              </p>
            </div>

            <div className="font-mono text-2xl font-black text-[#1E7C48]">
              {formatTime(callDuration)}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  isMuted ? 'bg-red-100 text-red-600 border-red-300' : 'bg-[#FAF7F2] text-[#4A3525] border-[#D8C7B3]'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  isSpeakerOn ? 'bg-emerald-100 text-[#1E7C48] border-emerald-300' : 'bg-[#FAF7F2] text-[#4A3525] border-[#D8C7B3]'
                }`}
                title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
                title="End Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
