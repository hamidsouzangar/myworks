import React from 'react';

const COLORS = ['#39FF14', '#FF003C', '#FCEE09', '#00F0FF', '#B026FF', '#FFFFFF'];

const EYES = [
  // Narrow Slits
  <path key="eyes-1" d="M 20 40 L 40 45 L 20 50 Z M 60 45 L 80 40 L 80 50 Z" fill="black" stroke="black" strokeWidth="2" strokeLinejoin="round" />,
  // Uneven Squares
  <g key="eyes-2">
    <rect x="25" y="35" width="15" height="15" fill="black" />
    <rect x="60" y="40" width="10" height="20" fill="black" />
  </g>,
  // Angry Angled Lines
  <path key="eyes-3" d="M 15 30 L 45 45 M 85 30 L 55 45" stroke="black" strokeWidth="8" strokeLinecap="square" />,
  // Big Circles with dots
  <g key="eyes-4">
    <circle cx="30" cy="40" r="12" fill="none" stroke="black" strokeWidth="6" />
    <circle cx="30" cy="40" r="4" fill="black" />
    <circle cx="70" cy="40" r="12" fill="none" stroke="black" strokeWidth="6" />
    <circle cx="70" cy="40" r="4" fill="black" />
  </g>
];

const MOUTHS = [
  // Flat Line
  <line key="mouth-1" x1="30" y1="75" x2="70" y2="75" stroke="black" strokeWidth="8" strokeLinecap="square" />,
  // Jagged Sawtooth
  <path key="mouth-2" d="M 20 70 L 35 85 L 50 70 L 65 85 L 80 70" fill="none" stroke="black" strokeWidth="6" strokeLinejoin="miter" />,
  // Open Triangle
  <polygon key="mouth-3" points="30,70 70,70 50,90" fill="black" />,
  // Asymmetrical Smirk
  <path key="mouth-4" d="M 30 80 Q 50 85 80 65" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
];

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

interface PlayerAvatarProps {
  seed: string;
  size?: number;
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ seed, size = 64, className = '' }) => {
  const hash = stringToHash(seed);

  const bgColor = COLORS[hash % COLORS.length];
  const eyes = EYES[(hash >> 2) % EYES.length];
  const mouth = MOUTHS[(hash >> 4) % MOUTHS.length];

  return (
    <div
      className={`inline-block border-4 border-black drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] ${className}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {eyes}
        {mouth}
      </svg>
    </div>
  );
};
