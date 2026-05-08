'use client';
import type { Classification } from '@/lib/types';
import { classificationLabel } from '@/lib/utils';

interface Props {
  classification: Classification;
  size?: 'sm' | 'md';
  rotate?: boolean;
}

const colorMap: Record<Classification, { text: string; border: string; bg: string }> = {
  TOP_SECRET: { text: '#c41e3a', border: '#c41e3a', bg: 'rgba(196,30,58,0.08)' },
  SECRET:     { text: '#c41e3a', border: '#c41e3a', bg: 'rgba(196,30,58,0.08)' },
  CONFIDENTIAL:{ text: '#d97706', border: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  UNCLASSIFIED:{ text: '#16a34a', border: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  DECLASSIFIED:{ text: '#16a34a', border: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
};

export default function ClassificationBadge({ classification, size = 'sm', rotate = false }: Props) {
  const c = colorMap[classification];
  const label = classificationLabel(classification);
  return (
    <span
      className="stamp"
      style={{
        color: c.text,
        borderColor: c.border,
        background: c.bg,
        transform: rotate ? 'rotate(-2deg)' : 'none',
        fontSize: size === 'md' ? '0.7rem' : '0.58rem',
        padding: size === 'md' ? '2px 8px' : '1px 5px',
      }}
    >
      {label}
    </span>
  );
}
