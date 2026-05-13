# 乒乓球揮拍社群平台 — 架構與維護手冊

---

## 各服務負責的事

| 服務 | 網址 / 位置 | 負責的事 |
|------|------------|---------|
| **GitHub** | `github.com/KanMingKai/TableTennis` | 存放所有程式碼，每次 push 自動觸發 Cloudflare 重新部署 |
| **Cloudflare Pages** | `tabletennis-8jf.pages.dev` | 對外提供網頁（練習 App + 社群平台），免費 CDN 加速 |
| **Firebase Firestore** | `console.firebase.google.com` → `tabletennis-community` | 存影片標題、日期、Cloudinary 網址、彈幕文字 |
| **Cloudinary** | `cloudinary.com` → Cloud: `dndyiurdr` | 存影片檔案本體，提供可播放的串流網址 |

---

## 檔案對應

```
tabletennis-forehand.html   → 練習 App（教練模式 + 偵測模式 + 錄影 + 發布）
platform/index.html         → 社群平台首頁（列出所有影片）
platform/video.html         → 單一影片頁（DPlayer 播放 + 彈幕）
platform/firebase-config.js → Firebase 設定（Firestore 連線）
```

---

## 資料流

```
用戶錄影
   ↓
點「發布到平台」
   ↓
影片上傳到 Cloudinary → 取得串流網址
   ↓
網址 + 標題存入 Firebase Firestore（videos 集合）
   ↓
platform/index.html 從 Firestore 讀取列表顯示
   ↓
用戶點影片 → platform/video.html 從 Firestore 讀取網址 → Cloudinary 串流播放
   ↓
用戶發彈幕 → 存入 Firestore（danmaku/{videoId}/comments 集合）
```

---

## 常見問題對應處理

### 網頁打不開 / 顯示舊版本
**原因**：Cloudflare Pages 部署中或快取未更新
**處理**：
- 等 1–2 分鐘讓 Cloudflare 完成部署
- 強制重新整理：`Ctrl + Shift + R`
- 到 [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → 確認最新部署狀態

---

### 影片上傳卡在 0% / 上傳失敗
**原因**：Cloudinary 設定問題
**處理**：
1. 按 F12 → Console 看錯誤訊息
2. 登入 [cloudinary.com](https://cloudinary.com) → Settings → Upload → 確認 `tabletennis_upload` 這個 preset 存在且為 **Unsigned**
3. 確認 `tabletennis-forehand.html` 裡的 `_CLOUDINARY_CLOUD = 'dndyiurdr'` 正確

---

### 影片列表空白 / 彈幕無法載入
**原因**：Firebase Firestore 連線問題或規則設定
**處理**：
1. 按 F12 → Console 看錯誤訊息
2. 登入 [console.firebase.google.com](https://console.firebase.google.com) → `tabletennis-community`
3. Firestore → **規則** → 確認 read 允許 `if true`
4. Firestore → **資料** → 直接看 `videos` 集合是否有資料

---

### 彈幕無法發送
**原因**：Firestore 寫入規則擋住
**處理**：
- Firestore → 規則 → 確認 `danmaku` 集合的 `allow create` 條件
- 規則應允許 `text.size() > 0 && text.size() <= 50`

---

### 程式碼修改後網站沒更新
**原因**：沒有 push 到 GitHub
**處理**：
```bash
git add .
git commit -m "說明修改內容"
git push origin main
```
push 成功後 Cloudflare 自動重新部署，約 1 分鐘生效。

---

### Cloudinary 儲存空間不夠（超過 25GB）
**處理**：
- 登入 Cloudinary → Media Library → 刪除舊的或不需要的影片
- 或升級 Cloudinary 方案（付費）
- 或換用其他影片儲存服務（架構只需改 `tabletennis-forehand.html` 的上傳邏輯）

---

### Firebase Firestore 免費額度（500MB / 50K 讀取/天）快滿
**處理**：
- Firestore → 使用情況 查看目前用量
- 定期清理測試資料
- 如需擴充：Firebase 升級到 Blaze（用多少付多少，小規模很便宜）

---

## 快速登入連結

| 服務 | 管理後台 |
|------|---------|
| GitHub | [github.com/KanMingKai/TableTennis](https://github.com/KanMingKai/TableTennis) |
| Cloudflare | [dash.cloudflare.com](https://dash.cloudflare.com) |
| Firebase | [console.firebase.google.com](https://console.firebase.google.com) → `tabletennis-community` |
| Cloudinary | [cloudinary.com](https://cloudinary.com) → Cloud `dndyiurdr` |
