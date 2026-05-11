export type Agency =
  | 'FBI'
  | 'DOW'
  | 'NASA'
  | 'ODNI'
  | 'DOE'
  | 'AARO'
  | 'ARMY'
  | 'USAF'
  | 'INDOPACOM'
  | 'CIA'
  | 'DIA'
  | 'DOS';

export type RecordType = 'PHOTO' | 'VIDEO' | 'REPORT' | 'COMPOSITE' | 'ARCHIVAL' | 'DOCUMENT';

export type Classification =
  | 'TOP_SECRET'
  | 'SECRET'
  | 'CONFIDENTIAL'
  | 'UNCLASSIFIED'
  | 'DECLASSIFIED';

export interface UFORecord {
  id: string;
  caseNumber?: string;
  agency: Agency;
  releaseDate: string;
  incidentDate: string;
  incidentLocation: string;
  coordinates?: [number, number];
  type: RecordType;
  description: string;
  imageUrl?: string;
  downloadUrl?: string;
  classification: Classification;
  section?: string;
  pdfPageCount?: number;
  pdfText?: string;
  classificationMarkings?: string[];
  redactedSectionCount?: number;
  tags?: string[];
  downloadUrls?: string[];
  sectionCount?: number;
  videoUrl?: string;
  imageUrls?: string[];
  localFilename?: string;
}

export interface RecordsData {
  scrapedAt?: string;
  source?: string;
  totalRecords: number;
  records: UFORecord[];
}
