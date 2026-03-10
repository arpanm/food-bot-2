import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders customer app with layout and nav (Chat, Order, Party, Diet)', () => {
    render(<App />);
    expect(screen.getByText(/Food Bot – Customer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /chat/i })).toBeInTheDocument();
    const orderLinks = screen.getAllByRole('link', { name: /order/i });
    expect(orderLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /party planner/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /diet planner/i })).toBeInTheDocument();
  });
});
