import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import Layout from './Layout';

function TestChild() {
  return <div>Child content</div>;
}

describe('Layout', () => {
  it('renders header and nav links', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TestChild />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Food Bot – Customer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByText(/Child content/)).toBeInTheDocument();
  });
});
