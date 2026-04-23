import { useGameStore } from './store/useGameStore';
import { useState } from 'react';

import { LaunchScreen } from './components/LaunchScreen';
import { HostDashboard } from './components/HostDashboard';
import { StealthInterview } from './components/StealthInterview';
import { GameLoop } from './components/GameLoop';
import { DuelHub } from './components/duel-games/DuelHub';
import { GameEngineSimulator } from './components/GameEngineSimulator';
import { useUiPop } from './hooks/useUiPop';

function App() {
  const { phase } = useGameStore();
  const [showDuelHub, setShowDuelHub] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  useUiPop();

  if (showDuelHub) {
    return <DuelHub onExit={() => setShowDuelHub(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {showSimulator && <GameEngineSimulator onClose={() => setShowSimulator(false)} />}

      {/* Absolute floating button for simulator access anywhere during dev */}
      <button
         onClick={() => setShowSimulator(true)}
         className="fixed bottom-4 right-4 z-40 bg-green-900 text-green-300 border border-green-500 px-3 py-2 rounded font-mono text-xs hover:bg-green-700 shadow-lg"
      >
        [Dev: Engine Sim]
      </button>

      {phase === 'LAUNCH' && <LaunchScreen onOpenDuelHub={() => setShowDuelHub(true)} />}
      {phase === 'HOST_DASHBOARD' && <HostDashboard onOpenDuelHub={() => setShowDuelHub(true)} />}
      {phase === 'STEALTH_INTERVIEW' && <StealthInterview />}
      {phase === 'GAME_LOOP' && <GameLoop />}
      {phase === 'GAME_OVER' && <div>Game Over View</div>}
    </div>
  );
}

export default App;
