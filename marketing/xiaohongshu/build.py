#!/usr/bin/env python3
"""小紅書「上海一對一實體課」三連圖：產生 HTML 並截成 1242×1656 PNG。

輪播結構（照小紅書套路）：
  1 封面 — 痛點大字報，3 秒抓住人，只講一句話
  2 解答 — 為什麼練不動 + 我已經在上海開課了
  3 自介 — 我是誰，大字，不放 logo

改文案：改下面 TEXT 裡的字串就好，版型不用動。
重畫：python3 build.py        （會產生 out/*.html 和 *.png）
"""
import glob
import os

from playwright.sync_api import sync_playwright

W, H = 1242, 1656  # 小紅書直式 3:4
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")

# ── 文案 ──────────────────────────────────────────────────────────
# sc = 簡體（發小紅書用）、tc = 繁體（你自己校稿用）
TEXT = {
    "sc": {
        # 第 1 張：封面
        "s1_chip": "打鼓 · 卡关自救",
        "s1_kicker": "90% 的人以为是天分问题",
        "s1_h1": '练了3年<br>还是只会<br><span class="hl">那几个节奏</span>',
        "s1_foot_l": "其实大家都卡在同一件事",
        "s1_foot_r": "往右滑 →",
        # 第 2 張：解答
        "s2_chip": "为什么越练越卡",
        "s2_h1": "不是你不够努力<br>是没人在旁边看着改",
        "s2_items": [
            "握棒的支点，到底在哪根手指",
            "棒子落下去，是弹回来，还是被你硬拉回来",
            "打快的时候，是手在动，还是整条手臂在硬撑",
        ],
        "s2_note": "这三件事，隔着萤幕看不到。我坐你旁边十分钟，能省你半年。",
        "s2_cta": '我人已经在<span class="o">上海</span><br>一对一，面对面上课中',
        # 第 3 張：自我介紹
        "s3_hi": "我是",
        "s3_name": "Jacob",
        "s3_role": "职业鼓手 · 教打鼓的人",
        "s3_quote": "先把地基打稳，<br>炫技才有意义。",
        "s3_items": [
            "从教会的鼓开始打，一路打成职业",
            "去过纽约、伦敦进修",
            "台湾最早做线上鼓课的那批人",
            "教最多的不是乐手，是零基础的上班族",
        ],
        "s3_bar": "现在人在上海 · 一对一面对面",
        "s3_ps": "想上课的私信我「实体课」，我把档期发你",
    },
    "tc": {
        "s1_chip": "打鼓 · 卡關自救",
        "s1_kicker": "90% 的人以為是天分問題",
        "s1_h1": '練了3年<br>還是只會<br><span class="hl">那幾個節奏</span>',
        "s1_foot_l": "其實大家都卡在同一件事",
        "s1_foot_r": "往右滑 →",
        "s2_chip": "為什麼越練越卡",
        "s2_h1": "不是你不夠努力<br>是沒人在旁邊看著改",
        "s2_items": [
            "握棒的支點，到底在哪根手指",
            "棒子落下去，是彈回來，還是被你硬拉回來",
            "打快的時候，是手在動，還是整條手臂在硬撐",
        ],
        "s2_note": "這三件事，隔著螢幕看不到。我坐你旁邊十分鐘，能省你半年。",
        "s2_cta": '我人已經在<span class="o">上海</span><br>一對一，面對面上課中',
        "s3_hi": "我是",
        "s3_name": "Jacob",
        "s3_role": "職業鼓手 · 教打鼓的人",
        "s3_quote": "先把地基打穩，<br>炫技才有意義。",
        "s3_items": [
            "從教會的鼓開始打，一路打成職業",
            "去過紐約、倫敦進修",
            "台灣最早做線上鼓課的那批人",
            "教最多的不是樂手，是零基礎的上班族",
        ],
        "s3_bar": "現在人在上海 · 一對一面對面",
        "s3_ps": "想上課的私訊我「實體課」，我把檔期發你",
    },
}

