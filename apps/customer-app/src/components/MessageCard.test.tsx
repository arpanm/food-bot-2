import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageCard from './MessageCard';

describe('MessageCard', () => {
  it('renders title and body', () => {
    render(<MessageCard title="Biryani House" body="North Indian cuisine" />);
    expect(screen.getByText('Biryani House')).toBeInTheDocument();
    expect(screen.getByText('North Indian cuisine')).toBeInTheDocument();
  });

  it('renders attributes', () => {
    render(
      <MessageCard
        title="Dish"
        attributes={[
          { label: 'Price', value: '₹250' },
          { label: 'Rating', value: '4.5' },
        ]}
      />
    );
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('₹250')).toBeInTheDocument();
  });
});
