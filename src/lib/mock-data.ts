import { MockPlayer, Match } from '@/types';

// Mock existing Gladiator Tennis players for opponent search
export const mockPlayers: MockPlayer[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex.thompson@email.com', rating: 4.5 },
  { id: '2', name: 'Jordan Martinez', email: 'jordan.m@email.com', rating: 4.0 },
  { id: '3', name: 'Sam Wilson', email: 'sam.wilson@email.com', rating: 3.5 },
  { id: '4', name: 'Taylor Chen', email: 'taylor.chen@email.com', rating: 5.0 },
  { id: '5', name: 'Morgan Lee', email: 'morgan.lee@email.com', rating: 4.2 },
  { id: '6', name: 'Casey Brown', email: 'casey.b@email.com', rating: 3.8 },
  { id: '7', name: 'Riley Johnson', email: 'riley.j@email.com', rating: 4.7 },
  { id: '8', name: 'Jamie Garcia', email: 'jamie.garcia@email.com', rating: 3.2 },
];

// Search mock players by name or email
export function searchPlayers(query: string): MockPlayer[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return mockPlayers.filter(
    player =>
      player.name.toLowerCase().includes(lowerQuery) ||
      player.email.toLowerCase().includes(lowerQuery)
  );
}

// Simulate async API call with delay
export async function simulateApiCall<T>(data: T, delayMs = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

// Simulate API call that can fail (for testing error states)
export async function simulateApiCallWithError<T>(
  data: T,
  shouldFail = false,
  delayMs = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network error. Please try again.'));
      } else {
        resolve(data);
      }
    }, delayMs);
  });
}

// LocalStorage keys
export const STORAGE_KEYS = {
  MATCHES: 'gladiator_matches',
} as const;

// Get matches from localStorage
export function getStoredMatches(): Match[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save matches to localStorage
export function saveMatches(matches: Match[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

// Add a new match
export function addMatch(match: Match): void {
  const matches = getStoredMatches();
  matches.unshift(match); // Add to beginning (most recent first)
  saveMatches(matches);
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
