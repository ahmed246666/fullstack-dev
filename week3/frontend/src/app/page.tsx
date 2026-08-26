'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ItemList from '../components/ItemList';
import CreateItemModal from '../components/CreateItemModal';

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleItemCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <section
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.75rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.35rem'
            }}
          >
            Full-Stack Management
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Items & Tasks Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Next.js frontend connected to Node.js / Express API and SQLite database.
          </p>
        </div>

        {/* Single Primary Action */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>Create New Item</span>
        </button>
      </section>

      {/* Main Items Listing Section */}
      <section>
        <ItemList refreshTrigger={refreshTrigger} />
      </section>

      {/* Item Creation Modal */}
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleItemCreated}
      />
    </div>
  );
}
