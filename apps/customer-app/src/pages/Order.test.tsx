import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Order from './Order';

describe('Order', () => {
  it('renders Order page with search, cart, orders tabs', () => {
    render(<Order />);
    expect(screen.getByText(/Order food/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search restaurants or dishes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^cart$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^orders$/i })).toBeInTheDocument();
  });
});
