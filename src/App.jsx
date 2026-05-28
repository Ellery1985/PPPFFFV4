import { useState, useEffect, useRef } from 'react'
import CharacterCreation from './components/CharacterCreation'
import CharacterPanel    from './components/CharacterPanel'
import InventoryPanel    from './components/InventoryPanel'
import { COLORS, defaultChar, buildSystemPrompt } from './constants'
import { parseGMReply, loadSave, writeSave, clearSave, exportSave } from './utils'
import { callClaude } from './api'

const { g, gb, p, pd, sh, st, il, bl } = COLORS

export default function App() {
  const saved = loadSave()

  // phase: 'creation' | 'game'
  const [phase, setPhase]         = useState(saved?.phase || 'creation')
  const [messages, setMessages]   = useState(saved?.messages || [])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [diceResult, setDiceResult] = useState(null)
  const [character, setCharacter] = useState(saved?.character || { ...defaultChar })
  const [systemPrompt, setSystemPrompt] = useState(saved?.systemPrompt || '')
  const [tab, setTab]             = useState('scene')
  const [charOpen, setCharOpen]   = useState(false)
  const [invOpen, setInvOpen]     = useState(false)
  const logRef  = useRef(null)
  const history = useRef(saved?.history || [])

  // Persist
  useEffect(() => {
    if (phase === 'game') {
      writeSave({ phase, messages, character, systemPrompt, history: history.current })
    }
  }, [messages, character, phase])

  // Auto-scroll log
  useEffect(() => {
    if (tab === 'log' && logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, tab])

  // ── Character creation complete ───────────────────────────────────────────
  const handleStart = async (char, campaignStyle, customDesc) => {
    const prompt = buildSystemPrompt(char, campaignStyle, customDesc)
    setCharacter({ ...defaultChar, ...char })
    setSystemPrompt(prompt)
    setPhase('game')
    history.current = []
    setMessages([])
    // kick off first GM message
    setLoading(true)
    setTab('scene')
    try {
      const initMsg = `冒險開始。請根據我的角色與劇情設定，生成這個世界，描述起始場景，並給我一個清晰的開場鉤子。`
      const { reply, messages: newHist } = await callClaude([], initMsg, prompt)
      history.current = newHist
      const { cleanText, charData } = parseGMReply(reply)
      if (charData) setCharacter(prev => ({ ...prev, ...charData, level: String(charData.level ?? prev.level) }))
      setMessages([{ type: 'gm', text: cleanText }])
    } catch (e) {
      setMessages([{ type: 'gm', text: '⚠ ' + e.message }])
    }
    setLoading(false)
  }

  // ── Send action ───────────────────────────────────────────────────────────
  const sendAction = async (action) => {
    const msg = action || input.trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)
    setTab('scene')
    setMessages(prev => [...prev, { type: 'player', text: msg }])
    try {
      const { reply, messages: newHist } = await callClaude(history.current, msg, systemPrompt)
      history.current = newHist
      const { cleanText, charData } = parseGMReply(reply)
      if (charData) setCharacter(prev => ({ ...prev, ...charData, level: String(charData.level ?? prev.level) }))
      setMessages(prev => [...prev, { type: 'gm', text: cleanText }])
    } catch (e) {
      setMessages(prev => [...prev, { type: 'gm', text: '⚠ ' + e.message }])
    }
    setLoading(false)
  }

  // ── Dice ──────────────────────────────────────────────────────────────────
  const rollDice = (sides) => {
    const roll = Math.floor(Math.random() * sides) + 1
    let q = ''
    if (sides === 20) {
      if (roll === 20) q = '✨ 大成功！'
      else if (roll >= 17) q = '✅ 成功'
      else if (roll >= 10) q = '⚡ 普通'
      else if (roll >= 2) q = '❌ 失敗'
      else q = '💀 大失敗！'
    }
    setDiceResult({ sides, roll, q })
    setInput(`（擲出 d${sides}，結果：${roll}）`)
  }

  // ── Load file ─────────────────────────────────────────────────────────────
  const loadFromFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result)
        history.current = d.history || []
        setCharacter(d.character || { ...defaultChar })
        setMessages(d.messages || [])
        setSystemPrompt(d.systemPrompt || '')
        setPhase(d.phase || 'game')
      } catch { alert('存檔格式錯誤') }
    }
    reader.readAsText(file)
  }

  // ── New game ──────────────────────────────────────────────────────────────
  const newGame = () => {
    if (!window.confirm('確定要開始新冒險嗎？目前進度將會儲存為匯出檔。')) return
    exportSave({ phase, messages, character, systemPrompt, history: history.current })
    clearSave()
    history.current = []
    setMessages([])
    setCharacter({ ...defaultChar })
    setSystemPrompt('')
    setPhase('creation')
    setDiceResult(null)
  }

  // ── Render: creation phase ────────────────────────────────────────────────
  if (phase === 'creation') {
    return <CharacterCreation onStart={handleStart} />
  }

  // ── Render: game phase ────────────────────────────────────────────────────
  const lastGM  = [...messages].reverse().find(m => m.type === 'gm')
  const btnBase = { fontFamily: 'Georgia,serif', cursor: 'pointer', borderRadius: 3, fontSize: '0.8rem', padding: '0.4rem 0.3rem', border: `1px solid ${il}`, background: 'rgba(44,26,14,0.8)', color: pd }
  const diceBtn = { ...btnBase, border: `1px solid ${bl}`, background: 'rgba(139,26,26,0.2)', color: '#e07070' }

  return (
    <div style={{ background: sh, minHeight: '100vh', fontFamily: 'Georgia,serif', color: p, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '0.8rem 1rem', borderBottom: `2px solid ${g}`, background: 'rgba(0,0,0,0.5)', flexShrink: 0, position: 'relative' }}>
        <div style={{ fontSize: '1.3rem', color: gb, fontWeight: 'bold', textShadow: '0 0 20px rgba(240,184,74,0.4)' }}>⚔ 巡路者傳奇 ⚔</div>
        <div style={{ fontSize: '0.68rem', color: st, letterSpacing: '0.2em', marginTop: '0.15rem' }}>
          {character.name} · {character.race} {character.cls} · Lv.{character.level}
        </div>
        <button onClick={newGame} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', ...btnBase, fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}>
          ✦ 新冒險
        </button>
      </div>

      <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', padding: '0.6rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Save bar */}
        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
          <button onClick={() => exportSave({ phase, messages, character, systemPrompt, history: history.current })}
            style={{ ...btnBase, padding: '0.25rem 0.6rem', border: `1px solid ${g}`, color: gb, fontSize: '0.75rem' }}>
            💾 匯出
          </button>
          <label style={{ ...btnBase, padding: '0.25rem 0.6rem', border: `1px solid ${g}`, color: gb, fontSize: '0.75rem', cursor: 'pointer' }}>
            📂 載入<input type="file" accept=".json" onChange={loadFromFile} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Panels */}
        <CharacterPanel character={character} open={charOpen} onToggle={() => setCharOpen(v => !v)} />
        <InventoryPanel items={character.items} open={invOpen} onToggle={() => setInvOpen(v => !v)} />

        {/* Tabs */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {['scene', 'log'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.38rem', fontFamily: 'Georgia,serif', fontSize: '0.78rem', cursor: 'pointer',
              borderRadius: t === 'scene' ? '3px 0 0 3px' : '0 3px 3px 0',
              background: tab === t ? 'rgba(201,150,58,0.22)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${tab === t ? g : il}`, color: tab === t ? gb : pd,
            }}>
              {t === 'scene' ? '📜 當前場景' : '📖 完整劇情'}
            </button>
          ))}
        </div>

        {/* Scene */}
        {tab === 'scene' && (
          <div style={{ background: 'linear-gradient(180deg,rgba(30,18,8,0.98),rgba(20,12,5,0.99))', border: `1px solid ${g}`, borderRadius: 4, padding: '1rem', minHeight: 180, flex: 1, overflowY: 'auto' }}>
            <div style={{ color: g, fontSize: '0.66rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>場景描述</div>
            <div style={{ fontSize: '0.97rem', lineHeight: 1.9, color: p, whiteSpace: 'pre-wrap' }}>
              {loading ? '地城主思考中⋯' : (lastGM?.text || '正在召喚世界⋯')}
            </div>
          </div>
        )}

        {/* Log */}
        {tab === 'log' && (
          <div ref={logRef} style={{ background: 'rgba(10,6,2,0.95)', border: `1px solid ${g}`, borderRadius: 4, padding: '0.8rem', flex: 1, overflowY: 'auto', minHeight: 180 }}>
            <div style={{ color: g, fontSize: '0.66rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>完整劇情紀錄</div>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(201,150,58,0.08)' }}>
                <div style={{ fontSize: '0.68rem', color: m.type === 'player' ? gb : '#c06050', marginBottom: '0.15rem', letterSpacing: '0.1em' }}>
                  {m.type === 'player' ? `▷ ${character.name}` : '◆ 地城主'}
                </div>
                <div style={{ fontSize: '0.92rem', lineHeight: 1.8, color: m.type === 'player' ? pd : p, whiteSpace: 'pre-wrap', fontStyle: m.type === 'gm' ? 'italic' : 'normal' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: g, fontStyle: 'italic', fontSize: '0.85rem' }}>地城主思考中⋯</div>}
          </div>
        )}

        {/* Dice result */}
        {diceResult && (
          <div style={{ background: 'rgba(201,150,58,0.1)', border: `1px solid ${g}`, borderRadius: 4, padding: '0.35rem 1rem', textAlign: 'center', flexShrink: 0 }}>
            <span style={{ color: st, fontSize: '0.7rem' }}>d{diceResult.sides} </span>
            <span style={{ fontSize: '1.8rem', color: gb, textShadow: `0 0 12px ${g}`, margin: '0 0.4rem' }}>{diceResult.roll}</span>
            <span style={{ color: pd, fontSize: '0.83rem' }}>{diceResult.q}</span>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.35rem', flexShrink: 0 }}>
          {[['🔍 察覺', '我仔細觀察四周環境'], ['💬 交涉', '我試著與對方交談，套取情報'], ['🗝 搜查', '我搜查這個地方，尋找隱藏的東西']].map(([l, a]) => (
            <button key={l} onClick={() => sendAction(a)} disabled={loading} style={btnBase}>{l}</button>
          ))}
          {[20, 6, 4].map(s => (
            <button key={s} onClick={() => rollDice(s)} disabled={loading} style={diceBtn}>🎲 d{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAction() } }}
            placeholder="輸入你的行動或對話⋯（Enter 送出，Shift+Enter 換行）"
            rows={2} disabled={loading}
            style={{ flex: 1, background: 'rgba(20,12,5,0.9)', border: `1px solid ${il}`, borderRadius: 3, color: p, fontFamily: 'Georgia,serif', fontSize: '0.93rem', padding: '0.55rem 0.8rem', outline: 'none', resize: 'none' }}
          />
          <button onClick={() => sendAction()} disabled={loading || !input.trim()}
            style={{ background: 'rgba(201,150,58,0.3)', border: `1px solid ${g}`, color: gb, fontFamily: 'serif', fontSize: '0.85rem', padding: '0.55rem 1rem', cursor: 'pointer', borderRadius: 3, whiteSpace: 'nowrap', opacity: (loading || !input.trim()) ? 0.5 : 1 }}>
            行動 ▶
          </button>
        </div>

      </div>
    </div>
  )
}
