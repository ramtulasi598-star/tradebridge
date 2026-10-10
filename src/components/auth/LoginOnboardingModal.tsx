import React, { useState, useEffect, useRef } from 'react';
import { UserRole, QualityGradeCode, LocationInfo } from '../../types/marketplace';
import { TradeBridgeLogo } from '../layout/TradeBridgeLogo';
import {
  Sprout,
  Building2,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Bell,
  X,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';

export interface OnboardingData {
  name: string;
  role: UserRole;
  mobile: string;
  location: LocationInfo;
  cropName: string;
  quantityValue: number;
  quantityUnit: 'kg' | 'quintal' | 'ton';
  quantityKg: number;
  grade: QualityGradeCode;
  notes?: string;
}

interface LoginOnboardingModalProps {
  isOpen: boolean;
  onSuccess: (data: OnboardingData) => void;
  onClose?: () => void;
  canCloseWithoutLogin?: boolean;
}

const POPULAR_CROPS = [
  { name: 'Tomato', icon: '🍅', defaultUnit: 'kg', baseRate: 28 },
  { name: 'Wheat', icon: '🌾', defaultUnit: 'quintal', baseRate: 26 },
  { name: 'Onion', icon: '🧅', defaultUnit: 'kg', baseRate: 34 },
  { name: 'Green Chilli', icon: '🌶️', defaultUnit: 'kg', baseRate: 52 },
  { name: 'Cotton (Kapas)', icon: '☁️', defaultUnit: 'quintal', baseRate: 70 },
  { name: 'Paddy Rice', icon: '🌾', defaultUnit: 'quintal', baseRate: 24 },
  { name: 'Potato', icon: '🥔', defaultUnit: 'kg', baseRate: 22 },
  { name: 'Maize', icon: '🌽', defaultUnit: 'quintal', baseRate: 21 },
  { name: 'Mango', icon: '🥭', defaultUnit: 'kg', baseRate: 65 },
  { name: 'Turmeric', icon: '🟡', defaultUnit: 'quintal', baseRate: 95 }
];

export const LoginOnboardingModal: React.FC<LoginOnboardingModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  canCloseWithoutLogin = false
}) => {
  // Form fields
  const [role, setRole] = useState<UserRole>('FARMER');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [cropName, setCropName] = useState('Tomato');
  const [quantityValue, setQuantityValue] = useState<number>(500);
  const [quantityUnit, setQuantityUnit] = useState<'kg' | 'quintal' | 'ton'>('kg');
  const [grade, setGrade] = useState<QualityGradeCode>('A');

  // Location fields
  const [village, setVillage] = useState('Kalikiri Mandalam');
  const [district, setDistrict] = useState('Chittoor');
  const [state, setState] = useState('Andhra Pradesh');

  // SMS OTP state
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [smsTimer, setSmsTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sound chime synthesizer via Web Audio API
  const playSmsNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext blocked
    }
  };

  // Timer countdown for resending OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && smsTimer > 0) {
      interval = setInterval(() => {
        setSmsTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, smsTimer]);

  if (!isOpen) return null;

  // Auto detect location helper
  const handleAutoDetectLocation = () => {
    const locations = [
      { village: 'Kalikiri Mandalam', district: 'Chittoor', state: 'Andhra Pradesh' },
      { village: 'Madanapalle Yard', district: 'Annamayya', state: 'Andhra Pradesh' },
      { village: 'Kolar Agro Belt', district: 'Kolar', state: 'Karnataka' },
      { village: 'Pimpalgaon Village', district: 'Nashik', state: 'Maharashtra' },
      { village: 'Miryalaguda Town', district: 'Nalgonda', state: 'Telangana' },
      { village: 'Khanna Grain Yard', district: 'Ludhiana', state: 'Punjab' }
    ];
    const picked = locations[Math.floor(Math.random() * locations.length)];
    setVillage(picked.village);
    setDistrict(picked.district);
    setState(picked.state);
  };

  // Send SMS OTP function
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!cropName.trim()) {
      setErrorMessage('Please specify your crop name');
      return;
    }
    if (!quantityValue || quantityValue <= 0) {
      setErrorMessage('Please enter a valid crop quantity');
      return;
    }

    setErrorMessage(null);

    // Generate realistic 6-digit random code
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setStep('OTP');
    setOtpSent(true);
    setSmsTimer(60);

    // Simulate SMS delivery: banner appears after 600ms
    setTimeout(() => {
      setShowSmsBanner(true);
      playSmsNotificationSound();
    }, 600);
  };

  // Auto-fill from incoming text SMS notification
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setEnteredOtp(digits);
    setShowSmsBanner(false);
  };

  // Handle single digit OTP input
  const handleOtpDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const newDigits = [...enteredOtp];
    newDigits[index] = char;
    setEnteredOtp(newDigits);

    // Auto-advance cursor
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = () => {
    const entered = enteredOtp.join('');
    if (entered !== generatedOtp && entered !== '123456') {
      setErrorMessage('Invalid OTP code. Please enter the code received in SMS.');
      return;
    }

    submitSuccess();
  };

  // 1-Click Demo Fill for immediate fast testing
  const handleQuickDemoFill = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'FARMER') {
      setName('Ramesh Naidu');
      setMobile('9848012345');
      setCropName('Tomato');
      setQuantityValue(600);
      setQuantityUnit('kg');
      setGrade('A');
      setVillage('Kalikiri Farm Gate');
      setDistrict('Chittoor');
      setState('Andhra Pradesh');
    } else {
      setName('Vikram Reddy');
      setMobile('9440167890');
      setCropName('Tomato');
      setQuantityValue(2000);
      setQuantityUnit('kg');
      setGrade('A');
      setVillage('Bowenpally Terminal');
      setDistrict('Hyderabad');
      setState('Telangana');
    }

    const testOtp = '849201';
    setGeneratedOtp(testOtp);
    setEnteredOtp(testOtp.split(''));
    setStep('OTP');
    setShowSmsBanner(true);
    playSmsNotificationSound();
  };

  // Submit and log user in
  const submitSuccess = () => {
    // Calculate total quantity in Kilograms
    let kgMultiplier = 1;
    if (quantityUnit === 'quintal') kgMultiplier = 100;
    if (quantityUnit === 'ton') kgMultiplier = 1000;
    const quantityKg = Math.round(quantityValue * kgMultiplier);

    const payload: OnboardingData = {
      name: name.trim() || (role === 'FARMER' ? 'Ramesh Naidu' : 'Vikram Reddy'),
      role,
      mobile: mobile.trim() ? (mobile.startsWith('+91') ? mobile : `+91 ${mobile}`) : '+91 98480 12345',
      location: {
        country: 'India',
        state: state.trim() || 'Andhra Pradesh',
        district: district.trim() || 'Chittoor',
        area: village.trim() || 'Kalikiri Mandalam',
        distanceKm: 0
      },
      cropName: cropName.trim() || 'Tomato',
      quantityValue: quantityValue || 500,
      quantityUnit,
      quantityKg: quantityKg || 500,
      grade
    };

    onSuccess(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* SIMULATED INCOMING REAL TEXT MESSAGE / SMS NOTIFICATION BANNER */}
      {showSmsBanner && (
        <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:w-[420px] mx-auto z-60 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1A1A1A]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#34C759] flex items-center justify-center text-white shrink-0 shadow-md">
                <MessageSquare className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">MESSAGES • now</span>
                  <button
                    onClick={() => setShowSmsBanner(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  TradeBridge Mandi Alert
                </div>
                <div className="text-xs text-zinc-200 mt-0.5 leading-snug">
                  Your verification OTP is <strong className="text-emerald-400 font-mono text-sm tracking-wider">{generatedOtp}</strong> for {role === 'FARMER' ? 'Farmer' : 'Buyer'} login. Valid for 10 min.
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="mt-2 w-full py-1.5 px-3 bg-[#34C759] hover:bg-[#2EB04E] text-black font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tap to Auto-Fill OTP ({generatedOtp})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-[#FAF7F2] text-[#2C1D13] w-full max-w-md rounded-3xl shadow-2xl border border-[#D8C7B3] overflow-hidden my-auto">
        {/* MODAL HEADER WITH LOGO */}
        <div className="bg-gradient-to-r from-[#7D5331] via-[#8C5E3C] to-[#6E4627] text-white p-4 sm:p-5 relative">
          {canCloseWithoutLogin && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <TradeBridgeLogo variant="icon" size="md" />
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TradeBridge Mandi
                <span className="text-[10px] font-bold bg-[#1E7C48] text-white px-2 py-0.5 rounded-full">
                  Direct Mandi
                </span>
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                Direct Agricultural Trade & Dynamic Price Exchange
              </p>
            </div>
          </div>

          {/* Quick Demo Pre-Fill Action Bar */}
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
            <span className="text-amber-200 font-semibold">⚡ Quick Demo Login:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('FARMER')}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-100 text-amber-950 font-black rounded-lg transition-transform active:scale-95 text-[10px]"
              >
                🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('BUYER')}
                className="px-2.5 py-1 bg-emerald-300 hover:bg-emerald-200 text-emerald-950 font-black rounded-lg transition-transform active:scale-95 text-[10px]"
              >
                🏢 Demo Buyer
              </button>
            </div>
          </div>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 bg-red-100 border border-red-300 rounded-2xl flex items-center gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: LOGIN DETAILS FORM */}
        {step === 'DETAILS' ? (
          <form onSubmit={handleRequestOtp} className="p-4 sm:p-5 space-y-4">
            {/* 1. ROLE SELECTOR: FARMER OR BUYER */}
            <div>
              <label className="block text-xs font-black uppercase text-[#6E5544] mb-2 tracking-wider">
                1. Select Account Type:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[76px] cursor-pointer ${
                    role === 'FARMER'
                      ? 'bg-[#E1F2E7] border-[#1E7C48] ring-2 ring-[#1E7C48] shadow-sm'
                      : 'bg-[#EDE3D5] border-[#D8C7B3] hover:border-[#8C5E3C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🌾</span>
                    {role === 'FARMER' && <CheckCircle2 className="w-4 h-4 text-[#1E7C48]" />}
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#2C1D13]">Farmer (రైతు / किसान)</div>
                    <div className="text-[10px] text-[#6E5544]">Sell crops directly with video</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[76px] cursor-pointer ${
                    role === 'BUYER'
                      ? 'bg-[#E1F2E7] border-[#1E7C48] ring-2 ring-[#1E7C48] shadow-sm'
                      : 'bg-[#EDE3D5] border-[#D8C7B3] hover:border-[#8C5E3C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🏢</span>
                    {role === 'BUYER' && <CheckCircle2 className="w-4 h-4 text-[#1E7C48]" />}
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#2C1D13]">Buyer (కొనుగోలుదారు / व्यापारी)</div>
                    <div className="text-[10px] text-[#6E5544]">Procure verified farm produce</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. USER NAME & MOBILE NUMBER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-[#6E5544] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C5E3C]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder={role === 'FARMER' ? 'e.g. Ramesh Naidu' : 'e.g. Vikram Reddy'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full min-h-[42px] pl-9 pr-3 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#6E5544] mb-1">
                  Mobile Number (For SMS OTP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C5E3C] text-xs font-bold">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98480 12345"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full min-h-[42px] pl-11 pr-3 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48]"
                  />
                </div>
              </div>
            </div>

            {/* 3. CROP NAME & POPULAR CROP PILLS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase text-[#6E5544]">
                  {role === 'FARMER' ? 'Crop You Want to Sell:' : 'Crop You Want to Buy:'}
                </label>
                <span className="text-[10px] text-[#1E7C48] font-bold">Popular Mandi Crops</span>
              </div>

              {/* Quick Select Crop Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2">
                {POPULAR_CROPS.map(c => {
                  const isSelected = cropName.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setCropName(c.name);
                        if (c.defaultUnit === 'quintal') setQuantityUnit('quintal');
                      }}
                      className={`min-h-[32px] px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-[#1E7C48] text-white shadow-xs'
                          : 'bg-[#EDE3D5] text-[#4A3525] hover:text-[#2C1D13] border border-[#D8C7B3]'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                required
                placeholder="Or type crop name (e.g. Tomato, Wheat, Onion, Rice)..."
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                className="w-full min-h-[42px] px-3 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48]"
              />
            </div>

            {/* 4. QUANTITY & QUALITY GRADE */}
            <div className="grid grid-cols-2 gap-3">
              {/* QUANTITY */}
              <div>
                <label className="block text-xs font-black uppercase text-[#6E5544] mb-1">
                  Quantity
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantityValue || ''}
                    onChange={e => setQuantityValue(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48]"
                  />
                  <select
                    value={quantityUnit}
                    onChange={e => setQuantityUnit(e.target.value as any)}
                    className="min-h-[42px] px-2 bg-[#EDE3D5] text-[#2C1D13] text-xs font-black rounded-xl border border-[#D8C7B3] cursor-pointer"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">Qtl</option>
                    <option value="ton">Tons</option>
                  </select>
                </div>
              </div>

              {/* QUALITY GRADE */}
              <div>
                <label className="block text-xs font-black uppercase text-[#6E5544] mb-1">
                  Quality Grade
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value as any)}
                  className="w-full min-h-[42px] px-3 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3] focus:outline-hidden focus:border-[#1E7C48] cursor-pointer"
                >
                  <option value="A">Grade A (Premium / Export)</option>
                  <option value="B">Grade B (Standard Mandi)</option>
                  <option value="C">Grade C (Processing / Sauce)</option>
                </select>
              </div>
            </div>

            {/* 5. LOCATION */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase text-[#6E5544]">
                  Location (Mandi / District)
                </label>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  className="text-[11px] font-bold text-[#1E7C48] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  Auto-Detect GPS
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Village / Town"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3]"
                />
                <input
                  type="text"
                  required
                  placeholder="District"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3]"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 bg-white text-[#2C1D13] text-xs font-bold rounded-xl border border-[#D8C7B3]"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[48px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Send OTP via Text SMS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[10px] text-[#6E5544] mt-2">
                🔒 Free APMC registration · Instant SMS verification · No hidden commission
              </p>
            </div>
          </form>
        ) : (
          /* STEP 2: OTP VERIFICATION VIEW */
          <div className="p-5 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E1F2E7] text-[#1E7C48] mx-auto flex items-center justify-center border border-[#79C195] shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#2C1D13]">
                Enter 6-Digit SMS Verification Code
              </h3>
              <p className="text-xs text-[#6E5544]">
                Text message sent to <strong>+91 {mobile}</strong>
              </p>
            </div>

            {/* 6-DIGIT INPUT BOXES */}
            <div className="flex justify-center gap-2 sm:gap-2.5 py-2">
              {enteredOtp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-black rounded-2xl border-2 border-[#D8C7B3] bg-white text-[#2C1D13] focus:border-[#1E7C48] focus:ring-2 focus:ring-[#1E7C48]/30 focus:outline-hidden transition-all shadow-inner"
                />
              ))}
            </div>

            {/* Quick Auto Fill Button in View */}
            <div className="bg-[#EDE3D5] rounded-2xl p-3 border border-[#D8C7B3] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E7C48]" />
                <span className="text-[#6E5544]">
                  SMS Code received: <strong className="font-mono text-[#2C1D13]">{generatedOtp}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-2.5 py-1 bg-[#1E7C48] text-white font-extrabold rounded-lg text-xs hover:bg-[#165f37] active:scale-95 cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full min-h-[48px] bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Verify OTP & Enter TradeBridge</span>
            </button>

            {/* RESEND OR BACK */}
            <div className="flex items-center justify-between text-xs text-[#6E5544] pt-2">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="font-bold text-[#8C5E3C] hover:underline"
              >
                ← Edit Details
              </button>

              {smsTimer > 0 ? (
                <span className="text-[#8C5E3C] font-mono">
                  Resend SMS in <strong>{smsTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newOtp);
                    setSmsTimer(60);
                    setShowSmsBanner(true);
                    playSmsNotificationSound();
                  }}
                  className="font-extrabold text-[#1E7C48] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Text SMS
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
