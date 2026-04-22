import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const TwoTruths: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);

  const [storytellerId, setStorytellerId] = useState<string>(players[0].id);
  const [guesserId, setGuesserId] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'STORY' | 'GUESS' | 'JUDGE'>('SETUP');
  const [timer, setTimer] = useState<number>(15);

  const [round, setRound] = useState(1);

  // Track scores
  const [scores, setScores] = useState<Record<string, number>>({});
  const updateScore = (name: string, points: number) => {
    setScores(prev => ({ ...prev, [name]: (prev[name] || 0) + points }));
  };

  const resetMatch = () => {
    setScores({});
    setRound(1);
    setPhase('SETUP');
  };

  // Match state
  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);

  const storyteller = players.find(p => p.id === storytellerId);
  const guesser = players.find(p => p.id === guesserId);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'GUESS' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playTimeOut('buzzer');
            handleGuessTimeout();
            return 0;
          }
          if (prev <= 3) soundEngine.playCountdown();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const startRound = () => {
    setPhase('STORY');
    setSelectedStatement(null);
  };

  const startGuessing = () => {
    setPhase('GUESS');
    setTimer(15);
    soundEngine.playStartBuzz();
  };

  const handleGuess = (statementNum: number) => {
    setSelectedStatement(statementNum);
    setPhase('JUDGE');
    soundEngine.playTimeOut('buzzer'); // Drama sound
  };

  const handleGuessTimeout = () => {
    setSelectedStatement(0); // 0 means timeout
    setPhase('JUDGE');
  };

  const finishRound = (winnerName: string) => {
    alert(`${winnerName} wins the round! Score +1.`);
    updateScore(winnerName, 1);

    if (round === 2) {
      // End of match
      alert(`Match complete!`);
      setPhase('SETUP');
      setRound(1);
    } else {
      setRound(2);
      // Swap roles
      const temp = storytellerId;
      setStorytellerId(guesserId);
      setGuesserId(temp);
      setPhase('STORY');
    }
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-8 text-yellow-500 uppercase tracking-widest text-center">2 Truths & A Lie</h1>
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl space-y-6">
          <div className="flex justify-between bg-black p-4 mb-4 rounded border-2 border-gray-700">
            {Object.entries(scores).map(([name, score]) => (
              <div key={name} className="text-center font-bold">
                <div className="text-sm text-gray-400 uppercase">{name}</div>
                <div className={score < 0 ? 'text-red-500' : 'text-green-500'}>{score}</div>
              </div>
            ))}
            {Object.keys(scores).length === 0 && <div className="text-gray-500 italic w-full text-center">No scores yet...</div>}
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Storyteller</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-yellow-500" value={storytellerId} onChange={(e) => setStorytellerId(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === guesserId}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Guesser</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-yellow-500" value={guesserId} onChange={(e) => setGuesserId(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === storytellerId}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={startRound} className="w-full py-6 mt-8 bg-yellow-600 hover:bg-yellow-500 text-3xl font-black uppercase tracking-widest transition-colors text-black">Begin</button>

          <div className="flex gap-4 mt-4">
            <button onClick={resetMatch} className="flex-1 py-4 bg-red-900 hover:bg-red-700 text-white font-bold uppercase transition-colors">Reset Game</button>
            <button onClick={onExit} className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">
      <button onClick={resetMatch} className="absolute top-4 left-4 px-4 py-2 border-2 border-gray-600 text-gray-400 font-bold hover:text-white z-50 bg-black">Quit</button>

      <div className="p-6 border-b-4 border-gray-800 flex justify-between items-center text-gray-500 uppercase font-bold tracking-widest pt-16">
         <div>Round {round} of 2</div>
         <div>{storyteller?.funnyName}'s Turn</div>
      </div>

      {phase === 'STORY' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
          <h2 className="text-4xl font-bold mb-12 text-yellow-500 uppercase">Tell your stories, {storyteller?.funnyName}</h2>

          <div className="flex w-full max-w-4xl gap-4 mb-16">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                className="flex-1 h-64 border-4 border-gray-700 bg-gray-900 flex items-center justify-center text-7xl font-black text-gray-600 hover:border-yellow-500 hover:text-yellow-500 transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>

          <button onClick={startGuessing} className="px-12 py-6 bg-white text-black font-black text-3xl uppercase tracking-widest hover:bg-gray-300">
            Hand phone to {guesser?.funnyName}
          </button>
        </div>
      )}

      {phase === 'GUESS' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative bg-blue-900/20">
          <h2 className="text-4xl font-bold mb-8 text-blue-400 uppercase tracking-widest">Which one is the lie, {guesser?.funnyName}?</h2>
          <div className={`text-8xl font-black font-mono mb-12 ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timer}</div>

          <div className="flex flex-col w-full max-w-2xl gap-6">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => handleGuess(num)}
                className="w-full py-8 border-4 border-blue-500 bg-blue-900/50 hover:bg-blue-600 text-4xl font-black text-white transition-all active:scale-95"
              >
                Statement {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'JUDGE' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
          <h2 className="text-6xl font-black uppercase mb-16 tracking-widest text-yellow-500">The Reveal</h2>

          <div className="text-3xl font-bold text-gray-400 mb-8 uppercase">
            {guesser?.funnyName} Selected: <span className="text-white text-5xl ml-4 block mt-4">{selectedStatement === 0 ? 'TIMEOUT' : `Statement #${selectedStatement}`}</span>
          </div>

          <div className="text-4xl font-black text-white mb-12 uppercase">Who won?</div>

          <div className="flex w-full max-w-xl gap-4">
            <button onClick={() => finishRound(storyteller?.funnyName || 'Storyteller')} className="flex-1 py-8 bg-green-600 hover:bg-green-500 text-3xl font-black text-white uppercase tracking-widest transition-colors">
              {storyteller?.funnyName} Won
            </button>
            <button onClick={() => finishRound(guesser?.funnyName || 'Guesser')} className="flex-1 py-8 bg-blue-600 hover:bg-blue-500 text-3xl font-black text-white uppercase tracking-widest transition-colors">
              {guesser?.funnyName} Won
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
