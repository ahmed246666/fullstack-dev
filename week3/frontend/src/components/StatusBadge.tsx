'use client';

import React, { useEffect, useState } from 'react';
import { checkBackendHealth } from '../lib/api';

export default function StatusBadge() {
  const [online, setOnline] = useState<boolean | null>(null);

  const verifyHealth = async () => {
    const health = await checkBackendHealth();
    setOnline(!!health);
  };

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (online === null) {
    return (
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Checking status...
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.6rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: online ? 'var(--success-bg)' : 'var(--danger-bg)',
        color: online ? 'var(--success)' : 'var(--danger)',
        border: `1px solid ${online ? 'var(--success-border)' : 'var(--danger-border)'}`
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: online ? 'var(--success)' : 'var(--danger)'
        }}
      />
      {online ? 'API Connected (5000)' : 'API Offline'}
    </span>
  );
}