# ── 版型 ──────────────────────────────────────────────────────────
BASE = """
/* 字重明確綁死，不靠系統去猜。粗細不一致有兩個來源，兩個都堵掉：
   1) 只用 400 / 700 / 900 三級 —— 之前混到 500（沒這個字檔）跟 900
      （Noto 的 Black 在系統裡是獨立字族），瀏覽器就自己合成假粗體。
   2) 簡體版一定要用 Noto Sans SC —— 用 TC 去排簡體，缺的字會掉到系統
      備援字型（文泉驛）去墊，同一行就會忽粗忽細。 */
@font-face { font-family:"CJK"; font-weight:400; src:url("../fonts/{cjk}-400.ttf") format("truetype") }
@font-face { font-family:"CJK"; font-weight:700; src:url("../fonts/{cjk}-700.ttf") format("truetype") }
@font-face { font-family:"CJK"; font-weight:900; src:url("../fonts/{cjk}-900.ttf") format("truetype") }
@font-face { font-family:"Arch"; font-weight:700; src:url("../fonts/Archivo-700.ttf") format("truetype") }
@font-face { font-family:"Arch"; font-weight:900; src:url("../fonts/Archivo-900.ttf") format("truetype") }

* { box-sizing:border-box; margin:0; padding:0 }
body { width:1242px; height:1656px; overflow:hidden; background:#f4f3ee; color:#0c0c0c;
       font-family:"CJK",sans-serif; -webkit-font-smoothing:antialiased }
.pg { width:100%; height:100%; display:flex; flex-direction:column }
.lat { font-family:"Arch",sans-serif; font-weight:700 }
/* 小標籤 */
.chip { display:inline-block; background:#fa5a1e; color:#fff; font-weight:900; font-size:30px;
        letter-spacing:.06em; padding:12px 26px; border-radius:999px }
/* 高亮：用 inline-block 壓低行高，色塊才不會撞到上一行 */
.hl { display:inline-block; background:#fa5a1e; color:#fff; line-height:1.06;
      padding:.06em .12em .10em; border-radius:8px }
.o  { color:#fa5a1e }
"""

S1 = """
.shot { position:relative; height:860px; overflow:hidden }
.shot img { width:100%; height:100%; object-fit:cover; display:block }
.shot::after { content:""; position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(12,12,12,.30) 0%,rgba(12,12,12,0) 40%,rgba(12,12,12,.55) 100%) }
.shot .chip { position:absolute; left:64px; top:56px; z-index:2 }
.say { flex:1; background:#0c0c0c; color:#fff; padding:66px 64px 60px;
       display:flex; flex-direction:column; justify-content:space-between }
.kick { font-size:38px; font-weight:700; color:#b9b4a8; letter-spacing:.01em }
.say h1 { font-size:132px; font-weight:900; line-height:1.30; letter-spacing:-.02em }
.foot { display:flex; justify-content:space-between; align-items:flex-end;
        font-size:36px; font-weight:700 }
.foot span { color:#b9b4a8 }
.foot b { color:#fa5a1e; font-size:42px }
"""

S1_BODY = """
<div class="pg">
  <div class="shot"><img src="../p1-class.jpg" alt=""><div class="chip">{s1_chip}</div></div>
  <div class="say">
    <div class="kick">{s1_kicker}</div>
    <h1>{s1_h1}</h1>
    <div class="foot"><span>{s1_foot_l}</span><b>{s1_foot_r}</b></div>
  </div>
</div>
"""

S2 = """
.pg { padding:72px 76px 68px; justify-content:space-between }
.pg h1 { font-size:82px; font-weight:900; line-height:1.28; letter-spacing:-.02em; margin-top:34px }
.band { height:352px; border-radius:22px; overflow:hidden; margin-top:6px }
.band img { width:100%; height:100%; object-fit:cover; display:block }
.list { display:flex; flex-direction:column; gap:26px }
.row { display:flex; align-items:flex-start; gap:24px }
.row .n { font-family:"Arch",sans-serif; font-weight:700; font-size:44px; color:#fa5a1e;
          line-height:1.15; flex:none; width:74px }
.row .t { font-size:44px; font-weight:700; line-height:1.35 }
.note { font-size:34px; line-height:1.6; color:#5b574f; font-weight:400;
        border-left:8px solid #2563ff; padding-left:24px }
.cta { background:#0c0c0c; color:#fff; border-radius:24px; padding:44px 46px;
       font-size:62px; font-weight:900; line-height:1.32; letter-spacing:-.01em }
"""

S2_BODY = """
<div class="pg">
  <div>
    <div class="chip">{s2_chip}</div>
    <h1>{s2_h1}</h1>
  </div>
  <div class="band"><img src="../p2-band.jpg" alt=""></div>
  <div class="list">{s2_rows}</div>
  <div class="note">{s2_note}</div>
  <div class="cta">{s2_cta}</div>
</div>
"""

