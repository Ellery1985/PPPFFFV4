# 巡路者傳奇 — 碎鏡大陸

Pathfinder 2e AI 跑團遊戲，以 Claude AI 擔任地城主。

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定 API Key
複製 `.env.example` 為 `.env`，填入你的 Anthropic API key：
```bash
cp .env.example .env
```
打開 `.env`，把 `sk-ant-xxxxxxxxxx` 換成你的真實 key：
```
VITE_ANTHROPIC_API_KEY=sk-ant-你的key
```
API key 可在 https://console.anthropic.com 取得。

### 3. 本機執行
```bash
npm run dev
```
打開 http://localhost:5173 即可開始遊玩。

---

## 部署到 Vercel

### 方法一：Vercel CLI
```bash
npm install -g vercel
vercel
```
部署時在 Vercel 後台設定環境變數：
- Key: `VITE_ANTHROPIC_API_KEY`
- Value: 你的 API key

### 方法二：GitHub + Vercel 自動部署
1. 把專案推上 GitHub（**確認 `.env` 在 `.gitignore` 裡，不要上傳 API key**）
2. 到 https://vercel.com 連結 GitHub repo
3. 在 Vercel 專案設定 → Environment Variables，加入 `VITE_ANTHROPIC_API_KEY`
4. 重新部署

---

## ⚠️ 安全注意事項

這個版本的 API key 會暴露在前端。適合**個人使用**。

若要開放給其他人使用，需要加一層後端（Node.js/Python），
讓 API key 只存在伺服器端，前端透過你的後端 API 呼叫 Claude。

---

## 專案結構

```
src/
├── main.jsx              # 入口
├── App.jsx               # 主畫面
├── api.js                # Anthropic API 呼叫
├── constants.js          # 系統提示詞、顏色、預設值
├── utils.js              # 存檔/讀檔/解析工具
└── components/
    ├── Panel.jsx          # 可折疊面板
    ├── Divider.jsx        # 分隔線
    ├── CharacterPanel.jsx # 角色資訊面板
    └── InventoryPanel.jsx # 裝備面板
```
