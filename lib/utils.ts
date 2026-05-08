import type { Agency, Classification, RecordType } from './types';

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function agencyLabel(agency: Agency): string {
  const map: Record<Agency, string> = {
    FBI: 'FBI',
    DOW: 'Dept. of War',
    NASA: 'NASA',
    ODNI: 'ODNI',
    DOE: 'Dept. of Energy',
    AARO: 'AARO',
    ARMY: 'U.S. Army',
    USAF: 'U.S. Air Force',
    INDOPACOM: 'INDOPACOM',
    CIA: 'CIA',
    DIA: 'DIA',
  };
  return map[agency] ?? agency;
}

export function agencyColor(agency: Agency): string {
  const map: Record<Agency, string> = {
    FBI: '#d97706',
    DOW: '#1d4ed8',
    NASA: '#0d9488',
    ODNI: '#7c3aed',
    DOE: '#16a34a',
    AARO: '#0891b2',
    ARMY: '#65a30d',
    USAF: '#2563eb',
    INDOPACOM: '#0f766e',
    CIA: '#9f1239',
    DIA: '#6b21a8',
  };
  return map[agency] ?? '#6b7d91';
}

export function classificationColor(c: Classification): string {
  const map: Record<Classification, string> = {
    TOP_SECRET: '#c41e3a',
    SECRET: '#c41e3a',
    CONFIDENTIAL: '#d97706',
    UNCLASSIFIED: '#16a34a',
    DECLASSIFIED: '#16a34a',
  };
  return map[c];
}

export function classificationLabel(c: Classification): string {
  const map: Record<Classification, string> = {
    TOP_SECRET: 'TOP SECRET',
    SECRET: 'SECRET',
    CONFIDENTIAL: 'CONFIDENTIAL',
    UNCLASSIFIED: 'UNCLASSIFIED',
    DECLASSIFIED: 'DECLASSIFIED',
  };
  return map[c];
}

export function typeLabel(t: RecordType): string {
  const map: Record<RecordType, string> = {
    PHOTO: 'Photo',
    VIDEO: 'Video Still',
    REPORT: 'Report',
    COMPOSITE: 'Composite',
    ARCHIVAL: 'Archival',
    DOCUMENT: 'Document',
  };
  return map[t] ?? t;
}

export function typeIcon(t: RecordType): string {
  const map: Record<RecordType, string> = {
    PHOTO: '📷',
    VIDEO: '🎬',
    REPORT: '📄',
    COMPOSITE: '🖊',
    ARCHIVAL: '🗄',
    DOCUMENT: '📋',
  };
  return map[t] ?? '📁';
}

export function formatDate(date: string): string {
  if (!date) return 'Unknown';
  // Handle partial dates like "2025-09" or "2013"
  if (/^\d{4}$/.test(date)) return date;
  if (/^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(month)-1]} ${year}`;
  }
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return date;
  }
}
