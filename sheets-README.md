# /sheets 練習講義頁

**只有一頁**（`sheets.html`）。每份講義一張卡：下載譜 ／ YouTube ／ B站。底下一個留 email。
沒有內頁——2026-09-02 Jacob 說「我只要那一頁就好，不用按進去還有那麼多資料大綱」。

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

高度：桌機 870 / 平板 903 / 手機 990 px，離 6000 上限很遠，隨便加幾份都不會撞到。

## 還沒接
`_functions/handoutLead`（收 email 的後端）。還沒接之前，留 email 會顯示
「寄不出去，上面的譜還是可以直接下載」——下載完全不依賴後端。
