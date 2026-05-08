import { getRecords } from '@/data/records';
import GalleryClient from './GalleryClient';

export default function GalleryPage() {
  const { records } = getRecords();
  const mediaRecords = records.filter((r) => r.imageUrl);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 6 }}>
          PURSUE // MEDIA GALLERY
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#dde2ec', margin: 0, letterSpacing: '-0.02em' }}>
            UAP Imagery Archive
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
            {mediaRecords.length} IMAGES
          </span>
        </div>
        <p style={{ color: '#6b7d91', fontSize: '0.85rem', margin: '10px 0 0', maxWidth: 600, lineHeight: 1.6 }}>
          Declassified sensor imagery, archival photographs, and video stills from U.S. government UAP investigations spanning 1972–2026.
        </p>
      </div>

      <GalleryClient records={mediaRecords} />
    </div>
  );
}
