import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DietPlanner from './DietPlanner';

describe('DietPlanner', () => {
  it('renders Diet planner placeholder content', () => {
    render(<DietPlanner />);
    expect(screen.getByText(/Diet planner/i)).toBeInTheDocument();
  });
});
