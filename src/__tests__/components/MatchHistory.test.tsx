import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Match } from '@/types';

// Mock the mock-data module
const mockGetStoredMatches = jest.fn();
const mockSimulateApiCall = jest.fn();

jest.mock('@/lib/mock-data', () => ({
  getStoredMatches: () => mockGetStoredMatches(),
  simulateApiCall: (data: any, delay?: number) => mockSimulateApiCall(data, delay),
  STORAGE_KEYS: { MATCHES: 'gladiator_matches' },
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...htmlProps } = props;
        return <div ref={ref} {...htmlProps}>{children}</div>;
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return React.forwardRef(({ children, href }: { children: React.ReactNode; href: string }, ref: any) => (
    <a href={href} ref={ref}>{children}</a>
  ));
});

// Import after mocks
import { MatchHistory } from '@/components/MatchHistory';

const mockMatch: Match = {
  id: 'test-123',
  date: '2024-01-15',
  opponent: {
    name: 'Test Opponent',
    email: 'test@example.com',
    isGladiatorPlayer: false,
    inviteStatus: 'invited',
  },
  surface: 'hard',
  matchType: 'casual',
  sets: [
    { playerGames: 6, opponentGames: 4 },
    { playerGames: 6, opponentGames: 3 },
  ],
  result: 'won',
  createdAt: '2024-01-15T10:00:00Z',
};

const mockLostMatch: Match = {
  id: 'test-456',
  date: '2024-01-14',
  opponent: {
    name: 'Another Opponent',
    email: 'another@example.com',
    isGladiatorPlayer: false,
    inviteStatus: 'accepted',
  },
  surface: 'clay',
  matchType: 'competitive',
  sets: [
    { playerGames: 4, opponentGames: 6 },
    { playerGames: 3, opponentGames: 6 },
  ],
  result: 'lost',
  createdAt: '2024-01-14T10:00:00Z',
};

describe('MatchHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading skeletons initially', () => {
      mockGetStoredMatches.mockReturnValue([]);
      mockSimulateApiCall.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<MatchHistory />);

      // Check for skeleton loading elements
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no matches exist', async () => {
      mockGetStoredMatches.mockReturnValue([]);
      mockSimulateApiCall.mockResolvedValue([]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText(/no matches yet/i)).toBeInTheDocument();
      });
    });

    it('should show call-to-action button in empty state', async () => {
      mockGetStoredMatches.mockReturnValue([]);
      mockSimulateApiCall.mockResolvedValue([]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log your first match/i })).toBeInTheDocument();
      });
    });
  });

  describe('Match List', () => {
    it('should display matches after loading', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Test Opponent')).toBeInTheDocument();
      });
    });

    it('should display match score', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('6-4, 6-3')).toBeInTheDocument();
      });
    });

    it('should display won badge for won matches', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Won')).toBeInTheDocument();
      });
    });

    it('should display lost badge for lost matches', async () => {
      mockGetStoredMatches.mockReturnValue([mockLostMatch]);
      mockSimulateApiCall.mockResolvedValue([mockLostMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Lost')).toBeInTheDocument();
      });
    });

    it('should display surface type', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Hard')).toBeInTheDocument();
      });
    });

    it('should display match type', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Casual')).toBeInTheDocument();
      });
    });

    it('should display pending badge for invited opponents', async () => {
      mockGetStoredMatches.mockReturnValue([mockMatch]);
      mockSimulateApiCall.mockResolvedValue([mockMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Pending')).toBeInTheDocument();
      });
    });

    it('should display confirmed badge for accepted opponents', async () => {
      mockGetStoredMatches.mockReturnValue([mockLostMatch]);
      mockSimulateApiCall.mockResolvedValue([mockLostMatch]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Confirmed')).toBeInTheDocument();
      });
    });
  });

  describe('Stats Summary', () => {
    it('should display total matches count', async () => {
      const matches = [mockMatch, mockLostMatch];
      mockGetStoredMatches.mockReturnValue(matches);
      mockSimulateApiCall.mockResolvedValue(matches);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Total Matches')).toBeInTheDocument();
      });
    });

    it('should display wins count', async () => {
      const matches = [mockMatch, mockLostMatch];
      mockGetStoredMatches.mockReturnValue(matches);
      mockSimulateApiCall.mockResolvedValue(matches);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Wins')).toBeInTheDocument();
      });
    });

    it('should display losses count', async () => {
      const matches = [mockMatch, mockLostMatch];
      mockGetStoredMatches.mockReturnValue(matches);
      mockSimulateApiCall.mockResolvedValue(matches);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText('Losses')).toBeInTheDocument();
      });
    });
  });

  describe('Match Notes', () => {
    it('should display notes if present', async () => {
      const matchWithNotes: Match = {
        ...mockMatch,
        notes: 'Great game, very close!',
      };
      mockGetStoredMatches.mockReturnValue([matchWithNotes]);
      mockSimulateApiCall.mockResolvedValue([matchWithNotes]);

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText(/"Great game, very close!"/)).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('should show error state when loading fails', async () => {
      mockGetStoredMatches.mockReturnValue([]);
      mockSimulateApiCall.mockRejectedValue(new Error('Network error'));

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByText(/error loading matches/i)).toBeInTheDocument();
      });
    });

    it('should show try again button on error', async () => {
      mockGetStoredMatches.mockReturnValue([]);
      mockSimulateApiCall.mockRejectedValue(new Error('Network error'));

      render(<MatchHistory />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });
  });
});
