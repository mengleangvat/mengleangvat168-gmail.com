import React from 'react';

interface KimmoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white-card';
  showSubtitle?: boolean;
  className?: string;
}

export const KimmoLogo: React.FC<KimmoLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 34, title: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 46, title: 'text-2xl', sub: 'text-xs' },
    lg: { icon: 60, title: 'text-3xl', sub: 'text-sm' },
    xl: { icon: 84, title: 'text-5xl', sub: 'text-base' },
  };

  const { icon, title, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Visual Bowl & Fire Emblem */}
      <div
        className={`relative flex items-center justify-center rounded-2xl p-1.5 shadow-sm transition-transform ${
          variant === 'light'
            ? 'bg-white text-[#8B0000] border-2 border-[#8B0000]/20'
            : variant === 'white-card'
            ? 'bg-[#8B0000] text-white shadow-md'
            : 'bg-gradient-to-br from-[#8B0000] to-[#600000] text-white shadow-[#8B0000]/25 shadow-md'
        }`}
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flame aura */}
          <path
            d="M50 8 C44 20 38 22 36 32 C34 40 40 45 44 48 C42 42 45 35 50 30 C55 36 58 41 56 48 C60 44 66 38 64 30 C62 20 56 20 50 8 Z"
            className={variant === 'light' ? 'fill-red-600 opacity-90' : 'fill-amber-400 opacity-95'}
          />
          {/* Sizzling Claypot Bowl */}
          <path
            d="M20 50 C20 72 32 86 50 86 C68 86 80 72 80 50 L20 50 Z"
            className={variant === 'light' ? 'fill-[#8B0000]' : 'fill-white'}
          />
          {/* Bowl Rim */}
          <rect
            x="16"
            y="46"
            width="68"
            height="7"
            rx="3.5"
            className={variant === 'light' ? 'fill-[#600000]' : 'fill-red-100'}
          />
          {/* Wavy Noodles */}
          <path
            d="M32 46 Q37 38 42 46 Q47 38 52 46 Q57 38 62 46 Q67 38 72 46"
            stroke={variant === 'light' ? '#b91c1c' : '#fbbf24'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Chopsticks lifting noodles */}
          <line
            x1="26"
            y1="22"
            x2="68"
            y2="42"
            stroke={variant === 'light' ? '#7f1d1d' : '#fef08a'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="30"
            y1="18"
            x2="72"
            y2="38"
            stroke={variant === 'light' ? '#7f1d1d' : '#fef08a'}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Chili pepper icon badge */}
          <path
            d="M44 62 C40 60 38 66 43 72 C48 78 57 78 57 78 C57 78 55 70 50 66 C48 64 46 64 44 62 Z"
            className={variant === 'light' ? 'fill-red-500' : 'fill-red-400'}
          />
        </svg>

        {/* Small Level 7 Flame Badge */}
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-red-950 ring-1 ring-white">
          7
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black tracking-wider uppercase font-dangrek leading-none ${title} ${
              variant === 'light'
                ? 'text-[#8B0000]'
                : variant === 'white-card'
                ? 'text-[#8B0000]'
                : 'text-[#8B0000]'
            }`}
          >
            KIMMO
          </span>
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8B0000] text-white tracking-wider">
            មីហឹរ
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-medium tracking-tight mt-0.5 leading-none ${sub} ${
              variant === 'white-card' ? 'text-stone-500' : 'text-[#8B0000]/80'
            }`}
          >
            គីមម៉ូ មីហឹរ 7 កម្រិត • Cambodia
          </span>
        )}
      </div>
    </div>
  );
};
