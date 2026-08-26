'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Item, ItemStatus } from '../types/item';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: ItemStatus;
  title: string;
  items: Item[];
  onDelete: (id: number) => Promise<void>;
}

export default function KanbanColumn({ id, title, items, onDelete }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${id}`,
    data: { status: id }
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '1 1 300px',
        minWidth: '280px',
        backgroundColor: isOver ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
        border: isOver ? '1px dashed var(--primary)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        minHeight: '450px',
        transition: 'background-color 0.15s ease, border-color 0.15s ease'
      }}
    >
      {/* Column Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: id === 'completed' ? 'var(--success)' : id === 'in-progress' ? 'var(--info)' : 'var(--warning)'
            }}
          />
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h3>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-main)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {items.length}
        </span>
      </div>

      {/* Cards List in Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
        {items.length === 0 ? (
          <div
            style={{
              height: '100px',
              border: '1px dashed var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.75rem'
            }}
          >
            Drop items here
          </div>
        ) : (
          items.map(item => (
            <KanbanCard key={item.id} item={item} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
