import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRANSLATIONS } from '../../data/translations';
import { INITIAL_CROPS, SAMPLE_LOCATIONS } from '../../data/initialData';
import { QualityGradeCode } from '../../types/marketplace';
import { X, Video, Camera, Check, Upload, Info, Sparkles } from 'lucide-react';

interface UploadListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (listingId: string) => void;
}

export const UploadListingModal: React.FC<UploadListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated
}) => {
  const { createListing } = useMarketplace();
  const { language, currentUser } = useAuth();
  const t = TRANSLATIONS[language];

  const [selectedCropId, setSelectedCropId] = useState<string>('crop-tomato');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [selectedGrade, setSelectedGrade] = useState<QualityGradeCode>('A');
  const [selectedLocation, setSelectedLocation] = useState(currentUser.location || SAMPLE_LOCATIONS[0]);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );

  // Camera / Media state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentCrop = INITIAL_CROPS.find(c => c.id === selectedCropId) || INITIAL_CROPS[0];

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsRecording(true);
      setRecordingSeconds(0);
      const timer = setInterval(() => {
        setRecordingSeconds(s => {
          if (s >= 15) {
            clearInterval(timer);
            handleStopCamera();
            return 15;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      // Fallback if browser camera access is denied or restricted in preview
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      alert('Camera access unavailable or blocked in this environment. Sample field inspection video loaded.');
    }
  };

  const handleStopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityKg <= 0) return;

    const newListingId = createListing(
      currentCrop.id,
      currentCrop.nameKey,
      selectedGrade,
      quantityKg,
      selectedLocation,
      videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    );

    onListingCreated(newListingId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D8C7B3] no-scrollbar">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#EDE3D5]/95 backdrop-blur-xs px-5 py-4 border-b border-[#D8C7B3] flex items-center justify-between z-10 text-[#2C1D13]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E5D7C4] text-[#1E7C48] flex items-center justify-center border border-[#D8C7B3]">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2C1D13]">
                {t.uploadCropTitle}
              </h2>
              <p className="text-[11px] text-[#6E5544]">
                {t.farmerNoPriceRule.substring(0, 52)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5D7C4] hover:bg-[#D9C8B5] text-[#4A3525] flex items-center justify-center border border-[#D8C7B3] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[#2C1D13]">
          {/* Strict Zero-Price Rule Notice */}
          <div className="bg-[#EDE3D5] border border-[#D8C7B3] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#4A3525]">
            <Info className="w-4 h-4 text-[#1E7C48] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#2C1D13]">{t.farmerNoPriceRule}</strong>
            </p>
          </div>

          {/* Step 1: Crop Video Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#4A3525]">
              {t.uploadVideoPrompt}
            </label>
            <p className="text-[11px] text-[#6E5544]">
              {t.videoHelpText}
            </p>

            {/* Video Player Preview / Live Camera Feed */}
            <div className="relative aspect-video bg-[#1B120B] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-[#D8C7B3]">
              {isRecording ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              ) : (
                <video src={videoUrl} controls className="w-full h-full object-cover" playsInline />
              )}

              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  Recording: {recordingSeconds}s / 15s
                </div>
              )}
            </div>

            {/* Video Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="min-h-[40px] px-3 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#D8C7B3] transition-colors"
                >
                  <Camera className="w-4 h-4 text-[#1E7C48]" />
                  {t.recordVideo}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="min-h-[40px] px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  Stop Recording
                </button>
              )}

              <label className="min-h-[40px] px-3 py-1.5 bg-[#EDE3D5] hover:bg-[#E5D7C4] text-[#2C1D13] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-[#D8C7B3] transition-colors">
                <Upload className="w-4 h-4 text-[#1E7C48]" />
                <span>{t.chooseVideoFile}</span>
                <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Step 2: Crop Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#4A3525]">
              {t.cropNameLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {INITIAL_CROPS.map(crop => (
                <button
                  type="button"
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedCropId === crop.id
                      ? 'border-[#1E7C48] bg-[#E1F2E7] text-[#1E7C48] font-extrabold shadow-xs'
                      : 'border-[#D8C7B3] bg-[#EDE3D5] hover:border-[#8C5E3C] text-[#4A3525]'
                  }`}
                >
                  <span className="text-xl">{crop.icon}</span>
                  <span className="text-xs truncate">{crop.nameKey}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Quantity Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#4A3525]">
              {t.quantityLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                step="10"
                value={quantityKg}
                onChange={e => setQuantityKg(Number(e.target.value))}
                required
                className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#D8C7B3] bg-[#FAF7F2] text-[#2C1D13] text-base font-bold tabular-nums"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-[#6E5544]">
                kg
              </span>
            </div>
            {/* Quick volume chips */}
            <div className="flex items-center gap-1.5 pt-1">
              {[100, 250, 500, 1000, 2000].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setQuantityKg(amt)}
                  className={`px-2.5 py-1 text-xs rounded-lg border font-bold transition-colors ${
                    quantityKg === amt
                      ? 'bg-[#1E7C48] text-white border-[#1E7C48]'
                      : 'bg-[#EDE3D5] border-[#D8C7B3] text-[#4A3525] hover:text-[#2C1D13]'
                  }`}
                >
                  {amt} kg
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Quality Grade Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#4A3525]">
              {t.gradeLabel}
            </label>
            <div className="space-y-2">
              {currentCrop.grades.map(grade => (
                <div
                  key={grade.code}
                  onClick={() => setSelectedGrade(grade.code)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedGrade === grade.code
                      ? 'border-[#1E7C48] bg-[#E1F2E7] shadow-xs'
                      : 'border-[#D8C7B3] bg-[#EDE3D5] hover:border-[#8C5E3C]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-[#2C1D13]">
                      {grade.name}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedGrade === grade.code
                          ? 'border-[#1E7C48] bg-[#1E7C48] text-white'
                          : 'border-[#D8C7B3]'
                      }`}
                    >
                      {selectedGrade === grade.code && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6E5544] leading-normal">
                    {grade.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 5: Farm Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#4A3525]">
              {t.locationLabel}
            </label>
            <select
              value={selectedLocation.area}
              onChange={e => {
                const loc = SAMPLE_LOCATIONS.find(l => l.area === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#D8C7B3] text-xs font-medium text-[#2C1D13] bg-[#FAF7F2]"
            >
              {SAMPLE_LOCATIONS.map(loc => (
                <option key={loc.area} value={loc.area} className="bg-[#FAF7F2] text-[#2C1D13]">
                  {loc.area}, {loc.district}, {loc.state}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[46px] bg-[#1E7C48] hover:bg-[#165f37] text-white text-sm font-black rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {t.publishListing}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
