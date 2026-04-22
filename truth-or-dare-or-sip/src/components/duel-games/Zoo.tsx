import { PlayerAvatar } from '../PlayerAvatar';
import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const Zoo: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);
  const [player1Id, setPlayer1Id] = useState<string>(players[0].id);
  const [player2Id, setPlayer2Id] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'READY' | 'COUNTDOWN' | 'ACTIVE'>('SETUP');
  const [countdown, setCountdown] = useState<number>(3);

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);

  const startCountdown = () => {
    setPhase('COUNTDOWN');
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        soundEngine.playCountdown();
      } else if (count === 0) {
        setCountdown(0);
        soundEngine.playStartBuzz();
        setPhase('ACTIVE');
        clearInterval(interval);
      }
    }, 1000);
    soundEngine.playCountdown(); // initial beep for 3
  };

  const handleWin = (winnerName: string) => {
    alert(`${winnerName} won! +1 Score!`);
    setPhase('SETUP');
  };

  const handleFalseStart = (playerName: string) => {
    soundEngine.playTimeOut('digital');
    alert(`FALSE START! ${playerName} gets a -1 penalty!`);
    setPhase('READY');
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400 uppercase tracking-widest">Zoo (Diaphragm Duel)</h1>
        <div className="max-w-2xl mx-auto space-y-6 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 1</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-blue-500" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 2</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-blue-500" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={() => setPhase('READY')} className="w-full py-6 mt-8 bg-blue-600 hover:bg-blue-500 text-3xl font-black uppercase tracking-widest transition-colors">To Arena</button>
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden relative">
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <button onClick={() => setPhase('SETUP')} className="px-4 py-2 border-2 border-gray-600 text-gray-400 font-bold hover:text-white hover:border-white transition-colors">Back</button>
        {(phase === 'READY' || phase === 'COUNTDOWN') && (
          <div className="flex gap-2">
            <button onClick={() => handleFalseStart(player1?.funnyName || 'Player 1')} className="px-4 py-2 bg-red-900 border border-red-500 text-red-200 text-xs font-bold uppercase">False Start P1</button>
            <button onClick={() => handleFalseStart(player2?.funnyName || 'Player 2')} className="px-4 py-2 bg-red-900 border border-red-500 text-red-200 text-xs font-bold uppercase">False Start P2</button>
          </div>
        )}
      </div>

      {phase === 'READY' && (
        <button onClick={startCountdown} className="w-64 h-64 rounded-full border-8 border-blue-500 flex items-center justify-center text-4xl font-black uppercase hover:bg-blue-900 transition-colors z-20 pulse-animation">
          Ready?
        </button>
      )}

      {phase === 'COUNTDOWN' && (
        <div className="w-64 h-64 rounded-full border-8 border-yellow-500 flex items-center justify-center text-8xl font-black z-20">
          {countdown}
        </div>
      )}

      {phase === 'ACTIVE' && (
        <div className="flex flex-col items-center w-full max-w-4xl z-20 gap-8 mt-16">
          <div className="w-64 h-64 rounded-full bg-blue-600 flex items-center justify-center animate-ping opacity-75 absolute"></div>
          <div className="w-48 h-48 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-black z-30 uppercase tracking-widest text-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
            Zoooooo
          </div>

          <div className="w-full flex gap-4 px-8 mt-12">
            <button onClick={() => handleWin(player1?.funnyName || 'Player 1')} className="flex flex-col items-center justify-center flex-1 py-8 border-4 border-green-500 text-green-500 font-black text-3xl uppercase hover:bg-green-500 hover:text-black transition-all">
              {player1 && <PlayerAvatar seed={player1.funnyName} size={48} className="mb-4" />}
              {player1?.funnyName} Won
            </button>
            <button onClick={() => handleWin(player2?.funnyName || 'Player 2')} className="flex flex-col items-center justify-center flex-1 py-8 border-4 border-green-500 text-green-500 font-black text-3xl uppercase hover:bg-green-500 hover:text-black transition-all">
              {player2 && <PlayerAvatar seed={player2.funnyName} size={48} className="mb-4" />}
              {player2?.funnyName} Won
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
