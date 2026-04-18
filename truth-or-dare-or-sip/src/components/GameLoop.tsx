import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import type { Task } from '../types';

export const GameLoop: React.FC = () => {
  const {
    globalSipsRemaining,
    players,
    currentTurn,
    setPhase
  } = useGameStore();

  const [localPhase, setLocalPhase] = useState<'COUNTDOWN' | 'SPINNING' | 'DECISION' | 'ACTION' | 'RESOLUTION'>('COUNTDOWN');
  const [countdown, setCountdown] = useState(5);
  const [spinRotation, setSpinRotation] = useState(0);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Audio context mockup for running sound
  useEffect(() => {
    if (localPhase === 'COUNTDOWN') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLocalPhase('SPINNING');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [localPhase]);

  const handleSpin = () => {
    // Determine random player (The Goblin)
    const targetPlayer = players[Math.floor(Math.random() * players.length)];
    const randomRotation = 720 + Math.floor(Math.random() * 360); // Spin at least twice
    setSpinRotation(randomRotation);

    setTimeout(() => {
      useGameStore.setState({
        currentTurn: { ...currentTurn, activePlayerId: targetPlayer.id }
      });
      setLocalPhase('DECISION');
    }, 2000);
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

    // THE PERSONA MATCH: Check top 10 cards
    const scanLimit = Math.min(10, deck.length);
    let selectedIndex = 0;

    if (activePlayer && activePlayer.tags.length > 0) {
      for (let i = 0; i < scanLimit; i++) {
        const cardPersona = deck[i].tags.persona;
        if (cardPersona && activePlayer.tags.includes(`p:${cardPersona}`)) {
          selectedIndex = i;
          break; // Perfect Match! (Score 100)
        }
      }
    }

    const drawnCard = deck[selectedIndex];

    // THE BURN: Remove it
    deck.splice(selectedIndex, 1);
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
    const { unholyUnion } = currentTurn.modifiers;
    const activePlayerId = currentTurn.activePlayerId;

    if (!activePlayerId) return;

    let sipPenalty = 0;

    // Resolution Selection logic
    if (action === 'SIP') {
      sipPenalty = unholyUnion ? 2 : 1;
    } else if (action === 'VETO') {
      sipPenalty = unholyUnion ? 2 : 1;
      // Veto logic could be harsher, but sticking to standard sips based on prompt
    } else if (action === 'DONE') {
      // no sip penalty
    }

    if (sipPenalty > 0) {
      decrementSips(sipPenalty);
      const activePlayer = players.find(p => p.id === activePlayerId);
      if (activePlayer) {
         updatePlayer(activePlayerId, { sipsTaken: activePlayer.sipsTaken + sipPenalty });
      }
    }

    // Phase: Aftermath
    // Decrement turn counters, handle Force Sip etc would go here in a fully expanded version.

    // Auto-save happens automatically via zustand persist middleware.

    // Reset Turn to next player spin
    setActiveTask(null);
    setLocalPhase('SPINNING');
  };

  if (globalSipsRemaining <= 0) {
    setPhase('GAME_OVER');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-lg mx-auto bg-gray-900">
      <div className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded-full font-bold shadow-lg">
        Global Sips: {globalSipsRemaining}
      </div>

      <AnimatePresence mode="wait">
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
              className="w-32 h-64 bg-green-500 rounded-t-full mb-12 shadow-[0_0_30px_rgba(34,197,94,0.5)] relative flex items-start justify-center"
            >
               <div className="w-8 h-16 bg-green-700 rounded-t-full mt-2" />
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
            <h2 className="text-4xl font-black text-orange-400 mb-2">The Goblin is</h2>
            <h3 className="text-5xl font-black text-white mb-12">{getActivePlayer()?.funnyName}</h3>

            <div className="flex gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => drawTask('truth')}
                className="flex-1 py-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl rounded-2xl shadow-xl"
              >
                TRUTH
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => drawTask('dare')}
                className="flex-1 py-8 bg-red-600 hover:bg-red-500 text-white font-black text-2xl rounded-2xl shadow-xl"
              >
                DARE
              </motion.button>
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

            <div className="grid grid-cols-3 gap-4 w-full">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => resolveTurn('DONE')} className="py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg">DONE</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => resolveTurn('SIP')} className="py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg">SIP</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => resolveTurn('VETO')} className="py-4 bg-gray-600 text-white font-bold rounded-xl shadow-lg">VETO</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
