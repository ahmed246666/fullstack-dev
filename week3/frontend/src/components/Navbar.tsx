'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.75rem'
        }}
      >
        {/* Brand & Program Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              AZM Squad Full-Stack
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Week 3 · Next.js + Express
            </div>
          </div>
        </div>

        {/* Right Section: Status Indicator */}
        <div>
          <StatusBadge />
        </div>
      </div>
    </header>
  );
}
