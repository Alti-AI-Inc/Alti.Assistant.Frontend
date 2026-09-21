import { afterEach, describe, expect, it, vi } from 'vitest';

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe('logger.debug', () => {
    it('does not call console.log in production', async () => {
      process.env.NODE_ENV = 'production';
      vi.resetModules();

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { logger } = await import('../logger');

      logger.debug('test production message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('calls console.log in development', async () => {
      process.env.NODE_ENV = 'development';
      vi.resetModules();

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { logger } = await import('../logger');

      logger.debug('test development message');
      expect(consoleSpy).toHaveBeenCalledWith('test development message');
    });
  });
});
