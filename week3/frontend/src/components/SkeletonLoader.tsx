import React from 'react';

export default function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem',
        width: '100%'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            minHeight: '180px'
          }}
        >
          {/* Header shimmer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '60%', height: '20px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '12px' }} />
          </div>

          {/* Description lines shimmer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
          </div>

          {/* Footer date shimmer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <div className="skeleton" style={{ width: '90px', height: '12px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
