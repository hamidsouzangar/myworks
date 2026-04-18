import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Task, GameSettings } from '../types';

const defaultSettings: GameSettings = {
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
  truthSerum: false,
  dareDevil: false,
  blindLuck: false,
  blockSkip: false,
  unholyUnion: false,
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
        // We will implement full boundary filtering later, for now we filter and route
        const safeTasks = allTasks.filter(t => {
          // Simple mock logic for purge based on boundaries
          if (state.settings.boundaries.noPhoneCalls && t.content.toLowerCase().includes('phone')) return false;
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

      resetGame: () => set({
        phase: 'HOST_DASHBOARD',
        players: [],
        globalSipsRemaining: 0,
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
