'use client';
import { useState } from 'react';
import type { UFORecord, Agency, RecordType } from '@/lib/types';
import { agencyLabel, agencyColor, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from '@/components/ClassificationBadge';
import AgencyBadge from '@/components/AgencyBadge';

const ALL = 'ALL';

export default function GalleryClient({ records }: { records: UFORecord[] }) {
  const [filterAgency, setFilterAgency] = useState<Agency | 'ALL'>(ALL);
  const [filterType, setFilterType] = useState<RecordType | 'ALL'>(ALL);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const agencies = [...new Set(records.map((r) => r.agency))].sort();
  const types = [...new Set(records.map((r) => r.type))].sort();

  const filtered = records.filter((r) => {
    if (filterAgency !== ALL && r.agency !== filterAgency) return false;
    if (filterType !== ALL && r.type !== filterType) return false;
    return true;
  });

  const lightboxRecord = records.find((r) => r.id === lightboxId) ?? null;
  const lightboxIdx = lightboxRecord ? filtered.indexOf(lightboxRecord) : -1;

  function prev() {
    if (lightboxIdx > 0) setLightboxId(filtered[lightboxIdx - 1].id);
  }
  function next() {
    if (lightboxIdx < filtered.length - 1) setLightboxId(filtered[lightboxIdx + 1].id);
  }

  return (
    <>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => { setFilterAgency(ALL); setFilterType(ALL); }}
          style={{
            background: filterAgency === ALL && filterType === ALL ? '#d97706' : '#0d1117',
            border: '1px solid #1e2a3a',
            color: filterAgency === ALL && filterType === ALL ? '#fff' : '#6b7d91',
            padding: '5px 14px',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          ALL
        </button>
        {agencies.map((a) => (
          <button
            key={a}
            onClick={() => setFilterAgency(filterAgency === a ? ALL : a as Agency)}
            style={{
              background: filterAgency === a ? `${agencyColor(a as Agency)}22` : '#0d1117',
              border: `1px solid ${filterAgency === a ? agencyColor(a as Agency) : '#1e2a3a'}`,
              color: filterAgency === a ? agencyColor(a as Agency) : '#6b7d91',
              padding: '5px 14px',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            {agencyLabel(a as Agency)}
          </button>
        ))}
        <div style={{ width: 1, background: '#1e2a3a', alignSelf: 'stretch' }} />
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(filterType === t ? ALL : t as RecordType)}
            style={{
              background: filterType === t ? '#111827' : '#0d1117',
              border: `1px solid ${filterType === t ? '#2d3f52' : '#1e2a3a'}`,
              color: filterType === t ? '#dde2ec' : '#6b7d91',
              padding: '5px 14px',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            {typeLabel(t as RecordType)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((record) => (
          <div
            key={record.id}
            onClick={() => setLightboxId(record.id)}
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2d3f52';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#1e2a3a';
            }}
          >
            {/* Image */}
            <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#080b10', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={record.imageUrl!}
                alt={record.id}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                className="thermal"
              />
              {/* Redaction bars on top (mimicking real UAP imagery) */}
              <div style={{ position: 'absolute', top: 0, left: '15%', width: '40%', height: 10, background: '#0a0a0a' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '18%', height: 10, background: '#0a0a0a' }} />

              {/* Classification top-right */}
              <div style={{ position: 'absolute', top: 14, left: 10 }}>
                <ClassificationBadge classification={record.classification} />
              </div>

              {/* Type badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(8,11,16,0.85)',
                  border: '1px solid #1e2a3a',
                  padding: '2px 7px',
                  fontFamily: 'monospace',
                  fontSize: '0.58rem',
                  color: '#6b7d91',
                  borderRadius: 1,
                }}
              >
                {typeLabel(record.type)}
              </div>
            </div>

            {/* Meta */}
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <AgencyBadge agency={record.agency} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60' }}>
                  {formatDate(record.incidentDate)}
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#dde2ec', marginBottom: 4 }}>
                {record.id}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6b7d91', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {record.incidentLocation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, fontFamily: 'monospace', fontSize: '0.72rem', color: '#3d4f60' }}>
          NO MEDIA RECORDS MATCH FILTER
        </div>
      )}

      {/* Lightbox */}
      {lightboxRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4,6,10,0.96)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxId(null); }}
        >
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 900,
              background: '#0d1117',
              border: '1px solid #2d3f52',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Lightbox header */}
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid #1e2a3a',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <AgencyBadge agency={lightboxRecord.agency} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#dde2ec' }}>
                  {lightboxRecord.id}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#3d4f60' }}>
                  {lightboxIdx + 1} / {filtered.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxId(null)}
                style={{
                  background: 'none', border: '1px solid #1e2a3a', color: '#6b7d91',
                  cursor: 'pointer', padding: '4px 10px', fontFamily: 'monospace', fontSize: '0.65rem', borderRadius: 2,
                }}
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div style={{ position: 'relative', background: '#080b10', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxRecord.imageUrl!}
                alt={lightboxRecord.id}
                style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', display: 'block' }}
                className="thermal"
              />
              {/* Nav arrows */}
              {lightboxIdx > 0 && (
                <button
                  onClick={prev}
                  style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(13,17,23,0.85)', border: '1px solid #1e2a3a',
                    color: '#dde2ec', padding: '10px 14px', cursor: 'pointer', borderRadius: 2, fontSize: '1rem',
                  }}
                >
                  ‹
                </button>
              )}
              {lightboxIdx < filtered.length - 1 && (
                <button
                  onClick={next}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(13,17,23,0.85)', border: '1px solid #1e2a3a',
                    color: '#dde2ec', padding: '10px 14px', cursor: 'pointer', borderRadius: 2, fontSize: '1rem',
                  }}
                >
                  ›
                </button>
              )}
            </div>

            {/* Metadata */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid #1e2a3a' }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                {[
                  { label: 'LOCATION', value: lightboxRecord.incidentLocation },
                  { label: 'DATE', value: formatDate(lightboxRecord.incidentDate) },
                  { label: 'TYPE', value: typeLabel(lightboxRecord.type) },
                  { label: 'CLASSIFICATION', value: <ClassificationBadge classification={lightboxRecord.classification} /> },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60', letterSpacing: '0.12em', marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#dde2ec' }}>{value}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6b7d91', margin: 0, lineHeight: 1.6 }}>
                {lightboxRecord.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
