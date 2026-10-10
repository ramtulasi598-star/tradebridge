import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { CancellationReasonCode, Deal } from '../../types/marketplace';
import { X, ShieldAlert, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';

interface CancellationModalProps {
  deal: Deal | null;
  cancellationId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  deal,
  cancellationId,
  isOpen,
  onClose
}) => {
  const {
    cancellationRequests,
    requestCancellation,
    respondToCancellationRequest,
    verifyCancellationOtp
  } = useMarketplace();
  const { currentUser, language } = useAuth();
  const t = TRANSLATIONS[language];

  // Active cancellation if exists
  const existingCancel = cancellationRequests.find(
    c => c.id === cancellationId || (deal && c.dealId === deal.id && c.status !== 'VERIFIED_CANCELLED')
  );

  const [reasonCode, setReasonCode] = useState<CancellationReasonCode>('QUANTITY_UNAVAILABLE');
  const [reasonNotes, setReasonNotes] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !deal) return null;

  const isInitiator = existingCancel ? existingCancel.requestedByUserId === currentUser.id : true;

  // Step 1: Submit cancellation request
  const handleInitiateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = requestCancellation(deal.id, reasonCode, reasonNotes);
    if (!result.success) {
      setErrorMsg('Could not initiate cancellation.');
    }
  };

  // Step 2: Other party responds
  const handleRespond = (agree: boolean) => {
    if (!existingCancel) return;
    setErrorMsg(null);
    const result = respondToCancellationRequest(existingCancel.id, agree);
    if (result.success && result.generatedOtp) {
      setSuccessMsg(`Agreement reached! Verification OTP has been sent.`);
    }
  };

  // Step 3: Verify OTP and finalize cancellation
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingCancel) return;
    setErrorMsg(null);
    const result = verifyCancellationOtp(existingCancel.id, otpInput);
    if (result.success) {
      setSuccessMsg(t.cancellationCompleted);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg('Invalid or expired OTP. Please verify and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C1D13] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border border-[#D8C7B3]">
        {/* Header */}
        <div className="sticky top-0 bg-[#EDE3D5]/95 backdrop-blur-xs px-5 py-4 border-b border-[#D8C7B3] flex items-center justify-between z-10 text-[#2C1D13]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-300 text-red-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2C1D13]">
                {t.cancellationTitle}
              </h2>
              <p className="text-[11px] text-[#6E5544] font-mono">
                Deal <strong className="text-[#1E7C48]">{deal.dealCode}</strong> · {deal.quantityKg} kg {deal.cropName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Warning Banner */}
          <div className="bg-[#FDF2E2] border border-[#E2BA7C] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#A3661C]">
            <AlertTriangle className="w-4 h-4 text-[#A3661C] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.cancellationWarning}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-100 border border-red-300 rounded-xl p-3 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-[#E1F2E7] border border-[#79C195] rounded-xl p-3 text-xs text-[#1E7C48] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E7C48]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STATE 1: NO CANCELLATION REQUESTED YET -> SHOW INITIATION FORM */}
          {!existingCancel && (
            <form onSubmit={handleInitiateRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3525]">
                  {t.selectReason}
                </label>
                <select
                  value={reasonCode}
                  onChange={e => setReasonCode(e.target.value as CancellationReasonCode)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#D8C7B3] text-xs font-semibold text-[#2C1D13] bg-[#FAF7F2]"
                >
                  <option value="QUANTITY_UNAVAILABLE">{t.reasonQtyUnavailable}</option>
                  <option value="QUALITY_MISMATCH">{t.reasonQualityMismatch}</option>
                  <option value="TRANSPORTATION_PROBLEM">{t.reasonTransportIssue}</option>
                  <option value="BUYER_CHANGED_REQUIREMENT">{t.reasonBuyerChanged}</option>
                  <option value="FARMER_CHANGED_DECISION">{t.reasonFarmerChanged}</option>
                  <option value="OTHER">{t.reasonOther}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3525]">
                  Explanation Notes
                </label>
                <textarea
                  rows={3}
                  value={reasonNotes}
                  onChange={e => setReasonNotes(e.target.value)}
                  placeholder={t.enterReasonNotes}
                  className="w-full p-3 rounded-xl border border-[#D8C7B3] text-xs text-[#2C1D13] placeholder-[#8C5E3C] bg-[#FAF7F2] focus:outline-hidden focus:border-[#1E7C48]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95"
              >
                {t.submitCancelRequest}
              </button>
            </form>
          )}

          {/* STATE 2: CANCELLATION PENDING APPROVAL FROM OTHER PARTY */}
          {existingCancel && existingCancel.status === 'PENDING_APPROVAL' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#EDE3D5] rounded-2xl border border-[#D8C7B3] text-xs space-y-1.5">
                <span className="text-[#6E5544] font-semibold block uppercase text-[10px]">
                  Pending Response
                </span>
                <p className="font-bold text-[#2C1D13]">
                  Requested by: {existingCancel.requestedByName} ({existingCancel.requestedByRole})
                </p>
                <p className="text-[#4A3525]">
                  <strong>Reason:</strong> {existingCancel.reasonCode}
                </p>
                {existingCancel.reasonNotes && (
                  <p className="text-[#6E5544] italic">
                    &ldquo;{existingCancel.reasonNotes}&rdquo;
                  </p>
                )}
              </div>

              {!isInitiator ? (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-[#4A3525] font-medium">
                    Do you agree to cancel Deal {deal.dealCode}?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRespond(true)}
                      className="min-h-[44px] px-4 py-2 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-extrabold transition-all"
                    >
                      {t.agreeToCancel}
                    </button>
                    <button
                      onClick={() => handleRespond(false)}
                      className="min-h-[44px] px-4 py-2 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#4A3525] rounded-xl text-xs font-semibold border border-[#D8C7B3] transition-colors"
                    >
                      {t.disputeCancellation}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#6E5544] text-center py-3 bg-[#EDE3D5] rounded-xl border border-[#D8C7B3]">
                  Waiting for the other party to approve. Once approved, you will receive a 6-digit verification OTP.
                </div>
              )}
            </div>
          )}

          {/* STATE 3: OTP VERIFICATION REQUIRED TO RELEASE LOCK */}
          {existingCancel && (existingCancel.status === 'OTP_PENDING' || existingCancel.otpCode) && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-[#E1F2E7] border border-[#79C195] rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#1E7C48]" />
                  <h3 className="text-sm font-bold text-[#2C1D13]">
                    Mutual Consent Reached!
                  </h3>
                </div>
                <p className="text-xs text-[#1E7C48] leading-relaxed">
                  {t.otpSentNotice}
                </p>

                {/* Demo Helper: Display Generated OTP */}
                {existingCancel.otpCode && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpInput(existingCancel.otpCode || '')}
                      className="text-xs font-mono font-bold bg-[#FAF7F2] text-[#1E7C48] px-3 py-1.5 rounded-lg border border-[#79C195] shadow-xs hover:bg-[#EDE3D5] transition-colors"
                    >
                      Click to Auto-fill Demo OTP: {existingCancel.otpCode}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3525]">
                  {t.enterCancellationOtp}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  className="w-full min-h-[48px] text-center tracking-widest text-lg font-mono font-bold rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] focus:outline-hidden focus:border-[#1E7C48]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t.verifyAndCancel}
              </button>
            </form>
          )}

          {/* STATE 4: CANCELLATION COMPLETED */}
          {existingCancel && existingCancel.status === 'VERIFIED_CANCELLED' && (
            <div className="bg-[#EDE3D5] border border-[#D8C7B3] rounded-2xl p-5 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#1E7C48] mx-auto" />
              <h3 className="text-sm font-bold text-[#2C1D13]">
                {t.cancellationCompleted}
              </h3>
              <p className="text-xs text-[#6E5544]">
                Pre-booked quantities have been restored to available inventory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
