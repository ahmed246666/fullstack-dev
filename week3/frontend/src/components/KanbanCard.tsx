'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Trash2, GripVertical } from 'lucide-react';
import { Item, ItemStatus } from '../types/item';
import { useToast } from '../context/ToastContext';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface KanbanCardProps {
  item: Item;
  onDelete: (id: number) => Promise<void>;
  isOverlay?: boolean;
}

export default function KanbanCard({ item, onDelete, isOverlay = false }: KanbanCardProps) {
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: { item }
  });

  const cardStyle: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    boxShadow: isOverlay ? 'var(--shadow-lg)' : undefined,
    border: isOverlay ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    padding: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

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
        day: 'numeric'
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
        ref={setNodeRef}
        style={cardStyle}
        {...listeners}
        {...attributes}
        className="card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
            <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              {item.title}
            </h4>
          </div>
          <span className={`badge ${getStatusBadgeClass(item.status)}`} style={{ flexShrink: 0 }}>
            {item.status.replace('-', ' ')}
          </span>
        </div>

        {item.description && (
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              paddingLeft: '1.25rem'
            }}
          >
            {item.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.4rem',
            marginTop: 'auto',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={11} />
            {formatDate(item.createdAt)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmOpen(true);
            }}
            disabled={isDeleting}
            className="btn btn-danger"
            style={{
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
            title="Delete item"
            aria-label="Delete item"
          >
            <Trash2 size={13} />
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
