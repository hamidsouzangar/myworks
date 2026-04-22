import { useGameStore } from './store/useGameStore';
import { useState } from 'react';

import { LaunchScreen } from './components/LaunchScreen';
import { HostDashboard } from './components/HostDashboard';
import { StealthInterview } from './components/StealthInterview';
import { GameLoop } from './components/GameLoop';
import { DuelHub } from './components/duel-games/DuelHub';
import { useUiPop } from './hooks/useUiPop';

function App() {
  const { phase } = useGameStore();
  const [showDuelHub, setShowDuelHub] = useState(false);
  useUiPop();

  if (showDuelHub) {
    return <DuelHub onExit={() => setShowDuelHub(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {phase === 'LAUNCH' && <LaunchScreen onOpenDuelHub={() => setShowDuelHub(true)} />}
      {phase === 'HOST_DASHBOARD' && <HostDashboard onOpenDuelHub={() => setShowDuelHub(true)} />}
      {phase === 'STEALTH_INTERVIEW' && <StealthInterview />}
      {phase === 'GAME_LOOP' && <GameLoop />}
      {phase === 'GAME_OVER' && <div>Game Over View</div>}
    </div>
  );
}

export default App;
