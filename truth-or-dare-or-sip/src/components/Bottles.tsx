

const BaseProps = {
  viewBox: "0 0 100 300",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "w-24 md:w-32 drop-shadow-[8px_8px_0_rgba(255,255,255,0.2)]"
};

export const Bottle1 = () => (
  <svg {...BaseProps}>
    <rect x="40" y="10" width="20" height="15" fill="#2A3D2F" />
    <path d="M 40 25 V 80 C 20 100 20 120 20 150 V 290 H 80 V 150 C 80 120 80 100 60 80 V 25 Z" fill="#4A6B53" />
    <rect x="25" y="180" width="50" height="70" fill="#E8DECB" />
    <rect x="30" y="185" width="40" height="60" fill="#4A6B53" />
    <rect x="35" y="190" width="30" height="50" fill="#E8DECB" />
  </svg>
);

export const Bottle2 = () => (
  <svg {...BaseProps}>
    <rect x="35" y="80" width="30" height="15" fill="#4A0E13" />
    <rect x="40" y="95" width="20" height="35" fill="#8B1C24" />
    <path d="M 40 130 C 0 130 0 290 20 290 H 80 C 100 290 100 130 60 130 Z" fill="#8B1C24" />
    <circle cx="50" cy="220" r="30" fill="#E8DECB" />
    <circle cx="50" cy="220" r="22" fill="#8B1C24" />
  </svg>
);

export const Bottle3 = () => (
  <svg {...BaseProps}>
    <rect x="35" y="20" width="30" height="10" fill="#1A0E08" />
    <path d="M 38 30 V 90 L 20 140 V 290 H 80 V 140 L 62 90 V 30 Z" fill="#3E2313" />
    <rect x="25" y="170" width="50" height="60" rx="10" fill="#E8DECB" />
    <circle cx="50" cy="200" r="15" fill="#3E2313" />
  </svg>
);

export const Bottle4 = () => (
  <svg {...BaseProps}>
    <rect x="35" y="40" width="30" height="15" fill="#7A6624" />
    <rect x="38" y="55" width="24" height="25" fill="#B89C3A" />
    <path d="M 25 80 H 75 L 85 110 V 290 H 15 V 110 Z" fill="#B89C3A" />
    <rect x="25" y="140" width="50" height="90" fill="#E8DECB" />
  </svg>
);

export const Bottle5 = () => (
  <svg {...BaseProps}>
    <path d="M 35 10 H 65 L 60 70 H 40 Z" fill="#E8DECB" />
    <path d="M 40 70 C 40 140 15 160 15 290 H 85 C 85 160 60 140 60 70 Z" fill="#D96C2A" />
    <path d="M 25 200 Q 50 180 75 200 V 260 Q 50 280 25 260 Z" fill="#E8DECB" />
  </svg>
);

export const Bottle6 = () => (
  <svg {...BaseProps}>
    <rect x="35" y="20" width="30" height="20" fill="#E8DECB" />
    <rect x="35" y="40" width="30" height="10" fill="#1A3B4C" />
    <rect x="25" y="50" width="50" height="240" fill="#4B8B9B" stroke="black" strokeWidth="8" />
    <rect x="40" y="80" width="20" height="150" fill="#E8DECB" />
    <line x1="32" y1="60" x2="32" y2="280" stroke="black" strokeWidth="4" />
  </svg>
);

export const Bottle7 = () => (
  <svg {...BaseProps}>
    <circle cx="50" cy="80" r="15" fill="#8B1C24" />
    <rect x="40" y="90" width="20" height="30" fill="#5A3A75" />
    <circle cx="50" cy="200" r="45" fill="#5A3A75" stroke="black" strokeWidth="8" />
    <rect x="25" y="240" width="50" height="10" fill="#5A3A75" />
    <path d="M 20 200 A 30 30 0 0 0 50 230 V 240 A 40 40 0 0 1 10 200 Z" fill="white" opacity="0.2" />
    <polygon points="50,170 60,190 40,190" fill="#E8DECB" />
    <rect x="45" y="190" width="10" height="10" fill="#E8DECB" />
  </svg>
);

export const BOTTLES = [Bottle1, Bottle2, Bottle3, Bottle4, Bottle5, Bottle6, Bottle7];
