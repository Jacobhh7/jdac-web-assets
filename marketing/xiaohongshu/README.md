# marketing/xiaohongshu

小紅書貼文素材。圖是用 HTML 排版、再用 Chromium 截成 1242×1656（3:4，小紅書直式）PNG。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `coach-offline-cover-sc.html` / `.png` | 上海一對一實體課封面（**簡體，發文用這張**） |
| `coach-offline-cover.html` / `.png` | 同一張的繁體版 |
| `coach-offline-copy.md` | 標題、正文（簡繁）、標籤、留言話術 |
| `hero_class.jpg` | 封面用的實體課現場照（裁自官網工作坊照片） |
| `render.py` | HTML → PNG |

## 改字

直接改 HTML 裡的文字就好，色票沿用 `jdac-coachpage.js`：
米白 `#f4f3ee`、墨 `#0c0c0c`、藍 `#2563ff`、橘 `#fa5a1e`。
底部「上海 · 面對面／檔期有限」在 `.foot .r` 那一區，換城市或加日期改那裡。

## 重畫

```bash
pip install playwright pillow
# 字型（容器裡沒有中文字型會變豆腐）
mkdir -p ~/.fonts && cd ~/.fonts
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz70e1_Co.ttf   # Regular
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz76Cy_Co.ttf   # Bold
curl -sO https://fonts.gstatic.com/s/notosanstc/v39/-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz7wm1_Co.ttf   # Black
curl -sO https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT0zRp8A.ttf  # Archivo Bold
fc-cache -f

cd marketing/xiaohongshu && python3 render.py          # 全部
python3 render.py coach-offline-cover-sc.html          # 只畫一張
```
