import {
  isValidSetScore,
  validateMatchSets,
  formatSetScore,
  formatMatchScore,
} from '@/lib/tennis-validation';
import { SetScore } from '@/types';

describe('Tennis Score Validation', () => {
  describe('isValidSetScore', () => {
    describe('valid regular scores (6-x where x <= 4)', () => {
      it.each([
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [0, 6],
        [1, 6],
        [2, 6],
        [3, 6],
        [4, 6],
      ])('should accept %d-%d as valid', (playerGames, opponentGames) => {
        const result = isValidSetScore({ playerGames, opponentGames });
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    describe('valid 7-5 scores', () => {
      it('should accept 7-5 as valid', () => {
        const result = isValidSetScore({ playerGames: 7, opponentGames: 5 });
        expect(result.valid).toBe(true);
      });

      it('should accept 5-7 as valid', () => {
        const result = isValidSetScore({ playerGames: 5, opponentGames: 7 });
        expect(result.valid).toBe(true);
      });
    });

    describe('valid 7-6 tiebreak scores', () => {
      it('should accept 7-6 with valid tiebreak (7-5)', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 7, opponentPoints: 5 },
        });
        expect(result.valid).toBe(true);
      });

      it('should accept 6-7 with valid tiebreak (5-7)', () => {
        const result = isValidSetScore({
          playerGames: 6,
          opponentGames: 7,
          tiebreak: { playerPoints: 5, opponentPoints: 7 },
        });
        expect(result.valid).toBe(true);
      });

      it('should accept extended tiebreak (10-8)', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 10, opponentPoints: 8 },
        });
        expect(result.valid).toBe(true);
      });

      it('should accept minimum winning tiebreak (7-0)', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 7, opponentPoints: 0 },
        });
        expect(result.valid).toBe(true);
      });
    });

    describe('invalid scores', () => {
      it('should reject negative games', () => {
        const result = isValidSetScore({ playerGames: -1, opponentGames: 6 });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Games cannot be negative');
      });

      it('should reject non-integer games', () => {
        const result = isValidSetScore({ playerGames: 6.5, opponentGames: 4 });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Games must be whole numbers');
      });

      it('should reject 6-5 (no 2-game lead)', () => {
        const result = isValidSetScore({ playerGames: 6, opponentGames: 5 });
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid set score');
      });

      it('should reject 6-6 (should be tiebreak)', () => {
        const result = isValidSetScore({ playerGames: 6, opponentGames: 6 });
        expect(result.valid).toBe(false);
      });

      it('should reject 7-4 (invalid)', () => {
        const result = isValidSetScore({ playerGames: 7, opponentGames: 4 });
        expect(result.valid).toBe(false);
      });

      it('should reject 8-6 (too many games)', () => {
        const result = isValidSetScore({ playerGames: 8, opponentGames: 6 });
        expect(result.valid).toBe(false);
      });

      it('should reject 5-5 (incomplete set)', () => {
        const result = isValidSetScore({ playerGames: 5, opponentGames: 5 });
        expect(result.valid).toBe(false);
      });
    });

    describe('invalid tiebreak scenarios', () => {
      it('should reject 7-6 without tiebreak', () => {
        const result = isValidSetScore({ playerGames: 7, opponentGames: 6 });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Tiebreak score required for 7-6 sets');
      });

      it('should reject tiebreak where winner has less than 7 points', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 6, opponentPoints: 4 },
        });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Tiebreak winner must have at least 7 points');
      });

      it('should reject tiebreak not won by 2 points (7-6)', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 7, opponentPoints: 6 },
        });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Tiebreak must be won by 2 points');
      });

      it('should reject mismatched tiebreak winner', () => {
        const result = isValidSetScore({
          playerGames: 7,
          opponentGames: 6,
          tiebreak: { playerPoints: 5, opponentPoints: 7 }, // opponent won tiebreak but player won set
        });
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Tiebreak winner must match set winner');
      });
    });
  });

  describe('validateMatchSets', () => {
    describe('valid matches', () => {
      it('should validate 2-0 victory (straight sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 6, opponentGames: 3 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(true);
        expect(result.result).toBe('won');
      });

      it('should validate 0-2 loss (straight sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 4, opponentGames: 6 },
          { playerGames: 3, opponentGames: 6 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(true);
        expect(result.result).toBe('lost');
      });

      it('should validate 2-1 victory (three sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 4, opponentGames: 6 },
          { playerGames: 6, opponentGames: 2 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(true);
        expect(result.result).toBe('won');
      });

      it('should validate 1-2 loss (three sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 4, opponentGames: 6 },
          { playerGames: 2, opponentGames: 6 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(true);
        expect(result.result).toBe('lost');
      });

      it('should validate match with tiebreak', () => {
        const sets: SetScore[] = [
          { playerGames: 7, opponentGames: 6, tiebreak: { playerPoints: 7, opponentPoints: 5 } },
          { playerGames: 6, opponentGames: 4 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(true);
        expect(result.result).toBe('won');
      });
    });

    describe('invalid matches', () => {
      it('should reject match with only 1 set', () => {
        const sets: SetScore[] = [{ playerGames: 6, opponentGames: 4 }];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Match must have 2 or 3 sets');
      });

      it('should reject match with 4 sets', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 4, opponentGames: 6 },
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 6, opponentGames: 3 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Match must have 2 or 3 sets');
      });

      it('should reject 3-0 sweep (invalid - match ends at 2 sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 6, opponentGames: 3 },
          { playerGames: 6, opponentGames: 2 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        // 3-0 is invalid because best of 3 ends at 2 sets
      });

      it('should reject 0-3 sweep (invalid - match ends at 2 sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 4, opponentGames: 6 },
          { playerGames: 3, opponentGames: 6 },
          { playerGames: 2, opponentGames: 6 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        // 0-3 is invalid because best of 3 ends at 2 sets
      });

      it('should reject match with invalid set score', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 5 }, // Invalid: no 2-game lead
          { playerGames: 6, opponentGames: 4 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Set 1');
      });

      it('should reject match with no winner (1-1 in sets with only 2 sets)', () => {
        const sets: SetScore[] = [
          { playerGames: 6, opponentGames: 4 },
          { playerGames: 4, opponentGames: 6 },
        ];
        const result = validateMatchSets(sets);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Match must have a winner (best of 3 sets)');
      });
    });
  });

  describe('formatSetScore', () => {
    it('should format regular set score', () => {
      expect(formatSetScore({ playerGames: 6, opponentGames: 4 })).toBe('6-4');
    });

    it('should format 7-5 score', () => {
      expect(formatSetScore({ playerGames: 7, opponentGames: 5 })).toBe('7-5');
    });

    it('should format tiebreak with loser points', () => {
      const set: SetScore = {
        playerGames: 7,
        opponentGames: 6,
        tiebreak: { playerPoints: 7, opponentPoints: 5 },
      };
      expect(formatSetScore(set)).toBe('7-6(5)');
    });

    it('should format extended tiebreak correctly', () => {
      const set: SetScore = {
        playerGames: 6,
        opponentGames: 7,
        tiebreak: { playerPoints: 8, opponentPoints: 10 },
      };
      expect(formatSetScore(set)).toBe('6-7(8)');
    });
  });

  describe('formatMatchScore', () => {
    it('should format 2-set match', () => {
      const sets: SetScore[] = [
        { playerGames: 6, opponentGames: 4 },
        { playerGames: 6, opponentGames: 3 },
      ];
      expect(formatMatchScore(sets)).toBe('6-4, 6-3');
    });

    it('should format 3-set match', () => {
      const sets: SetScore[] = [
        { playerGames: 6, opponentGames: 4 },
        { playerGames: 4, opponentGames: 6 },
        { playerGames: 7, opponentGames: 5 },
      ];
      expect(formatMatchScore(sets)).toBe('6-4, 4-6, 7-5');
    });

    it('should format match with tiebreak', () => {
      const sets: SetScore[] = [
        { playerGames: 7, opponentGames: 6, tiebreak: { playerPoints: 7, opponentPoints: 3 } },
        { playerGames: 6, opponentGames: 4 },
      ];
      expect(formatMatchScore(sets)).toBe('7-6(3), 6-4');
    });
  });
});
