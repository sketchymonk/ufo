import Link from 'next/link';
import { getRecords } from '@/data/records';
import { agencyColor, agencyLabel, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from '@/components/ClassificationBadge';
import AgencyBadge from '@/components/AgencyBadge';

export default function DashboardPage() {
  const { records, totalRecords } = getRecords();

  const agencies = [...new Set(records.map((r) => r.agency))];
  const locations = [...new Set(records.map((r) => r.incidentLocation))];
  const years = records
    .map((r) => parseInt(r.incidentDate))
    .filter((y) => !isNaN(y));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const typeCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const agencyCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.agency] = (acc[r.agency] || 0) + 1;
    return acc;
  }, {});

  const recent = [...records]
    .sort((a, b) => (b.incidentDate > a.incidentDate ? 1 : -1))
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Hero */}
      <div
        className="grid-bg"
        style={{
          border: '1px solid #1e2a3a',
          borderRadius: 4,
          padding: '48px 40px',
          marginBottom: 40,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <ClassificationBadge classification="DECLASSIFIED" size="md" rotate />
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: '#6b7d91',
              letterSpacing: '0.2em',
              marginBottom: 16,
            }}
          >
            PURSUE // PRESIDENTIAL UNSEALING AND REPORTING SYSTEM FOR UAP ENCOUNTERS
          </div>
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#dde2ec',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            UAP Records
            <br />
            <span style={{ color: '#d97706' }}>Intelligence Dashboard</span>
          </h1>
          <p
            style={{
              color: '#6b7d91',
              maxWidth: 560,
              lineHeight: 1.7,
              fontSize: '0.95rem',
              margin: '0 0 28px',
            }}
          >
            Consolidated view of all declassified Unidentified Anomalous Phenomena records
            released by the U.S. Department of War in coordination with ODNI, NASA, FBI, and
            additional intelligence components under President Trump&apos;s executive directive of February 19, 2026.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/records"
              style={{
                background: '#d97706',
                color: '#fff',
                padding: '10px 20px',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              VIEW ALL RECORDS →
            </Link>
            <Link
              href="/gallery"
              style={{
                border: '1px solid #1e2a3a',
                color: '#dde2ec',
                padding: '10px 20px',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              GALLERY
            </Link>
            <Link
              href="/map"
              style={{
                border: '1px solid #1e2a3a',
                color: '#dde2ec',
                padding: '10px 20px',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                borderRadius: 2,
              }}
            >
              MAP VIEW
            </Link>
          </div>
        </div>
        {/* Decorative coordinates */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 24,
            fontFamily: 'monospace',
            fontSize: '0.62rem',
            color: '#2d3f52',
            letterSpacing: '0.1em',
          }}
        >
          38°52′15″N 77°03′18″W // WASHINGTON D.C.
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          { label: 'RECORDS', value: totalRecords, sub: 'Release 01' },
          { label: 'AGENCIES', value: agencies.length, sub: agencies.slice(0,3).map(a => agencyLabel(a as never)).join(', ') + '...' },
          { label: 'LOCATIONS', value: locations.length, sub: 'Global incidents' },
          { label: 'DATE RANGE', value: `${minYear}–${maxYear}`, sub: `${maxYear - minYear} year span` },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 4,
              padding: '20px 20px 16px',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.58rem',
                color: '#6b7d91',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#d97706',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#3d4f60' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Two column: recent + breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 40 }}>
        {/* Recent records */}
        <div
          style={{
            background: '#0d1117',
            border: '1px solid #1e2a3a',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #1e2a3a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#dde2ec' }}>
              RECENT INCIDENTS
            </span>
            <Link
              href="/records"
              style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#d97706', textDecoration: 'none' }}
            >
              VIEW ALL →
            </Link>
          </div>
          {recent.map((r, i) => (
            <Link
              key={r.id}
              href={`/records?id=${r.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 20px',
                borderBottom: i < recent.length - 1 ? '1px solid #1e2a3a' : 'none',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: 56,
                  height: 36,
                  borderRadius: 2,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#111827',
                  border: '1px solid #1e2a3a',
                }}
              >
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.imageUrl}
                    alt={r.id}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="thermal"
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1rem' }}>
                    📄
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.68rem',
                      color: '#dde2ec',
                      fontWeight: 600,
                    }}
                  >
                    {r.id}
                  </span>
                  <AgencyBadge agency={r.agency} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7d91', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.incidentLocation} • {formatDate(r.incidentDate)}
                </div>
              </div>

              {/* Type */}
              <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#3d4f60', flexShrink: 0 }}>
                {typeLabel(r.type)}
              </span>
            </Link>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Agency breakdown */}
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a3a' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#dde2ec' }}>
                BY AGENCY
              </span>
            </div>
            <div style={{ padding: '12px 20px' }}>
              {Object.entries(agencyCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([agency, count]) => (
                  <div key={agency} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, fontFamily: 'monospace', fontSize: '0.62rem', color: '#6b7d91' }}>
                      {count}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: agencyColor(agency as never),
                          width: `${(count / totalRecords) * 100}%`,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.62rem',
                        color: agencyColor(agency as never),
                        width: 80,
                        textAlign: 'right',
                      }}
                    >
                      {agencyLabel(agency as never)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Record types */}
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a3a' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#dde2ec' }}>
                BY TYPE
              </span>
            </div>
            <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(typeCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div
                    key={type}
                    style={{
                      background: '#111827',
                      border: '1px solid #1e2a3a',
                      borderRadius: 2,
                      padding: '6px 12px',
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      color: '#dde2ec',
                    }}
                  >
                    <span style={{ color: '#6b7d91' }}>{count}× </span>
                    {typeLabel(type as never)}
                  </div>
                ))}
            </div>
          </div>

          {/* Quick nav */}
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a3a' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#dde2ec' }}>
                EXPLORE
              </span>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/timeline', label: 'CHRONOLOGICAL TIMELINE', sub: '1972 → 2026' },
                { href: '/map',      label: 'INCIDENT MAP',           sub: `${locations.length} global locations` },
                { href: '/gallery',  label: 'MEDIA GALLERY',          sub: `${records.filter(r => r.imageUrl).length} images` },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: '#111827',
                    border: '1px solid #1e2a3a',
                    borderRadius: 2,
                    textDecoration: 'none',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#dde2ec', letterSpacing: '0.06em', marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#3d4f60' }}>{sub}</div>
                  </div>
                  <span style={{ color: '#d97706', fontSize: '0.8rem' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Release metadata */}
      <div
        style={{
          border: '1px solid #1e2a3a',
          borderRadius: 4,
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          background: '#0d1117',
        }}
      >
        {[
          { label: 'PROGRAM', value: 'PURSUE' },
          { label: 'RELEASE', value: 'Release 01' },
          { label: 'DATE CLEARED', value: 'May 8, 2026' },
          { label: 'COORDINATOR', value: 'Dept. of War / ODNI' },
          { label: 'STATUS', value: 'ACTIVE — Rolling releases' },
          { label: 'REFERENCE', value: 'WAR.GOV/UFO' },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#3d4f60', letterSpacing: '0.15em', marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7d91' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
