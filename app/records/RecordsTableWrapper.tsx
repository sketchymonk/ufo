'use client';
import { useSearchParams } from 'next/navigation';
import type { UFORecord } from '@/lib/types';
import RecordsTable from '@/components/RecordsTable';

export default function RecordsTableWrapper({ records }: { records: UFORecord[] }) {
  const params = useSearchParams();
  const initialId = params.get('id') ?? undefined;
  return <RecordsTable records={records} initialId={initialId} />;
}
