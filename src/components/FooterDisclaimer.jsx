const FooterDisclaimer = () => (
  <div
    role="contentinfo"
    aria-label="Demo project disclaimer"
    style={{
      width: '100%',
      background: '#0a0c10',
      borderTop: '1px solid rgba(59,77,224,0.25)',
      padding: '18px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'Inter, sans-serif',
    }}
  >
    {/* Icon row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#3B4DE0" opacity="0.2" />
        <circle cx="12" cy="12" r="10" stroke="#3B4DE0" strokeWidth="1.5" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="#3B4DE0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="#3B4DE0" />
      </svg>
      <span style={{ color: '#3B4DE0', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Demo Project Disclaimer
      </span>
    </div>

    {/* Main text */}
    <p style={{ margin: 0, textAlign: 'center', color: '#64748B', fontSize: '0.75rem', lineHeight: '1.6', maxWidth: '700px' }}>
      This is a <strong style={{ color: '#94A3B8' }}>student demo project</strong> created for educational purposes.
      It is <strong style={{ color: '#94A3B8' }}>not affiliated with, sponsored by, or endorsed by Coinbase</strong> or any other financial institution.
      {' '}<span style={{ color: '#EF4444', fontWeight: 600 }}>Do not enter real personal information, passwords, financial data, or payment details.</span>
      {' '}All data submitted is for demonstration only.
    </p>
  </div>
);

export default FooterDisclaimer;
