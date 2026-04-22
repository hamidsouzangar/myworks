import React, { useState } from 'react';
import { soundEngine } from '../utils/SoundEngine';

export const SoundTester: React.FC = () => {
  const [spinDuration, setSpinDuration] = useState(2000);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-sans">
      <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-12">Sound Engine Tester</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playCountdown(); }}
          className="h-32 border-4 border-white text-white font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
        >
          Countdown Beep
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playStartBuzz(); }}
          className="h-32 border-4 border-green-500 text-green-500 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-green-500 hover:text-black active:scale-95"
        >
          Start Buzz
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playFinish(); }}
          className="h-32 border-4 border-blue-500 text-blue-500 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-blue-500 hover:text-black active:scale-95"
        >
          Task Finish
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playTimeOut('buzzer'); }}
          className="h-32 border-4 border-red-600 text-red-600 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-red-600 hover:text-black active:scale-95"
        >
          TimeOut (Buzzer)
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playTimeOut('digital'); }}
          className="h-32 border-4 border-yellow-400 text-yellow-400 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-yellow-400 hover:text-black active:scale-95"
        >
          TimeOut (Digital)
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playUiPop(); }}
          className="h-32 border-4 border-pink-500 text-pink-500 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-pink-500 hover:text-black active:scale-95"
        >
          UI Pop
        </button>

        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playBottleStop(); }}
          className="h-32 border-4 border-purple-500 text-purple-500 font-black text-2xl uppercase tracking-widest transition-all duration-150 hover:bg-purple-500 hover:text-black active:scale-95"
        >
          Bottle Stop (Thud)
        </button>
      </div>

      <div className="w-full max-w-xl bg-gray-900 p-8 border-4 border-cyan-500 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest mb-6">Bottle Spin Physics</h2>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={spinDuration}
          onChange={(e) => setSpinDuration(Number(e.target.value))}
          className="w-full mb-4 accent-cyan-500"
        />
        <div className="text-cyan-200 font-mono text-xl mb-6">{spinDuration}ms</div>
        <button
          onClick={() => { soundEngine.unlock(); soundEngine.playBottleSpin(spinDuration); }}
          className="w-full py-4 border-4 border-cyan-400 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-400 hover:text-black font-black uppercase text-2xl transition-colors active:scale-95"
        >
          Test Spin Sound
        </button>
      </div>
    </div>
  );
};
