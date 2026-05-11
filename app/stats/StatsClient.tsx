'use client';
import type { UFORecord } from '@/lib/types';
import { agencyLabel, agencyColor, typeLabel } from '@/lib/utils';

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0d1117',
        border: '1px solid #1e2a3a',
        borderRadius: 4,
        padding: '20px 20px 16px',
      }}
    >
      <div style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 16 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function StatsClient({ records }: { records: UFORecord[] }) {
  // Incidents by year
  const byYear: Record<string, number> = {};
  for (const r of records) {
    const y = r.incidentDate ? r.incidentDate.slice(0, 4) : '';
    if (y && /^\d{4}$/.test(y)) byYear[y] = (byYear[y] ?? 0) + 1;
  }
  const years = Object.keys(byYear).sort();
  const maxYear = Math.max(...Object.values(byYear));

  // By agency
  const byAgency: Record<string, number> = {};
  for (const r of records) byAgency[r.agency] = (byAgency[r.agency] ?? 0) + 1;
  const agencyEntries = Object.entries(byAgency).sort((a, b) => b[1] - a[1]);
  const maxAgency = agencyEntries[0]?.[1] ?? 1;

  // By type
  const byType: Record<string, number> = {};
  for (const r of records) byType[r.type] = (byType[r.type] ?? 0) + 1;
  const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  const totalTypes = records.length;

  // Top locations
  const byLocation: Record<string, number> = {};
  for (const r of records) {
    if (r.incidentLocation && r.incidentLocation !== 'Unknown') {
      byLocation[r.incidentLocation] = (byLocation[r.incidentLocation] ?? 0) + 1;
    }
  }
  const topLocations = Object.entries(byLocation).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Records with coordinates (mappable)
  const withCoords = records.filter(r => r.coordinates).length;
  const withText   = records.filter(r => r.pdfText).length;
  const videos     = records.filter(r => r.type === 'VIDEO' || r.videoUrl).length;
  const photos     = records.filter(r => r.type === 'PHOTO').length;

  const statStyle = {
    background: '#080b10',
    border: '1px solid #1e2a3a',
    borderRadius: 3,
    padding: '14px 16px',
    textAlign: 'center' as const,
  };
  const statNum = { fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 700, color: '#d97706', display: 'block' as const };
  const statLbl = { fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60', letterSpacing: '0.1em', marginTop: 4, display: 'block' as const };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Quick stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
        {[
          [records.length, 'TOTAL RECORDS'],
          [videos, 'VIDEOS'],
          [photos, 'PHOTOS'],
          [withCoords, 'MAPPED'],
          [withText, 'PARSED'],
          [agencyEntries.length, 'AGENCIES'],
          [years.length, 'YEARS SPAN'],
          [records.filter(r => r.sectionCount && r.sectionCount > 1).length, 'MULTI-SECTION'],
        ].map(([n, label]) => (
          <div key={String(label)} style={statStyle}>
            <span style={statNum}>{n}</span>
            <span style={statLbl}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Incidents by year */}
        <Panel title="INCIDENTS BY YEAR">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100, overflowX: 'auto' }}>
            {years.map(y => (
              <div key={y} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                <div
                  style={{
                    width: 18,
                    height: `${Math.max(4, (byYear[y] / maxYear) * 88)}px`,
                    background: '#d97706',
                    borderRadius: '1px 1px 0 0',
                    minHeight: 4,
                    transition: 'height 0.3s',
                    cursor: 'default',
                  }}
                  title={`${y}: ${byYear[y]}`}
                />
                <span style={{ fontFamily: 'monospace', fontSize: '0.45rem', color: '#3d4f60', transform: 'rotate(-60deg)', whiteSpace: 'nowrap', marginTop: 2 }}>
                  {y}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* By agency */}
        <Panel title="RECORDS BY AGENCY">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agencyEntries.map(([agency, count]) => (
              <div key={agency} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: agencyColor(agency as never), width: 80, flexShrink: 0 }}>
                  {agencyLabel(agency as never)}
                </span>
                <div style={{ flex: 1, height: 10, background: '#080b10', borderRadius: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(count / maxAgency) * 100}%`,
                      height: '100%',
                      background: agencyColor(agency as never),
                      borderRadius: 1,
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#6b7d91', width: 24, textAlign: 'right', flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* By type */}
        <Panel title="RECORD TYPES">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {typeEntries.map(([type, count]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#6b7d91', width: 80, flexShrink: 0 }}>
                  {typeLabel(type as never)}
                </span>
                <div style={{ flex: 1, height: 10, background: '#080b10', borderRadius: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${(count / totalTypes) * 100}%`,
                      height: '100%',
                      background: '#475569',
                      borderRadius: 1,
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#6b7d91', width: 24, textAlign: 'right', flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Top locations */}
        <Panel title="TOP INCIDENT LOCATIONS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topLocations.map(([loc, count], i) => (
              <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60', width: 14, flexShrink: 0 }}>
                  {i + 1}.
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#8b9cb0', flex: 1 }}>
                  {loc}
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    color: '#d97706',
                    background: 'rgba(217,119,6,0.08)',
                    border: '1px solid rgba(217,119,6,0.2)',
                    padding: '1px 6px',
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
