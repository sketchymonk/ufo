'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',         label: 'Overview' },
  { href: '/records',  label: 'Records' },
  { href: '/gallery',  label: 'Gallery' },
  { href: '/map',      label: 'Map' },
  { href: '/timeline', label: 'Timeline' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Classification banner */}
      <div
        style={{
          background: '#16a34a',
          textAlign: 'center',
          padding: '3px 0',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: '#fff',
        }}
      >
        UNCLASSIFIED // CLEARED FOR PUBLIC RELEASE // PURSUE RELEASE 01 — MAY 8, 2026
      </div>

      {/* Main nav */}
      <nav
        style={{
          background: '#0d1117',
          borderBottom: '1px solid #1e2a3a',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          height: 52,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.12em',
            color: '#dde2ec',
            textDecoration: 'none',
            marginRight: 32,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#d97706' }}>▲</span>{' '}PURSUE
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  fontWeight: active ? 700 : 400,
                  color: active ? '#d97706' : '#6b7d91',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid #d97706' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {label.toUpperCase()}
              </Link>
            );
          })}
        </div>

        {/* Source link */}
        <a
          href="https://www.war.gov/ufo/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.6rem',
            color: '#3d4f60',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          SOURCE: WAR.GOV/UFO ↗
        </a>
      </nav>
    </header>
  );
}
