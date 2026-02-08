import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpponentStep } from '@/components/match-form/OpponentStep';
import { MatchFormProvider } from '@/context/MatchFormContext';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => {
        // Filter out framer-motion specific props
        const { initial, animate, exit, transition, whileHover, whileTap, ...htmlProps } = props;
        return <div ref={ref} {...htmlProps}>{children}</div>;
      }),
      p: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, ...htmlProps } = props;
        return <p ref={ref} {...htmlProps}>{children}</p>;
      }),
      button: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...htmlProps } = props;
        return <button ref={ref} {...htmlProps}>{children}</button>;
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

const renderWithProvider = (component: React.ReactNode) => {
  return render(<MatchFormProvider>{component}</MatchFormProvider>);
};

describe('OpponentStep Component', () => {
  it('should render opponent name input', () => {
    renderWithProvider(<OpponentStep />);
    expect(screen.getByPlaceholderText(/search or enter opponent name/i)).toBeInTheDocument();
  });

  it('should render opponent email input', () => {
    renderWithProvider(<OpponentStep />);
    expect(screen.getByPlaceholderText(/opponent@email.com/i)).toBeInTheDocument();
  });

  it('should render continue button', () => {
    renderWithProvider(<OpponentStep />);
    expect(screen.getByRole('button', { name: /continue to match details/i })).toBeInTheDocument();
  });

  it('should show validation error for empty name', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const continueButton = screen.getByRole('button', { name: /continue to match details/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/opponent name is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const nameInput = screen.getByPlaceholderText(/search or enter opponent name/i);
    await user.type(nameInput, 'Test Opponent');

    const continueButton = screen.getByRole('button', { name: /continue to match details/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const nameInput = screen.getByPlaceholderText(/search or enter opponent name/i);
    const emailInput = screen.getByPlaceholderText(/opponent@email.com/i);

    await user.type(nameInput, 'Test Opponent');
    await user.type(emailInput, 'invalid-email');

    const continueButton = screen.getByRole('button', { name: /continue to match details/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should allow input of opponent name', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const nameInput = screen.getByPlaceholderText(/search or enter opponent name/i);
    await user.type(nameInput, 'John Doe');

    expect(nameInput).toHaveValue('John Doe');
  });

  it('should allow input of opponent email', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const emailInput = screen.getByPlaceholderText(/opponent@email.com/i);
    await user.type(emailInput, 'john@example.com');

    expect(emailInput).toHaveValue('john@example.com');
  });

  it('should have proper form labels', () => {
    renderWithProvider(<OpponentStep />);

    expect(screen.getByText(/opponent name/i)).toBeInTheDocument();
    expect(screen.getByText(/opponent email/i)).toBeInTheDocument();
  });

  it('should accept valid form submission', async () => {
    const user = userEvent.setup();
    renderWithProvider(<OpponentStep />);

    const nameInput = screen.getByPlaceholderText(/search or enter opponent name/i);
    const emailInput = screen.getByPlaceholderText(/opponent@email.com/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');

    // Both fields should have values
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');

    // No validation errors should be present
    expect(screen.queryByText(/opponent name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
  });
});
