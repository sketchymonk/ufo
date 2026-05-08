'use client';
import { useState } from 'react';
import type { UFORecord } from '@/lib/types';
import { agencyColor, agencyLabel, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from '@/components/ClassificationBadge';
import AgencyBadge from '@/components/AgencyBadge';

// Mercator projection helpers
function mercatorX(lon: number, width: number): number {
  return ((lon + 180) / 360) * width;
}
function mercatorY(lat: number, height: number): number {
  const rad = (lat * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  const maxY = Math.log(Math.tan(Math.PI / 4 + (85 * Math.PI) / 180 / 2));
  return ((1 - y / maxY) / 2) * height;
}

// Rough world map outline as SVG path data (simplified continents)
const CONTINENTS = [
  // North America
  'M 170 70 L 200 65 L 220 75 L 235 90 L 220 110 L 210 130 L 190 140 L 175 130 L 160 110 L 155 90 Z',
  // South America
  'M 195 150 L 215 145 L 225 165 L 220 200 L 205 215 L 190 200 L 185 170 Z',
  // Europe
  'M 335 65 L 360 62 L 370 75 L 355 85 L 340 80 Z',
  // Africa
  'M 340 90 L 370 85 L 385 115 L 380 155 L 360 170 L 340 155 L 330 120 L 335 95 Z',
  // Asia
  'M 370 60 L 440 55 L 480 70 L 490 95 L 460 110 L 420 105 L 390 90 L 375 75 Z',
  // Australia
  'M 445 155 L 475 150 L 485 170 L 470 185 L 445 175 Z',
];

interface Props {
  records: UFORecord[];
}

export default function MapClient({ records }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const WIDTH = 900;
  const HEIGHT = 480;

  const selected = records.find((r) => r.id === selectedId) ?? null;
  const hovered = records.find((r) => r.id === hoveredId) ?? null;

  // Group records by approximate location to prevent overlap
  const locationGroups: Record<string, UFORecord[]> = {};
  records.forEach((r) => {
    if (!r.coordinates) return;
    const key = `${Math.round(r.coordinates[0] / 5) * 5}_${Math.round(r.coordinates[1] / 10) * 10}`;
    if (!locationGroups[key]) locationGroups[key] = [];
    locationGroups[key].push(r);
  });

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* Map */}
      <div
        style={{
          flex: 1,
          background: '#0d1117',
          border: '1px solid #1e2a3a',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* Ocean background */}
          <rect width={WIDTH} height={HEIGHT} fill="#080b10" />

          {/* Grid lines */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = mercatorY(lat, HEIGHT);
            return (
              <line
                key={`lat-${lat}`}
                x1={0} y1={y} x2={WIDTH} y2={y}
                stroke="#1e2a3a"
                strokeWidth={0.5}
                strokeDasharray={lat === 0 ? '4,4' : '2,6'}
              />
            );
          })}
          {[-120, -60, 0, 60, 120].map((lon) => {
            const x = mercatorX(lon, WIDTH);
            return (
              <line
                key={`lon-${lon}`}
                x1={x} y1={0} x2={x} y2={HEIGHT}
                stroke="#1e2a3a"
                strokeWidth={0.5}
                strokeDasharray="2,6"
              />
            );
          })}

          {/* Landmasses — simplified filled polygons */}
          {CONTINENTS.map((d, i) => (
            <path key={i} d={d} fill="#111827" stroke="#1e2a3a" strokeWidth={0.8} />
          ))}

          {/* Incident pins */}
          {Object.values(locationGroups).map((group) => {
            const r = group[0];
            if (!r.coordinates) return null;
            const [lat, lon] = r.coordinates;
            const cx = mercatorX(lon, WIDTH);
            const cy = mercatorY(lat, HEIGHT);
            const isHovered = group.some((g) => g.id === hoveredId);
            const isSelected = group.some((g) => g.id === selectedId);
            const color = agencyColor(r.agency);
            const count = group.length;

            return (
              <g
                key={r.id}
                onClick={() => setSelectedId(isSelected ? null : r.id)}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered || isSelected ? 14 : 10}
                  fill="none"
                  stroke={isSelected ? '#d97706' : color}
                  strokeWidth={1}
                  opacity={0.3}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered || isSelected ? 8 : 5}
                  fill={isSelected ? '#d97706' : color}
                  opacity={0.9}
                />
                {count > 1 && (
                  <text
                    x={cx + 7}
                    y={cy - 7}
                    fontSize={8}
                    fill="#d97706"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ×{count}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <text x={10} y={HEIGHT - 30} fontSize={7} fill="#3d4f60" fontFamily="monospace">
            PURSUE // DECLASSIFIED INCIDENT LOCATIONS
          </text>
          <text x={10} y={HEIGHT - 20} fontSize={6} fill="#3d4f60" fontFamily="monospace">
            SOURCE: WAR.GOV/UFO — RELEASE 01 — {records.length} GEOLOCATED RECORDS
          </text>
        </svg>

        {/* Hover tooltip */}
        {hovered && !selected && (
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0d1117',
              border: '1px solid #2d3f52',
              borderRadius: 3,
              padding: '8px 14px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#dde2ec', marginBottom: 2 }}>
              {hovered.id}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6b7d91' }}>
              {hovered.incidentLocation} • {formatDate(hovered.incidentDate)}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {selected ? (
          // Selected record detail
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #2d3f52',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e2a3a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#d97706', letterSpacing: '0.1em' }}>
                SELECTED INCIDENT
              </span>
              <button
                onClick={() => setSelectedId(null)}
                style={{ background: 'none', border: 'none', color: '#6b7d91', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem' }}
              >
                ✕
              </button>
            </div>
            {selected.imageUrl && (
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#080b10' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.imageUrl} alt={selected.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="thermal" />
              </div>
            )}
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#dde2ec', fontWeight: 700, marginBottom: 6 }}>
                {selected.id}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <AgencyBadge agency={selected.agency} />
                <ClassificationBadge classification={selected.classification} />
              </div>
              {([
                { label: 'LOCATION', value: selected.incidentLocation },
                { label: 'DATE', value: formatDate(selected.incidentDate) },
                { label: 'TYPE', value: typeLabel(selected.type) },
                selected.coordinates ? { label: 'COORDS', value: `${selected.coordinates[0]}°N ${selected.coordinates[1]}°E` } : null,
              ].filter((x): x is { label: string; value: string } => x !== null)).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.58rem', color: '#3d4f60', width: 60 }}>{label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#6b7d91', flex: 1 }}>{value}</span>
                </div>
              ))}
              <p style={{ fontSize: '0.74rem', color: '#6b7d91', lineHeight: 1.6, margin: '10px 0 0' }}>
                {selected.description}
              </p>
            </div>
          </div>
        ) : (
          // All records list
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#6b7d91', letterSpacing: '0.1em', padding: '8px 0' }}>
              ALL INCIDENTS — CLICK MAP TO SELECT
            </div>
            {records.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                style={{
                  background: '#0d1117',
                  border: '1px solid #1e2a3a',
                  borderRadius: 3,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2d3f52'; setHoveredId(r.id); }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1e2a3a'; setHoveredId(null); }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#dde2ec' }}>{r.id}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: agencyColor(r.agency), marginTop: 3 }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b7d91' }}>
                  {r.incidentLocation} · {formatDate(r.incidentDate)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
