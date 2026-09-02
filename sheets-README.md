# /sheets 講義頁

```
sheets.html                     ← 索引頁（自動生成，不要手改）
sheets/<slug>.html              ← 每份講義的內頁（自動生成，不要手改）
sheets/_data/<slug>.json        ← 🟢 你唯一要寫的東西
sheets/_data/_範本.json          ← 複製這份開始
sheets/_style.css               ← 共用樣式
build-sheets.py                 ← 版型＋共用段落都在這裡
```

## 加一份新講義（三步）

1. **先把譜做出來**：`~/jdac-video-finish/sheet_<片名>.py`
   （記譜規則見 `reference-jdac-exercise-score`；沒有這支就沒有 parts/order，build 會直接擋下來）
2. **寫一個 JSON**：複製 `sheets/_data/_範本.json` → `sheets/_data/<slug>.json`，
   `parts` / `order` 用 `python3 sheet_<片名>.py --json` 的輸出貼進去，**不要手打打點**。
   PDF 放 `sheets/<slug>.pdf`、第一頁縮圖放 `sheets/<slug>-p1.png`。
3. **`python3 build-sheets.py`** → 內頁與索引一起重生成。push 就上線。

**每份 JSON 只寫「這份講義的內容」。** 銷售段（譜是單向的）、見證、雙路徑 CTA、記譜規則、
授權、FAQ 後兩題**全部在 `build-sheets.py` 裡共用**——改一次，所有講義頁一起變。
🔴 **絕對不要把那些字複製進 JSON**：那正是第 8 份講義會出事的地方
（全站最常改、紅線最多的文案散在 20 個檔案裡）。

`sheets/<slug>.html` ＝ 單一份講義的詳情頁。第 1 份是《Paradiddle to Chops》。
設計走 **A（講義優先）的段落骨架 ＋ C（可長大）的資料層**，四個角度評審的合成版。

## 十段結構
1. HERO 拿檔案（反轉句大標 ＋ PDF 縮圖 ＋ 裸 `<a download>`，**不擋 email**）
2. 下載副線（中國備用連結 ＋ 選配訂閱）
3. 講義裡有什麼（12 條，**從 JSON 渲染**）
4. 練的順序（五步，從 JSON）
5. 配套長片 ＋ 章節（含「3:25 課程介紹，跳過不影響練習」的主動揭露）
6. 這份譜是怎麼記的（記譜規則＝最強的信任證據，不是行銷語言）
7. 黑色監聽段「譜是單向的。」（全頁第一次談錢）
8. 一張真實見證（原文照抄線上教練課頁，未改寫）
9. 雙路徑：健檢（**實心藍**）／教練課（白底黑框）
10. FAQ ＋ 授權 ＋「這是第 1 份講義」

**CTA 階梯用顏色編碼**：全頁只有兩顆實心藍鈕＝下載（0% 承諾）與健檢（10–15%）。
教練課刻意是白底黑框的窄卡。**加第三顆藍鈕就破功了。**

## 打點的單一真相來源 🔴
12 條與練的順序**不是在這裡打的**，是從
`~/jdac-video-finish/sheet_Paradiddle_to_chops.py --json` 來的
（同一支檔畫 PDF、也畫影片底部的譜條）。改打點只改那支，然後：

```bash
python3 ~/jdac-video-finish/sheet_Paradiddle_to_chops.py --json    # 貼進 <script id="jdacSheetData">
python3 ~/jdac-video-finish/sheet_Paradiddle_to_chops.py           # 重出 PDF
```

2026-09-02 就是因為憑逐字稿重打，把第一拍寫成「右左右／左左右右／大鼓」（正確是 `RLRL LRRK`）。

## 還沒接的四件事
1. **`_functions/handoutLead`**（Velo backend）—— 照 `healthLead.js` 複製一份，
   collection `HandoutLeads`，`_id = 'd' + sha1(email)`（前綴要避開 'q'/'h'）。
   **絕對不要接 post_quizLead**：`type` 會被截成一個字再被靜默改成 B 型。
   dup 要**照樣再寄一次**（他換裝置再填是正常行為），只把 downloads +1。
2. **匿名計數**：不用開新端點。`healthLead.js` 的 `logHealthEvent`（約 238 行）
   把 `if (ev !== 'start' && ev !== 'done')` 改成含 `sheet_arrive` / `sheet_dl` /
   `sheet_sub` / `sheet_quiz` 的白名單即可，既有查詢有 filter 不會被汙染。
3. **影片網址**：填 JSON 的 `youtube_url` / `bilibili_url`（兩個都可留空）。
   填了會出現：影片卡的兩顆觀看按鈕、hero 底下一行小連結，
   而且**章節時間碼會自動變成 YouTube 的 `?t=` 深連結**。
   `youtu.be/ID` 會自動正規化成 `watch?v=ID`（不轉的話 `&t=` 不會生效），所以短網址直接貼就行。
4. **Wix 頁**：走 **Custom Element**（照 `build-jdac-quizpage.py` 改一支
   `build-jdac-sheetpage.py`，約 10 分鐘），不要用 iframe——內容會在頁面本體 DOM，
   SEO 與 `?src=` 都自然拿得到。真的要用 HtmlComponent 也行，
   `masterPage.js` 的 `wireEmbedAutoHeight()` 會自動調高度（payload 必須帶 `jdacFrom`）。

## 🔴 高度只剩 140px 餘裕
實測**內頁 5860px、索引頁 2260px**（加了兩顆觀看按鈕之後），`masterPage.js` 的自動高度夾在 200–6000px，**超過就靜默放棄、退回編輯器的固定高度**。
所以：**再加一段就會爆**。要加東西就得先砍一段（走 Custom Element 的話沒有這個限制）。

## 還要決定的事
- **Wix 端怎麼掛**：索引一頁 ＋ 每份講義一頁（`/sheets/<slug>`），或索引一頁 ＋
  一個吃 `?s=slug` 的動態頁（後者要在 masterPage 的 `FORWARD_PARAMS` 加 `s`，
  清洗規則抄 `src` 那行）。**檔案這邊兩種都支援**，差別只在 Wix 後台要開幾頁。
- **訂閱名單有沒有人會去寄信？** 如果第 2 份上線那天不會有人按 Wix marketing email 的寄送鍵，
  就把訂閱表單整個砍掉，email 100% 押健檢——留一個沒人寄的名單比不收更糟。

## 零成本的回訪觸發器（還沒做）
把一個短網址＋QR 印在 **PDF 第 3 頁「練的順序」旁邊**，指向 `/drummerquiz?src=pdf`。
那張紙會被印出來夾在打點板旁邊放好幾個月——它比網頁上任何「版本號／會更新」的設計都有效。
