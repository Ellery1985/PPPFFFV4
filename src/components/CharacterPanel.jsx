import Panel from './Panel'
import Divider from './Divider'
import { statNames, rankLabel, rankColor, COLORS } from '../constants'
import { mod } from '../utils'

const { g, gb, p, pd, st, il } = COLORS

export default function CharacterPanel({ character, open, onToggle }) {
  const isBuilt = character.name !== '待建角色'

  return (
    <Panel
      label="角色資訊"
      open={open}
      onToggle={onToggle}
      badge={isBuilt ? character.name : null}
    >
      {/* Basic info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem', fontSize: '0.83rem', marginBottom: '0.6rem' }}>
        {[['名字', character.name], ['職業', character.cls], ['種族', character.race], ['陣營', character.align], ['等級', character.level]].map(([k, v]) => (
          <div key={k}>
            <span style={{ color: st, fontSize: '0.7rem' }}>{k} </span>
            <span style={{ color: p }}>{v}</span>
          </div>
        ))}
      </div>

      {/* HP bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
        <span style={{ color: st, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>體力</span>
        <div style={{ flex: 1, height: 7, background: 'rgba(0,0,0,0.5)', border: `1px solid ${il}`, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(0, (character.hp / character.maxHp) * 100)}%`,
            background: 'linear-gradient(90deg,#8b1a1a,#c0392b)',
            transition: 'width 0.5s',
          }} />
        </div>
        <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{character.hp} / {character.maxHp}</span>
      </div>

      {/* Ability scores */}
      <Divider label="六項能力值" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.4rem', marginBottom: '0.2rem' }}>
        {Object.entries(character.stats || {}).map(([k, v]) => (
          <div key={k} style={{
            background: 'rgba(201,150,58,0.08)', border: '1px solid rgba(201,150,58,0.2)',
            borderRadius: 3, padding: '0.35rem 0.4rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', color: st, letterSpacing: '0.1em' }}>{statNames[k] || k}</div>
            <div style={{ fontSize: '1.1rem', color: gb, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: '0.75rem', color: pd }}>{mod(v)}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {character.skills?.length > 0 && <>
        <Divider label="技能" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 0.8rem' }}>
          {character.skills.map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '0.82rem', padding: '0.15rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div>
                <span style={{ color: p }}>{s.name}</span>
                <span style={{
                  marginLeft: '0.4rem', fontSize: '0.65rem',
                  color: rankColor[s.rank] || g,
                  background: 'rgba(0,0,0,0.3)', padding: '0.05rem 0.3rem', borderRadius: 2,
                }}>{rankLabel[s.rank] || s.rank}</span>
              </div>
              <span style={{ color: gb, fontWeight: 'bold' }}>{s.bonus >= 0 ? '+' : ''}{s.bonus}</span>
            </div>
          ))}
        </div>
      </>}

      {/* Feats */}
      {character.feats?.length > 0 && <>
        <Divider label="專長" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {character.feats.map((f, i) => {
            const [name, ...rest] = f.split('（')
            const desc = rest.join('（').replace(/）$/, '')
            return (
              <div key={i} style={{
                background: 'rgba(74,144,217,0.07)', border: '1px solid rgba(74,144,217,0.2)',
                borderRadius: 3, padding: '0.3rem 0.6rem', fontSize: '0.82rem',
              }}>
                <span style={{ color: '#7ab8f5' }}>{name}</span>
                {desc && <span style={{ color: st, fontSize: '0.75rem' }}> — {desc}</span>}
              </div>
            )
          })}
        </div>
      </>}
    </Panel>
  )
}
