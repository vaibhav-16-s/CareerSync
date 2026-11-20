import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ApplicationStatusBadge,
  MatchScoreBadge,
} from '@/components/shared/status-badge';
import { ApplicationStatus } from '@/types';

describe('ApplicationStatusBadge', () => {
  it('renders the human label for a status', () => {
    render(<ApplicationStatusBadge status={ApplicationStatus.SHORTLISTED} />);
    expect(screen.getByText('Shortlisted')).toBeInTheDocument();
  });

  it('renders Hired with success styling token', () => {
    render(<ApplicationStatusBadge status={ApplicationStatus.HIRED} />);
    const el = screen.getByText('Hired');
    expect(el.className).toContain('green');
  });
});

describe('MatchScoreBadge', () => {
  it('rounds and labels the score', () => {
    render(<MatchScoreBadge score={82.4} />);
    expect(screen.getByText('82% match')).toBeInTheDocument();
  });
});
