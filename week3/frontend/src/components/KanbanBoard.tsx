'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { Item, ItemStatus } from '../types/item';
import { updateItemStatus } from '../lib/api';
import { useToast } from '../context/ToastContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

interface KanbanBoardProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onDeleteItem: (id: number) => Promise<void>;
}

export default function KanbanBoard({ items, setItems, onDeleteItem }: KanbanBoardProps) {
  const { showToast } = useToast();
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // require 5px movement to start drag so clicks on buttons still work
      }
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const itemData = event.active.data.current?.item as Item | undefined;
    if (itemData) {
      setActiveItem(itemData);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = Number(String(active.id).replace('item-', ''));
    let targetStatus: ItemStatus | null = null;

    // Check if dropped directly onto a column
    if (over.id.toString().startsWith('column-')) {
      targetStatus = over.id.toString().replace('column-', '') as ItemStatus;
    } else if (over.id.toString().startsWith('item-')) {
      // Dropped onto another card, inherit its column status
      const targetCardId = Number(String(over.id).replace('item-', ''));
      const targetCard = items.find(i => i.id === targetCardId);
      if (targetCard) targetStatus = targetCard.status;
    }

    if (!targetStatus) return;

    const currentItem = items.find(i => i.id === activeId);
    if (!currentItem || currentItem.status === targetStatus) return;

    const previousStatus = currentItem.status;

    // Optimistic Update
    setItems(prev => prev.map(item =>
      item.id === activeId ? { ...item, status: targetStatus! } : item
    ));

    try {
      await updateItemStatus(activeId, targetStatus);
      showToast(`Moved "${currentItem.title}" to ${targetStatus.replace('-', ' ')}`, 'success', 2500);
    } catch (err: any) {
      // Rollback on error
      setItems(prev => prev.map(item =>
        item.id === activeId ? { ...item, status: previousStatus } : item
      ));
      showToast(err.message || 'Failed to update item status', 'error');
    }
  };

  const columns: { id: ItemStatus; title: string }[] = [
    { id: 'pending', title: 'Pending' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '1rem'
        }}
      >
        {columns.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            items={items.filter(i => i.status === col.id)}
            onDelete={onDeleteItem}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div style={{ width: '280px' }}>
            <KanbanCard item={activeItem} onDelete={async () => {}} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
