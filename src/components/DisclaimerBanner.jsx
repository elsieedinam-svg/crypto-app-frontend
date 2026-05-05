import { useState } from 'react';

const DisclaimerBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Student project disclaimer"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #1a1060 0%, #0d2a6b 50%, #0a2248 100%)',
        borderBottom: '1px solid rgba(59,77,224,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '9px 16px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Warning icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          fill="#FBBF24"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke="#1a1060" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="#1a1060" />
      </svg>

      <p
        style={{
          margin: 0,
          color: '#CBD5E1',
          fontSize: '0.8125rem',
          lineHeight: '1.4',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#FBBF24', fontWeight: 600 }}>Student Project — </span>
        This site is built for educational purposes only and is{' '}
        <strong style={{ color: '#fff' }}>not affiliated with, endorsed by, or associated with Coinbase</strong>.
        {' '}Do not enter real personal or financial information.
      </p>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss disclaimer"
        style={{
          flexShrink: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          marginLeft: '4px',
          borderRadius: '4px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default DisclaimerBanner;
