# marketing/xiaohongshu

小紅書貼文素材。圖用 HTML 排版、Chromium 截成 **1242×1656（3:4 直式）**PNG。

## 這一組：上海一對一實體課（三連圖）

照小紅書輪播套路排：**痛點 → 解答 → 我是誰**。

| 順序 | 檔案 | 任務 |
| --- | --- | --- |
| 1 | `out/1-cover-sc.png` | 封面。純大字報不放照片，只講一句痛點，3 秒內要被看懂 |
| 2 | `out/2-answer-sc.png` | 解答。三個「線上看不到」的細節 ＋ 我已經在上海上課中 |
| 3 | `out/3-about-sc.png` | 自介。大字、少小字、不放 logo |

`-tc` 是繁體版（自己校稿用），發小紅書用 `-sc`。
文案（標題／正文／標籤／回覆口徑）在 `coach-offline-copy.md`。

## 為什麼這樣排

- 3:4 直式在資訊流佔屏最大，比橫版多約 4 成面積
- 封面走「痛點＋結果」公式，視覺衝擊優先於資訊量。這一組刻意不放照片：
  縮圖只有指甲大，一句超大字比一張看不清楚的現場照更能停住手指
- 輪播用「痛點共感 → 解法 → 信任」三層，最後才給行動
- 不放品牌 logo：廣告感越低越好，讓它看起來像分享不像投放

## 改字 / 重畫

所有文案集中在 `build.py` 最上面的 `TEXT`，改字串就好，版型不用動。

```bash
pip install playwright pillow
# 中文字型（沒裝會變豆腐）
mkdir -p ~/.fonts && cd ~/.fonts
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz70e1_Co.ttf   # Regular
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz76Cy_Co.ttf   # Bold
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz7wm1_Co.ttf   # Black
curl -sO https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT0zRp8A.ttf
fc-cache -f

cd marketing/xiaohongshu && python3 build.py    # 六張一次畫完，輸出到 out/
```

## 素材

| 檔案 | 來源 |
| --- | --- |
| `p3-portrait.jpg` | Jacob 本人照，裁自官網 coachpage 的 MEET JACOB 區塊 |
| `fonts/NotoSansSC-*.ttf` | 簡體版用 |
| `fonts/NotoSansTC-*.ttf` | 繁體版用 |
| `fonts/Archivo-*.ttf` | 數字與英文 |

第 1、2 張目前不放照片。之後若要放，記得**只用有 Jacob 本人的照片**——
官網那些工作坊合照裡也有其他教練與學員，別隨手抓。

色票沿用 `jdac-coachpage.js`：米白 `#f4f3ee`、墨 `#0c0c0c`、藍 `#2563ff`、橘 `#fa5a1e`。
