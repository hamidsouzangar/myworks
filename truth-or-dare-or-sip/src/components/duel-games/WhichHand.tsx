import { PlayerAvatar } from '../PlayerAvatar';
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const WhichHand: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);
  const [player1Id, setPlayer1Id] = useState<string>(players[0].id);
  const [player2Id, setPlayer2Id] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'START' | 'HIDE' | 'GUESS' | 'RESULT'>('SETUP');
  const [timer, setTimer] = useState<number>(15);

  // State for the match
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [round, setRound] = useState(1);
  const [hiderId, setHiderId] = useState<string>(player1Id);

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);

  const hider = players.find(p => p.id === hiderId);
  const guesser = hiderId === player1Id ? player2 : player1;

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if ((phase === 'HIDE' || phase === 'GUESS') && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playTimeOut('buzzer');
            if (phase === 'HIDE') {
              setPhase('GUESS');
              return 15;
            } else {
              setPhase('RESULT');
              return 0;
            }
          }
          if (prev <= 3) soundEngine.playCountdown();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const startRound = () => {
    soundEngine.playStartBuzz();
    setPhase('HIDE');
    setTimer(15);
  };

  const initGame = () => {
    // Randomize starting hider
    setHiderId(Math.random() > 0.5 ? player1Id : player2Id);
    setPhase('START');
  };

  const handleWin = (winnerId: string) => {
    if (winnerId === player1Id) {
      const newWins = p1Wins + 1;
      setP1Wins(newWins);
      if (newWins >= 2) {
        alert(`${player1?.funnyName} Wins the Match!`);
        resetGame();
        return;
      }
    } else {
      const newWins = p2Wins + 1;
      setP2Wins(newWins);
      if (newWins >= 2) {
        alert(`${player2?.funnyName} Wins the Match!`);
        resetGame();
        return;
      }
    }

    setHiderId(winnerId); // Winner hides next
    setRound(prev => prev + 1);
    setPhase('START');
  };

  const resetGame = () => {
    setP1Wins(0);
    setP2Wins(0);
    setRound(1);
    setPhase('SETUP');
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-teal-400 uppercase tracking-widest">Which Hand</h1>
        <div className="max-w-2xl mx-auto space-y-6 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 1</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-teal-500" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 2</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-teal-500" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={initGame} className="w-full py-6 mt-8 bg-teal-600 hover:bg-teal-500 text-3xl font-black text-white uppercase tracking-widest transition-colors">Start Match</button>
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  // Calculate circular progress for the timer
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timer / 15) * circumference;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 border-b-4 border-gray-800 flex justify-between items-center">
        <div className="flex-1 flex items-center gap-4">
          {player1 && <PlayerAvatar seed={player1.funnyName} size={48} />}
          <div>
            <h2 className="text-2xl font-bold uppercase">{player1?.funnyName}</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2].map(i => (
                <div key={i} className={`w-8 h-8 border-4 ${p1Wins >= i ? 'bg-teal-500 border-teal-500' : 'border-gray-600'} rounded-full`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-4xl font-black text-teal-500 uppercase tracking-widest">Round {round}</h1>
          <button onClick={resetGame} className="mt-2 text-sm text-gray-500 hover:text-white uppercase font-bold">Abort Match</button>
        </div>

        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="flex flex-col items-end">
            <h2 className="text-2xl font-bold uppercase">{player2?.funnyName}</h2>
            <div className="flex gap-2 mt-2 justify-end">
               {[1, 2].map(i => (
                <div key={i} className={`w-8 h-8 border-4 ${p2Wins >= i ? 'bg-teal-500 border-teal-500' : 'border-gray-600'} rounded-full`}></div>
              ))}
            </div>
          </div>
          {player2 && <PlayerAvatar seed={player2.funnyName} size={48} />}
        </div>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">

        {phase === 'START' && (
          <button onClick={startRound} className="w-64 h-64 rounded-full border-8 border-teal-500 flex items-center justify-center text-4xl font-black uppercase hover:bg-teal-900 transition-colors z-20">
            Start Round
          </button>
        )}

        {(phase === 'HIDE' || phase === 'GUESS') && (
          <>
            <div className="text-6xl font-black uppercase mb-12 relative z-10">
              <span className="text-teal-400 block mb-4">{hider?.funnyName} Hides</span>
              <span className="text-gray-400 block">{guesser?.funnyName} Guesses</span>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="100" stroke="#1f2937" strokeWidth="12" fill="none" />
                <circle
                  cx="128" cy="128" r="100"
                  stroke={phase === 'HIDE' ? '#0d9488' : '#eab308'}
                  strokeWidth="12" fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 linear"
                />
              </svg>
              <div className="text-7xl font-black">{timer}</div>
            </div>

            <div className="mt-12 text-3xl font-bold uppercase tracking-widest text-gray-500">
              {phase === 'HIDE' ? 'Hide the object!' : 'Make your guess!'}
            </div>

            {/* Allow early skip for testing / fast play */}
            <button onClick={() => {
              if (phase === 'HIDE') { setPhase('GUESS'); setTimer(15); }
              else setPhase('RESULT');
            }} className="mt-8 px-6 py-2 border-2 border-gray-700 text-gray-500 hover:text-white uppercase font-bold text-sm">
              Skip Timer
            </button>
          </>
        )}

        {phase === 'RESULT' && (
          <div className="text-6xl font-black uppercase mb-12">
            Who won?
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {phase === 'RESULT' && (
        <div className="flex h-48 border-t-8 border-gray-800">
          <button onClick={() => handleWin(player1Id)} className="flex-1 bg-gray-900 hover:bg-teal-700 text-3xl font-black uppercase transition-colors">
            {player1?.funnyName} Wins Round
          </button>
          <div className="w-2 bg-gray-800"></div>
          <button onClick={() => handleWin(player2Id)} className="flex-1 bg-gray-900 hover:bg-teal-700 text-3xl font-black uppercase transition-colors">
            {player2?.funnyName} Wins Round
          </button>
        </div>
      )}
    </div>
  );
};
