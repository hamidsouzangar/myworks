import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SoundTester } from '../SoundTester';
import { StaringContest } from './StaringContest';
import { Zoo } from './Zoo';
import { RPSWar } from './RPSWar';
import { RoastBattle } from './RoastBattle';
import { WhichHand } from './WhichHand';
import { MiniCharades } from './MiniCharades';
import { MemoryChain } from './MemoryChain';
import { LastLetterChain } from './LastLetterChain';
import { TwoTruths } from './TwoTruths';

type Screen = 'HUB' | 'SOUND_TESTER' | 'GAME_STARING' | 'GAME_WHICH_HAND' | 'GAME_ZOO' | 'GAME_CHARADES' | 'GAME_RPS' | 'GAME_ROAST' | 'GAME_MEMORY' | 'GAME_LAST_LETTER' | 'GAME_TWO_TRUTHS';

export const DuelHub: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HUB');
  const storePlayers = useGameStore((state) => state.players);

  // If we launch Duel Hub before a game has started, we mock some players so we can test.
  const players = storePlayers.length >= 2 ? storePlayers : [
    { id: 'mock1', funnyName: 'The Goblin', tags: [], sipsTaken: 0, truthsDone: 0, daresDone: 0, strictSips: 0 },
    { id: 'mock2', funnyName: 'Professor Chaos', tags: [], sipsTaken: 0, truthsDone: 0, daresDone: 0, strictSips: 0 },
    { id: 'mock3', funnyName: 'Captain Oblivious', tags: [], sipsTaken: 0, truthsDone: 0, daresDone: 0, strictSips: 0 },
    { id: 'mock4', funnyName: 'Sneaky Snake', tags: [], sipsTaken: 0, truthsDone: 0, daresDone: 0, strictSips: 0 }
  ];

  if (currentScreen === 'SOUND_TESTER') {
    return (
      <div className="relative min-h-screen bg-black">
        <button
          onClick={() => setCurrentScreen('HUB')}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-gray-800 text-white font-bold border-2 border-white hover:bg-white hover:text-black transition-colors"
        >
          ← Back to Hub
        </button>
        <SoundTester />
      </div>
    );
  }

  // Note: we pass players as a prop or set it in the store temporarily if needed, but since we mock them, let's just make the mini-games use the store, OR we can override the store for testing.
  // It's cleaner to override the store players so the mini-games components (which pull from the store) see them.
  React.useEffect(() => {
    if (storePlayers.length < 2) {
      useGameStore.setState({ players });
    }
  }, [storePlayers, players]);

  if (currentScreen === 'GAME_STARING') {
    return <StaringContest onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_ZOO') {
    return <Zoo onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_RPS') {
    return <RPSWar onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_ROAST') {
    return <RoastBattle onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_WHICH_HAND') {
    return <WhichHand onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_CHARADES') {
    return <MiniCharades onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_MEMORY') {
    return <MemoryChain onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_LAST_LETTER') {
    return <LastLetterChain onExit={() => setCurrentScreen('HUB')} />;
  }
  if (currentScreen === 'GAME_TWO_TRUTHS') {
    return <TwoTruths onExit={() => setCurrentScreen('HUB')} />;
  }

  // Placeholder for when we add the games
  if (currentScreen !== 'HUB') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8">{currentScreen} under construction</h1>
        <button
          onClick={() => setCurrentScreen('HUB')}
          className="px-6 py-3 bg-white text-black font-bold border-4 border-white hover:bg-black hover:text-white transition-colors"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-4 border-white pb-4">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-red-500">Duel Arena</h1>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-800 font-bold border-2 border-gray-600 hover:border-white transition-colors"
          >
            Exit Arena
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setCurrentScreen('SOUND_TESTER')}
            className="p-6 border-4 border-purple-500 text-purple-500 font-bold text-2xl uppercase tracking-wider hover:bg-purple-500 hover:text-black transition-all"
          >
            Test Sound Engine
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 uppercase text-gray-400">Mini-Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onClick={() => setCurrentScreen('GAME_STARING')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Staring Contest</button>
          <button onClick={() => setCurrentScreen('GAME_WHICH_HAND')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Which Hand</button>
          <button onClick={() => setCurrentScreen('GAME_ZOO')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Zoo</button>
          <button onClick={() => setCurrentScreen('GAME_CHARADES')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Mini Charades</button>
          <button onClick={() => setCurrentScreen('GAME_RPS')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">RPS WAR</button>
          <button onClick={() => setCurrentScreen('GAME_ROAST')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Roast Battle</button>
          <button onClick={() => setCurrentScreen('GAME_MEMORY')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Memory Chain</button>
          <button onClick={() => setCurrentScreen('GAME_LAST_LETTER')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">Last Letter Chain</button>
          <button onClick={() => setCurrentScreen('GAME_TWO_TRUTHS')} className="p-4 border-2 border-white font-bold hover:bg-white hover:text-black transition-all">2 Truths & A Lie</button>
        </div>
      </div>
    </div>
  );
};
