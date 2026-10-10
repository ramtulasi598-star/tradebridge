import React, { useState, useEffect, useRef } from 'react';
import { CropListing } from '../../types/marketplace';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Gauge
} from 'lucide-react';

// Fallback high-res photographic assets for crops
export const CROP_HD_PHOTOS: Record<string, string[]> = {
  'crop-tomato': [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-chilli': [
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-potato': [
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-onion': [
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-capsicum': [
    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-wheat': [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-rice': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&auto=format&fit=crop&q=85'
  ],
  'crop-maize': [
    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&auto=format&fit=crop&q=85'
  ]
};

// Web Audio synthesizer for realistic rural farm ambience (morning wind + distant songbirds)
class FarmAudioAmbience {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private birdTimer: number | null = null;
  private isPlaying = false;

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // 1. Wind noise generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.08;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for soft morning breeze through field foliage
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;

      // 2. Periodic pleasant morning birdsong chirps
      this.scheduleBirdChirp();
      this.isPlaying = true;
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  private scheduleBirdChirp() {
    if (!this.ctx || !this.gainNode) return;
    const nextInterval = 2500 + Math.random() * 4000;
    this.birdTimer = window.setTimeout(() => {
      this.playBirdChirp();
      if (this.isPlaying) {
        this.scheduleBirdChirp();
      }
    }, nextInterval);
  }

  private playBirdChirp() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const baseFreq = 2200 + Math.random() * 600;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 700, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, now + 0.16);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 800, now + 0.24);

      chirpGain.gain.setValueAtTime(0.001, now);
      chirpGain.gain.linearRampToValueAtTime(0.035, now + 0.04);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(chirpGain);
      chirpGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
      } catch {
        // noop
      }
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // noop
      }
      this.noiseNode = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // noop
      }
      this.ctx = null;
    }
  }
}

interface CropVideoPlayerProps {
  listing: CropListing;
  isInline?: boolean;
  autoPlay?: boolean;
  onExpandFullscreen?: () => void;
  onClose?: () => void;
  onCallFarmer?: () => void;
  onChatFarmer?: () => void;
  onPrebook?: () => void;
}

