'use client';

import React, { useState } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { Item, ItemStatus } from '../types/item';
import { useToast } from '../context/ToastContext';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ItemCardProps {
  item: Item;
  onDelete: (id: number) => Promise<void>;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getStatusBadgeClass = (status: ItemStatus) => {
    switch (status) {
      case 'completed': return 'badge-completed';
      case 'in-progress': return 'badge-in-progress';
      default: return 'badge-pending';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
      setIsConfirmOpen(false);
      showToast(`Item "${item.title}" deleted.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          opacity: isDeleting ? 0.5 : 1
        }}
      >
        {/* Top Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                wordBreak: 'break-word'
              }}
            >
              {item.title}
            </h3>
            <span className={`badge ${getStatusBadgeClass(item.status)}`}>
              {item.status.replace('-', ' ')}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.8125rem',
              color: item.description ? 'var(--text-secondary)' : 'var(--text-muted)',
              lineHeight: 1.5,
              marginBottom: '1rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Card Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
            marginTop: 'auto',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} />
            {formatDate(item.createdAt)}
          </span>

          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={isDeleting}
            className="btn btn-danger"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
            title="Delete item"
            aria-label="Delete item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        itemTitle={item.title}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
