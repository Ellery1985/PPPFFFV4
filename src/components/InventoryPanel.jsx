import Panel from './Panel'
import { typeIcon, typeLabel, COLORS } from '../constants'

const { g, gb, pd, st } = COLORS

export default function InventoryPanel({ items = [], open, onToggle }) {
  return (
    <Panel
      label="🎒 裝備欄"
      open={open}
      onToggle={onToggle}
      badge={items.length > 0 ? `${items.length}件` : null}
    >
      {items.length === 0
        ? <div style={{ color: st, fontStyle: 'italic', fontSize: '0.85rem' }}>（尚無裝備）</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {['weapon', 'armor', 'consumable', 'gear'].map(type => {
              const group = items.filter(it => it.type === type)
              if (!group.length) return null
              return (
                <div key={type}>
                  <div style={{ fontSize: '0.68rem', color: st, letterSpacing: '0.15em', margin: '0.3rem 0 0.2rem' }}>
                    {typeIcon[type]} {typeLabel[type]}
                  </div>
                  {group.map((item, i) => (
                    <div key={i} style={{
                      background: 'rgba(201,150,58,0.07)', border: '1px solid rgba(201,150,58,0.18)',
                      borderRadius: 3, padding: '0.35rem 0.7rem', marginBottom: '0.2rem',
                    }}>
                      <span style={{ color: gb, fontSize: '0.88rem' }}>{item.name}</span>
                      {item.detail && (
                        <div style={{ color: pd, fontSize: '0.78rem', marginTop: '0.15rem', lineHeight: 1.5 }}>
                          {item.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
      }
    </Panel>
  )
}
