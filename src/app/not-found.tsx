import Link from 'next/link'
import GameBackground from '@/components/GameBackground'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, position: 'relative',
    }}>
      <GameBackground />
      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: 24,
        padding: '40px 32px', maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🗺️</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0D1B2A', marginBottom: 8 }}>
          404
        </h1>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1B8A8F', marginBottom: 8 }}>
          Lost in the Realm
        </p>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 28, lineHeight: 1.6 }}>
          This page doesn&apos;t exist in our world yet.
          <br />
          <span style={{ fontSize: 12 }}>此页面暂不存在。</span>
        </p>
        <Link href="/" style={{
          display: 'block', padding: '14px 24px',
          background: 'linear-gradient(135deg,#1B8A8F,#2ABFBF)',
          borderRadius: 14, color: 'white', fontSize: 14, fontWeight: 700,
          textDecoration: 'none',
        }}>
          ← Return to Adventure
        </Link>
      </div>
    </div>
  )
}
