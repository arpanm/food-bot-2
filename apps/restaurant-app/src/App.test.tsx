import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders restaurant app with Dashboard, Menu, Orders, Analytics tabs', () => {
    render(<App />);
    expect(screen.getByText(/Food Bot – Restaurant/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument();
  });

  it('Dashboard tab shows summary cards (orders, revenue, pending)', () => {
    render(<App />);
    expect(screen.getByText(/Orders today/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenue today/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending orders/i)).toBeInTheDocument();
  });

  it('Menu tab shows list with name, category, price, available', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText(/Chicken Biryani/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Main/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/₹250/)).toBeInTheDocument();
  });

  it('Orders tab shows list with id, items, status, time', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /orders/i }));
    expect(screen.getByText(/ord-101/i)).toBeInTheDocument();
    expect(screen.getByText(/preparing/i)).toBeInTheDocument();
  });

  it('Analytics tab shows placeholder/chart', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /analytics/i }));
    expect(screen.getByText(/Revenue and popular items.*coming soon/i)).toBeInTheDocument();
  });
});
