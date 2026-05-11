'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { UFORecord } from '@/lib/types';
import RecordsTable from '@/components/RecordsTable';

function Inner({ records }: { records: UFORecord[] }) {
  const params = useSearchParams();
  const initialId = params.get('id') ?? undefined;
  return <RecordsTable records={records} initialId={initialId} />;
}

export default function RecordsTableWrapper({ records }: { records: UFORecord[] }) {
  return (
    <Suspense fallback={null}>
      <Inner records={records} />
    </Suspense>
  );
}
