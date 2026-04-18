import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../store/useGameStore';
import type { Player } from '../types';
import taskBankData from '../data/taskBank.json';

const FUNNY_NAMES = [
  "Captain Chaos", "The Instigator", "Whiskey Tango", "Sir Sips-a-Lot",
  "The Goblin", "Count Drinkula", "Tipsy Tornado", "The Mischief Maker",
  "Sneaky Pete", "Madame Merlot", "Duke of Dare", "Truth Teller"
];

const PERSONA_TAGS = ['flirty', 'introvert', 'nosy', 'chaotic', 'romantic'];

export const StealthInterview: React.FC = () => {
  const { settings, addPlayer } = useGameStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setLocalPhase] = useState<'PASS_IPAD' | 'QUIZ'>('PASS_IPAD');
  const [timeLeft, setTimeLeft] = useState(45);
  const [answers, setAnswers] = useState<string[]>([]);

  // Simple quiz questions
  const questions = [
    "What's your vibe tonight?",
    "Are you more likely to instigate or spectate?"
  ];

  const totalPlayers = settings.numPlayers;

  useEffect(() => {
    let timer: number;
    if (phase === 'QUIZ' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && phase === 'QUIZ') {
      handleCompleteQuiz();
    }
    return () => window.clearInterval(timer);
  }, [phase, timeLeft]);

  const handleStartQuiz = () => {
    setLocalPhase('QUIZ');
    setTimeLeft(45);
    setAnswers(Array(questions.length).fill(''));
  };

  const handleCompleteQuiz = () => {
    // Generate random name and tag
    const funnyName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)] + ` #${currentPlayerIndex + 1}`;
    const tag = PERSONA_TAGS[Math.floor(Math.random() * PERSONA_TAGS.length)];

    const newPlayer: Player = {
      id: uuidv4(),
      funnyName,
      tags: [`p:${tag}`],
      sipsTaken: 0
    };

    addPlayer(newPlayer);

    if (currentPlayerIndex + 1 < totalPlayers) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setLocalPhase('PASS_IPAD');
    } else {
      // All players interviewed, Initialize State (Phase 1)
      const { initGame } = useGameStore.getState();
      initGame(taskBankData as any);
      // initGame internally sets phase to GAME_LOOP
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'PASS_IPAD' ? (
          <motion.div
            key="pass"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center w-full bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-red-400">Player {currentPlayerIndex + 1}</h2>
            <p className="text-xl mb-8 text-gray-300">Pass the device to Player {currentPlayerIndex + 1}. No peeking!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQuiz}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg"
            >
              I am Player {currentPlayerIndex + 1}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <div className={`text-6xl font-black mb-8 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}
            </div>

            <div className="w-full space-y-6">
              {questions.map((q, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-gray-300 text-lg mb-2">{q}</label>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[i] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-red-500 focus:outline-none"
                    placeholder="Type your answer..."
                  />
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCompleteQuiz}
              className="w-full py-4 mt-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg"
            >
              Submit & Complete
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