S3 = """
.pg { padding:76px 76px 68px; justify-content:space-between }
.top { display:flex; gap:44px; align-items:flex-start }
.who { flex:1; padding-top:8px }
.who .hi { font-size:56px; font-weight:700; color:#5b574f }
.who .nm { font-size:150px; font-weight:900; line-height:.98; letter-spacing:-.03em; margin-top:6px }
.who .rl { font-size:40px; font-weight:700; margin-top:26px; line-height:1.4 }
.who .rl::before { content:""; display:block; width:110px; height:9px; background:#fa5a1e; margin-bottom:24px }
.who .qt { font-size:46px; font-weight:900; line-height:1.5; margin-top:52px; letter-spacing:-.01em }
.who .qt::before { content:"「"; color:#fa5a1e }
.who .qt::after  { content:"」"; color:#fa5a1e }
.port { width:452px; height:700px; border-radius:24px; overflow:hidden; flex:none }
.port img { width:100%; height:100%; object-fit:cover; display:block }
.pts { display:flex; flex-direction:column; gap:30px }
.pt { display:flex; align-items:flex-start; gap:22px; font-size:50px; font-weight:700; line-height:1.34 }
.pt i { width:20px; height:20px; border-radius:50%; background:#2563ff; flex:none; margin-top:20px }
.bar { background:#0c0c0c; color:#fff; border-radius:22px; padding:38px 42px; text-align:center }
.bar .b1 { font-size:56px; font-weight:900; letter-spacing:-.01em }
.bar .b2 { font-size:32px; font-weight:700; color:#b9b4a8; margin-top:16px }
"""

S3_BODY = """
<div class="pg">
  <div class="top">
    <div class="who">
      <div class="hi">{s3_hi}</div>
      <div class="nm lat">{s3_name}</div>
      <div class="rl">{s3_role}</div>
      <div class="qt">{s3_quote}</div>
    </div>
    <div class="port"><img src="../p3-portrait.jpg" alt=""></div>
  </div>
  <div class="pts">{s3_pts}</div>
  <div class="bar"><div class="b1">{s3_bar}</div><div class="b2">{s3_ps}</div></div>
</div>
"""

PAGE = """<!doctype html>
<meta charset="utf-8">
<title>{title}</title>
<style>{base}{css}</style>
{body}
"""


CJK = {"sc": "NotoSansSC", "tc": "NotoSansTC"}


def render_html(lang):
    t = TEXT[lang]
    base = BASE.replace("{cjk}", CJK[lang])
    pages = {}

    pages["1-cover"] = PAGE.format(
        title=f"1 封面 ({lang})", base=base, css=S1, body=S1_BODY.format(**t)
    )

    rows = "".join(
        f'<div class="row"><div class="n">{i:02d}</div><div class="t">{x}</div></div>'
        for i, x in enumerate(t["s2_items"], 1)
    )
    pages["2-answer"] = PAGE.format(
        title=f"2 解答 ({lang})", base=base, css=S2,
        body=S2_BODY.format(s2_rows=rows, **{k: v for k, v in t.items() if k != "s2_items"}),
    )

    pts = "".join(f'<div class="pt"><i></i><span>{x}</span></div>' for x in t["s3_items"])
    pages["3-about"] = PAGE.format(
        title=f"3 自介 ({lang})", base=base, css=S3,
        body=S3_BODY.format(s3_pts=pts, **{k: v for k, v in t.items() if k != "s3_items"}),
    )
    return pages


def find_chrome():
    for pat in ("/opt/pw-browsers/chromium*/chrome-linux/chrome",
                "/opt/pw-browsers/chromium*/chrome-linux/headless_shell"):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def main():
    os.makedirs(OUT, exist_ok=True)
    files = []
    for lang in TEXT:
        for name, html in render_html(lang).items():
            p = os.path.join(OUT, f"{name}-{lang}.html")
            with open(p, "w", encoding="utf-8") as f:
                f.write(html)
            files.append(p)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=find_chrome(),
                                     args=["--no-sandbox", "--font-render-hinting=none"])
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for src in files:
            page.goto("file://" + src)
            page.wait_for_timeout(700)
            png = src[:-5] + ".png"
            page.screenshot(path=png)
            print(f"{os.path.basename(png)}  {os.path.getsize(png)//1024} KB")
        browser.close()


if __name__ == "__main__":
    main()
