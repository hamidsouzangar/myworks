import React, { useState, useEffect } from "react";
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const RoastBattle: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);
  const [player1Id, setPlayer1Id] = useState<string>(players[0].id);
  const [player2Id, setPlayer2Id] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'WARNING' | 'ROUND_1' | 'ROUND_2' | 'JUDGE'>('SETUP');
  const [timer, setTimer] = useState<number>(30);

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if ((phase === 'ROUND_1' || phase === 'ROUND_2') && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playEndBuzz();
            if (phase === 'ROUND_1') {
              setPhase('ROUND_2');
            } else {
              setPhase('JUDGE');
            }
            return 30; // reset for next round/phase
          }
          if (prev <= 5) soundEngine.playCountdownBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const handleStart = () => {
    setPhase('WARNING');
  };

  const acknowledgeWarning = () => {
    setPhase('ROUND_1');
    setTimer(30);
    soundEngine.playStartBuzz();
  };

  const handleVeto = (attackerName: string) => {
    soundEngine.playHarshBeep();
    alert(`VETO! ${attackerName} went too far and loses the match! Penalty -1.`);
    setPhase('SETUP');
  };

  const handleWin = (winnerName: string) => {
    alert(`The Crowd Chose ${winnerName}! Score +1.`);
    setPhase('SETUP');
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-orange-500 uppercase tracking-widest">Roast Battle</h1>
        <div className="max-w-2xl mx-auto space-y-6 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 1 (Attacks First)</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-orange-500" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 2</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-orange-500" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={handleStart} className="w-full py-6 mt-8 bg-orange-600 hover:bg-orange-500 text-3xl font-black text-black uppercase tracking-widest transition-colors">Start Battle</button>
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  if (phase === 'WARNING') {
    return (
      <div className="min-h-screen bg-red-900 text-white flex flex-col items-center justify-center p-8 font-sans">
        <div className="max-w-3xl text-center space-y-8 p-12 border-8 border-red-500 bg-black">
          <h2 className="text-6xl font-black uppercase text-red-500">WARNING</h2>
          <p className="text-3xl font-bold uppercase leading-relaxed">
            TOPICS OFF LIMITS:<br/>
            <span className="text-white">Family, Health, Money.</span>
          </p>
          <p className="text-xl text-red-300 uppercase tracking-widest">Respect the Veto.</p>
          <button onClick={acknowledgeWarning} className="w-full py-6 bg-red-600 hover:bg-red-500 text-3xl font-black uppercase tracking-widest transition-colors mt-8">
            I Understand
          </button>
        </div>
      </div>
    );
  }

  const p1Active = phase === 'ROUND_1';
  const p2Active = phase === 'ROUND_2';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="absolute top-4 left-4 z-50">
        <button onClick={() => setPhase('SETUP')} className="px-4 py-2 border-2 border-gray-600 font-bold bg-black text-gray-400 hover:text-white">Abort</button>
      </div>

      <div className="flex-1 flex">
        {/* Player 1 Side */}
        <div className={`flex-1 flex flex-col items-center justify-center p-8 border-r-4 border-gray-800 transition-colors duration-500 ${p1Active ? 'bg-orange-900 bg-opacity-30 shadow-[inset_0_0_100px_rgba(234,88,12,0.5)]' : ''}`}>
          <h2 className={`text-6xl font-black uppercase text-center break-words mb-8 ${p1Active ? 'text-orange-500' : 'text-gray-500'}`}>{player1?.funnyName}</h2>
          {p1Active && <div className="text-9xl font-black text-white font-mono">{timer}</div>}
        </div>

        {/* Player 2 Side */}
        <div className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors duration-500 ${p2Active ? 'bg-orange-900 bg-opacity-30 shadow-[inset_0_0_100px_rgba(234,88,12,0.5)]' : ''}`}>
          <h2 className={`text-6xl font-black uppercase text-center break-words mb-8 ${p2Active ? 'text-orange-500' : 'text-gray-500'}`}>{player2?.funnyName}</h2>
          {p2Active && <div className="text-9xl font-black text-white font-mono">{timer}</div>}
        </div>
      </div>

      {/* Control Panel */}
      <div className="h-48 border-t-8 border-gray-800 bg-gray-900 flex p-4 gap-4">
        {phase === 'JUDGE' ? (
          <>
            <button onClick={() => handleWin(player1?.funnyName || 'Player 1')} className="flex-1 bg-orange-600 hover:bg-orange-500 font-black text-3xl uppercase tracking-widest text-black">
              {player1?.funnyName} Wins
            </button>
            <button onClick={() => handleWin(player2?.funnyName || 'Player 2')} className="flex-1 bg-orange-600 hover:bg-orange-500 font-black text-3xl uppercase tracking-widest text-black">
              {player2?.funnyName} Wins
            </button>
          </>
        ) : (
          <button
            onClick={() => handleVeto(p1Active ? (player1?.funnyName || 'P1') : (player2?.funnyName || 'P2'))}
            className="flex-1 bg-red-900 hover:bg-red-600 border-4 border-red-500 font-black text-5xl uppercase tracking-widest text-white transition-colors"
          >
            VETO (TOO FAR)
          </button>
        )}
      </div>
    </div>
  );
};
