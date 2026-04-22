import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';
import type { Player } from '../../types';

export const MemoryChain: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);

  const [phase, setPhase] = useState<'SETUP' | 'PLAY' | 'RESULT'>('SETUP');
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Game State
  const [turn, setTurn] = useState(1);
  const [timer, setTimer] = useState(5);
  const [story, setStory] = useState<string[]>([]);
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'PLAY' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playTimeOut('digital');
            handleLoss(activePlayers[currentPlayerIndex]);
            return 0;
          }
          if (prev <= 3) soundEngine.playCountdown();
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
    setTurn(1);
    setStory([]);
    setTimer(5);
    setPhase('PLAY');
    soundEngine.playStartBuzz();
  };

  const getTimerForTurn = (t: number) => {
    if (t === 1) return 5;
    if (t === 2) return 8;
    if (t === 3) return 11;
    if (t === 4) return 14;
    return 17;
  };

  const nextTurn = () => {
    soundEngine.playCountdown();
    const nextTurnNum = turn + 1;
    setTurn(nextTurnNum);

    // Calculate next player
    let nextIdx = (currentPlayerIndex + 1) % activePlayers.length;
    setCurrentPlayerIndex(nextIdx);

    setTimer(getTimerForTurn(nextTurnNum));

    // Just mock adding a word for visual feedback in testing
    setStory([...story, `Word${turn}`]);
  };

  const handleLoss = (loser: Player) => {
    alert(`${loser.funnyName} messed up! Penalty -1.`);

    // Eliminate player
    const remaining = activePlayers.filter(p => p.id !== loser.id);
    if (remaining.length === 1) {
      alert(`${remaining[0].funnyName} is the Last One Standing! Score +1`);
      setPhase('SETUP');
    } else {
      setActivePlayers(remaining);
      // Adjust index
      let newIdx = currentPlayerIndex;
      if (newIdx >= remaining.length) newIdx = 0;
      setCurrentPlayerIndex(newIdx);

      // Reset chain or continue? Usually continue, let's keep the chain but reset timer.
      setTimer(getTimerForTurn(turn));
    }
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4 text-purple-500 uppercase tracking-widest text-center">Memory Chain</h1>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-lg">
          Player 1 says a word. Player 2 repeats it and adds a new word. The chain grows. Stutter, forget, or run out of time and you're out.
        </p>
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-xl uppercase mb-4">Player Pool ({players.length})</h3>
          <div className="flex flex-wrap gap-2 mb-8">
             {players.map(p => <span key={p.id} className="bg-black px-3 py-1 font-bold text-sm border border-gray-700">{p.funnyName}</span>)}
          </div>
          <button onClick={startGame} className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-3xl font-black uppercase tracking-widest transition-colors">Start Game</button>
          <button onClick={onExit} className="w-full py-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  const currentPlayer = activePlayers[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <div className="p-4 border-b-2 border-gray-800 flex justify-between">
         <button onClick={() => setPhase('SETUP')} className="text-gray-500 uppercase font-bold text-sm hover:text-white">Abort Game</button>
         <div className="text-gray-500 uppercase font-bold text-sm">Turn {turn}</div>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Player Roster Row */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {activePlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`px-6 py-3 font-bold text-xl uppercase border-4 transition-all duration-300 ${idx === currentPlayerIndex ? 'border-green-500 bg-green-900/30 text-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-red-900 text-gray-500'}`}
            >
              {p.funnyName}
            </div>
          ))}
        </div>

        {/* Central Action Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className={`text-9xl font-black font-mono mb-8 ${timer <= 3 ? 'text-red-500 animate-pulse' : 'text-purple-500'}`}>
            {timer}
          </div>

          <div className="text-3xl font-bold uppercase tracking-widest text-gray-400 mb-8 text-center">
            {turn === 1 ? 'Say the first word!' : 'Recite & Add 1 word!'}
          </div>

          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-4 min-h-[100px] flex flex-col items-center">
             <button onClick={() => setShowStory(!showStory)} className="text-xs uppercase font-bold text-gray-600 mb-2 hover:text-white">
               {showStory ? 'Hide Sequence (Cheat)' : 'Show Sequence (Cheat)'}
             </button>
             {showStory && (
               <div className="text-lg font-mono text-center break-words text-gray-300">
                 {story.length > 0 ? story.join(' -> ') : 'Empty...'}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex h-48 border-t-8 border-gray-800 bg-gray-900">
        <button onClick={() => handleLoss(currentPlayer)} className="flex-1 bg-red-900 hover:bg-red-700 text-red-100 text-2xl font-black uppercase border-r-4 border-gray-800 transition-colors">
          {currentPlayer.funnyName} Failed
          <span className="block text-sm font-bold mt-2 text-red-300">Stuttered / Wrong Word</span>
        </button>
        <button onClick={nextTurn} className="flex-1 bg-green-900 hover:bg-green-600 text-green-100 text-3xl font-black uppercase transition-colors">
          Success!
          <span className="block text-sm font-bold mt-2 text-green-300">Next Player's Turn</span>
        </button>
      </div>
    </div>
  );
};
