import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../store/useGameStore';
import type { Player } from '../types';
import taskBankData from '../data/taskBank.json';
import { PERSONA_GROUPS, QUIZ_QUESTIONS } from '../data/stealthQuiz';

export const StealthInterview: React.FC = () => {
  const { settings, addPlayer } = useGameStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setLocalPhase] = useState<'PASS_IPAD' | 'QUIZ'>('PASS_IPAD');
  const [timeLeft, setTimeLeft] = useState(45);

  // Quiz specific state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [randomizedQuestions, setRandomizedQuestions] = useState([...QUIZ_QUESTIONS]);
  const [scores, setScores] = useState<Record<string, number>>({
    group1_goofball: 0,
    group2_antihero: 0,
    group3_nervous: 0,
    group4_feral: 0,
    group5_softie: 0
  });

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
    // Randomize questions for the new player
    setRandomizedQuestions([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScores({
      group1_goofball: 0,
      group2_antihero: 0,
      group3_nervous: 0,
      group4_feral: 0,
      group5_softie: 0
    });
    setLocalPhase('QUIZ');
    setTimeLeft(45);
  };

  const handleAnswer = (awardedGroups: string[]) => {
    // Update scores
    const newScores = { ...scores };
    awardedGroups.forEach(g => {
      newScores[g] += 1;
    });
    setScores(newScores);

    // Next question or complete
    if (currentQuestionIndex + 1 < randomizedQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteQuiz(newScores);
    }
  };

  const handleCompleteQuiz = (finalScores = scores) => {
    // Find the winning group
    let maxScore = -1;
    let winningGroupId = "group1_goofball"; // fallback

    Object.entries(finalScores).forEach(([groupId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningGroupId = groupId;
      }
    });

    const winningGroup = PERSONA_GROUPS.find(g => g.id === winningGroupId)!;

    // Pick random nickname from the group
    const funnyName = winningGroup.nicknames[Math.floor(Math.random() * winningGroup.nicknames.length)];

    // Assign tags (prepend 'p:' to match task bank persona format if needed, but the user prompt has them as regular strings in the tags array, we will just use the tags directly for matching later)
    // We will append 'p:' to them so they match the GameLoop logic which checks for `p:${cardPersona}`
    const tags = winningGroup.tags.map(t => `p:${t}`);

    const newPlayer: Player = {
      id: uuidv4(),
      funnyName,
      tags,
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

  const currentQ = randomizedQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-xl mx-auto">
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
            <div className={`text-6xl font-black mb-6 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {timeLeft}
            </div>

            <div className="w-full space-y-6">
              <div className="text-center mb-6">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{currentQ.title} ({currentQuestionIndex + 1}/8)</span>
                <h3 className="text-2xl font-bold text-white mt-2">{currentQ.text}</h3>
              </div>

              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt.groups)}
                    className="w-full py-4 px-6 bg-gray-700 hover:bg-red-600 text-white text-left font-semibold rounded-xl shadow transition-colors"
                  >
                    {opt.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
