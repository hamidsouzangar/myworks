import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

export const LaunchScreen: React.FC = () => {
  const { phase, setPhase, globalSipsRemaining, resetGame } = useGameStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Small delay to simulate loading and show the splash screen
    const timer = setTimeout(() => {
      setChecking(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    resetGame();
    setPhase('HOST_DASHBOARD');
  };

  const handleResumeGame = () => {
    setPhase('GAME_LOOP');
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-300">Loading Game State...</h2>
      </div>
    );
  }

  const hasSave = phase === 'GAME_LOOP' || (globalSipsRemaining > 0 && phase !== 'LAUNCH' && phase !== 'GAME_OVER');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
      >
        Truth or Dare or Sip
      </motion.h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {hasSave && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResumeGame}
            className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            Resume Game
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewGame}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          {hasSave ? 'Start New Game' : 'New Game'}
        </motion.button>
      </div>
    </div>
  );
};
