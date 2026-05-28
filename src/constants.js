export const STORAGE_KEY = 'pathfinder_save_v4'

export const RACES = ['人類', '精靈', '矮人', '地精', '半身人', '侏儒', '半精靈', '半獸人', '獸人', '蜥蜴人']
export const CLASSES = ['戰士', '遊俠', '盜賊', '法師', '牧師', '德魯伊', '吟遊詩人', '聖武士', '野蠻人', '武僧', '術士', '巫師']
export const ALIGNMENTS = ['守序善良', '中立善良', '混亂善良', '守序中立', '真正中立', '混亂中立', '守序邪惡', '中立邪惡', '混亂邪惡']
export const CAMPAIGN_STYLES = [
  { id: 'adventure',  label: '奇幻冒險',   icon: '⚔️',  desc: '探索地下城、打倒怪物、尋找寶藏' },
  { id: 'intrigue',   label: '政治陰謀',   icon: '🕵️', desc: '宮廷鬥爭、派系角力、謊言與背叛' },
  { id: 'horror',     label: '黑暗恐怖',   icon: '💀',  desc: '邪神崇拜、不死生物、瘋狂與黑暗' },
  { id: 'mystery',    label: '懸疑調查',   icon: '🔍',  desc: '謀殺案件、失蹤人口、古老秘密' },
  { id: 'seafaring',  label: '海洋探索',   icon: '⚓',  desc: '航海冒險、海盜、神秘島嶼與海怪' },
  { id: 'war',        label: '戰爭史詩',   icon: '🏰',  desc: '國家戰爭、軍事策略、英雄與犧牲' },
  { id: 'custom',     label: '自訂劇情',   icon: '✨',  desc: '告訴 GM 你想要的故事' },
]

export function buildSystemPrompt(char, campaignStyle, customDesc) {
  const styleNote = campaignStyle === 'custom'
    ? `玩家想要的劇情：${customDesc}`
    : `劇情風格：${CAMPAIGN_STYLES.find(s => s.id === campaignStyle)?.label}——${CAMPAIGN_STYLES.find(s => s.id === campaignStyle)?.desc}`

  return `你是一位《巡路者傳奇》（Pathfinder 2e）的地城主（GM），正在主持一場中文單人跑團。

【玩家角色】
名字：${char.name}　種族：${char.race}　職業：${char.cls}　陣營：${char.align}

【劇情設定】
${styleNote}

【世界生成規則】
- 第一次回應時，根據劇情風格創造一個原創世界：包含世界名稱、當前地點、時代背景、核心衝突
- 世界設定要有內在邏輯，地名、NPC、勢力都要原創且有個性
- 主線任務要與劇情風格吻合，並在開場時埋下清晰的鉤子讓玩家投入

【Pathfinder 2e 規則】
- 每次回應末尾必須輸出角色狀態 JSON，格式如下，用 ===JSON_START=== 和 ===JSON_END=== 包住：
===JSON_START===
{
  "name":"${char.name}","race":"${char.race}","cls":"${char.cls}","align":"${char.align}","level":1,
  "hp":20,"maxHp":20,
  "stats":{"str":10,"dex":10,"con":10,"int":10,"wis":10,"cha":10},
  "skills":[{"name":"運動","rank":"trained","bonus":5}],
  "feats":["專長名稱（簡短說明）"],
  "items":[
    {"name":"武器名","type":"weapon","detail":"1d8 斬擊，精準+1"},
    {"name":"防具名","type":"armor","detail":"AC+2"},
    {"name":"道具名","type":"gear","detail":"功能說明"}
  ]
}
===JSON_END===
- 根據職業給予合理的初始能力值、技能、專長與裝備
- 定期要求技能檢定（說明 DC 值）；大成功有額外收穫，大失敗有代價
- 描述戰鬥時詢問玩家回合行動，追蹤 HP 變化
- 升級時更新 level 並給予新專長

【敘事規則】
- 每次回應 150–300 字，場景生動、細節豐富、NPC 有個性
- 給玩家 2–3 個明確的行動方向（但不限制其他行動）
- 保持懸念與張力，適時埋伏筆
- 使用繁體中文，文風雅緻流暢`
}

export const defaultChar = {
  name: '', race: '', cls: '', align: '',
  level: '1', hp: 20, maxHp: 20,
  stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skills: [], feats: [], items: []
}

export const statNames   = { str: '力量', dex: '敏捷', con: '體質', int: '智力', wis: '感知', cha: '魅力' }
export const rankLabel   = { trained: '熟練', expert: '專精', master: '大師', legendary: '傳奇' }
export const rankColor   = { trained: '#c9963a', expert: '#4a90d9', master: '#9b59b6', legendary: '#e74c3c' }
export const typeIcon    = { weapon: '⚔', armor: '🛡', gear: '🎒', consumable: '⚗' }
export const typeLabel   = { weapon: '武器', armor: '防具', consumable: '消耗品', gear: '道具' }

export const COLORS = {
  g: '#c9963a', gb: '#f0b84a', p: '#f5e6c8', pd: '#e8d5a3',
  sh: '#1a0f05', st: '#6b5a4e', bl: '#8b1a1a', il: '#5c3a1e',
}
