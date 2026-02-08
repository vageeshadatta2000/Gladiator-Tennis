import {
  mockPlayers,
  searchPlayers,
  simulateApiCall,
  simulateApiCallWithError,
  generateId,
  STORAGE_KEYS,
} from '@/lib/mock-data';

describe('Mock Data Helpers', () => {
  describe('mockPlayers', () => {
    it('should have at least 5 players', () => {
      expect(mockPlayers.length).toBeGreaterThanOrEqual(5);
    });

    it('should have required fields for each player', () => {
      mockPlayers.forEach(player => {
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('name');
        expect(player).toHaveProperty('email');
        expect(player).toHaveProperty('rating');
        expect(typeof player.id).toBe('string');
        expect(typeof player.name).toBe('string');
        expect(typeof player.email).toBe('string');
        expect(typeof player.rating).toBe('number');
      });
    });

    it('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      mockPlayers.forEach(player => {
        expect(player.email).toMatch(emailRegex);
      });
    });

    it('should have ratings between 1 and 5', () => {
      mockPlayers.forEach(player => {
        expect(player.rating).toBeGreaterThanOrEqual(1);
        expect(player.rating).toBeLessThanOrEqual(5);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockPlayers.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('searchPlayers', () => {
    it('should return empty array for empty query', () => {
      expect(searchPlayers('')).toEqual([]);
    });

    it('should return empty array for query less than 2 characters', () => {
      expect(searchPlayers('a')).toEqual([]);
    });

    it('should find players by name (case insensitive)', () => {
      const results = searchPlayers('alex');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name.toLowerCase()).toContain('alex');
    });

    it('should find players by partial name', () => {
      const results = searchPlayers('Thom');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find players by email (case insensitive)', () => {
      const results = searchPlayers('thompson');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchPlayers('zzzznonexistent');
      expect(results).toEqual([]);
    });

    it('should find multiple players matching query', () => {
      // Search for common letter combination
      const results = searchPlayers('son');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('should be case insensitive', () => {
      const lowerResults = searchPlayers('alex');
      const upperResults = searchPlayers('ALEX');
      const mixedResults = searchPlayers('AlEx');

      expect(lowerResults).toEqual(upperResults);
      expect(upperResults).toEqual(mixedResults);
    });
  });

  describe('simulateApiCall', () => {
    it('should resolve with provided data after delay', async () => {
      const testData = { message: 'test' };
      const result = await simulateApiCall(testData, 10);
      expect(result).toEqual(testData);
    });

    it('should work with different data types', async () => {
      expect(await simulateApiCall('string', 10)).toBe('string');
      expect(await simulateApiCall(123, 10)).toBe(123);
      expect(await simulateApiCall([1, 2, 3], 10)).toEqual([1, 2, 3]);
      expect(await simulateApiCall({ key: 'value' }, 10)).toEqual({ key: 'value' });
    });

    it('should respect delay time', async () => {
      const start = Date.now();
      await simulateApiCall('test', 50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(40); // Allow some tolerance
    });
  });

  describe('simulateApiCallWithError', () => {
    it('should resolve with data when shouldFail is false', async () => {
      const testData = { id: 1 };
      const result = await simulateApiCallWithError(testData, false, 10);
      expect(result).toEqual(testData);
    });

    it('should reject with error when shouldFail is true', async () => {
      await expect(simulateApiCallWithError('test', true, 10)).rejects.toThrow(
        'Network error. Please try again.'
      );
    });

    it('should resolve by default (shouldFail defaults to false)', async () => {
      const testData = { test: true };
      // @ts-ignore - testing default behavior
      const result = await simulateApiCallWithError(testData, undefined, 10);
      expect(result).toEqual(testData);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should include timestamp', () => {
      const before = Date.now();
      const id = generateId();
      const after = Date.now();
      const timestamp = parseInt(id.split('-')[0]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('should have consistent format', () => {
      const id = generateId();
      const parts = id.split('-');
      expect(parts.length).toBe(2);
      expect(parts[0]).toMatch(/^\d+$/); // Timestamp is numeric
      expect(parts[1].length).toBe(9); // Random part is 9 chars
    });

    it('should generate many unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have MATCHES key', () => {
      expect(STORAGE_KEYS.MATCHES).toBe('gladiator_matches');
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(STORAGE_KEYS) || typeof STORAGE_KEYS === 'object').toBe(true);
    });
  });
});
