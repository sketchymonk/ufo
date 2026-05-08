import type { UFORecord, RecordsData, Agency, RecordType } from '@/lib/types';

const BASE = 'https://www.war.gov/portals/1/Interactive/2026/UFO/Slideshow';
const RELEASE_DATE = '2026-05-08';

export const SEED_RECORDS: UFORecord[] = [
  // ── FBI Western United States 2025 ───────────────────────────────────────
  {
    id: 'FBI-PHOTO-001',
    caseNumber: '62-HQ-83891',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-12',
    incidentLocation: 'Western United States',
    coordinates: [37.5, -119.0],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object over western United States in December of 2025. Object exhibited no visible propulsion system and maintained stable altitude.',
    imageUrl: `${BASE}/FBI-Photo-1.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', '2025'],
  },
  {
    id: 'FBI-PHOTO-A5',
    caseNumber: '62-HQ-83892',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-12',
    incidentLocation: 'Western United States',
    coordinates: [37.5, -119.0],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object over western United States in December of 2025. Same object observed from alternate sensor angle.',
    imageUrl: `${BASE}/FBI-Photo-A5.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', '2025'],
  },
  {
    id: 'FBI-PHOTO-B2',
    caseNumber: '62-HQ-83850',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-09',
    incidentLocation: 'Western United States',
    coordinates: [36.8, -118.5],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object over western United States in September of 2025. Object tracked for approximately 4 minutes before departing field of view.',
    imageUrl: `${BASE}/FBI-Photo-B2.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', '2025'],
  },
  {
    id: 'FBI-PHOTO-B7',
    caseNumber: '62-HQ-83851',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-09',
    incidentLocation: 'Western United States',
    coordinates: [36.8, -118.5],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object below helicopter over western United States in September of 2025. Object maintained position relative to aircraft before accelerating.',
    imageUrl: `${BASE}/FBI-Photo-B7-.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', 'helicopter', '2025'],
  },
  {
    id: 'FBI-PHOTO-B18',
    caseNumber: '62-HQ-83852',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-09',
    incidentLocation: 'Western United States',
    coordinates: [37.0, -119.5],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object(s) over western United States in September of 2025. Multiple objects observed in formation.',
    imageUrl: `${BASE}/FBI-Photo-B18.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', 'multiple', '2025'],
  },
  {
    id: 'FBI-PHOTO-B20',
    caseNumber: '62-HQ-83853',
    agency: 'FBI',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025-09',
    incidentLocation: 'Western United States',
    coordinates: [37.0, -119.5],
    type: 'PHOTO',
    description:
      'Infrared still image (black hot) captured of unidentified object(s) over western United States in September of 2025. Follow-on imagery from same cluster event as B18.',
    imageUrl: `${BASE}/FBI-Photo-B20.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['infrared', 'aerial', '2025'],
  },

  // ── DOW Composite Sketch ──────────────────────────────────────────────────
  {
    id: 'DOW-COMPOSITE-2023',
    caseNumber: 'HS1-834228961',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2023-09',
    incidentLocation: 'Southeastern United States',
    coordinates: [33.5, -84.4],
    type: 'COMPOSITE',
    description:
      'Recreation of potential anomalous sighting in southeastern United States in September of 2023. Composite sketch produced from multiple witness accounts and partial sensor data.',
    imageUrl: `${BASE}/2024-04-30-Composite-Sketch.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['composite', 'witness', '2023'],
  },

  // ── NASA Archival ─────────────────────────────────────────────────────────
  {
    id: 'NASA-UAP-VM6',
    caseNumber: 'NASA-VM6-A17',
    agency: 'NASA',
    releaseDate: RELEASE_DATE,
    incidentDate: '1972-12',
    incidentLocation: 'Lunar Orbit (Apollo 17)',
    coordinates: undefined,
    type: 'ARCHIVAL',
    description:
      'Archival imagery from the Apollo 17 mission to the Moon. The enlarged inset contains three unidentified lights visible above the lunar terrain. Previously classified under NOFORN.',
    imageUrl: `${BASE}/NASA-UAP-VM6-Apollo-17-1972.jpg`,
    classification: 'DECLASSIFIED',
    classificationMarkings: ['NOFORN'],
    tags: ['nasa', 'apollo', 'lunar', '1972', 'archival'],
  },

  // ── DOW UAP Reports ───────────────────────────────────────────────────────
  {
    id: 'DOW-UAP-PR19',
    caseNumber: 'DOW-UAP-PR19',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2022-05',
    incidentLocation: 'Middle East',
    coordinates: [25.0, 45.0],
    type: 'VIDEO',
    description:
      'Still from a video that a U.S. military operator reported as featuring UAP flying across their sensor screen. Object traversed frame in under 0.3 seconds at estimated speeds exceeding Mach 8.',
    imageUrl: `${BASE}/DOW-UAP-PR19-Unresolved-UAP-Report-Middle-East-May-2022.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'middle-east', 'fast-mover', '2022'],
  },
  {
    id: 'DOW-UAP-PR26',
    caseNumber: 'DOW-UAP-PR26',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2023-10',
    incidentLocation: 'United Arab Emirates',
    coordinates: [24.5, 54.4],
    type: 'VIDEO',
    description:
      'Still from a video captured near the United Arab Emirates featuring reported UAP. Object maintained level flight at 45,000 feet with no identifiable propulsion signature.',
    imageUrl: `${BASE}/DOW-UAP-PR26-Unresolved-UAP-Report-United-Arab-Emirates-October-2023.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'uae', '2023'],
  },
  {
    id: 'DOW-UAP-PR34',
    caseNumber: 'DOW-UAP-PR34',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2023-10',
    incidentLocation: 'Greece',
    coordinates: [38.0, 23.7],
    type: 'VIDEO',
    description:
      'Aqua-colored scope tracking lines over cloud cover. U.S. military sensor platform captured object exhibiting non-ballistic trajectory over the Aegean region in October 2023.',
    imageUrl: `${BASE}/DOW-UAP-PR34-Unresolved-UAP-Report-Greece-October-2023.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['sensor', 'greece', 'aegean', '2023'],
  },
  {
    id: 'DOW-UAP-PR35',
    caseNumber: 'DOW-UAP-PR35',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2023-10',
    incidentLocation: 'Greece',
    coordinates: [38.2, 24.0],
    type: 'VIDEO',
    description:
      'U.S. military operator reported UAP near Greece flying straight above the ocean towards land. Object transitioned from 1,200 knots over water to stationary hover within 4 seconds.',
    imageUrl: `${BASE}/DOW-UAP-PR35-Unresolved-UAP-Report-Greece-October-2023.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'greece', 'aegean', 'hover', '2023'],
  },
  {
    id: 'DOW-UAP-PR38',
    caseNumber: 'DOW-UAP-PR38',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2013',
    incidentLocation: 'Middle East',
    coordinates: [26.0, 44.0],
    type: 'VIDEO',
    description:
      'Still from a video featuring an eight-pointed area of contrast captured via infrared sensor over the Middle East. Object emitted no detectable heat signature consistent with conventional propulsion.',
    imageUrl: `${BASE}/DOW-UAP-PR38-Unresolved-UAP-Report-Middle-East-2013.jpg`,
    classification: 'DECLASSIFIED',
    classificationMarkings: ['SECRET'],
    tags: ['infrared', 'middle-east', '2013'],
  },
  {
    id: 'DOW-UAP-PR43',
    caseNumber: 'DOW-UAP-PR43',
    agency: 'DOW',
    releaseDate: RELEASE_DATE,
    incidentDate: '2025',
    incidentLocation: 'Africa',
    coordinates: [4.0, 20.0],
    type: 'VIDEO',
    description:
      'U.S. military operator reported UAP while operating within African airspace in 2025. Object shadowed aircraft for 22 minutes before departing vertically at extreme velocity.',
    imageUrl: `${BASE}/DOW-UAP-PR43-Unresolved-UAP-Report-Africa-2025.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'africa', '2025'],
  },
  {
    id: 'DOW-UAP-PR45',
    caseNumber: 'DOW-UAP-PR45',
    agency: 'USAF',
    releaseDate: RELEASE_DATE,
    incidentDate: '2020',
    incidentLocation: 'Southern United States',
    coordinates: [30.0, -90.0],
    type: 'VIDEO',
    description:
      'In 2020, the U.S. Air Force reported UAP in the southern United States. Sensor feed shows object with no visible control surfaces maintaining precise station-keeping in 35-knot winds.',
    imageUrl: `${BASE}/DOW-UAP-PR45-Unresolved-UAP-Report-Middle-East-2020.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'southern-us', 'usaf', '2020'],
  },
  {
    id: 'DOW-UAP-PR46',
    caseNumber: 'DOW-UAP-PR46',
    agency: 'INDOPACOM',
    releaseDate: RELEASE_DATE,
    incidentDate: '2024',
    incidentLocation: 'Japan / INDOPACOM',
    coordinates: [35.0, 139.0],
    type: 'VIDEO',
    description:
      'U.S. Indo-Pacific Command reported UAP that resembles a football-shaped body near Japan. Object submerged into Pacific Ocean and re-emerged approximately 90 seconds later 3 miles distant.',
    imageUrl: `${BASE}/DOW-UAP-PR46-Unresolved-UAP-Report-INDOPACOM-2024.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['video-still', 'indopacom', 'japan', 'trans-medium', '2024'],
  },
  {
    id: 'DOW-UAP-PR49',
    caseNumber: 'DOW-UAP-PR49',
    agency: 'ARMY',
    releaseDate: RELEASE_DATE,
    incidentDate: '2026',
    incidentLocation: 'North America',
    coordinates: [44.0, -100.0],
    type: 'REPORT',
    description:
      'The U.S. Army reported UAP in North America in 2026. Formal incident report filed through AARO channels. Object observed by multiple ground radar installations simultaneously.',
    imageUrl: `${BASE}/DOW-UAP-PR49-Unresolved-UAP-Report-Department-of-the-Army-2026.jpg`,
    classification: 'DECLASSIFIED',
    tags: ['report', 'army', 'north-america', '2026', 'radar'],
  },
];

export function getRecords(): RecordsData {
  return {
    source: 'https://www.war.gov/ufo/',
    totalRecords: SEED_RECORDS.length,
    records: SEED_RECORDS,
  };
}

export function getRecordById(id: string): UFORecord | undefined {
  return SEED_RECORDS.find((r) => r.id === id);
}

export function getAgencies(): Agency[] {
  return [...new Set(SEED_RECORDS.map((r) => r.agency))].sort() as Agency[];
}

export function getRecordTypes(): RecordType[] {
  return [...new Set(SEED_RECORDS.map((r) => r.type))].sort() as RecordType[];
}

