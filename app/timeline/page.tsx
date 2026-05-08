import { getRecords } from '@/data/records';
import TimelineClient from './TimelineClient';

export default function TimelinePage() {
  const { records } = getRecords();

  // Sort by incident date ascending
  const sorted = [...records].sort((a, b) => {
    const ay = parseInt(a.incidentDate) || 0;
    const by = parseInt(b.incidentDate) || 0;
    return ay - by;
  });

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 6 }}>
          PURSUE // CHRONOLOGICAL TIMELINE
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dde2ec', margin: 0, letterSpacing: '-0.02em' }}>
          Incident Timeline
        </h1>
        <p style={{ color: '#6b7d91', fontSize: '0.85rem', margin: '10px 0 0', lineHeight: 1.6 }}>
          Chronological record of all declassified UAP incidents from 1972 to 2026.
        </p>
      </div>

      <TimelineClient records={sorted} />
    </div>
  );
}
