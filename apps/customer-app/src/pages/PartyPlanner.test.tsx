import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PartyPlanner from './PartyPlanner';

describe('PartyPlanner', () => {
  it('renders Party planner placeholder content', () => {
    render(<PartyPlanner />);
    expect(screen.getByText(/Party planner/i)).toBeInTheDocument();
  });
});
