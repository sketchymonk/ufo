'use client';
import type { Agency } from '@/lib/types';
import { agencyLabel, agencyColor } from '@/lib/utils';

interface Props {
  agency: Agency;
  size?: 'sm' | 'md';
}

export default function AgencyBadge({ agency, size = 'sm' }: Props) {
  const color = agencyColor(agency);
  return (
    <span
      style={{
        color,
        borderColor: color,
        background: `${color}18`,
        fontSize: size === 'md' ? '0.7rem' : '0.6rem',
        padding: size === 'md' ? '2px 8px' : '1px 6px',
        fontFamily: 'var(--font-mono, monospace)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        border: '1px solid',
        borderRadius: '2px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {agencyLabel(agency)}
    </span>
  );
}
