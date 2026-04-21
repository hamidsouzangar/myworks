import { PlayerAvatar } from '../PlayerAvatar';
import React, { useState, useEffect } from "react";
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const StaringContest: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);
  // Assume we have a method to add penalty, or we can just mock it for the duel games test.

  // Local state for the test
  const [player1Id, setPlayer1Id] = useState<string>(players[0].id);
  const [player2Id, setPlayer2Id] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'READY' | 'ACTIVE' | 'RESOLUTION'>('SETUP');
  const [timer, setTimer] = useState<number>(20);
  const [galleryFailed, setGalleryFailed] = useState<boolean>(false);

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);
  const gallery = players.filter(p => p.id !== player1Id && p.id !== player2Id);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'ACTIVE' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setPhase('RESOLUTION');
            soundEngine.playEndBuzz();
            setGalleryFailed(true);
            return 0;
          }
          if (prev <= 4) soundEngine.playCountdownBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const startCountdown = () => {
    setPhase('READY');
    let count = 3;
    const interval = setInterval(() => {
      if (count > 0) {
        soundEngine.playCountdownBeep();
        count--;
      } else {
        clearInterval(interval);
        soundEngine.playStartBuzz();
        setPhase('ACTIVE');
      }
    }, 1000);
  };

  const handleLoss = (loserName: string) => {
    // In a real game we would use addPenalty or similar, but for test we just alert
    alert(`${loserName} gets a -1 penalty!`);
    setPhase('SETUP');
    setTimer(20);
    setGalleryFailed(false);
  };

  const handleGalleryFail = () => {
    alert(`The Gallery failed! They all get a -1 penalty!`);
    setPhase('SETUP');
    setTimer(20);
    setGalleryFailed(false);
  };

  const handleIllegalTouch = (playerName: string) => {
    soundEngine.playHarshBeep();
    alert(`ILLEGAL TOUCH! ${playerName} gets an instant -1 penalty!`);
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center">Staring Contest: Setup</h1>
        <div className="max-w-2xl mx-auto space-y-6 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 1</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 2</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={startCountdown} className="w-full py-6 mt-8 bg-green-600 hover:bg-green-500 text-3xl font-black uppercase tracking-widest transition-colors">Start Duel</button>
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="flex-1 flex border-b-8 border-gray-800">
        <div className="flex-1 flex flex-col items-center justify-center border-r-4 border-gray-800 p-8">
          {player1 && <PlayerAvatar seed={player1.funnyName} size={96} className="mb-6" />}
          <h2 className="text-6xl font-black uppercase text-center break-words">{player1?.funnyName}</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center border-l-4 border-gray-800 p-8">
          {player2 && <PlayerAvatar seed={player2.funnyName} size={96} className="mb-6" />}
          <h2 className="text-6xl font-black uppercase text-center break-words">{player2?.funnyName}</h2>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {phase === 'READY' && <div className="text-9xl font-black text-yellow-500 bg-black px-8 py-4 border-8 border-yellow-500 animate-pulse">READY</div>}
        {(phase === 'ACTIVE' || phase === 'RESOLUTION') && (
          <div className={`text-9xl font-black px-8 py-4 border-8 ${timer <= 5 ? 'text-red-500 border-red-500 animate-pulse' : 'text-white border-white'} bg-black`}>
            {timer}
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-900 p-6 flex flex-col">
        <h3 className="text-2xl font-bold uppercase text-gray-500 mb-4 text-center">The Gallery</h3>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto mb-4">
          {gallery.map(p => (
            <button key={p.id} onClick={() => handleIllegalTouch(p.funnyName)} className="bg-gray-800 p-2 text-center relative group overflow-hidden border border-gray-700 hover:border-red-500 transition-colors">
              <span className="font-bold block">{p.funnyName}</span>
              <div className="absolute inset-0 bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase text-sm">
                Illegal Touch
              </div>
            </button>
          ))}
        </div>

        {phase === 'ACTIVE' && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleLoss(player1?.funnyName || 'Player 1')} className="py-6 bg-red-600 hover:bg-red-500 font-black text-2xl uppercase">{player1?.funnyName} Lost</button>
            <button onClick={() => handleLoss(player2?.funnyName || 'Player 2')} className="py-6 bg-red-600 hover:bg-red-500 font-black text-2xl uppercase">{player2?.funnyName} Lost</button>
          </div>
        )}

        {phase === 'RESOLUTION' && galleryFailed && (
          <button onClick={handleGalleryFail} className="w-full py-8 bg-blue-600 hover:bg-blue-500 font-black text-4xl uppercase animate-bounce">
            Gallery Failed
          </button>
        )}
      </div>
    </div>
  );
};
