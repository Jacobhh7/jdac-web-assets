# 怎麼嵌到 Wix

## 🔴 一定要用「網址」模式，不要用「程式碼」模式

`masterPage.js` 的自動高度（`wireEmbedAutoHeight`，第 70–92 行）第一件事就是：

```js
if (String(c.src || '').indexOf('jdac-web-assets') === -1) return;   // 只動我們自己的嵌入
```

**它只認 `src` 裡有 `jdac-web-assets` 的 HtmlComponent。**
如果你用「程式碼」模式把 `<iframe>` 貼進去，Wix 那個元件自己的 `src` 是 `about:blank`，
字串對不上 → 自動高度不會生效，而且我的 postMessage 是從內層 iframe 發的，
會被 Wix 的外層 iframe 擋掉 → 你得手動把高度設成 5900 並且以後每次改內容都要重設。

同一支檔的 `forwardSrcToEmbeds`（第 44 行）也是同一個判斷，
所以走「網址」模式還會**自動把 `?src=` 歸因參數接到網址後面**，不用自己處理。

## 步驟

1. **先 push**（檔案還沒上 GitHub Pages，網址現在是 404）：
   ```
   cd ~/jdac-web-assets && git add sheets.html sheets/ build-sheets.py sheets-README.md && git commit -m "..." && git push
   ```
2. Wix 編輯器 → **新增 → 嵌入 → 嵌入網站（Embed a Site）**
3. 選 **網址**，貼：
   ```
   https://jacobhh7.github.io/jdac-web-assets/sheets/paradiddle-to-chops.html
   ```
   索引頁是：
   ```
   https://jacobhh7.github.io/jdac-web-assets/sheets.html
   ```
4. 元件寬度拉滿版；高度隨便設（**1000 就好**），載入後 masterPage 會自己調成 5860。
5. 發佈。

## 產生出來的 iframe（給你看，不用自己貼）

Wix 會自己生一個大致長這樣的東西：

```html
<iframe src="https://jacobhh7.github.io/jdac-web-assets/sheets/paradiddle-to-chops.html"
        style="width:100%;height:5860px;border:0;display:block"
        title="Paradiddle to Chops 練習譜"></iframe>
```

## 三條會踩到的線

- **高度上限 6000**（masterPage 第 81 行 `if (h < 200 || h > 6000) return;`）。
  這一頁現在 **5860px，只剩 140px**。內頁再加東西就會超過，
  超過不是報錯是**靜默放棄**，你會看到頁面停在編輯器設的固定高度。
- **PDF 下載**：iframe 裡的 `<a download>` 跨網域時瀏覽器會忽略 `download` 屬性，
  改成直接開新分頁顯示 PDF（手機上很正常，桌機 Chrome 也會開 PDF viewer）。
  這是瀏覽器行為不是 bug；要強制下載就得把 PDF 放到 Wix 自己的網域。
- **PDF 也還沒上線**：`sheets/paradiddle-to-chops.pdf` 跟著這次 push 一起上，
  push 完網址就是 `https://jacobhh7.github.io/jdac-web-assets/sheets/paradiddle-to-chops.pdf`。

## 之後要換成 Custom Element 的話

`build-jdac-quizpage.py` 是現成模板，複製一支改初始化函式名就好（約 10 分鐘）。
好處：內容跑在頁面本體 DOM → **沒有 6000px 上限**、SEO 算頁面自己的、`?src=` 直接讀得到。
以你之後要一直加講義，這條路遲早要走。
