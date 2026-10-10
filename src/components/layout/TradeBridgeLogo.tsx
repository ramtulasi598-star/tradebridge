import React from 'react';

interface TradeBridgeLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: 'dark' | 'light';
  className?: string;
}

export const TradeBridgeLogo: React.FC<TradeBridgeLogoProps> = ({
  variant = 'full',
  size = 'md',
  textColor = 'light',
  className = ''
}) => {
  // Dimension mapping
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  const subtitleSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs'
  };

  // Reusable standalone TradeBridge Icon SVG replicating the exact user logo
  const TradeBridgeIcon = (
    <div className={`${iconSizes[size]} shrink-0 rounded-2xl overflow-hidden shadow-md flex items-center justify-center relative`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tbGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43A047" />
            <stop offset="35%" stopColor="#388E3C" />
            <stop offset="75%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>
        </defs>

        {/* Squircle container matching the app logo image */}
        <rect width="100" height="100" rx="24" fill="url(#tbGreenGrad)" />

        {/* White "tb" monogram emblem */}
        <g fill="#FFFFFF" fillRule="evenodd" clipRule="evenodd">
          {/* Left "t" hook and upper stem */}
          <path
            d="M 23 25 C 23 23 24.5 21.5 26.5 21.5 L 34.5 21.5 C 36.5 21.5 38 23 38 25 L 38 48 C 42.5 42 49 38 57 38 C 71 38 82 49 82 63 C 82 72 77 79 69 84 L 64 74 C 69 71 72 66 72 61 C 72 53 66 47 57 47 C 49 47 43 53 43 61 C 43 66 45 70 49 73 L 44 83 C 37 78 33 70 33 61 L 33 25 C 33 24 32.5 23 31.5 23 L 24.5 23 C 23.5 23 23 24 23 25 Z"
          />
          {/* Bottom bridge link connection */}
          <path
            d="M 50 62 C 50 58 53 55 57 55 C 61 55 64 58 64 62 C 64 66 61 69 57 69 C 53 69 50 66 50 62 Z"
          />
          <path
            d="M 45 84 L 54 84 C 55 84 56 83.5 56.5 82.5 L 59 78 C 55 78.5 52 77 49 75 L 45 84 Z"
          />
        </g>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{TradeBridgeIcon}</div>;
  }

  const isLight = textColor === 'light';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {TradeBridgeIcon}

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline tracking-tight">
          <span
            className={`${titleSizes[size]} font-extrabold ${
              isLight ? 'text-white' : 'text-[#1E1E1E]'
            }`}
          >
            Trade
          </span>
          <span
            className={`${titleSizes[size]} font-black ${
              isLight ? 'text-[#81C784]' : 'text-[#2E7D32]'
            }`}
          >
            Bridge
          </span>
        </div>

        {variant === 'full' && (
          <span
            className={`${subtitleSizes[size]} font-bold tracking-wider uppercase mt-0.5 ${
              isLight ? 'text-[#D8C7B3]' : 'text-[#4A3525]'
            }`}
          >
            B2B Agri-Tech Marketplace
          </span>
        )}
      </div>
    </div>
  );
};
