'use client';
import { useState, useMemo } from 'react';
import type { UFORecord, Agency, RecordType } from '@/lib/types';
import { agencyLabel, agencyColor, classificationColor, formatDate, typeLabel } from '@/lib/utils';
import ClassificationBadge from './ClassificationBadge';
import AgencyBadge from './AgencyBadge';
import RecordDetailDrawer from './RecordDetailDrawer';

interface Props {
  records: UFORecord[];
  initialId?: string;
}

const ALL = 'ALL';

export default function RecordsTable({ records, initialId }: Props) {
  const [search, setSearch] = useState('');
  const [filterAgency, setFilterAgency] = useState<Agency | 'ALL'>(ALL);
  const [filterType, setFilterType] = useState<RecordType | 'ALL'>(ALL);
  const [sortField, setSortField] = useState<'incidentDate' | 'agency' | 'type' | 'incidentLocation'>('incidentDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);

  const agencies = useMemo(() => [...new Set(records.map((r) => r.agency))].sort(), [records]);
  const types = useMemo(() => [...new Set(records.map((r) => r.type))].sort(), [records]);

  const filtered = useMemo(() => {
    let r = records;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (rec) =>
          rec.id.toLowerCase().includes(q) ||
          rec.incidentLocation.toLowerCase().includes(q) ||
          rec.description.toLowerCase().includes(q) ||
          rec.agency.toLowerCase().includes(q) ||
          (rec.caseNumber?.toLowerCase().includes(q) ?? false) ||
          (rec.pdfText?.toLowerCase().includes(q) ?? false)
      );
    }
    if (filterAgency !== ALL) r = r.filter((rec) => rec.agency === filterAgency);
    if (filterType !== ALL) r = r.filter((rec) => rec.type === filterType);

    return [...r].sort((a, b) => {
      const av = a[sortField] ?? '';
      const bv = b[sortField] ?? '';
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
  }, [records, search, filterAgency, filterType, sortField, sortDir]);

  const selectedRecord = records.find((r) => r.id === selectedId) ?? null;

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const colStyle = (field: typeof sortField) => ({
    cursor: 'pointer',
    userSelect: 'none' as const,
    color: sortField === field ? '#d97706' : '#6b7d91',
    fontFamily: 'monospace',
    fontSize: '0.6rem',
    letterSpacing: '0.12em',
    padding: '10px 12px',
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
    borderBottom: `1px solid #1e2a3a`,
  });

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', minHeight: 0 }}>
      {/* Main table area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '14px 0',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search records, locations, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1 1 240px',
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 2,
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#dde2ec',
              outline: 'none',
            }}
          />
          <select
            value={filterAgency}
            onChange={(e) => setFilterAgency(e.target.value as Agency | 'ALL')}
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 2,
              padding: '8px 10px',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: filterAgency !== ALL ? agencyColor(filterAgency) : '#6b7d91',
              outline: 'none',
            }}
          >
            <option value={ALL}>ALL AGENCIES</option>
            {agencies.map((a) => (
              <option key={a} value={a}>{agencyLabel(a)}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RecordType | 'ALL')}
            style={{
              background: '#0d1117',
              border: '1px solid #1e2a3a',
              borderRadius: 2,
              padding: '8px 10px',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#6b7d91',
              outline: 'none',
            }}
          >
            <option value={ALL}>ALL TYPES</option>
            {types.map((t) => (
              <option key={t} value={t}>{typeLabel(t)}</option>
            ))}
          </select>
          <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: '#3d4f60', marginLeft: 8 }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div
          style={{
            border: '1px solid #1e2a3a',
            borderRadius: 4,
            overflow: 'auto',
            flex: 1,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#0d1117' }}>
                <th style={colStyle('agency')} onClick={() => toggleSort('agency')}>
                  AGENCY {sortField === 'agency' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={{ ...colStyle('incidentDate'), minWidth: 100 }} onClick={() => toggleSort('incidentDate')}>
                  INCIDENT DATE {sortField === 'incidentDate' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={colStyle('incidentLocation')} onClick={() => toggleSort('incidentLocation')}>
                  LOCATION {sortField === 'incidentLocation' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={colStyle('type')} onClick={() => toggleSort('type')}>
                  TYPE {sortField === 'type' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={{ ...colStyle('agency'), cursor: 'default' }}>CLASSIFICATION</th>
                <th style={{ ...colStyle('agency'), cursor: 'default' }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const isSelected = record.id === selectedId;
                return (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedId(isSelected ? null : record.id)}
                    style={{
                      background: isSelected ? '#111827' : 'transparent',
                      borderBottom: '1px solid #1e2a3a',
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                      borderLeft: isSelected ? '2px solid #d97706' : '2px solid transparent',
                    }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <AgencyBadge agency={record.agency} />
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#dde2ec', whiteSpace: 'nowrap' }}>
                      {formatDate(record.incidentDate)}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#6b7d91', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {record.incidentLocation}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.68rem', color: '#6b7d91' }}>
                      {typeLabel(record.type)}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <ClassificationBadge classification={record.classification} />
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.62rem', color: '#3d4f60' }}>
                      {record.id}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: '40px', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.72rem', color: '#3d4f60' }}
                  >
                    NO RECORDS MATCH SEARCH CRITERIA
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selectedRecord && (
        <RecordDetailDrawer
          record={selectedRecord}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
