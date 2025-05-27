export enum GamePhase {
  SETUP = "SETUP",
  PLAYING = "PLAYING",
  EVENT_RESOLUTION = "EVENT_RESOLUTION",
  GAME_OVER = "GAME_OVER",
}

export enum SpaceType {
  START = "START",
  PAYDAY = "PAYDAY",
  LIFE_EVENT = "LIFE_EVENT",
  GET_MONEY = "GET_MONEY",
  LOSE_MONEY = "LOSE_MONEY",
  ACTION_CHOICE = "ACTION_CHOICE", // Similar to LIFE_EVENT but might be more choice-driven from board
  STOP_SPACE = "STOP_SPACE", // Generic stop space, action determined by payload
  END = "END",
  EMPTY = "EMPTY", // A simple pass-through space
}

export interface PlayerColorSet {
  token: string; // e.g. 'bg-red-500'
  text: string;  // e.g. 'text-red-700'
  border: string; // e.g. 'border-red-700'
  name: string; // e.g. 'Red'
}

export interface Player {
  id: string;
  name: string;
  colorSet: PlayerColorSet;
  money: number;
  position: number; // Index on the boardSpaces array
  isRetired: boolean;
  missNextTurn: boolean;
  isCPU: boolean; // Identifies if the player is CPU controlled
  isDelegatedThisTurn?: boolean; // True if a human player has delegated this turn to CPU
}

export interface BoardSpace {
  id: number;
  type: SpaceType;
  description: string;
  color: string; // Tailwind bg color class for the space tile
  isStopSpace?: boolean;
  actionPayload?: {
    amount?: number; // For money changes (positive for gain, negative for loss)
    eventKey?: string; // Key to look up LifeEventData
    choices?: LifeEventOption[]; // Direct choices on the space
  };
}

export interface LifeEventOption {
  text: string;
  // effect returns partial player updates and a result message
  effect: (currentPlayer: Player, allPlayers: Player[]) => { playerUpdate: Partial<Player>; message: string, followUpEventKey?: string };
}

export interface LifeEventData {
  key: string;
  title: string;
  description: string;
  options?: LifeEventOption[]; // For events with choices
  // effect is for events with no choices, or a default outcome
  effect?: (currentPlayer: Player, allPlayers: Player[]) => { playerUpdate: Partial<Player>; message: string, followUpEventKey?: string };
}

export interface ActiveModalEvent {
  type: 'life_event' | 'action_choice';
  data: LifeEventData;
  messageLog?: string[]; // To show results of choices
}