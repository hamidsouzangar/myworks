export type Phase = 'LAUNCH' | 'HOST_DASHBOARD' | 'STEALTH_INTERVIEW' | 'GAME_LOOP' | 'GAME_OVER';

export interface Player {
  id: string;
  realName?: string;
  funnyName: string;
  archetype: string;
  gender: string;
  ageGroup: string;
  hasPartnerInGame: boolean;
  tags: string[]; // e.g., 'p:instigator'
  sipsTaken: number;
  truthsDone: number;
  daresDone: number;
  strictSips: number;
  activeModifiers: string[];
}

export interface GameSettings {
  deviceLayout: 'portrait' | 'wide';
  globalAgeGroup: 'Kid' | 'Teenager' | 'Adult';
  interviewTimerSeconds: number;
  numPlayers: number;
  roundsPerPlayer: number;
  targetGameTimeMin: number;
  drinkVolumeMl: number;
  drinkType: 'soft' | 'hard';
  unlockLevel3: boolean;
  boundaries: {
    noPhoneCalls: boolean;
    noTexting: boolean;
    noSocialMedia: boolean;
    noPrivacyInvasions: boolean;
    noTouching: boolean;
    noClothingRemoval: boolean;
    noGrossFood: boolean;
    indoorOnly: boolean;
    noExes: boolean;
    keepDaresClean: boolean;
    keepTruthsClean: boolean;
  };
}

export interface TaskTag {
  type?: string;
  barrier?: string;
  level?: string;
  persona?: string;
  [key: string]: any;
}

export interface Task {
  id: string;
  content: string;
  verified: boolean;
  tags: TaskTag;
}

export interface Modifiers {
  chooseNextVictim: boolean;
  blockSkip: boolean;
  truthSerum: boolean;
  forceSip: boolean;
  dareDevil: boolean;
  kingQueen: boolean;
  unholyUnion: boolean;
  kissRoulette: boolean;
  muteButton: number;
  selectNextTruthSpice: boolean;
  roomRoast: boolean;
  vowOfSilence: number;
  tRex: number;
  blindLuck: boolean;
}

export interface EngineLog {
  id: string;
  timestamp: number;
  message: string;
}

export interface GameState {
  phase: Phase;
  settings: GameSettings;
  players: Player[];
  globalSipsRemaining: number;
  turnPacingMs: number;
  sipVolumeMl: number;

  // Game Arrays
  tasks: {
    truthLevel1: Task[];
    truthLevel2: Task[];
    truthLevel3: Task[];
    dareLevel1: Task[];
    dareLevel2: Task[];
    dareLevel3: Task[];
  };

  // Turn State
  currentTurn: {
    activePlayerId: string | null;
    targetPlayerId: string | null;
    modifiers: Modifiers;
    isChaosDuel: boolean;
  };

  debugLogs: EngineLog[];

  // Actions
  setPhase: (phase: Phase) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  initGame: (tasks: Task[]) => void;
  decrementSips: (amount: number) => void;
  resetGame: () => void;
  addDebugLog: (message: string) => void;
}
