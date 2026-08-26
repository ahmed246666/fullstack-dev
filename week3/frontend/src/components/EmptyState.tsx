import React from 'react';
import { Inbox, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  isSearchActive?: boolean;
  onClearSearch?: () => void;
}

export default function EmptyState({
  title = 'No Items Found',
  description = 'Your database is currently empty. Create your first item to get started.',
  isSearchActive = false,
  onClearSearch
}: EmptyStateProps) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        gap: '0.75rem',
        borderStyle: 'dashed',
        borderColor: 'var(--border-strong)',
        backgroundColor: 'transparent'
      }}
    >
      <div
        style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}
      >
        {isSearchActive ? <SearchX size={22} /> : <Inbox size={22} />}
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {isSearchActive ? 'No Matching Results' : title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: '360px' }}>
          {isSearchActive
            ? 'No items match your active search filters. Try clearing the query.'
            : description}
        </p>
      </div>

      {isSearchActive && onClearSearch && (
        <button onClick={onClearSearch} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
          Clear Filter
        </button>
      )}
    </div>
  );
}
