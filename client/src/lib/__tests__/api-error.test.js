import { describe, it, expect } from 'vitest';
import { normalizeError, getErrorMessage } from '@/lib/api-error';

describe('normalizeError', () => {
  it('extracts code/message from the backend envelope', () => {
    const axiosErr = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          success: false,
          error: { code: 'UNPROCESSABLE', message: 'Already applied' },
        },
      },
    };
    const result = normalizeError(axiosErr);
    expect(result).toMatchObject({
      code: 'UNPROCESSABLE',
      message: 'Already applied',
      status: 422,
    });
  });

  it('handles network failures', () => {
    const result = normalizeError({ isAxiosError: true, code: 'ERR_NETWORK' });
    expect(result.code).toBe('NETWORK');
    expect(result.status).toBe(0);
  });

  it('falls back for plain errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('weird')).toBe('Unexpected error');
  });
});
