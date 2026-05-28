import { COLORS } from '../constants'
const { g, st } = COLORS

export default function Panel({ label, open, onToggle, badge, children }) {
  return (
    <div style={{ border: `1px solid ${g}`, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg,rgba(44,26,14,0.95),rgba(26,15,5,0.98))',
          border: 'none', padding: '0.6rem 1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', color: '#f0b84a', fontFamily: 'Georgia,serif', fontSize: '0.82rem',
        }}
      >
        <span>
          {label}
          {badge && (
            <span style={{
              background: 'rgba(201,150,58,0.2)', border: `1px solid ${g}`,
              borderRadius: 10, padding: '0.1rem 0.5rem',
              fontSize: '0.72rem', marginLeft: '0.4rem',
            }}>{badge}</span>
          )}
        </span>
        <span style={{ color: st }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ background: 'rgba(20,12,5,0.97)', padding: '0.7rem 1rem' }}>
          {children}
        </div>
      )}
    </div>
  )
}
