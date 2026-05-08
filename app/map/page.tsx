import { getRecords } from '@/data/records';
import MapClient from './MapClient';

export default function MapPage() {
  const { records } = getRecords();
  const geoRecords = records.filter((r) => r.coordinates);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 6 }}>
          PURSUE // INCIDENT MAP
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dde2ec', margin: 0, letterSpacing: '-0.02em' }}>
            Global Incident Locations
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
            {geoRecords.length} GEOLOCATED
          </span>
        </div>
        <p style={{ color: '#6b7d91', fontSize: '0.85rem', margin: '10px 0 0', lineHeight: 1.6 }}>
          Geographic distribution of declassified UAP incidents. Click a marker to view record details.
        </p>
      </div>
      <MapClient records={geoRecords} />
    </div>
  );
}
