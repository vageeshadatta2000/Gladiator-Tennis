import { SetScore, MatchResult } from '@/types';

// Valid regular set scores (without tiebreak)
// A set is won when a player wins 6 games with at least 2 games advantage
// Or wins 7-5 or 7-6 (tiebreak)
export function isValidSetScore(set: SetScore): { valid: boolean; error?: string } {
  const { playerGames, opponentGames, tiebreak } = set;

  // Games must be non-negative integers
  if (playerGames < 0 || opponentGames < 0) {
    return { valid: false, error: 'Games cannot be negative' };
  }

  if (!Number.isInteger(playerGames) || !Number.isInteger(opponentGames)) {
    return { valid: false, error: 'Games must be whole numbers' };
  }

  // Check for valid winning scores
  const higher = Math.max(playerGames, opponentGames);
  const lower = Math.min(playerGames, opponentGames);

  // 6-0, 6-1, 6-2, 6-3, 6-4 (winner has 6, loser has 0-4)
  if (higher === 6 && lower <= 4) {
    return { valid: true };
  }

  // 7-5 (winner has 7, loser has exactly 5)
  if (higher === 7 && lower === 5) {
    return { valid: true };
  }

  // 7-6 tiebreak (must have tiebreak scores)
  if (higher === 7 && lower === 6) {
    if (!tiebreak) {
      return { valid: false, error: 'Tiebreak score required for 7-6 sets' };
    }

    // Validate tiebreak: win by 2, first to 7 (or more)
    const tbHigher = Math.max(tiebreak.playerPoints, tiebreak.opponentPoints);
    const tbLower = Math.min(tiebreak.playerPoints, tiebreak.opponentPoints);

    if (tbHigher < 7) {
      return { valid: false, error: 'Tiebreak winner must have at least 7 points' };
    }

    if (tbHigher - tbLower < 2) {
      return { valid: false, error: 'Tiebreak must be won by 2 points' };
    }

    // Ensure tiebreak winner matches set winner
    const playerWonSet = playerGames === 7;
    const playerWonTiebreak = tiebreak.playerPoints > tiebreak.opponentPoints;

    if (playerWonSet !== playerWonTiebreak) {
      return { valid: false, error: 'Tiebreak winner must match set winner' };
    }

    return { valid: true };
  }

  return {
    valid: false,
    error: `Invalid set score: ${playerGames}-${opponentGames}. Valid scores: 6-0 to 6-4, 7-5, or 7-6 with tiebreak`,
  };
}

// Validate all sets and determine match winner
export function validateMatchSets(sets: SetScore[]): {
  valid: boolean;
  result?: MatchResult;
  error?: string;
} {
  if (sets.length < 2 || sets.length > 3) {
    return { valid: false, error: 'Match must have 2 or 3 sets' };
  }

  // Validate each set
  for (let i = 0; i < sets.length; i++) {
    const validation = isValidSetScore(sets[i]);
    if (!validation.valid) {
      return { valid: false, error: `Set ${i + 1}: ${validation.error}` };
    }
  }

  // Count sets won
  let playerSetsWon = 0;
  let opponentSetsWon = 0;

  for (const set of sets) {
    if (set.playerGames > set.opponentGames) {
      playerSetsWon++;
    } else {
      opponentSetsWon++;
    }
  }

  // Best of 3: first to 2 sets wins
  if (playerSetsWon === 2) {
    // If player won 2-0, should only have 2 sets
    if (opponentSetsWon === 0 && sets.length !== 2) {
      return { valid: false, error: 'Match ended 2-0, should only have 2 sets' };
    }
    return { valid: true, result: 'won' };
  }

  if (opponentSetsWon === 2) {
    // If opponent won 2-0, should only have 2 sets
    if (playerSetsWon === 0 && sets.length !== 2) {
      return { valid: false, error: 'Match ended 0-2, should only have 2 sets' };
    }
    return { valid: true, result: 'lost' };
  }

  return { valid: false, error: 'Match must have a winner (best of 3 sets)' };
}

// Format set score for display
export function formatSetScore(set: SetScore): string {
  const base = `${set.playerGames}-${set.opponentGames}`;
  if (set.tiebreak) {
    const tbLoser = Math.min(set.tiebreak.playerPoints, set.tiebreak.opponentPoints);
    return `${base}(${tbLoser})`;
  }
  return base;
}

// Format full match score
export function formatMatchScore(sets: SetScore[]): string {
  return sets.map(formatSetScore).join(', ');
}
