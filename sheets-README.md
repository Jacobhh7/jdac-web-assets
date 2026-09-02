# /sheets 練習講義頁

**只有一頁**（`sheets.html`）：講義卡（下載譜／YouTube／B站）→ 宣傳段（譜是單向的）→ 見證 → 健檢／教練課。
沒有內頁、沒有留 email——2026-09-02 Jacob 定的。

## 加一份新講義

1. PDF 放 `sheets/<slug>.pdf`，第一頁縮圖放 `sheets/<slug>-p1.png`
2. 複製 `sheets/_data/_範本.json` → `sheets/_data/<slug>.json`，填 10 個欄位
3. `python3 build-sheets.py` → push

JSON 就這些：`slug / no / title / card_line / pdf / thumb / pages / video_len /
youtube_url / bilibili_url`。後兩個可留空（留空就不出那顆按鈕）。
`youtu.be/ID` 會自動轉成 `watch?v=ID`。

## 嵌 Wix

**用「網址」模式**貼 `https://jacobhh7.github.io/jdac-web-assets/sheets.html`。
`masterPage.js` 的自動高度只認 `src` 含 `jdac-web-assets` 的 HtmlComponent，
用「程式碼」模式貼 iframe 對不上、高度要手動設。

### 高度（實測，Wix 自動高度上限 6000）

| 份數 | 桌機 1280 | 平板 1024 | 平板 834 | 平板 768 | 手機 390 |
|---|---|---|---|---|---|
| 1 | 2001 | 2000 | 1956 | 1990 | 2102 |
| 2 | 1816 | 1815 | 1840 | 1890 | 2597 |
| 4 | 2285 | 2284 | 2346 | 2380 | 3585 |
| 6 | 2755 | 2754 | 2851 | 2869 | 4573 |
| 10 | 3694 | 3693 | 3863 | 3849 | **6550 ❌** |

桌機／平板兩欄排，每 **2 份 +470px**；手機單欄，每 **1 份 +495px**。
（2 份反而比 1 份矮是因為兩張卡填滿同一列，把單卡那排的空白吃掉了。）

### 🔴 卡片要改成橫向滑動的觸發點：手機第 9 份

手機是最先撞牆的：`2102 + 495 × (份數−1)`，**第 9 份 ≈ 6062px 就超過 6000**。
桌機／平板要到第 19 份左右。

**到那時候把 `.ixgrid` 改成橫向滑動（scroll-snap carousel）**，高度就固定在一張卡的高度、
不再隨份數長，而且手機本來就適合橫滑。做法很輕：

```css
.ixgrid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:18px;
        padding-bottom:12px;-webkit-overflow-scrolling:touch}
.ix{flex:0 0 min(320px,82%);scroll-snap-align:start}
```

改完 `build-sheets.py` 不用動（HTML 結構一樣），只改 `sheets/_style.css` 一段。
⚠️ 嵌在 iframe 裡橫滑要確認手勢不會被 Wix 的外層攔掉，改的時候用手機真機測一次。

## 宣傳段的規矩
黑色監聽段、見證、健檢／教練課都寫在 `build-sheets.py` 裡共用，**不進每份講義的 JSON**。
見證是原文照抄線上教練課頁，沒有改寫。
**藍色實心鈕只有兩種**：每張卡的「下載譜」與「開始鼓手能力健檢」；教練課刻意是白底黑框。
加第三種藍鈕，階梯就看不出輕重了。
