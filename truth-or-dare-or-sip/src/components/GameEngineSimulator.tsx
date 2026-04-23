import React from 'react';
import { useGameStore } from '../store/useGameStore';
import type { Modifiers } from '../types';

export const GameEngineSimulator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const state = useGameStore();

  const handleGlobalSips = (amount: number) => {
    state.decrementSips(amount);
  };

  const handleToggleModifier = (modKey: keyof Modifiers) => {
    const mods = state.currentTurn.modifiers;
    const newVal = typeof mods[modKey] === 'boolean' ? !mods[modKey] : (mods[modKey] as number > 0 ? 0 : 3);
    useGameStore.setState(s => ({
      currentTurn: {
        ...s.currentTurn,
        modifiers: {
          ...s.currentTurn.modifiers,
          [modKey]: newVal
        }
      }
    }));
  };

  const clearLogs = () => {
    useGameStore.setState({ debugLogs: [] });
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-4 font-mono text-xs text-green-400 flex flex-col md:flex-row gap-4">

      {/* Left Column: Controls & State */}
      <div className="flex-1 border border-green-500 p-4 overflow-y-auto bg-black/50 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-green-500 pb-2">
          <h2 className="text-xl font-bold uppercase tracking-widest">Engine Simulator</h2>
          <button onClick={onClose} className="px-4 py-1 bg-red-900 text-white font-bold hover:bg-red-700">Close</button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Global State</h3>
          <div className="flex gap-4">
            <div className="border border-green-800 p-2">
              <div>Phase: <span className="text-white">{state.phase}</span></div>
              <div>Global Sips: <span className="text-white text-lg font-bold">{state.globalSipsRemaining}</span></div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleGlobalSips(-5)} className="bg-green-900 px-2 py-1 hover:bg-green-700">+5</button>
                <button onClick={() => handleGlobalSips(5)} className="bg-red-900 px-2 py-1 hover:bg-red-700">-5</button>
              </div>
            </div>
            <div className="border border-green-800 p-2 flex-1">
               <div>Active Player ID: <span className="text-white">{state.currentTurn.activePlayerId || 'None'}</span></div>
               <div>Target Player ID: <span className="text-white">{state.currentTurn.targetPlayerId || 'None'}</span></div>
               <div className="mt-2 text-gray-500 italic">Toggle "Choose Next Victim" below to bypass the spin animation.</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Deck Sizes</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-900/30 p-2 border border-blue-900">Truth 1: <span className="text-white">{state.tasks.truthLevel1.length}</span></div>
            <div className="bg-red-900/30 p-2 border border-red-900">Dare 1: <span className="text-white">{state.tasks.dareLevel1.length}</span></div>
            <div className="bg-blue-900/30 p-2 border border-blue-900">Truth 2: <span className="text-white">{state.tasks.truthLevel2.length}</span></div>
            <div className="bg-red-900/30 p-2 border border-red-900">Dare 2: <span className="text-white">{state.tasks.dareLevel2.length}</span></div>
            <div className="bg-blue-900/30 p-2 border border-blue-900">Truth 3: <span className="text-white">{state.tasks.truthLevel3.length}</span></div>
            <div className="bg-red-900/30 p-2 border border-red-900">Dare 3: <span className="text-white">{state.tasks.dareLevel3.length}</span></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Active Modifiers</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(state.currentTurn.modifiers).map(([key, val]) => {
              const isActive = typeof val === 'boolean' ? val : val > 0;
              return (
                <button
                  key={key}
                  onClick={() => handleToggleModifier(key as keyof Modifiers)}
                  className={`p-2 text-left border ${isActive ? 'bg-green-900 border-green-400 text-white' : 'border-green-900/50 hover:bg-green-900/20'}`}
                >
                  <span className="font-bold">{key}</span>: {val.toString()}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Engine Log */}
      <div className="w-full md:w-96 border border-green-500 p-4 bg-black flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Debug Log</h3>
          <button onClick={clearLogs} className="text-gray-500 hover:text-white">Clear</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {state.debugLogs.length === 0 ? (
            <div className="text-gray-600 italic">Awaiting engine activity...</div>
          ) : (
            state.debugLogs.map(log => (
              <div key={log.id} className="border-b border-green-900/50 pb-2">
                 <div className="text-gray-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</div>
                 <div className="text-green-300">{log.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
