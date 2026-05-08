import { Suspense } from 'react';
import { getRecords } from '@/data/records';
import RecordsTableWrapper from './RecordsTableWrapper';

export default function RecordsPage() {
  const { records, totalRecords } = getRecords();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 6 }}>
          PURSUE // RELEASE 01
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#dde2ec',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Declassified Records
          </h1>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#6b7d91',
              border: '1px solid #1e2a3a',
              padding: '2px 8px',
              borderRadius: 2,
            }}
          >
            {totalRecords} FILES
          </span>
        </div>
      </div>

      {/* Table (client component handles interactivity) */}
      <Suspense fallback={<div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#3d4f60', padding: 40 }}>LOADING RECORDS...</div>}>
        <RecordsTableWrapper records={records} />
      </Suspense>
    </div>
  );
}
