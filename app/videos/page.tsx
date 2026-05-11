import { getRecords } from '@/data/records';
import VideosClient from './VideosClient';

export default function VideosPage() {
  const { records } = getRecords();
  const videos = records.filter(r => r.type === 'VIDEO' || !!r.videoUrl);
  return (
    <main style={{ padding: '32px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 6 }}>
          PURSUE // UAP VIDEO FOOTAGE
        </div>
        <h1 style={{ fontFamily: 'monospace', fontSize: '1.3rem', color: '#dde2ec', fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>
          SURVEILLANCE FOOTAGE
        </h1>
        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#3d4f60', marginTop: 6 }}>
          {videos.length} DECLASSIFIED VIDEO RECORDS
        </div>
      </div>
      <VideosClient videos={videos} />
    </main>
  );
}
