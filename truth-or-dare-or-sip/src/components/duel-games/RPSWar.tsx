import { PlayerAvatar } from '../PlayerAvatar';
import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundEngine } from '../../utils/SoundEngine';

export const RPSWar: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const players = useGameStore((state) => state.players);
  const [player1Id, setPlayer1Id] = useState<string>(players[0].id);
  const [player2Id, setPlayer2Id] = useState<string>(players[1].id);

  const [phase, setPhase] = useState<'SETUP' | 'READY' | 'COUNTDOWN' | 'RESULT'>('SETUP');
  const [countdownText, setCountdownText] = useState<string>('');

  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);

  const player1 = players.find(p => p.id === player1Id);
  const player2 = players.find(p => p.id === player2Id);

  const isSuddenDeath = p1Wins === 1 && p2Wins === 1;

  const startRound = () => {
    setPhase('COUNTDOWN');

    if (isSuddenDeath) {
      // Dramatic pause before sudden death
      setCountdownText('SUDDEN DEATH...');
      setTimeout(() => {
        runCountdown();
      }, 2000);
    } else {
      runCountdown();
    }
  };

  const runCountdown = () => {
    let step = 1;
    setCountdownText('1...');
    soundEngine.playCountdown();

    const interval = setInterval(() => {
      step++;
      if (step === 2) {
        setCountdownText('2...');
        soundEngine.playCountdown();
      } else if (step === 3) {
        setCountdownText('3!');
        soundEngine.playCountdown();
      } else if (step === 4) {
        setCountdownText('SHOOT!');
        soundEngine.playStartBuzz();
        setPhase('RESULT');
        clearInterval(interval);
      }
    }, 700);
  };

  const handleWin = (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      const newWins = p1Wins + 1;
      setP1Wins(newWins);
      if (newWins >= 2) {
        alert(`${player1?.funnyName} wins the match!`);
        resetGame();
      } else {
        setPhase('READY');
      }
    } else {
      const newWins = p2Wins + 1;
      setP2Wins(newWins);
      if (newWins >= 2) {
        alert(`${player2?.funnyName} wins the match!`);
        resetGame();
      } else {
        setPhase('READY');
      }
    }
  };

  const resetGame = () => {
    setP1Wins(0);
    setP2Wins(0);
    setPhase('SETUP');
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 uppercase tracking-widest">RPS WAR</h1>
        <div className="max-w-2xl mx-auto space-y-6 bg-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 1</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-yellow-500" value={player1Id} onChange={(e) => setPlayer1Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player2Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xl mb-2 font-bold">Select Player 2</label>
            <select className="w-full p-4 bg-black text-white text-xl font-bold border-2 border-yellow-500" value={player2Id} onChange={(e) => setPlayer2Id(e.target.value)}>
              {players.map(p => <option key={p.id} value={p.id} disabled={p.id === player1Id}>{p.funnyName}</option>)}
            </select>
          </div>
          <button onClick={() => setPhase('READY')} className="w-full py-6 mt-8 bg-yellow-600 hover:bg-yellow-500 text-3xl font-black text-black uppercase tracking-widest transition-colors">Enter Arena</button>
          <button onClick={onExit} className="w-full py-4 mt-4 bg-gray-700 hover:bg-gray-600 font-bold uppercase transition-colors">Cancel</button>
        </div>
      </div>
    );
  }

  const bgClass = isSuddenDeath ? 'bg-red-900' : 'bg-black';
  const textClass = isSuddenDeath ? 'text-red-100' : 'text-white';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col font-sans transition-colors duration-1000`}>
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-800">
        <button onClick={resetGame} className="px-4 py-2 border-2 border-gray-600 font-bold hover:bg-gray-800 transition-colors">Quit Match</button>
        {isSuddenDeath && <span className="font-black text-2xl animate-pulse tracking-widest">SUDDEN DEATH</span>}
        <div className="w-24"></div> {/* Spacer */}
      </div>

      <div className="flex flex-1">
        {/* Player 1 Side */}
        <div className="flex-1 flex flex-col items-center justify-center border-r-4 border-gray-800 p-8">
          {player1 && <PlayerAvatar seed={player1.funnyName} size={96} className="mb-4" />}
          <h2 className="text-4xl font-black uppercase text-center mb-8">{player1?.funnyName}</h2>
          <div className="flex gap-4">
            <div className={`w-16 h-16 border-4 ${p1Wins >= 1 ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'} rounded-full`}></div>
            <div className={`w-16 h-16 border-4 ${p1Wins >= 2 ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'} rounded-full`}></div>
            <div className="w-16 h-16 border-4 border-gray-600 rounded-full opacity-30"></div> {/* Third slot hidden visually unless best of 5? Spec says 3 slots, "first to 2? or best of 3" -> "Sudden Death Mode: When slots are 1-1" so we need 2 wins to win. */}
          </div>
        </div>

        {/* Center Area */}
        <div className="flex flex-col items-center justify-center px-12 z-10 w-96 shrink-0 relative">
          {phase === 'READY' && (
            <button onClick={startRound} className={`w-48 h-48 rounded-full border-8 ${isSuddenDeath ? 'border-red-500 bg-black text-red-500' : 'border-yellow-500 text-yellow-500'} flex items-center justify-center text-3xl font-black uppercase hover:bg-opacity-20 transition-all`}>
              Start Round
            </button>
          )}

          {phase === 'COUNTDOWN' && (
            <div className={`text-7xl font-black uppercase text-center ${isSuddenDeath ? 'text-white' : 'text-yellow-500'}`}>
              {countdownText}
            </div>
          )}

          {phase === 'RESULT' && (
            <div className="text-8xl font-black uppercase text-center mb-12">
              SHOOT!
            </div>
          )}
        </div>

        {/* Player 2 Side */}
        <div className="flex-1 flex flex-col items-center justify-center border-l-4 border-gray-800 p-8">
          {player2 && <PlayerAvatar seed={player2.funnyName} size={96} className="mb-4" />}
          <h2 className="text-4xl font-black uppercase text-center mb-8">{player2?.funnyName}</h2>
          <div className="flex gap-4">
            <div className={`w-16 h-16 border-4 ${p2Wins >= 1 ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'} rounded-full`}></div>
            <div className={`w-16 h-16 border-4 ${p2Wins >= 2 ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'} rounded-full`}></div>
            <div className="w-16 h-16 border-4 border-gray-600 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {phase === 'RESULT' && (
        <div className="flex w-full mt-auto h-32 border-t-4 border-gray-800">
          <button onClick={() => handleWin(1)} className="flex-1 bg-gray-900 hover:bg-yellow-600 font-black text-2xl uppercase transition-colors">
            {player1?.funnyName} Wins Throw
          </button>
          <div className="w-4 bg-gray-800"></div>
          <button onClick={() => setPhase('READY')} className="px-8 bg-gray-800 hover:bg-gray-700 font-bold text-xl uppercase transition-colors">
            Tie
          </button>
          <div className="w-4 bg-gray-800"></div>
          <button onClick={() => handleWin(2)} className="flex-1 bg-gray-900 hover:bg-yellow-600 font-black text-2xl uppercase transition-colors">
            {player2?.funnyName} Wins Throw
          </button>
        </div>
      )}
    </div>
  );
};
