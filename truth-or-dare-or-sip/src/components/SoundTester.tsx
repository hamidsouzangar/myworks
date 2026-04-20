import React from 'react';
import { soundEngine } from '../utils/SoundEngine';

export const SoundTester: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          onClick={() => soundEngine.playCountdownBeep()}
          className="h-48 border-4 border-white text-white font-bold text-3xl uppercase tracking-widest transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
        >
          Countdown Beep
        </button>

        <button
          onClick={() => soundEngine.playStartBuzz()}
          className="h-48 border-4 border-green-500 text-green-500 font-bold text-3xl uppercase tracking-widest transition-all duration-150 hover:bg-green-500 hover:text-black active:scale-95"
        >
          Start Buzz
        </button>

        <button
          onClick={() => soundEngine.playEndBuzz()}
          className="h-48 border-4 border-red-600 text-red-600 font-bold text-3xl uppercase tracking-widest transition-all duration-150 hover:bg-red-600 hover:text-black active:scale-95"
        >
          End Buzz
        </button>

        <button
          onClick={() => soundEngine.playHarshBeep()}
          className="h-48 border-4 border-yellow-400 text-yellow-400 font-bold text-3xl uppercase tracking-widest transition-all duration-150 hover:bg-yellow-400 hover:text-black active:scale-95"
        >
          Harsh Beep
        </button>
      </div>
    </div>
  );
};
