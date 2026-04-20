import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const TwoTruths: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);

  const [storytellerId, setStorytellerId] = useState<string>(players[0].id);
  const [guesserId, setGuesserId] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'STORY' | 'GUESS' | 'REVEAL'>('SETUP');
  const [timer, setTimer] = useState<number>(15);

  const [round, setRound] = useState(1);
  const [guesserWins, setGuesserWins] = useState(0);
  const [storytellerWins, setStorytellerWins] = useState(0);

  // Match state
  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
  const [lieStatement, setLieStatement] = useState<number>(2); // Hardcoded for testing, real game would ask storyteller to pick

  const storyteller = players.find(p => p.id === storytellerId);
  const guesser = players.find(p => p.id === guesserId);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'GUESS' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playEndBuzz();
            handleGuessTimeout();
            return 0;
          }
          if (prev <= 3) soundEngine.playCountdownBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const startRound = () => {
    setPhase('STORY');
    setSelectedStatement(null);
    // Randomize lie for testing
    setLieStatement(Math.floor(Math.random() * 3) + 1);
  };

  const startGuessing = () => {
    setPhase('GUESS');
    setTimer(15);
    soundEngine.playStartBuzz();
  };

  const handleGuess = (statementNum: number) => {
    setSelectedStatement(statementNum);
    setPhase('REVEAL');
    soundEngine.playEndBuzz(); // Drama sound
  };

  const handleGuessTimeout = () => {
    setSelectedStatement(0); // 0 means timeout
    setPhase('REVEAL');
  };

  const finishRound = () => {
    let gWins = guesserWins;
    let sWins = storytellerWins;

    if (selectedStatement === lieStatement) {
      gWins++;
      setGuesserWins(gWins);
      alert(`${guesser?.funnyName} Guessed Correctly! Score +1.`);
    } else {
      sWins++;
      setStorytellerWins(sWins);
      alert(`${storyteller?.funnyName} Fooled Them! Score +1.`);
    }

    if (round === 2) {
      if (gWins === 1 && sWins === 1) {
        alert(`Both won a round! The ENTIRE AUDIENCE gets a -1 Penalty!`);
      } else {
         const winner = gWins > sWins ? guesser?.funnyName : storyteller?.funnyName;
         alert(`${winner} wins the match!`);
      }
      setPhase('SETUP');
      setRound(1);
      setGuesserWins(0);
      setStorytellerWins(0);
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
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="p-6 border-b-4 border-gray-800 flex justify-between items-center text-gray-500 uppercase font-bold tracking-widest">
         <button onClick={() => setPhase('SETUP')} className="hover:text-white">Abort</button>
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

      {phase === 'REVEAL' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
          <h2 className="text-6xl font-black uppercase mb-16 tracking-widest">The Reveal</h2>

          <div className="text-3xl font-bold text-gray-400 mb-8 uppercase">
            Guesser Selected: <span className="text-white text-5xl ml-4">{selectedStatement === 0 ? 'TIMEOUT' : `#${selectedStatement}`}</span>
          </div>

          <div className="text-3xl font-bold text-gray-400 mb-16 uppercase">
            The Lie Was: <span className="text-red-500 text-6xl ml-4 block mt-4">Statement #{lieStatement}</span>
          </div>

          <button onClick={finishRound} className="w-full max-w-xl py-8 bg-green-600 hover:bg-green-500 text-4xl font-black text-white uppercase tracking-widest transition-colors">
            {selectedStatement === lieStatement ? 'Guesser Wins!' : 'Storyteller Wins!'}
          </button>
        </div>
      )}
    </div>
  );
};
