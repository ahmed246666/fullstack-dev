'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  itemTitle,
  onClose,
  onConfirm,
  isDeleting = false
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)'
              }}
            >
              <Trash2 size={16} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Delete Item
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{itemTitle}&rdquo;</strong>? This action cannot be undone.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn"
            style={{
              backgroundColor: 'var(--danger)',
              color: '#ffffff',
              borderColor: 'var(--danger)'
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
