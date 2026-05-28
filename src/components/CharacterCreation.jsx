import { useState } from 'react'
import { RACES, CLASSES, ALIGNMENTS, CAMPAIGN_STYLES, COLORS } from '../constants'

const { g, gb, p, pd, sh, st, il, bl } = COLORS

// ── helpers ──────────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <div style={{ color: st, fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '0.4rem' }}>
    {children}
  </div>
)

function OptionGrid({ options, value, onChange, columns = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '0.4rem' }}>
      {options.map(opt => {
        const id    = typeof opt === 'string' ? opt : opt.id
        const label = typeof opt === 'string' ? opt : opt.label
        const icon  = typeof opt === 'string' ? null : opt.icon
        const desc  = typeof opt === 'string' ? null : opt.desc
        const sel   = value === id
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            background: sel ? 'rgba(201,150,58,0.2)' : 'rgba(30,18,8,0.8)',
            border: `1px solid ${sel ? gb : il}`,
            borderRadius: 4, padding: desc ? '0.6rem 0.5rem' : '0.45rem 0.3rem',
            color: sel ? gb : pd, cursor: 'pointer',
            fontFamily: 'Georgia,serif', fontSize: '0.82rem',
            textAlign: desc ? 'left' : 'center',
            transition: 'all 0.15s',
          }}>
            {icon && <span style={{ marginRight: '0.35rem' }}>{icon}</span>}
            <span style={{ fontWeight: sel ? 'bold' : 'normal' }}>{label}</span>
            {desc && <div style={{ color: st, fontSize: '0.72rem', marginTop: '0.25rem', lineHeight: 1.4 }}>{desc}</div>}
          </button>
        )
      })}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'rgba(20,12,5,0.9)',
        border: `1px solid ${il}`, borderRadius: 3,
        color: p, fontFamily: 'Georgia,serif', fontSize: '0.97rem',
        padding: '0.6rem 0.9rem', outline: 'none',
      }}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        width: '100%', background: 'rgba(20,12,5,0.9)',
        border: `1px solid ${il}`, borderRadius: 3,
        color: p, fontFamily: 'Georgia,serif', fontSize: '0.93rem',
        padding: '0.6rem 0.9rem', outline: 'none', resize: 'vertical',
      }}
    />
  )
}

// ── step definitions ──────────────────────────────────────────────────────────
const STEPS = ['name', 'race', 'class', 'align', 'campaign']

