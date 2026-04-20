import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';
import type { Player } from '../../types';

export const MiniCharades: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);

  const [phase, setPhase] = useState<'DRAFT' | 'SETUP_ROUND' | 'ACTIVE' | 'SUMMARY'>('DRAFT');

  // Draft State
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [draftPool, setDraftPool] = useState<Player[]>(players);
  const [isTeamATurnToDraft, setIsTeamATurnToDraft] = useState(true);

  // Game State
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');

  // Round State
  const [timer, setTimer] = useState(30);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const words = ['Elephant', 'Pizza', 'Helicopter', 'Zombie', 'Guitar', 'Swimming', 'Tornado', 'Spiderman']; // Mock words
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (phase === 'ACTIVE' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            soundEngine.playEndBuzz();
            handleTimeOut();
            return 0;
          }
          if (prev <= 5) soundEngine.playCountdownBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timer]);

  const handleDraft = (player: Player) => {
    if (isTeamATurnToDraft) {
      setTeamA([...teamA, player]);
    } else {
      setTeamB([...teamB, player]);
    }
    setDraftPool(draftPool.filter(p => p.id !== player.id));
    setIsTeamATurnToDraft(!isTeamATurnToDraft);
  };

  const startRound = () => {
    setTimer(30);
    setPhase('ACTIVE');
    soundEngine.playStartBuzz();
  };

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
  };

  const handleCorrect = () => {
    if (activeTeam === 'A') setTeamAScore(prev => prev + 1);
    else setTeamBScore(prev => prev + 1);

    // In actual game, score is based on time or just count. We'll use count for simplicity.
    soundEngine.playCountdownBeep(); // success sound
    nextWord();
  };

  const handleSkip = () => {
    soundEngine.playHarshBeep();
    setTimer(prev => Math.max(0, prev - 5)); // 5s penalty
    nextWord();
  };

  const handleTimeOut = () => {
    // Round ends for this team
    if (activeTeam === 'A') {
      setActiveTeam('B');
      setPhase('SETUP_ROUND');
    } else {
      // Both teams went, end of round
      if (currentRound >= 3) {
        setPhase('SUMMARY');
      } else {
        setCurrentRound(prev => prev + 1);
        setActiveTeam('A');
        setPhase('SETUP_ROUND');
      }
    }
  };

  if (phase === 'DRAFT') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center text-pink-500 uppercase tracking-widest">Mini Charades: Draft</h1>

        <div className="flex-1 flex gap-8 mb-8">
          <div className="flex-1 bg-gray-800 p-6 border-t-4 border-pink-500">
            <h2 className="text-2xl font-bold mb-4 uppercase">Team A</h2>
            <ul className="space-y-2">
              {teamA.map(p => <li key={p.id} className="text-xl font-bold bg-black p-3">{p.funnyName}</li>)}
            </ul>
          </div>

          <div className="flex-1 bg-gray-800 p-6 border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold mb-4 uppercase">Team B</h2>
            <ul className="space-y-2">
              {teamB.map(p => <li key={p.id} className="text-xl font-bold bg-black p-3">{p.funnyName}</li>)}
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4 uppercase text-center">
            {draftPool.length > 0 ? `Drafting: ${isTeamATurnToDraft ? 'Team A' : 'Team B'} Pick` : 'Draft Complete'}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {draftPool.map(p => (
              <button
                key={p.id}
                onClick={() => handleDraft(p)}
                className={`px-6 py-3 font-bold text-xl uppercase ${isTeamATurnToDraft ? 'bg-pink-900 hover:bg-pink-700' : 'bg-blue-900 hover:bg-blue-700'}`}
              >
                {p.funnyName}
              </button>
            ))}
          </div>

          {draftPool.length === 0 && (
            <button onClick={() => setPhase('SETUP_ROUND')} className="w-full py-6 mt-8 bg-green-600 hover:bg-green-500 text-3xl font-black uppercase tracking-widest">
              Start Game
            </button>
          )}
        </div>
        <button onClick={onExit} className="mt-4 px-4 py-2 border-2 border-gray-600 font-bold uppercase hover:bg-gray-800 self-center">Cancel</button>
      </div>
    );
  }

  if (phase === 'SETUP_ROUND') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 font-sans text-center">
        <h1 className="text-4xl font-black text-gray-500 uppercase tracking-widest mb-4">Round {currentRound}</h1>
        <h2 className={`text-6xl font-black uppercase mb-12 ${activeTeam === 'A' ? 'text-pink-500' : 'text-blue-500'}`}>
          Team {activeTeam} Get Ready
        </h2>
        <p className="text-2xl mb-12 text-gray-400">Select your Actor and Guesser(s).<br/>Hand the device to the Actor.</p>

        <button onClick={startRound} className="w-full max-w-md py-8 bg-white text-black hover:bg-gray-300 text-4xl font-black uppercase tracking-widest transition-colors">
          Ready!
        </button>
      </div>
    );
  }

  if (phase === 'SUMMARY') {
    const winner = teamAScore > teamBScore ? 'Team A' : teamBScore > teamAScore ? 'Team B' : 'Tie';
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans text-center">
        <h1 className="text-6xl font-black uppercase mb-12 text-yellow-500">Game Over</h1>
        <div className="flex gap-16 mb-12 text-4xl font-bold uppercase">
          <div className="text-pink-500">Team A: {teamAScore}</div>
          <div className="text-blue-500">Team B: {teamBScore}</div>
        </div>
        <h2 className="text-5xl font-black mb-12">Winner: {winner}</h2>
        <button onClick={onExit} className="px-12 py-6 border-4 border-white text-3xl font-black uppercase hover:bg-white hover:text-black transition-colors">
          Exit
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-gray-900 border-b-4 border-gray-800">
        <div className="text-3xl font-black text-pink-500">A: {teamAScore}</div>
        <div className={`text-5xl font-black font-mono ${timer <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timer}s</div>
        <div className="text-3xl font-black text-blue-500">B: {teamBScore}</div>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <p className="text-gray-500 uppercase font-bold tracking-widest mb-4">Current Word (Actor Only)</p>

        <button
          onMouseDown={() => setIsWordVisible(true)}
          onMouseUp={() => setIsWordVisible(false)}
          onMouseLeave={() => setIsWordVisible(false)}
          onTouchStart={() => setIsWordVisible(true)}
          onTouchEnd={() => setIsWordVisible(false)}
          className={`w-full max-w-2xl h-64 border-8 flex items-center justify-center transition-colors ${isWordVisible ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-900 border-gray-700 hover:border-gray-500 cursor-pointer'}`}
        >
          {isWordVisible ? (
            <span className="text-7xl font-black uppercase tracking-wider">{words[currentWordIndex]}</span>
          ) : (
            <span className="text-3xl font-bold text-gray-500 uppercase tracking-widest">Hold to Reveal</span>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="flex h-48 border-t-8 border-gray-800 bg-gray-900">
        <button onClick={handleCorrect} className="flex-1 bg-green-900 hover:bg-green-600 text-green-100 text-3xl font-black uppercase border-r-4 border-gray-800 transition-colors">
          Correct!
          <span className="block text-sm font-bold mt-2 text-green-300">+1 Point</span>
        </button>
        <button onClick={handleSkip} className="flex-1 bg-red-900 hover:bg-red-700 text-red-100 text-3xl font-black uppercase border-r-4 border-gray-800 transition-colors">
          Skip
          <span className="block text-sm font-bold mt-2 text-red-300">-5s Penalty</span>
        </button>
        <button onClick={handleTimeOut} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-2xl font-black uppercase transition-colors">
          End Turn
        </button>
      </div>
    </div>
  );
};
