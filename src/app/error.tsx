'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        An unexpected error occurred.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: '#222',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Try again
      </button>
    </div>
  );
}
