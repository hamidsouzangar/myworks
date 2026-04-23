import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '../store/useGameStore';
import type { Player } from '../types';
import taskBankData from '../data/taskBank.json';
import { soundEngine } from '../utils/SoundEngine';
import { CPM_ARCHETYPES, CPM_QUESTIONS } from '../data/cpmDatabase';

export const StealthInterview: React.FC = () => {
  const { settings, addPlayer } = useGameStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setLocalPhase] = useState<'PASS_IPAD' | 'QUIZ' | 'REVEAL'>('PASS_IPAD');
  const [revealedPlayer, setRevealedPlayer] = useState<{name: string, archetype: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState(settings.interviewTimerSeconds || 30);

  // Quiz specific state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [randomizedQuestions, setRandomizedQuestions] = useState([...CPM_QUESTIONS]);

  // CPM Tracking
  const [scores, setScores] = useState<Record<string, number>>({});
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [answersCount, setAnswersCount] = useState(0);

  // Demographic Captures
  const [capturedGender, setCapturedGender] = useState('Unknown');
  const [capturedPartner, setCapturedPartner] = useState(false);

  // Ref for exact timing
  const questionStartTime = useRef<number>(Date.now());

  const totalPlayers = settings.numPlayers;

  // Initialize scores object on mount
  useEffect(() => {
    const initialScores: Record<string, number> = {};
    CPM_ARCHETYPES.forEach(a => { initialScores[a.id] = 0; });
    setScores(initialScores);
  }, []);

  useEffect(() => {
    let timer: number;
    if (phase === 'QUIZ' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft <= 0 && phase === 'QUIZ') {
      handleCompleteQuiz();
    }
    return () => window.clearInterval(timer);
  }, [phase, timeLeft]);

  const handleStartQuiz = () => {
    // Keep demographic questions (id starts with 'q-') at the beginning, randomize the rest, pick total 8
    const demographics = CPM_QUESTIONS.filter(q => q.id.startsWith('q-'));
    const others = CPM_QUESTIONS.filter(q => !q.id.startsWith('q-')).sort(() => Math.random() - 0.5).slice(0, 6); // 2 demog + 6 personality = 8 questions total

    setRandomizedQuestions([...demographics, ...others]);
    setCurrentQuestionIndex(0);
    const initialScores: Record<string, number> = {};
    CPM_ARCHETYPES.forEach(a => { initialScores[a.id] = 0; });
    setScores(initialScores);
    setReactionTimes([]);
    setAnswersCount(0);
    setLocalPhase('QUIZ');
    setTimeLeft(settings.interviewTimerSeconds || 30);
    questionStartTime.current = Date.now();
  };

  const handleAnswer = (primary: string[], secondary: string[], optionText: string) => {
    // Check for demographic questions and save the state
    const qId = randomizedQuestions[currentQuestionIndex].id;
    if (qId === 'q-gender') setCapturedGender(optionText);
    if (qId === 'q-partner') setCapturedPartner(optionText === 'Yes');

    // 1. Calculate Reaction Time
    const rt = (Date.now() - questionStartTime.current) / 1000;
    setReactionTimes(prev => [...prev, rt]);
    setAnswersCount(prev => prev + 1);

    // 2. Add Layer 1 Score (Content Scoring)
    const newScores = { ...scores };
    primary.forEach(g => { newScores[g] = (newScores[g] || 0) + 2; });
    secondary.forEach(g => { newScores[g] = (newScores[g] || 0) + 1; });
    setScores(newScores);

    // 3. Next question or complete
    if (currentQuestionIndex + 1 < randomizedQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      questionStartTime.current = Date.now();
    } else {
      handleCompleteQuiz(newScores, [...reactionTimes, rt], answersCount + 1);
    }
  };

  const handleCompleteQuiz = (
    finalScores = scores,
    finalRts = reactionTimes,
    finalAnsCount = answersCount
  ) => {
    // Calculate Average RT
    const avgRt = finalRts.length > 0
      ? finalRts.reduce((a, b) => a + b, 0) / finalRts.length
      : 999.0;

    // Calculate if they had a timeout (null answer)
    const hadTimeout = finalAnsCount < 8;



    // Phase 3: Temporal Modifier (Layer 2)
    const tempScores = { ...finalScores };

    if (avgRt < 2.5 && !hadTimeout) {

      ['Extrovert', 'Instigator', 'Fearless', 'Unpredictable'].forEach(a => tempScores[a] += 3);
      ['Argues Technicalities', 'Gentle', 'Introvert'].forEach(a => tempScores[a] -= 2);
    } else if (avgRt > 8.0 || hadTimeout) {

      ['Flight Risk', 'Introvert', 'Gentle'].forEach(a => tempScores[a] += 3);
      ['Main Character', 'Exhibitionist', 'Fearless'].forEach(a => tempScores[a] -= 3);
    } else {

      ['Argues Technicalities', 'Manipulator', 'People Pleaser'].forEach(a => tempScores[a] += 3);
    }

    // Phase 4: Completion Ratio Modifier (Layer 3)

    if (finalAnsCount <= 2) {

      tempScores['Flight Risk'] += 5;
      tempScores['Extrovert'] -= 5;
    } else if (finalAnsCount <= 4) {

      ['Introvert', 'Gentle'].forEach(a => tempScores[a] += 3);
    } else if (finalAnsCount <= 6) {

      ['Manipulator', 'Argues Technicalities'].forEach(a => tempScores[a] += 3);
    } else {

      ['Main Character', 'Exhibitionist', 'Instigator'].forEach(a => tempScores[a] += 3);
    }

    // Phase 5: Archetype Resolution
    let maxScore = -999;
    let winningGroupId = "Normie";

    Object.entries(tempScores).forEach(([groupId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningGroupId = groupId;
      }
    });

    const winningGroup = CPM_ARCHETYPES.find(g => g.id === winningGroupId) || CPM_ARCHETYPES.find(g => g.id === "Normie")!;

    // Pick random nickname from the winning group
    const funnyName = winningGroup.nicknames[Math.floor(Math.random() * winningGroup.nicknames.length)];

    // Assign tags mapped for the engine
    const tags = winningGroup.tags.map(t => `p:${t}`);

    const newPlayer: Player = {
      id: uuidv4(),
      funnyName,
      archetype: winningGroup.id,
      gender: capturedGender,
      ageGroup: settings.globalAgeGroup, // Use global setting here
      hasPartnerInGame: capturedPartner,
      tags,
      sipsTaken: 0,
      truthsDone: 0,
      daresDone: 0,
      strictSips: 0,
      activeModifiers: []
    };

    addPlayer(newPlayer);

    // Show Reveal Phase
    setRevealedPlayer({ name: funnyName, archetype: winningGroup.id });
    setLocalPhase('REVEAL');
  };

  const handleNextPlayer = () => {
    // Continue flow
    if (currentPlayerIndex + 1 < totalPlayers) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setLocalPhase('PASS_IPAD');
    } else {
      // All players interviewed, Initialize State (Phase 1)
      // Unlock AudioContext here (this is inside a direct user click event)
      soundEngine.unlock();
      const { initGame } = useGameStore.getState();
      initGame(taskBankData as any);
    }
  };

  const currentQ = randomizedQuestions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'PASS_IPAD' && (
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
        )}

        {phase === 'QUIZ' && (
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
                    onClick={() => handleAnswer(opt.primary, opt.secondary, opt.text)}
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

      <AnimatePresence mode="wait">
        {phase === 'REVEAL' && revealedPlayer && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-2">You are</h2>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">{revealedPlayer.name}</h1>
            <p className="text-xl text-gray-300 italic mb-8">Archetype: {revealedPlayer.archetype}</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextPlayer}
              className="w-full max-w-sm py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg"
            >
              {currentPlayerIndex + 1 < totalPlayers ? "Next Player" : "Start Game"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
