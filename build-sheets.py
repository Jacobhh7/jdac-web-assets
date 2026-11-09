# -*- coding: utf-8 -*-
"""產生 sheets.html —— **只有一頁**。每份講義一張卡：下載譜 / YouTube / B站。
（2026-11-09 Jacob：「把七日班的資訊也做到 /sheets」→ 見證下面加 7 天運棒特訓班橫幅 `.s7`，
 文案照首頁 B 版橫幅那一條；開跑日／名額／價格抓 jdac-admin camp-status。）

加一份新講義＝寫一個 sheets/_data/<slug>.json，然後 `python3 build-sheets.py`。
（2026-09-02 Jacob：「我只要那一頁就好，不用按進去還有那麼多資料大綱」——
 所以沒有內頁、沒有 12 條清單、沒有章節、沒有 FAQ。要加東西前先問他。）
"""
import json, glob, os

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
E = lambda s: str(s or '')

def yt(u):   # youtu.be/ID → watch?v=ID
    u = (u or '').strip()
    import re
    return re.sub(r'^https?://youtu\.be/([\w-]+).*$', r'https://www.youtube.com/watch?v=\1', u)

def card(s):
    btns = f'<a class="b p" href="{E(s["pdf"])}" download>下載譜（{E(s["pages"])} 頁）</a>'
    if s.get('youtube_url'):
        btns += f'<a class="b" href="{yt(s["youtube_url"])}" target="_blank" rel="noopener"><span class="m">▶</span>YouTube</a>'
    if s.get('bilibili_url'):
        btns += f'<a class="b" href="{E(s["bilibili_url"])}" target="_blank" rel="noopener"><span class="m">B</span>B站</a>'
    meta = f'{E(s["pages"])} 頁'
    if s.get('video_len'): meta += f' ・ 配套影片 {E(s["video_len"])}'
    return f'''
  <div class="ix reveal">
    <a class="th" href="{E(s["pdf"])}" download><img src="{E(s["thumb"])}" alt="{E(s["title"])} 練習譜"></a>
    <div class="ixb">
      <span class="ixno">SHEET {E(s["no"])}</span>
      <div class="ixt">{E(s["title"])}</div>
      <p class="ixp">{E(s.get("card_line"))}</p>
      <div class="btns">{btns}</div>
      <p class="ixm mono">{meta}</p>
    </div>
  </div>'''