export const RealisticCropVideoPlayer: React.FC<CropVideoPlayerProps> = ({
  listing,
  isInline = false,
  autoPlay = true,
  onExpandFullscreen,
  onClose,
  onCallFarmer,
  onChatFarmer,
  onPrebook
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const duration = listing.videoDurationSeconds || 24;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioManagerRef = useRef<FarmAudioAmbience | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Photos for this crop
  const photoUrls = CROP_HD_PHOTOS[listing.cropId] || [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=85'
  ];

  // Preload HD crop photos for cinema engine
  useEffect(() => {
    imagesRef.current = photoUrls.map(url => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      return img;
    });
  }, [listing.cropId]);

  // Audio setup
  useEffect(() => {
    const audio = new FarmAudioAmbience();
    audioManagerRef.current = audio;
    return () => {
      audio.stop();
    };
  }, []);

  // Handle Mute / Unmute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (isPlaying) {
        audioManagerRef.current?.start();
      }
    } else {
      setIsMuted(true);
      audioManagerRef.current?.stop();
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioManagerRef.current?.stop();
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        audioManagerRef.current?.start();
      }
    }
  };

  // Cycle speed
  const cycleSpeed = () => {
    if (playbackSpeed === 1.0) setPlaybackSpeed(0.5); // Slow-mo inspection
    else if (playbackSpeed === 0.5) setPlaybackSpeed(1.5);
    else setPlaybackSpeed(1.0);
  };

  // Timeline timer tick
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= duration) {
            // Loop or reset
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, duration]);

  // Switch camera angle photos every 8 seconds
  useEffect(() => {
    const idx = Math.floor((currentTime / 8) % photoUrls.length);
    setActivePhotoIdx(idx);
  }, [currentTime, photoUrls.length]);

  // Realistic Cinematic Canvas Motion Engine: Handheld micro-camera shake, lens glare, morning sunlight, depth pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const currentImg = imagesRef.current[activePhotoIdx];
      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        // Natural handheld camera drift & zoom (Ken Burns farm camera motion)
        const progress = (currentTime % 8) / 8; // 0 to 1
        const zoom = 1.05 + Math.sin(progress * Math.PI) * 0.08;
        
        // Micro hand-jitter (real human holding camera while inspecting produce crates)
        const handJitterX = Math.sin(elapsed * 2.8) * 3.5 + Math.cos(elapsed * 4.2) * 2;
        const handJitterY = Math.cos(elapsed * 2.2) * 2.8 + Math.sin(elapsed * 3.7) * 1.5;

        // Pan across harvest lot
        const panX = (progress - 0.5) * 45 + handJitterX;
        const panY = (progress - 0.5) * 25 + handJitterY;

        ctx.save();
        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.scale(zoom, zoom);
        ctx.drawImage(currentImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        // 1. Cinematic morning sunlight ray & lens flare across fresh produce
        const sunX = (Math.sin(elapsed * 0.8) * 0.3 + 0.7) * width;
        const sunY = (Math.cos(elapsed * 0.7) * 0.2 + 0.3) * height;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.6);
        sunGrad.addColorStop(0, 'rgba(255, 248, 220, 0.28)');
        sunGrad.addColorStop(0.4, 'rgba(255, 230, 180, 0.12)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Fresh morning dew shimmer / sparkling water droplets reflection on skin
        const sparkleTime = elapsed * 3;
        const sparkleX = width * 0.42 + Math.sin(sparkleTime) * 60;
        const sparkleY = height * 0.52 + Math.cos(sparkleTime * 0.8) * 40;
        const sparkleGrad = ctx.createRadialGradient(sparkleX, sparkleY, 2, sparkleX, sparkleY, 24);
        sparkleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        sparkleGrad.addColorStop(0.5, 'rgba(255, 255, 200, 0.35)');
        sparkleGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sparkleGrad;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 24, 0, Math.PI * 2);
        ctx.fill();

        // 3. Subtle vignette to frame the farm harvest naturally
        const vigGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.75);
        vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Fallback rendering
        ctx.fillStyle = '#1A120B';
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTime, activePhotoIdx]);

  // Formatted timer string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className={`relative bg-[#0E0905] overflow-hidden select-none font-sans text-white ${
      isInline
        ? 'w-full rounded-2xl aspect-[16/10] shadow-md border border-[#D8C7B3]'
        : 'w-full h-full rounded-3xl flex flex-col'
    }`}>
      {/* CANVAS REALISTIC CROP VIDEO ENGINE */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-cover"
        />

        {/* 1. CAMERA RECORDER HUD (Top Bar) */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-start justify-between pointer-events-none z-10">
          {/* Top Left: Blinking Red REC + Timestamp */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>REC</span>
              </div>
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white/90 drop-shadow-md">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white/90">
                4K UHD 60FPS
              </span>
            </div>

            {/* GPS Geotag Stamp */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/80 drop-shadow-sm font-medium">
              <MapPin className="w-3 h-3 text-[#79C195]" />
              <span>
                {listing.location.area || 'Kalikiri'}, {listing.location.district || 'Chittoor'} (13.62° N, 78.78° E)
              </span>
            </div>
          </div>

          {/* Top Right: Badges & Close/Expand */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* AI Scan toggle */}
            <button
              onClick={() => setShowAiOverlay(!showAiOverlay)}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black flex items-center gap-1 border transition-all ${
                showAiOverlay
                  ? 'bg-[#1E7C48] text-white border-[#79C195] shadow-md'
                  : 'bg-black/50 text-white/70 border-white/20 hover:text-white'
              }`}
              title="Toggle AI Quality Inspector HUD"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI SCAN</span>
            </button>

            {/* Slow-Mo Inspector */}
            <button
              onClick={cycleSpeed}
              className="px-2 py-1 bg-black/60 backdrop-blur-xs text-white border border-white/20 rounded-xl text-[10px] sm:text-xs font-mono font-bold hover:bg-black/80 transition-colors"
              title="Change Speed (0.5x Slow-Motion for produce inspection)"
            >
              {playbackSpeed}x
            </button>

            {/* Expand / Fullscreen Button */}
            {isInline && onExpandFullscreen && (
              <button
                onClick={onExpandFullscreen}
                className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-xs text-white flex items-center justify-center border border-white/20 transition-all shadow-md"
                title="Open Fullscreen Inspection"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close button (when in modal) */}
            {!isInline && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center border border-white/20 transition-all"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* 2. REALISTIC AI QUALITY INSPECTION HUD OVERLAY (Center Bounding Box) */}
        {showAiOverlay && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 p-6">
            {/* Animated scanning laser line */}
            <div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#79C195] to-transparent opacity-75 shadow-[0_0_12px_#1E7C48]"
              style={{
                top: `${((currentTime * 18) % 80) + 10}%`,
                transition: 'top 0.1s linear'
              }}
            />

            {/* Target Reticle Box around produce */}
            <div className="relative w-48 sm:w-64 h-36 sm:h-48 border-2 border-dashed border-[#79C195]/80 rounded-2xl bg-black/25 backdrop-blur-[1px] p-2 sm:p-2.5 flex flex-col justify-between shadow-2xl animate-pulse">
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#1E7C48]" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#1E7C48]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#1E7C48]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#1E7C48]" />

              {/* Tag Header */}
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase text-[#79C195] bg-black/60 px-2 py-0.5 rounded-md">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#79C195]" />
                  <span>LOT VERIFIED</span>
                </div>
                <span className="font-mono text-white">GRADE {listing.grade}</span>
              </div>

              {/* Real-time Quality Metrics */}
              <div className="bg-black/75 backdrop-blur-xs rounded-xl p-2 space-y-1 text-[10px] sm:text-[11px] font-bold text-white border border-white/10">
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-[#D8C7B3]">Color Uniformity:</span>
                  <span className="text-[#79C195] font-mono">98.4% Scarlet</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-[#D8C7B3]">Blemish / Pest Mark:</span>
                  <span className="text-[#79C195] font-mono">0.0% Clean</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-[#D8C7B3]">Firmness Index:</span>
                  <span className="text-[#79C195] font-mono">9.6 / 10 Export</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-[#D8C7B3]">Harvest Window:</span>
                  <span className="text-white font-mono">Today 07:15 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CENTER PLAY / PAUSE TOUCH OVERLAY */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-15 group focus:outline-none"
        >
          {!isPlaying ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E7C48]/90 hover:bg-[#1E7C48] text-white flex items-center justify-center shadow-2xl border-2 border-white/80 transform group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
            </div>
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/30 backdrop-blur-xs">
              <Pause className="w-6 h-6" />
            </div>
          )}
        </button>

        {/* 4. BOTTOM CONTROLS & TIMELINE BAR */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 space-y-2">
          {/* Progress Scrubber */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentTime(ratio * duration);
            }}
            className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer relative transition-all"
          >
            <div
              className="h-full bg-[#1E7C48] rounded-full shadow-sm relative transition-all"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transform translate-x-1/2" />
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play / Pause button */}
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>

              {/* Sound Ambience toggle (Web Audio realistic rural breeze & birds) */}
              <button
                onClick={toggleMute}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors text-[11px] font-bold ${
                  !isMuted
                    ? 'bg-[#1E7C48] text-white shadow-sm'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
                title="Toggle Real Farm Ambience (Breeze & Birds Audio)"
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{!isMuted ? 'Farm Audio ON' : 'Unmute Audio'}</span>
              </button>

              {/* Replay */}
              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Harvest lot specs */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="font-extrabold text-[#79C195]">
                ₹{listing.expectedPricePerKg || 32}/kg
              </span>
              <span className="text-white/60">•</span>
              <span className="text-white/90">
                {listing.totalQuantityKg || 1000} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL BOTTOM ACTION STRIP (Only when in full modal mode) */}
      {!isInline && (
        <div className="bg-[#1C130B] p-4 border-t border-[#3D2B1E] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2A1D13] text-[#79C195] flex items-center justify-center font-black border border-[#4D3624]">
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">{listing.farmerName}</span>
                <span className="text-[10px] bg-[#1E7C48] text-white px-2 py-0.5 rounded-full font-bold">
                  Verified Farmer
                </span>
              </div>
              <p className="text-xs text-[#C2AE97]">
                {listing.cropName} • Grade {listing.grade} • {listing.location.area}, {listing.location.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onCallFarmer && (
              <button
                onClick={onCallFarmer}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-[#2A1D13] hover:bg-[#3D2B1E] text-white rounded-xl text-xs font-bold border border-[#4D3624] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#79C195]" />
                <span>Call Farmer</span>
              </button>
            )}

            {onChatFarmer && (
              <button
                onClick={onChatFarmer}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 bg-[#2A1D13] hover:bg-[#3D2B1E] text-white rounded-xl text-xs font-bold border border-[#4D3624] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#79C195]" />
                <span>Chat</span>
              </button>
            )}

            {onPrebook && (
              <button
                onClick={onPrebook}
                className="flex-1 sm:flex-initial min-h-[42px] px-5 bg-[#1E7C48] hover:bg-[#165f37] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <span>Send Pre-book Offer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Full-screen Modal Wrapper
interface CropVideoModalProps {
  listing: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onCallFarmer?: (mobile: string) => void;
  onChatFarmer?: (farmerId: string) => void;
  onPrebook?: (listing: CropListing) => void;
}

export const CropVideoModal: React.FC<CropVideoModalProps> = ({
  listing,
  isOpen,
  onClose,
  onCallFarmer,
  onChatFarmer,
  onPrebook
}) => {
  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#1C130B] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#3D2B1E] relative">
        <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black">
          <RealisticCropVideoPlayer
            listing={listing}
            isInline={false}
            autoPlay={true}
            onClose={onClose}
            onCallFarmer={() => onCallFarmer && onCallFarmer(listing.farmerMobile || '+91 98480 12345')}
            onChatFarmer={() => onChatFarmer && onChatFarmer(listing.farmerId)}
            onPrebook={() => onPrebook && onPrebook(listing)}
          />
        </div>
      </div>
    </div>
  );
};
