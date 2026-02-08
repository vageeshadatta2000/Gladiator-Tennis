// Opponent invite status as specified by recruiter feedback
export type InviteStatus = 'invited' | 'accepted';

// Match result from perspective of the reporting player
export type MatchResult = 'won' | 'lost';

// Tennis surfaces
export type Surface = 'hard' | 'clay' | 'grass' | 'indoor';

// Match types
export type MatchType = 'casual' | 'competitive' | 'league' | 'tournament';

// A single set score
export interface SetScore {
  playerGames: number;
  opponentGames: number;
  tiebreak?: {
    playerPoints: number;
    opponentPoints: number;
  };
}

// Opponent data - can be existing Gladiator player or new invite
export interface Opponent {
  id?: string; // Only exists if they're an existing Gladiator player
  name: string;
  email: string;
  isGladiatorPlayer: boolean;
  inviteStatus?: InviteStatus;
}

// Complete match record
export interface Match {
  id: string;
  date: string; // ISO date string
  opponent: Opponent;
  surface: Surface;
  matchType: MatchType;
  sets: SetScore[];
  result: MatchResult;
  notes?: string;
  createdAt: string; // ISO timestamp
}

// Form state for multi-step form
export interface MatchFormData {
  // Step 1: Opponent info
  opponentName: string;
  opponentEmail: string;

  // Step 2: Match details
  date: string;
  surface: Surface;
  matchType: MatchType;

  // Step 3: Scores
  sets: SetScore[];
  result: MatchResult;

  // Optional
  notes?: string;
}

// Mock player for opponent search
export interface MockPlayer {
  id: string;
  name: string;
  email: string;
  rating: number;
}
