import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import type { GameSettings } from '../types';

export const HostDashboard: React.FC<{ onOpenDuelHub?: () => void }> = ({ onOpenDuelHub }) => {
  const { settings, updateSettings, setPhase } = useGameStore();

  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleStartInterview = () => {
    updateSettings(localSettings);
    setPhase('STEALTH_INTERVIEW');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setLocalSettings({ ...localSettings, [name]: val });
  };

  const handleBoundaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLocalSettings({
      ...localSettings,
      boundaries: {
        ...localSettings.boundaries,
        [name]: checked
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen max-w-lg mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
      >
        Host Dashboard
      </motion.h1>

      <div className="w-full bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-400 border-b border-gray-700 pb-2">Initial Settings</h2>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Device Layout (for iPad/Phone)</label>
            <select name="deviceLayout" value={localSettings.deviceLayout} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white">
              <option value="portrait">Portrait</option>
              <option value="wide">Wide</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Global Age Group</label>
            <select name="globalAgeGroup" value={localSettings.globalAgeGroup} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white">
              <option value="Kid">Kid</option>
              <option value="Teenager">Teenager</option>
              <option value="Adult">Adult</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Number of Players</label>
            <input type="number" name="numPlayers" min="2" max="20" value={localSettings.numPlayers} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Rounds per Player</label>
            <input type="number" name="roundsPerPlayer" min="1" max="50" value={localSettings.roundsPerPlayer} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Pre-game Quiz Timer (seconds)</label>
            <input type="number" name="interviewTimerSeconds" min="10" max="120" value={localSettings.interviewTimerSeconds} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Target Game Time (Min)</label>
            <input type="number" name="targetGameTimeMin" min="5" max="300" value={localSettings.targetGameTimeMin} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Drink Volume (ml)</label>
            <input type="number" name="drinkVolumeMl" min="5" max="500" value={localSettings.drinkVolumeMl} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white" />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">Drink Type</label>
            <select name="drinkType" value={localSettings.drinkType} onChange={handleChange} className="bg-gray-700 p-2 rounded text-white">
              <option value="soft">Soft Drink</option>
              <option value="hard">Hard Liquor</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" id="unlockLevel3" name="unlockLevel3" checked={localSettings.unlockLevel3} onChange={(e) => setLocalSettings({...localSettings, unlockLevel3: e.target.checked})} className="w-5 h-5 accent-red-500" />
            <label htmlFor="unlockLevel3" className="text-gray-300">Unlock Level 3 (NSFW / Extreme)</label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-400 border-b border-gray-700 pb-2">Boundaries & Hard Limits</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(localSettings.boundaries).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={key}
                  name={key}
                  checked={value}
                  onChange={handleBoundaryChange}
                  className="w-4 h-4 accent-red-500"
                />
                <label htmlFor={key} className="text-gray-300 text-sm">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartInterview}
          className="w-full py-4 mt-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          Proceed to Stealth Interview
        </motion.button>

        {onOpenDuelHub && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenDuelHub}
            className="w-full py-4 px-6 mt-4 bg-purple-900 hover:bg-purple-700 text-white border-4 border-purple-500 font-black rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-colors uppercase tracking-widest text-lg"
          >
            Test Duel Mini-Games
          </motion.button>
        )}
      </div>
    </div>
  );
};
