import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 0',
        backgroundColor: 'var(--bg-main)',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <strong>Enterprise Full-Stack Program</strong> · Ahmed Osama
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Node.js / Express</span>
          <span>SQLite</span>
          <span>Next.js App Router</span>
          <span>Squad-Kit SDD</span>
        </div>
      </div>
    </footer>
  );
}
