'use client';
import type { UFORecord } from '@/lib/types';
import { agencyLabel, agencyColor, classificationLabel, classificationColor, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from './ClassificationBadge';

interface Props {
  record: UFORecord;
  onClose: () => void;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, marginBottom: 10 }}>
      <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.1em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#dde2ec' }}>
        {value}
      </span>
    </div>
  );
}

export default function RecordDetailDrawer({ record, onClose }: Props) {
  return (
    <div
      style={{
        width: 360,
        flexShrink: 0,
        marginLeft: 20,
        background: '#0d1117',
        border: '1px solid #1e2a3a',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
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
          <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.12em', marginBottom: 3 }}>
            RECORD DETAIL
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#dde2ec', fontWeight: 700 }}>
            {record.id}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #1e2a3a',
            color: '#6b7d91',
            cursor: 'pointer',
            padding: '4px 8px',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            borderRadius: 2,
          }}
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Image */}
      {record.imageUrl && (
        <div
          style={{
            aspectRatio: '16/9',
            overflow: 'hidden',
            position: 'relative',
            background: '#080b10',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={record.imageUrl}
            alt={record.id}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="thermal"
          />
          {/* Classification overlay */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          >
            <ClassificationBadge classification={record.classification} size="sm" rotate />
          </div>
          {/* Redaction bars mimicking real sensor imagery */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              width: '30%',
              height: 12,
              background: '#0a0a0a',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '20%',
              height: 12,
              background: '#0a0a0a',
            }}
          />
        </div>
      )}

      {/* Meta */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <ClassificationBadge classification={record.classification} size="md" rotate />
        </div>

        <MetaRow label="CASE NO." value={record.caseNumber ?? '—'} />
        <MetaRow
          label="AGENCY"
          value={
            <span style={{ color: agencyColor(record.agency) }}>
              {agencyLabel(record.agency)}
            </span>
          }
        />
        <MetaRow label="INCIDENT" value={formatDate(record.incidentDate)} />
        <MetaRow label="LOCATION" value={record.incidentLocation} />
        <MetaRow label="TYPE" value={typeLabel(record.type)} />
        <MetaRow label="RELEASED" value={formatDate(record.releaseDate)} />
        {record.pdfPageCount && <MetaRow label="PAGES" value={record.pdfPageCount.toString()} />}
        {record.coordinates && (
          <MetaRow
            label="COORDINATES"
            value={`${record.coordinates[0].toFixed(2)}°N, ${record.coordinates[1].toFixed(2)}°E`}
          />
        )}

        {/* Description */}
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.1em', marginBottom: 8 }}>
            SUMMARY
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7d91', lineHeight: 1.7, margin: 0 }}>
            {record.description}
          </p>
        </div>

        {/* Classification markings */}
        {record.classificationMarkings && record.classificationMarkings.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.1em', marginBottom: 8 }}>
              CLASSIFICATION MARKINGS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {record.classificationMarkings.map((m) => (
                <span
                  key={m}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    color: '#c41e3a',
                    border: '1px solid #c41e3a',
                    padding: '1px 6px',
                    borderRadius: 1,
                    background: 'rgba(196,30,58,0.07)',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {record.tags && record.tags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', letterSpacing: '0.1em', marginBottom: 8 }}>
              TAGS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {record.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    color: '#6b7d91',
                    border: '1px solid #1e2a3a',
                    padding: '1px 6px',
                    borderRadius: 1,
                    background: '#111827',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #1e2a3a',
          display: 'flex',
          gap: 8,
        }}
      >
        {record.downloadUrl ? (
          <a
            href={record.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              background: '#d97706',
              color: '#fff',
              textAlign: 'center',
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            ↓ DOWNLOAD
          </a>
        ) : (
          <a
            href="https://www.war.gov/ufo/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              background: '#111827',
              color: '#6b7d91',
              textAlign: 'center',
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: 2,
              border: '1px solid #1e2a3a',
            }}
          >
            VIEW SOURCE ↗
          </a>
        )}
      </div>
    </div>
  );
}
