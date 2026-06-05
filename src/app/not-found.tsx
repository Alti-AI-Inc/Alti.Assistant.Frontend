import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Page Not Found
      </p>
      <Link
        href="/"
        style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: '#222',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