// ── main component ────────────────────────────────────────────────────────────
export default function CharacterCreation({ onStart }) {
  const [step, setStep]           = useState(0)
  const [name, setName]           = useState('')
  const [race, setRace]           = useState('')
  const [cls, setCls]             = useState('')
  const [align, setAlign]         = useState('')
  const [campaign, setCampaign]   = useState('')
  const [customDesc, setCustomDesc] = useState('')

  const stepKey = STEPS[step]
  const isLast  = step === STEPS.length - 1

  const canNext = () => {
    if (stepKey === 'name')     return name.trim().length > 0
    if (stepKey === 'race')     return race !== ''
    if (stepKey === 'class')    return cls !== ''
    if (stepKey === 'align')    return align !== ''
    if (stepKey === 'campaign') return campaign !== '' && (campaign !== 'custom' || customDesc.trim().length > 0)
    return false
  }

  const handleNext = () => {
    if (!canNext()) return
    if (isLast) {
      onStart({ name: name.trim(), race, cls, align }, campaign, customDesc.trim())
    } else {
      setStep(s => s + 1)
    }
  }

  // progress bar
  const Progress = () => (
    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem' }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i <= step ? gb : 'rgba(201,150,58,0.2)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: sh, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.8rem', color: gb, fontWeight: 'bold', textShadow: `0 0 24px rgba(240,184,74,0.4)` }}>⚔ 巡路者傳奇 ⚔</div>
        <div style={{ fontSize: '0.72rem', color: st, letterSpacing: '0.3em', marginTop: '0.3rem' }}>PATHFINDER 2E · 角色建立</div>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'linear-gradient(160deg,rgba(44,26,14,0.97),rgba(20,12,5,0.99))',
        border: `1px solid ${g}`, borderRadius: 6,
        padding: '1.5rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
      }}>
        <Progress />

        {/* ── Step: Name ── */}
        {stepKey === 'name' && <>
          <Label>第一步 · 為你的冒險者命名</Label>
          <div style={{ fontSize: '1rem', color: p, marginBottom: '1rem', lineHeight: 1.7 }}>
            這個名字將隨著你的故事流傳下去。
          </div>
          <TextInput value={name} onChange={setName} placeholder="輸入角色名字⋯" />
        </>}

        {/* ── Step: Race ── */}
        {stepKey === 'race' && <>
          <Label>第二步 · 選擇種族</Label>
          <OptionGrid options={RACES} value={race} onChange={setRace} columns={3} />
        </>}

        {/* ── Step: Class ── */}
        {stepKey === 'class' && <>
          <Label>第三步 · 選擇職業</Label>
          <OptionGrid options={CLASSES} value={cls} onChange={setCls} columns={3} />
        </>}

        {/* ── Step: Alignment ── */}
        {stepKey === 'align' && <>
          <Label>第四步 · 選擇陣營</Label>
          <OptionGrid options={ALIGNMENTS} value={align} onChange={setAlign} columns={3} />
        </>}

        {/* ── Step: Campaign ── */}
        {stepKey === 'campaign' && <>
          <Label>第五步 · 選擇劇情風格</Label>
          <div style={{ marginBottom: '0.8rem' }}>
            <OptionGrid
              options={CAMPAIGN_STYLES}
              value={campaign}
              onChange={setCampaign}
              columns={2}
            />
          </div>
          {campaign === 'custom' && (
            <div style={{ marginTop: '0.7rem' }}>
              <Label>描述你想要的故事⋯</Label>
              <TextArea
                value={customDesc}
                onChange={setCustomDesc}
                placeholder="例：我想在一個被詛咒的沙漠王國裡，扮演一個尋找失散家人的流浪武士⋯"
                rows={4}
              />
            </div>
          )}
        </>}

        {/* ── Navigation ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.4rem' }}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            style={{
              background: 'transparent', border: `1px solid ${il}`,
              color: step === 0 ? il : pd, borderRadius: 3,
              padding: '0.5rem 1rem', cursor: step === 0 ? 'default' : 'pointer',
              fontFamily: 'Georgia,serif', fontSize: '0.85rem',
            }}
          >
            ← 上一步
          </button>

          {/* Summary in middle */}
          <div style={{ color: st, fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.6 }}>
            {name && <span style={{ color: pd }}>{name}</span>}
            {race && <span style={{ color: st }}> · {race}</span>}
            {cls  && <span style={{ color: st }}> · {cls}</span>}
          </div>

          <button
            onClick={handleNext}
            disabled={!canNext()}
            style={{
              background: canNext() ? 'rgba(201,150,58,0.3)' : 'rgba(0,0,0,0.2)',
              border: `1px solid ${canNext() ? g : il}`,
              color: canNext() ? gb : il,
              borderRadius: 3, padding: '0.5rem 1.2rem',
              cursor: canNext() ? 'pointer' : 'default',
              fontFamily: 'Georgia,serif', fontSize: '0.88rem',
              transition: 'all 0.15s',
            }}
          >
            {isLast ? '開始冒險 ▶' : '下一步 →'}
          </button>
        </div>
      </div>

      {/* Flavour text */}
      <div style={{ color: st, fontSize: '0.75rem', marginTop: '1.5rem', textAlign: 'center', letterSpacing: '0.1em' }}>
        由 Claude AI 擔任地城主 · Pathfinder 2e 規則框架
      </div>
    </div>
  )
}
