# -*- coding: utf-8 -*-
"""產生 sheets.html —— **只有一頁**。每份講義一張卡：下載譜 / YouTube / B站。

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

<div class="qz-em">
  <div class="qzt">出新的講義要不要寄給你？</div>
  <p class="fine" style="margin-top:6px">留個信箱，之後每出一份我一起寄。只寄講義，不寄別的，隨時可以退訂。</p>
  <form id="subf"><div class="qz-emrow">
    <input class="qz-emin" id="em" type="email" required placeholder="你的 email">
    <button class="qz-embtn" type="submit">寄給我</button>
  </div></form>
  <p class="qz-emmsg" id="msg"></p>
</div>

<p class="fine" style="margin-top:22px">自己練、印出來、帶去教室都可以。請不要拿去賣，也不要改成自己的名字。</p>
</div>
<script>
(function () {{
  var API = 'https://www.jacobdrumemory.com/_functions';
  var $ = function (i) {{ return document.getElementById(i); }};
  $('subf').addEventListener('submit', function (e) {{
    e.preventDefault();
    var m = $('msg'); m.className = 'qz-emmsg'; m.textContent = '寄送中…';
    var src = (new URLSearchParams(location.search).get('src') || 'sheets')
      .toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20);
    fetch(API + '/handoutLead', {{ method: 'POST', headers: {{ 'Content-Type': 'text/plain' }},
      body: JSON.stringify({{ email: $('em').value.trim(), handout: 'all', source: src }}) }})
      .then(function (r) {{ return r.ok ? r.json() : Promise.reject(r.status); }})
      .then(function () {{ m.className = 'qz-emmsg ok'; m.textContent = '好了，之後出新的我就寄給你。'; }})
      .catch(function () {{ m.className = 'qz-emmsg err'; m.textContent = '寄不出去。上面的譜還是可以直接下載。'; }});
  }});
  if ('IntersectionObserver' in window) {{
    var io = new IntersectionObserver(function (es) {{ es.forEach(function (x) {{
      if (x.isIntersecting) {{ x.target.classList.add('in-view'); io.unobserve(x.target); }} }}); }}, {{ threshold: .12 }});
    document.querySelectorAll('.reveal').forEach(function (n) {{ io.observe(n); }});
  }} else {{ document.querySelectorAll('.reveal').forEach(function (n) {{ n.classList.add('in-view'); }}); }}
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
    sheets = sorted((json.load(open(f, encoding='utf-8')) for f in files), key=lambda s: s['no'])
    build(sheets)
    print(f'✓ sheets.html（{len(sheets)} 份講義，一頁）')
