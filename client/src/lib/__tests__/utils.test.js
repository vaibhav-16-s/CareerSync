import { describe, it, expect } from 'vitest';
import {
  isActivePath,
  stipendLabel,
  deadlineState,
  initials,
  truncate,
  asId,
  asObject,
} from '@/lib/utils';

describe('isActivePath', () => {
  const hrefs = [
    '/company/internships',
    '/company/internships/new',
    '/company/dashboard',
  ];

  it('matches exact path', () => {
    expect(isActivePath('/company/dashboard', '/company/dashboard', hrefs)).toBe(true);
  });

  it('matches a section root by prefix', () => {
    expect(isActivePath('/company/internships/123', '/company/internships', hrefs)).toBe(true);
  });

  it('defers to a more specific sibling (the /new bug)', () => {
    // On /company/internships/new, only the "new" item is active, not the index.
    expect(isActivePath('/company/internships/new', '/company/internships', hrefs)).toBe(false);
    expect(isActivePath('/company/internships/new', '/company/internships/new', hrefs)).toBe(true);
  });

  it('never matches the root path as a prefix', () => {
    expect(isActivePath('/anything', '/', hrefs)).toBe(false);
  });
});

describe('stipendLabel', () => {
  it('renders Unpaid for zero/missing', () => {
    expect(stipendLabel(undefined)).toBe('Unpaid');
    expect(stipendLabel({ amount: 0, currency: 'INR', period: 'month' })).toBe('Unpaid');
  });

  it('formats amount with currency and period', () => {
    const label = stipendLabel({ amount: 15000, currency: 'INR', period: 'month' });
    expect(label).toContain('15,000');
    expect(label).toContain('/month');
  });
});

describe('deadlineState', () => {
  it('reports no deadline', () => {
    expect(deadlineState(undefined).label).toBe('No deadline');
  });

  it('flags a passed deadline as closed', () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    const state = deadlineState(past);
    expect(state.passed).toBe(true);
    expect(state.label).toBe('Closed');
  });

  it('marks soon-closing deadlines as urgent', () => {
    const soon = new Date(Date.now() + 2 * 86_400_000).toISOString();
    expect(deadlineState(soon).urgent).toBe(true);
  });
});

describe('string helpers', () => {
  it('builds initials from a name', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
    expect(initials('madonna')).toBe('M');
    expect(initials(undefined)).toBe('?');
  });

  it('truncates long text with an ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
    expect(truncate('short', 50)).toBe('short');
  });
});

describe('populated-field resolvers', () => {
  it('asId reads id from string or populated object', () => {
    expect(asId('abc')).toBe('abc');
    expect(asId({ _id: 'xyz' })).toBe('xyz');
    expect(asId(null)).toBe('');
  });

  it('asObject only returns objects', () => {
    expect(asObject('abc')).toBeUndefined();
    expect(asObject({ _id: 'xyz' })).toEqual({ _id: 'xyz' });
  });
});
