import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--danger-border)',
        backgroundColor: 'var(--danger-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        gap: '0.75rem',
        maxWidth: '520px',
        margin: '1rem auto'
      }}
    >
      <div
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger)'
        }}
      >
        <AlertTriangle size={20} />
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--danger)' }}>
        Unable to Load Data
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '400px', lineHeight: 1.5 }}>
        {message || 'The Express backend server on port 5000 is not reachable.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
          style={{ marginTop: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
