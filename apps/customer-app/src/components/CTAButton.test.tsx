import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CTAButton from './CTAButton';

describe('CTAButton', () => {
  it('renders label', () => {
    render(<CTAButton label="Add to cart" />);
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<CTAButton label="Submit" onClick={onClick} />);
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
