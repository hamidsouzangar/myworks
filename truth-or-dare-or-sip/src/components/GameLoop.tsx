import { PlayerAvatar } from './PlayerAvatar';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import type { Task } from '../types';
import { BOTTLES } from './Bottles';
import { soundEngine } from '../utils/SoundEngine';

export const GameLoop: React.FC = () => {
  const {
    globalSipsRemaining,
    players,
    currentTurn,
    setPhase
  } = useGameStore();

  const [localPhase, setLocalPhase] = useState<'READY' | 'COUNTDOWN' | 'SPINNING' | 'DECISION' | 'ACTION' | 'RESOLUTION'>('READY');
  const [countdown, setCountdown] = useState(5);
  const [spinRotation, setSpinRotation] = useState(0);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showVetoWarning, setShowVetoWarning] = useState(false);
  const [BottleComponent, setBottleComponent] = useState(() => BOTTLES[0]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isFirstRound, setIsFirstRound] = useState(true);

  const startTurn = () => {
    soundEngine.unlock();
    if (isFirstRound) {
      setLocalPhase('COUNTDOWN');
      setIsFirstRound(false);
    } else {
      setLocalPhase('SPINNING');
    }
  };

  // Audio context mockup for running sound
  useEffect(() => {
    if (localPhase === 'COUNTDOWN') {
      soundEngine.playCountdown();
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            soundEngine.playStartBuzz();
            setLocalPhase('SPINNING');
            return 0;
          }
          soundEngine.playCountdown();
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [localPhase]);

  const handleSpin = () => {
    const { currentTurn, players } = useGameStore.getState();
    const { chooseNextVictim } = currentTurn.modifiers;

    if (chooseNextVictim) {
      useGameStore.getState().addDebugLog(`Targeting Check: 'Choose Next Victim' is ACTIVE. Bypassing Spin.`);
      // In a real implementation we would prompt the previous winner to pick the next player.
      // For the simulator, we randomly pick and bypass the visual spin.
      const targetPlayer = players[Math.floor(Math.random() * players.length)];
      useGameStore.setState(s => ({
        currentTurn: {
          ...s.currentTurn,
          activePlayerId: targetPlayer.id,
          modifiers: { ...s.currentTurn.modifiers, chooseNextVictim: false }
        }
      }));
      setLocalPhase('DECISION');
      return;
    }

    useGameStore.getState().addDebugLog(`Targeting Check: 'Choose Next Victim' is NO. Normal Spin selected.`);

    // Sync the spin duration visually and audibly
    const SPIN_DURATION_MS = 2000;
    soundEngine.playBottleSpin(SPIN_DURATION_MS);

    // Determine random player (The Goblin)
    const targetPlayer = players[Math.floor(Math.random() * players.length)];
    const randomRotation = 720 + Math.floor(Math.random() * 360); // Spin at least twice
    setSpinRotation(randomRotation);

    // Pick random bottle for next spin (shows up after this spin resolves)
    const RandomBottle = BOTTLES[Math.floor(Math.random() * BOTTLES.length)];

    setTimeout(() => {
      soundEngine.playBottleStop();
      setBottleComponent(() => RandomBottle);
      useGameStore.setState(s => ({
        currentTurn: { ...s.currentTurn, activePlayerId: targetPlayer.id }
      }));
      setLocalPhase('DECISION');
    }, SPIN_DURATION_MS);
  };

  const getActivePlayer = () => players.find(p => p.id === currentTurn.activePlayerId);

  const drawTask = (type: 'truth' | 'dare') => {
    const state = useGameStore.getState();
    const activePlayer = getActivePlayer();

    // Choose level array (simplified to Level 1 for now, but can scale to Level 2/3)
    let deck = type === 'truth' ? [...state.tasks.truthLevel1] : [...state.tasks.dareLevel1];

    if (deck.length === 0) {
      alert(`No more ${type}s available!`);
      return;
    }

    let selectedIndex = 0;

    if (activePlayer) {
      // THE ENGINE PULL (Persona Match)
      const scanLimit = Math.min(10, deck.length);
      let bestScore = -1;
      let matchedReason = 'Random default (Score 50)';

      for (let i = 0; i < scanLimit; i++) {
        const card = deck[i];
        let score = 0;
        let currentReason = '';

        // Match Persona Tag (Score 100 for perfect match, 50 if no match but valid)
        const targetPersona = card.tags.persona;
        if (targetPersona && activePlayer.tags.includes(`p:${targetPersona}`)) {
          score = 100;
          currentReason = `Matched P:${targetPersona} - Score 100`;
        } else {
          score = 50;
          currentReason = `Fallback (No persona match) - Score 50`;
        }

        // Match Constraints (If a card strictly requires something we don't have, drop score)
        const requiresPartner = card.tags.requiresPartner;
        if ((requiresPartner === 'true' || requiresPartner === true) && !activePlayer.hasPartnerInGame) {
           score = -100;
           currentReason = `Rejected: Missing Partner - Score -100`;
        }

        if (score > bestScore) {
          bestScore = score;
          selectedIndex = i;
          matchedReason = currentReason;
        }
      }

      state.addDebugLog(`Drew [${type.toUpperCase()}]: ${matchedReason} for ${activePlayer.funnyName}`);
    }

    const drawnCard = deck[selectedIndex];

    // THE BURN: Remove it permanently
    deck.splice(selectedIndex, 1);

    if (type === 'truth') {
      useGameStore.setState(s => ({ tasks: { ...s.tasks, truthLevel1: deck } }));
    } else {
      useGameStore.setState(s => ({ tasks: { ...s.tasks, dareLevel1: deck } }));
    }
    useGameStore.setState((prev) => ({
      tasks: {
        ...prev.tasks,
        [type === 'truth' ? 'truthLevel1' : 'dareLevel1']: deck
      }
    }));

    setActiveTask(drawnCard);
    setLocalPhase('ACTION');
  };

  const resolveTurn = (action: 'DONE' | 'SIP' | 'VETO') => {
    const state = useGameStore.getState();
    const { decrementSips, currentTurn, players, updatePlayer } = state;
    const { unholyUnion, forceSip } = currentTurn.modifiers;
    const activePlayerId = currentTurn.activePlayerId;
    const activePlayer = players.find(p => p.id === activePlayerId);

    if (!activePlayerId || !activePlayer) return;

    if (action === 'VETO' && !showVetoWarning) {
      soundEngine.playTimeOut('digital');
      setShowVetoWarning(true);
      return;
    }

    let sipPenalty = 0;

    // Resolution Selection logic
    if (action === 'SIP') {
      soundEngine.playTimeOut('buzzer');
      sipPenalty = unholyUnion ? 2 : 1;
    } else if (action === 'VETO') {
      soundEngine.playTimeOut('digital');
      sipPenalty = players.length; // Global sip penalty for all players
    } else if (action === 'DONE') {
      soundEngine.playFinish();
      // Apply Award logic (placeholder for engine parsing of 'Award:' text)
      // e.g. "Award: Truth Serum" -> add to player's activeModifiers array
    }

    if (sipPenalty > 0) {
      decrementSips(sipPenalty);

      // Update individual player sips
      if (action === 'VETO') {
        players.forEach(p => {
          updatePlayer(p.id, { sipsTaken: p.sipsTaken + 1, strictSips: p.strictSips + 1 });
        });
      } else {
        updatePlayer(activePlayerId, {
          sipsTaken: activePlayer.sipsTaken + sipPenalty,
          strictSips: activePlayer.strictSips + sipPenalty
        });
      }
    }

    if (action === 'DONE') {
      if (activeTask) {
        if (activeTask.tags.type?.includes('truth')) {
          updatePlayer(activePlayerId, { truthsDone: activePlayer.truthsDone + 1 });
        } else if (activeTask.tags.type?.includes('dare')) {
          updatePlayer(activePlayerId, { daresDone: activePlayer.daresDone + 1 });
        }
      }
    }

    // Phase: Aftermath
    if (forceSip) {
      state.addDebugLog(`Instant Trigger: 'Force Sip' activated against Target.`);
      // Instantly deduct 1 sip
      decrementSips(1);
      // Reset force sip modifier
      useGameStore.setState(s => ({
        currentTurn: { ...s.currentTurn, modifiers: { ...s.currentTurn.modifiers, forceSip: false } }
      }));
    }

    // Clean up active modifiers on players (Decrement counters like Silence 2 -> 1)
    const store = useGameStore.getState();
    const { muteButton, vowOfSilence, tRex } = store.currentTurn.modifiers;

    const newModifiers = { ...store.currentTurn.modifiers };
    let hasChanges = false;

    if (muteButton > 0) {
      newModifiers.muteButton -= 1;
      hasChanges = true;
    }
    if (vowOfSilence > 0) {
      newModifiers.vowOfSilence -= 1;
      hasChanges = true;
    }
    if (tRex > 0) {
      newModifiers.tRex -= 1;
      hasChanges = true;
    }

    if (hasChanges) {
       useGameStore.setState(s => ({
         currentTurn: { ...s.currentTurn, modifiers: newModifiers }
       }));
    }

    // Reset Turn to next player spin
    setShowVetoWarning(false);
    setActiveTask(null);
    setLocalPhase('READY');
    setCountdown(5);
  };

  const handleExitGame = () => {
    useGameStore.getState().resetGame();
  };

  if (globalSipsRemaining <= 0) {
    setPhase('GAME_OVER');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-lg mx-auto bg-gray-900 relative">
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-bold shadow-lg text-sm"
        >
          Exit
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded-full font-bold shadow-lg">
        Global Sips: {globalSipsRemaining}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-600 text-center max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Exit Game?</h2>
            <p className="text-gray-300 mb-8">Are you sure you want to end the current game session?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold"
              >
                No
              </button>
              <button
                onClick={handleExitGame}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {localPhase === 'READY' && (
          <motion.div
            key="ready"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-black bg-opacity-80 z-20"
          >
            <button
              onClick={startTurn}
              className="px-12 py-6 bg-red-600 hover:bg-red-500 text-white font-black text-5xl rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.5)] transform transition-transform hover:scale-105 active:scale-95 uppercase"
            >
              {isFirstRound ? 'START GAME' : 'NEXT TURN'}
            </button>
          </motion.div>
        )}

        {localPhase === 'COUNTDOWN' && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-9xl font-black text-red-500"
          >
            {countdown}
          </motion.div>
        )}

        {localPhase === 'SPINNING' && (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full"
          >
            <h2 className="text-2xl font-bold mb-12 text-gray-200">Tap to Spin the Bottle</h2>

            <motion.div
              animate={{ rotate: spinRotation }}
              transition={{ duration: 2, ease: "circOut" }}
              className="mb-12 flex items-center justify-center origin-center"
            >
               <BottleComponent />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpin}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg"
            >
              SPIN
            </motion.button>
          </motion.div>
        )}

        {localPhase === 'DECISION' && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center w-full text-center"
          >
            {getActivePlayer() && (
              <PlayerAvatar seed={getActivePlayer()!.funnyName} size={80} className="mb-4" />
            )}
            <h2 className="text-4xl font-black text-orange-400 mb-2">The Goblin is</h2>
            <h3 className="text-5xl font-black text-white mb-2">{getActivePlayer()?.funnyName}</h3>

            {/* Player Status Display */}
            {getActivePlayer() && (
              <div className="flex justify-center gap-4 mb-10 text-sm font-bold text-gray-400 bg-gray-800 px-6 py-3 rounded-xl shadow-inner">
                <div className="flex flex-col">
                  <span className="text-green-400">{getActivePlayer()!.truthsDone}</span>
                  <span className="text-[10px] uppercase">Truths</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-red-400">{getActivePlayer()!.daresDone}</span>
                  <span className="text-[10px] uppercase">Dares</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-orange-400">{getActivePlayer()!.sipsTaken}</span>
                  <span className="text-[10px] uppercase">Sips</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-purple-400">{getActivePlayer()!.strictSips}</span>
                  <span className="text-[10px] uppercase">Strict</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full">
              {currentTurn.modifiers.blindLuck ? (
                 <div className="w-full py-8 bg-purple-900 border border-purple-500 rounded-2xl flex flex-col items-center">
                   <span className="text-purple-300 font-bold mb-4 uppercase tracking-widest text-sm">Blind Luck Active!</span>
                   <button
                     onClick={() => drawTask(Math.random() > 0.5 ? 'truth' : 'dare')}
                     className="px-8 py-4 bg-purple-500 text-white font-black uppercase text-xl rounded-xl hover:bg-purple-400"
                   >
                     Previous Winner Chooses
                   </button>
                 </div>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => drawTask('truth')}
                    disabled={currentTurn.modifiers.dareDevil}
                    className={`flex-1 py-8 text-white font-black text-2xl rounded-2xl shadow-xl transition-colors ${currentTurn.modifiers.dareDevil ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                    {currentTurn.modifiers.dareDevil ? 'LOCKED' : 'TRUTH'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => drawTask('dare')}
                    disabled={currentTurn.modifiers.truthSerum}
                    className={`flex-1 py-8 text-white font-black text-2xl rounded-2xl shadow-xl transition-colors ${currentTurn.modifiers.truthSerum ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-500'}`}
                  >
                    {currentTurn.modifiers.truthSerum ? 'LOCKED' : 'DARE'}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {localPhase === 'ACTION' && activeTask && (
          <motion.div
            key="action"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="w-full bg-white text-gray-900 p-8 rounded-2xl shadow-2xl mb-8 transform rotate-1">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{activeTask.tags.type?.replace('Type:', '')}</span>
              <h2 className="text-3xl font-black mt-2 leading-tight">{activeTask.content}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-200 text-xs font-bold rounded-full">{activeTask.tags.level}</span>
                {activeTask.tags.persona && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{activeTask.tags.persona}</span>
                )}
              </div>
            </div>

            {showVetoWarning ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-red-900 p-6 rounded-2xl border border-red-500 text-center"
              >
                <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
                <p className="text-gray-300 mb-6">All of the players must sip.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setShowVetoWarning(false)} className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl">Continue the game</button>
                  <button onClick={() => resolveTurn('VETO')} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl">Yes, we are sure</button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-4 w-full">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => resolveTurn('DONE')} className="py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg">DONE</motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => resolveTurn('SIP')}
                  disabled={currentTurn.modifiers.blockSkip}
                  className={`py-4 text-white font-bold rounded-xl shadow-lg transition-colors ${currentTurn.modifiers.blockSkip ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-orange-500'}`}
                >
                  {currentTurn.modifiers.blockSkip ? 'BLOCKED' : 'SIP'}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => resolveTurn('VETO')} className="py-4 bg-gray-600 text-white font-bold rounded-xl shadow-lg">VETO</motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
