'use client';
import { useState } from 'react';
import type { UFORecord } from '@/lib/types';
import { agencyColor, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from '@/components/ClassificationBadge';
import AgencyBadge from '@/components/AgencyBadge';
import RecordDetailDrawer from '@/components/RecordDetailDrawer';

export default function TimelineClient({ records }: { records: UFORecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = records.find((r) => r.id === selectedId) ?? null;

  // Group into year buckets
  const yearGroups: Record<string, UFORecord[]> = {};
  records.forEach((r) => {
    const year = r.incidentDate.split('-')[0] ?? r.incidentDate.slice(0, 4);
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(r);
  });

  const years = Object.keys(yearGroups).sort();

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Timeline */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Year range bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            padding: '12px 16px',
            background: '#0d1117',
            border: '1px solid #1e2a3a',
            borderRadius: 4,
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#6b7d91' }}>
            {years[0]}
          </span>
          <div
            style={{
              flex: 1,
              margin: '0 20px',
              height: 2,
              background: 'linear-gradient(90deg, #1e2a3a, #d97706, #1e2a3a)',
              borderRadius: 1,
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#d97706' }}>
            {years[years.length - 1]}
          </span>
        </div>

        {/* Year groups */}
        {years.map((year) => (
          <div key={year} style={{ marginBottom: 40 }}>
            {/* Year marker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#d97706',
                  background: '#0d1117',
                  border: '1px solid #d97706',
                  padding: '4px 14px',
                  borderRadius: 2,
                  letterSpacing: '0.1em',
                }}
              >
                {year}
              </div>
              <div style={{ flex: 1, height: 1, background: '#1e2a3a' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60' }}>
                {yearGroups[year].length} INCIDENT{yearGroups[year].length !== 1 ? 'S' : ''}
              </span>
            </div>

            {/* Records in this year */}
            <div style={{ paddingLeft: 28, borderLeft: '1px solid #1e2a3a', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {yearGroups[year].map((record) => {
                const isSelected = record.id === selectedId;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedId(isSelected ? null : record.id)}
                    style={{
                      background: isSelected ? '#111827' : '#0d1117',
                      border: `1px solid ${isSelected ? '#d97706' : '#1e2a3a'}`,
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s',
                      display: 'flex',
                      gap: 0,
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#2d3f52';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#1e2a3a';
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -35,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: isSelected ? '#d97706' : agencyColor(record.agency),
                        border: '2px solid #0d1117',
                      }}
                    />

                    {/* Image thumbnail */}
                    {record.imageUrl && (
                      <div style={{ width: 100, flexShrink: 0, background: '#080b10', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={record.imageUrl}
                          alt={record.id}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="thermal"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#dde2ec', fontWeight: 700 }}>
                            {record.id}
                          </span>
                          <AgencyBadge agency={record.agency} />
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                          <ClassificationBadge classification={record.classification} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#6b7d91' }}>
                          📍 {record.incidentLocation}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#6b7d91' }}>
                          {typeLabel(record.type)}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: '#3d4f60',
                          margin: 0,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {record.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            border: '1px solid #1e2a3a',
            borderRadius: 4,
            background: '#0d1117',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            color: '#3d4f60',
            letterSpacing: '0.12em',
          }}
        >
          END OF RELEASE 01 RECORDS // ADDITIONAL RELEASES PENDING — WAR.GOV/UFO
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <RecordDetailDrawer
          record={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