def build(sheets):
    css = open('sheets/_style.css', encoding='utf-8').read()
    html = f'''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>JDAC 練習講義</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,500;0,800;1,900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap">
<style>
{css}
</style>
</head>
<body>
<div class="wrap">
<p class="mglab">JDAC 練習講義</p>
<h1>每一支免費教學，<em>都配一份可以印出來的譜</em></h1>
<p class="sub">A4，印出來夾在譜架上就能用。<b>直接下載，不用留 email。</b></p>

<div class="ixgrid">{''.join(card(s) for s in sheets)}</div>

</div><!-- /wrap -->

<div class="band-dark">
  <div class="band-in">
    <div class="tick"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div><span class="lab">// FEEDBACK LOOP — 這些譜給不了你的</span><span class="lab2">CH.01 — SINGLE DIRECTION</span></div>
    <h2>譜是單向的。</h2>
    <p>你可以把它全部印出來、貼在打點板旁邊、每天打三十分鐘。<br>但它不會在你左手慢半格的時候停下來告訴你。</p>
    <div class="pb-card"><span class="err">ERR 01</span><p class="rt">錄起來聽，才發現重音根本沒出來。重音不清楚，整句就糊掉。</p></div>
    <div class="pb-card"><span class="err">ERR 02</span><p class="rt">卡在同一個速度兩個禮拜。多半不是缺新練習，是缺一個會回頭看你上一次練了什麼的人。</p></div>
    <p style="margin-top:16px">他自己聽不出來，因為他一直是用同一雙耳朵，在聽同一雙手。</p>
  </div>
</div>

<div class="wrap">
<div class="vo-card reveal">
  <div class="av" style="background-image:url('https://static.wixstatic.com/media/1a91b2_303fb4954b224514b343e0c9b7aa8dcc~mv2.jpg/v1/fill/w_240,h_240,al_c,q_80,enc_auto/xinyu.jpg')"></div>
  <p class="qt">學爵士鼓很多年，平時也在網路上自修，但總覺得進步很慢、不太系統，走了不少彎路。偶然在 YouTube 看到 Jacob 老師的教學，內容細緻用心，就下決心報名，明顯感覺到突破性的提升。絕對系統的良心教學！</p>
  <div class="who">昕宇 <span>／ 爵士鼓老師</span></div>
</div>

<a class="s7 reveal" href="https://www.jacobdrumemory.com/7-day?src=sheets" target="_blank" rel="noopener">
  <span class="s7-new">NEW</span>
  <div class="s7-t">
    <div class="s7-eb">7-DAY STICK CLASS · 7 天運棒特訓班</div>
    <h2>先用 7 天，<br>把<span>手練鬆</span>。</h2>
    <p class="s7-hook">你以為要更用力練，<br>但其實要先<em>學會怎麼發力</em>。</p>
    <p class="s7-meta">每天 20–30 分鐘、只練運棒。開始前一天錄兩段，第 7 天再錄一次，我親自把前後放在一起看、回覆你。</p>
    <div class="s7-chips"><span class="s7-chip"><i class="live"></i><span data-s7="date">每月第 1、3 個週一開跑</span></span><span class="s7-chip" data-s7="seats" hidden></span><span class="s7-chip" data-s7="price">NT$690</span></div>
    <span class="s7-btn">看 7 天怎麼跑 →</span>
    <p class="s7-fine">做完 14 天內升級線上教練課，這 690 全額折抵。</p>
  </div>
  <div class="s7-ph" role="img" aria-label="Jacob"></div>
</a>

<div class="dp">
  <div class="dp-c reveal">
    <span class="dp-tag">先量一下</span>
    <h3>不確定該先補哪一塊？</h3>
    <p>27 題、六個面向，做完會拿到一份屬於你自己的能力報告。約 5 分鐘，中途有一關要動手打，不方便的話可以跳過。</p>
    <a class="b p" href="https://www.jacobdrumemory.com/drummerquiz?src=sheets" target="_blank" rel="noopener">開始鼓手能力健檢</a>
  </div>
  <div class="dp-c cool reveal">
    <span class="dp-tag">要有人看你打</span>
    <h3>線上教練課</h3>
    <p>每週交一支影片，我逐拍看完再回你。作業全部我一個人批改，所以我會控制人數。</p>
    <a class="b" href="https://www.jacobdrumemory.com/onlinecoaching?src=sheets" target="_blank" rel="noopener">看課程怎麼上</a>
  </div>
</div>

<p class="fine" style="margin-top:22px">自己練、印出來、帶去教室都可以。請不要拿去賣，也不要改成自己的名字。</p>
</div>
<script>
(function () {{
  var $ = function (i) {{ return document.getElementById(i); }};
  if ('IntersectionObserver' in window) {{
    var io = new IntersectionObserver(function (es) {{ es.forEach(function (x) {{
      if (x.isIntersecting) {{ x.target.classList.add('in-view'); io.unobserve(x.target); }} }}); }}, {{ threshold: .12 }});
    document.querySelectorAll('.reveal').forEach(function (n) {{ io.observe(n); }});
  }} else {{ document.querySelectorAll('.reveal').forEach(function (n) {{ n.classList.add('in-view'); }}); }}
  // 7 天運棒特訓班橫幅：抓到 jdac-admin 即時梯次才換成真的開跑日／剩幾位（放寬上限的梯次不回剩幾位 → 不顯示）
  (function () {{
    if (!window.fetch || !document.querySelector('[data-s7]')) return;
    var W = ['日', '一', '二', '三', '四', '五', '六'];
    fetch('https://jdac-admin.vercel.app/api/camp-status', {{ cache: 'no-store', credentials: 'omit' }})
      .then(function (r) {{ if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }})
      .then(function (j) {{
        var bs = (j && j.batches) || [], b = null;
        for (var i = 0; i < bs.length; i++) {{ if (!bs[i].soldOut) {{ b = bs[i]; break; }} }}
        if (j && j.phase === 'open' && b) {{
          var p = String(b.startDate).split('-').map(Number), t = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
          document.querySelectorAll('[data-s7="date"]').forEach(function (el) {{ el.textContent = p[1] + '/' + p[2] + '（' + W[t.getUTCDay()] + '）開跑'; }});
          if (b.seatsLeft != null) document.querySelectorAll('[data-s7="seats"]').forEach(function (el) {{ el.textContent = '剩 ' + b.seatsLeft + ' 位'; el.hidden = false; }});
        }}
        if (j && j.price && j.price.TWD) document.querySelectorAll('[data-s7="price"]').forEach(function (el) {{ el.textContent = 'NT$' + Number(j.price.TWD).toLocaleString('en-US'); }});
      }}).catch(function () {{}});
  }})();
  function rh() {{ if (window.parent === window) return;
    try {{ window.parent.postMessage({{ jdacHeight: Math.ceil(document.documentElement.scrollHeight), jdacFrom: 'sheets' }}, '*'); }} catch (e) {{}} }}
  window.addEventListener('load', rh); window.addEventListener('resize', rh);
  [0, 300, 800, 1500, 2500].forEach(function (ms) {{ setTimeout(rh, ms); }});
}})();
</script>
</body>
</html>
'''
    open('sheets.html', 'w', encoding='utf-8').write(html)

if __name__ == '__main__':
    files = sorted(f for f in glob.glob('sheets/_data/*.json')
                   if not os.path.basename(f).startswith('_'))
    # 最新的排最前面（Jacob 2026-11-09：「讓最新更新的放在最前面」）——編號大的在前，SHEET 編號本身不變
    sheets = sorted((json.load(open(f, encoding='utf-8')) for f in files), key=lambda s: int(s['no']), reverse=True)
    build(sheets)
    print(f'✓ sheets.html（{len(sheets)} 份講義，一頁）')
