'use client';
import { useState } from 'react';
import type { UFORecord } from '@/lib/types';
import { agencyLabel, agencyColor, formatDate } from '@/lib/utils';

function videoLabel(filename: string): string {
  if (!filename) return 'UAP Footage';
  const base = filename.replace(/\.[^.]+$/, '');
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/Uap/g, 'UAP')
    .replace(/Dow/g, 'DOW')
    .replace(/Pr(\d+)/i, 'PR$1');
}

export default function VideosClient({ videos }: { videos: UFORecord[] }) {
  const [active, setActive] = useState<UFORecord | null>(null);

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Grid */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {videos.map(v => {
            const isActive = active?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActive(isActive ? null : v)}
                style={{
                  background: isActive ? '#0d1e33' : '#0d1117',
                  border: `1px solid ${isActive ? '#d97706' : '#1e2a3a'}`,
                  borderRadius: 4,
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Thumbnail placeholder */}
                <div
                  style={{
                    aspectRatio: '16/9',
                    background: '#080b10',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    borderBottom: '1px solid #1e2a3a',
                    position: 'relative',
                  }}
                >
                  <span style={{ opacity: 0.3 }}>▶</span>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 8,
                      fontFamily: 'monospace',
                      fontSize: '0.55rem',
                      color: '#d97706',
                      letterSpacing: '0.08em',
                    }}
                  >
                    MP4
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      color: '#dde2ec',
                      marginBottom: 4,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    } as React.CSSProperties}
                  >
                    {videoLabel(v.localFilename ?? v.id)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.55rem',
                        color: agencyColor(v.agency),
                        border: `1px solid ${agencyColor(v.agency)}44`,
                        padding: '1px 5px',
                        borderRadius: 1,
                      }}
                    >
                      {agencyLabel(v.agency)}
                    </span>
                    {v.incidentDate && (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60' }}>
                        {formatDate(v.incidentDate)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Player panel */}
      {active && (
        <div
          style={{
            width: 480,
            flexShrink: 0,
            position: 'sticky',
            top: 80,
            background: '#0d1117',
            border: '1px solid #1e2a3a',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #1e2a3a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60', letterSpacing: '0.12em', marginBottom: 2 }}>
                NOW PLAYING
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#dde2ec', fontWeight: 700 }}>
                {active.id}
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              style={{
                background: 'none',
                border: '1px solid #1e2a3a',
                color: '#6b7d91',
                cursor: 'pointer',
                padding: '3px 8px',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                borderRadius: 2,
              }}
            >
              ✕
            </button>
          </div>

          {/* Video */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            key={active.videoUrl}
            controls
            autoPlay
            style={{ width: '100%', background: '#000', display: 'block' }}
            src={active.videoUrl}
          />

          {/* Metadata */}
          <div style={{ padding: '12px 16px' }}>
            {[
              ['AGENCY', <span key="a" style={{ color: agencyColor(active.agency) }}>{agencyLabel(active.agency)}</span>],
              ['DATE', active.incidentDate ? formatDate(active.incidentDate) : '—'],
              ['LOCATION', active.incidentLocation || '—'],
              ['CLASSIFICATION', 'DECLASSIFIED'],
            ].map(([label, value]) => (
              <div key={String(label)} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#3d4f60', letterSpacing: '0.08em' }}>{label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#dde2ec' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Download */}
          {active.videoUrl && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid #1e2a3a' }}>
              <a
                href={active.videoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: '#d97706',
                  color: '#fff',
                  textAlign: 'center',
                  padding: '7px 12px',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                ↓ DOWNLOAD MP4
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
