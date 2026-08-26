'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Kanban, LayoutGrid, Search, X, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Item, ItemStatus, StatusCounts } from '../types/item';
import { fetchItems, deleteItem } from '../lib/api';
import ItemCard from './ItemCard';
import KanbanBoard from './KanbanBoard';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';
import ErrorAlert from './ErrorAlert';

interface ItemListProps {
  refreshTrigger?: number;
}

export default function ItemList({ refreshTrigger = 0 }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({ all: 0, pending: 0, 'in-progress': 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ItemStatus>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');

  const loadItems = useCallback(async (search: string, status: 'all' | ItemStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchItems({
        search,
        status: viewMode === 'grid' ? status : undefined
      });
      setItems(result.items);
      setCounts(result.counts);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, [viewMode]);

  // Debounced search trigger to backend
  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems(searchQuery, selectedStatus);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, refreshTrigger, loadItems]);

  const handleDeleteItem = async (id: number) => {
    await deleteItem(id);
    loadItems(searchQuery, selectedStatus);
  };

  const getTabIcon = (tab: 'all' | ItemStatus) => {
    switch (tab) {
      case 'pending': return <Clock size={13} style={{ color: 'var(--warning)' }} />;
      case 'in-progress': return <Activity size={13} style={{ color: 'var(--info)' }} />;
      case 'completed': return <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Filter Bar: View Switcher, Search & Status Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem'
        }}
      >
        {/* Left: View Mode Toggle & Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <div
            style={{
              display: 'inline-flex',
              padding: '0.2rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              gap: '0.2rem'
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'kanban' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Kanban size={14} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
          </div>

          {/* Grid View Status Tabs (Filtered Backend-Side) */}
          {viewMode === 'grid' && (
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
              {(['all', 'pending', 'in-progress', 'completed'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedStatus(tab)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedStatus === tab ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedStatus === tab ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    color: selectedStatus === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {getTabIcon(tab)}
                  <span>{tab.replace('-', ' ')}</span>
                  <span
                    style={{
                      padding: '0.1rem 0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      fontSize: '0.6875rem'
                    }}
                  >
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Search Field (Filtered Backend-Side) */}
        <div style={{ flex: '1 1 220px', maxWidth: '300px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <Search size={14} />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Search items via backend..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', paddingRight: searchQuery ? '2rem' : '0.85rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SkeletonLoader count={3} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={() => loadItems(searchQuery, selectedStatus)} />
      ) : counts.all === 0 ? (
        <EmptyState isSearchActive={false} />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          items={items}
          setItems={setItems}
          onDeleteItem={handleDeleteItem}
        />
      ) : items.length === 0 ? (
        <EmptyState
          isSearchActive={true}
          onClearSearch={() => {
            setSearchQuery('');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem'
          }}
        >
          {items.map(item => (
            <ItemCard key={item.id} item={item} onDelete={handleDeleteItem} />
          ))}
        </div>
      )}
    </div>
  );
}
