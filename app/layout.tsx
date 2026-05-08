import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'PURSUE — UAP Records Dashboard',
  description:
    'Presidential Unsealing and Reporting System for UAP Encounters. Declassified government records on Unidentified Anomalous Phenomena.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="scanlines" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          style={{
            borderTop: '1px solid #1e2a3a',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            color: '#3d4f60',
            letterSpacing: '0.08em',
          }}
        >
          <span>PURSUE — PRESIDENTIAL UNSEALING AND REPORTING SYSTEM FOR UAP ENCOUNTERS</span>
          <span>RELEASE 01 // MAY 8, 2026 // UNCLASSIFIED</span>
        </footer>
      </body>
    </html>
  );
}
