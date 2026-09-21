/**
 * Centralized logging utility.
 * Only outputs in development — silent in production.
 * Replace all raw console.log/warn calls with logger.debug/warn.
 * Keep console.error → logger.error (always logs, even in production).
 */

const isDev =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    if (isDev) console.log(...args);
  },
  info: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    if (isDev) console.info(...args);
  },
  warn: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};
