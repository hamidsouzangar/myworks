import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Task, GameSettings } from '../types';

const defaultSettings: GameSettings = {
  deviceLayout: 'portrait',
  globalAgeGroup: 'Adult',
  interviewTimerSeconds: 30,
  numPlayers: 3,
  roundsPerPlayer: 5,
  targetGameTimeMin: 30,
  drinkVolumeMl: 20,
  drinkType: 'soft',
  unlockLevel3: false,
  boundaries: {
    noPhoneCalls: true,
    noTexting: true,
    noSocialMedia: true,
    noPrivacyInvasions: true,
    noTouching: true,
    noClothingRemoval: true,
    noGrossFood: true,
    indoorOnly: true,
    noExes: true,
    keepDaresClean: true,
    keepTruthsClean: true,
  }
};

const initialModifiers = {
  chooseNextVictim: false,
  blockSkip: false,
  truthSerum: false,
  forceSip: false,
  dareDevil: false,
  kingQueen: false,
  unholyUnion: false,
  kissRoulette: false,
  muteButton: 0,
  selectNextTruthSpice: false,
  roomRoast: false,
  vowOfSilence: 0,
  tRex: 0,
  blindLuck: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'LAUNCH',
      settings: defaultSettings,
      players: [],
      globalSipsRemaining: 0,
      turnPacingMs: 0,
      sipVolumeMl: 0,
      debugLogs: [],
      tasks: {
        truthLevel1: [],
        truthLevel2: [],
        truthLevel3: [],
        dareLevel1: [],
        dareLevel2: [],
        dareLevel3: [],
      },
      currentTurn: {
        activePlayerId: null,
        targetPlayerId: null,
        modifiers: initialModifiers,
        isChaosDuel: false,
      },

      setPhase: (phase) => set({ phase }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addPlayer: (player) => set((state) => ({
        players: [...state.players, player]
      })),

      updatePlayer: (id, updates) => set((state) => ({
        players: state.players.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      initGame: (allTasks: Task[]) => {
        const state = get();
        // Sips logic: (Number of Players) * (Rounds per Player) * 2
        const sips = state.settings.numPlayers * state.settings.roundsPerPlayer * 2;
        // Pacing logic: Target Game Time (Min) * 60 / (Number of Players * Rounds per Player)
        const pacing = (state.settings.targetGameTimeMin * 60) / (state.settings.numPlayers * state.settings.roundsPerPlayer) * 1000;

        // Phase 1: THE PURGE & THE DEALER
        const bounds = state.settings.boundaries;

        const safeTasks = allTasks.filter(t => {
          const barrier = t.tags.barrier;
          if (!barrier) return true; // Safe if no barrier tag

          // If the barrier string includes a rule that is flagged as TRUE (banned) in settings, destroy it
          if (bounds.noPhoneCalls && barrier.includes('noPhoneCalls')) return false;
          if (bounds.noTexting && barrier.includes('noTexting')) return false;
          if (bounds.noSocialMedia && barrier.includes('noSocialMedia')) return false;
          if (bounds.noPrivacyInvasions && barrier.includes('noPrivacyInvasions')) return false;
          if (bounds.noTouching && barrier.includes('noTouching')) return false;
          if (bounds.noClothingRemoval && barrier.includes('noClothingRemoval')) return false;
          if (bounds.noGrossFood && barrier.includes('noGrossFood')) return false;
          if (bounds.indoorOnly && barrier.includes('indoorOnly')) return false;
          if (bounds.noExes && barrier.includes('noExes')) return false;

          return true;
        });

        const truthLevel1 = safeTasks.filter(t => t.tags.type?.includes('truth') && t.tags.level === 'Level-1');
        const truthLevel2 = safeTasks.filter(t => t.tags.type?.includes('truth') && t.tags.level === 'Level-2');
        const truthLevel3 = safeTasks.filter(t => t.tags.type?.includes('truth') && t.tags.level === 'Level-3');
        const dareLevel1 = safeTasks.filter(t => t.tags.type?.includes('dare') && t.tags.level === 'Level-1');
        const dareLevel2 = safeTasks.filter(t => t.tags.type?.includes('dare') && t.tags.level === 'Level-2');
        const dareLevel3 = safeTasks.filter(t => t.tags.type?.includes('dare') && t.tags.level === 'Level-3');

        // THE SHUFFLE helper
        const shuffle = (array: Task[]) => [...array].sort(() => Math.random() - 0.5);

        set({
          globalSipsRemaining: sips,
          turnPacingMs: pacing,
          sipVolumeMl: state.settings.drinkVolumeMl,
          tasks: {
            truthLevel1: shuffle(truthLevel1),
            truthLevel2: shuffle(truthLevel2),
            truthLevel3: shuffle(truthLevel3),
            dareLevel1: shuffle(dareLevel1),
            dareLevel2: shuffle(dareLevel2),
            dareLevel3: shuffle(dareLevel3),
          },
          phase: 'GAME_LOOP',
        });
      },

      decrementSips: (amount) => set((state) => {
        const newSips = state.globalSipsRemaining - amount;
        return {
          globalSipsRemaining: newSips,
          phase: newSips <= 0 ? 'GAME_OVER' : state.phase
        };
      }),

      addDebugLog: (message: string) => set((state) => ({
        debugLogs: [{ id: Math.random().toString(36).substring(7), timestamp: Date.now(), message }, ...state.debugLogs].slice(0, 50)
      })),

      resetGame: () => set({
        phase: 'HOST_DASHBOARD',
        players: [],
        globalSipsRemaining: 0,
        debugLogs: [],
        currentTurn: {
          activePlayerId: null,
          targetPlayerId: null,
          modifiers: initialModifiers,
          isChaosDuel: false,
        }
      })
    }),
    {
      name: 'truth-or-dare-or-sip-storage',
    }
  )
);
