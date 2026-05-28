export default function Divider({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      margin: '0.6rem 0 0.4rem', color: '#6b5a4e',
      fontSize: '0.7rem', letterSpacing: '0.15em',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,150,58,0.2)' }} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'rgba(201,150,58,0.2)' }} />
    </div>
  )
}
