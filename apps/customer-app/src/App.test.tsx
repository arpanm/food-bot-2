import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders customer app with layout and nav (Chat, Order, Party, Diet)', () => {
    render(<App />);
    expect(screen.getByText(/Food Bot – Customer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /order/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /party planner/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /diet planner/i })).toBeInTheDocument();
  });
});
