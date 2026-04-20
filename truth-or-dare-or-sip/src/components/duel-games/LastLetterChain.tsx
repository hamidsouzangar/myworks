import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';
import type { Player } from '../../types';

export const LastLetterChain: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);

  const [phase, setPhase] = useState<'SETUP' | 'SPIN' | 'PLAY'>('SETUP');
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [timer, setTimer] = useState(5);
  const [currentWord, setCurrentWord] = useState('');
  const [targetLetter, setTargetLetter] = useState('');

  const startingWords = ['APPLE', 'MONKEY', 'PIRATE', 'GUITAR', 'ELEPHANT', 'ZEBRA', 'ROCKET', 'DINOSAUR', 'VAMPIRE', 'CASTLE'];

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'PLAY' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playHarshBeep();
            handleLoss(activePlayers[currentPlayerIndex], 'Time Out');
            return 0;
          }
          if (prev <= 2) soundEngine.playCountdownBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer, activePlayers, currentPlayerIndex]);

  const startGame = () => {
    if (players.length < 2) return alert("Need at least 2 players");
    setActivePlayers(players);
    setCurrentPlayerIndex(0);
    spinWord();
  };

  const spinWord = () => {
    setPhase('SPIN');
    let spins = 0;
    const maxSpins = 20;

    const interval = setInterval(() => {
      const randomWord = startingWords[Math.floor(Math.random() * startingWords.length)];
      setCurrentWord(randomWord);
      soundEngine.playCountdownBeep();
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setTargetLetter(randomWord.slice(-1));
        soundEngine.playStartBuzz();
        setPhase('PLAY');
        setTimer(5);
      }
    }, 100);
  };

  const nextTurn = () => {
    soundEngine.playCountdownBeep();

    // In a real app we'd type the word, but for offline manual ref we just prompt or assume success and randomize a new letter to keep the UI flowing for testing
    // To make it functional for testing without typing, we just pick a random letter to represent the 'end' of their verbal word.
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    setTargetLetter(nextLetter);
    setCurrentWord(`...${nextLetter}`); // Just a visual indicator

    let nextIdx = (currentPlayerIndex + 1) % activePlayers.length;
    setCurrentPlayerIndex(nextIdx);
    setTimer(5);
  };

  const handleLoss = (loser: Player, reason: string) => {
    alert(`${loser.funnyName} Failed! (${reason})`);

    const remaining = activePlayers.filter(p => p.id !== loser.id);
    if (remaining.length === 1) {
      alert(`${remaining[0].funnyName} Wins the game!`);
      setPhase('SETUP');
    } else {
      setActivePlayers(remaining);
      let newIdx = currentPlayerIndex;
      if (newIdx >= remaining.length) newIdx = 0;
      setCurrentPlayerIndex(newIdx);
      spinWord(); // Restart round with new word for remaining players
    }
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4 text-cyan-500 uppercase tracking-widest text-center">Last Letter Chain</h1>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-lg">
          The app gives a word. The next player has 5 seconds to say a word starting with the LAST letter of that word.
        </p>
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl space-y-4">
          <button onClick={startGame} className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-3xl font-black uppercase tracking-widest transition-colors text-black">Start Sweat Test</button>
          <button onClick={onExit} className="w-full py-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  const currentPlayer = activePlayers[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="p-4 border-b-2 border-gray-800 flex justify-between">
         <button onClick={() => setPhase('SETUP')} className="text-gray-500 uppercase font-bold text-sm hover:text-white">Abort</button>
         <button onClick={spinWord} className="text-cyan-500 uppercase font-bold text-sm border border-cyan-500 px-2 rounded hover:bg-cyan-900">Spin New Word</button>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Player Roster */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {activePlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`px-4 py-2 font-bold uppercase border-2 transition-all duration-300 ${idx === currentPlayerIndex ? 'border-green-500 text-green-400 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'border-gray-800 text-gray-600'}`}
            >
              {p.funnyName}
            </div>
          ))}
        </div>

        {/* Central Action Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">

          <div className="text-xl text-gray-500 uppercase font-bold tracking-widest mb-2">
            {phase === 'SPIN' ? 'Selecting Word...' : 'Previous Word'}
          </div>
          <div className="text-5xl font-black uppercase tracking-widest text-gray-300 mb-12">
            {phase === 'SPIN' ? currentWord : currentWord.slice(0, -1)}
            <span className={phase === 'PLAY' ? 'text-cyan-500 underline decoration-cyan-500 decoration-8 underline-offset-8' : ''}>
              {phase === 'PLAY' ? currentWord.slice(-1) : ''}
            </span>
          </div>

          {phase === 'PLAY' && (
            <>
              <div className="text-gray-500 font-bold uppercase tracking-widest mb-4">Start your word with:</div>
              <div className="text-[12rem] leading-none font-black text-cyan-500 mb-8 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                {targetLetter}
              </div>
              <div className={`text-6xl font-black font-mono absolute top-1/2 left-8 -translate-y-1/2 ${timer <= 2 ? 'text-red-500 animate-pulse scale-150' : 'text-gray-700'}`}>
                {timer}s
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control Panel */}
      {phase === 'PLAY' && (
        <div className="flex h-48 border-t-8 border-gray-800 bg-gray-900">
          <button onClick={() => handleLoss(currentPlayer, 'Invalid / Repeated')} className="flex-1 bg-red-900 hover:bg-red-700 text-red-100 text-2xl font-black uppercase border-r-4 border-gray-800 transition-colors">
            Wrong / Repeat
            <span className="block text-sm font-bold mt-2 text-red-300">Eliminate Player</span>
          </button>
          <button onClick={nextTurn} className="flex-1 bg-cyan-900 hover:bg-cyan-600 text-cyan-100 text-3xl font-black uppercase transition-colors">
            Correct!
            <span className="block text-sm font-bold mt-2 text-cyan-300">Next Turn</span>
          </button>
        </div>
      )}
    </div>
  );
};
