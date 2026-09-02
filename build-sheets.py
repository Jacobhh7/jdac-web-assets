# -*- coding: utf-8 -*-
"""把 sheets/_data/*.json 蓋成講義頁：每份一個 sheets/<slug>.html ＋ 一個索引 sheets.html。

加一份新講義＝**只寫一個 JSON**，然後 `python3 build-sheets.py`。
版型、銷售段、見證、CTA、記譜規則、授權全部在這支檔裡共用——
**絕對不要把那些字複製到每份講義的 JSON 裡**（那是第 8 份會出事的地方）。

打點只有一個真相來源：`~/jdac-video-finish/sheet_<片名>.py --json`。
"""
import json, glob, os, re

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
E = lambda s: str(s or '')

CSS = open('sheets/_style.css', encoding='utf-8').read()

HEAD = '''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>__TITLE__</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,700;0,800;1,800;1,900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap">
<style>
''' + CSS + '''
</style>
</head>
<body>
'''

# ── 共用段落（改一次全部的講義頁都變）────────────────────────────
SHARED_NOTATION = '''
<div class="card reveal">
  <p class="dh">How it&rsquo;s written 這份譜是怎麼記的</p>
  <p class="fine" style="margin:0 0 14px;font-size:14.5px;color:#2c2c28">網路上的鼓譜寫法很亂，同一個東西十種畫法。我的譜照下面這幾條記，一條一條改出來的：</p>
  <ul class="spec">
    <li><b>小鼓在中線「上面」那一間</b>，不是壓在中線上；大鼓是最下面那一間。</li>
    <li><b>R／L 一行，K 另起一行用橘色。</b>手腳同時下去的音＝同一根符桿兩個音頭。</li>
    <li><b>八顆的型就寫 2/4，不硬湊成 4/4。</b>完整一句 16 顆才寫 4/4。</li>
    <li>重音記號畫在橫梁上方，音頭是斜的橢圓——不是為了好看，是為了在 4K 影片上不糊。</li>
  </ul>
  <p class="fine">影片裡每段練習畫面下方燒的譜條，跟 PDF 是同一套程式畫的，所以不會對不上。</p>
</div>
'''

SHARED_DARK = '''
</div><!-- /wrap -->
<div class="band-dark">
  <div class="band-in">
    <div class="tick">''' + ''.join('<i></i>' for _ in range(40)) + '''</div>
    <div><span class="lab">// FEEDBACK LOOP — 這份譜給不了你的</span><span class="lab2">CH.01 — SINGLE DIRECTION</span></div>
    <h2>譜是單向的。</h2>
    <p>你可以把它全部印出來、貼在打點板旁邊、每天打三十分鐘。<br>但它不會在你左手慢半格的時候停下來告訴你。</p>
    <div class="pb-card"><span class="err">ERR 01</span><p class="rt">錄起來聽，才發現重音根本沒出來。重音不清楚，整句就糊掉。</p></div>
    <div class="pb-card"><span class="err">ERR 02</span><p class="rt">每一條單獨都打得起來，一放進歌裡就散。問題出在交接的那一格，沒有人在旁邊聽的時候，你不會知道是哪一格。</p></div>
    <div class="pb-card"><span class="err">ERR 03</span><p class="rt">卡在同一個速度兩個禮拜。多半不是缺新練習，是缺一個會回頭看你上一次練了什麼的人。</p></div>
    <p style="margin-top:18px">他自己聽不出來，因為他一直是用同一雙耳朵，在聽同一雙手。</p>
  </div>
</div>
<div class="wrap">
<div class="vo-card reveal" style="margin-bottom:22px">
  <div class="av" style="background-image:url('https://static.wixstatic.com/media/1a91b2_303fb4954b224514b343e0c9b7aa8dcc~mv2.jpg/v1/fill/w_240,h_240,al_c,q_80,enc_auto/xinyu.jpg')"></div>
  <p class="qt">學爵士鼓很多年，平時也在網路上自修，但總覺得進步很慢、不太系統，走了不少彎路。偶然在 YouTube 看到 Jacob 老師的教學，內容細緻用心，就下決心報名，明顯感覺到突破性的提升。絕對系統的良心教學！</p>
  <div class="who">昕宇 <span>／ 爵士鼓老師</span></div>
</div>
<div class="dp">
  <div class="dp-c reveal">
    <span class="dp-tag">先量一下</span>
    <h3>不確定該先補哪一塊？</h3>
    <p>27 題、六個面向，做完會拿到一份屬於你自己的能力報告。約 5 分鐘，中途有一關要動手打，不方便的話可以跳過。</p>
    <a class="jh-btn p" id="quiz" href="#" style="font-size:15px;padding:13px 24px">開始鼓手能力健檢</a>
  </div>
  <div class="dp-c cool reveal">
    <span class="dp-tag">要有人看你打</span>
    <h3>線上教練課</h3>
    <p>每週交一支影片，我逐拍看完再回你。作業全部我一個人批改，所以我會控制人數。</p>
    <a class="jh-btn s" id="coach" href="#" style="font-size:15px;padding:13px 24px">看課程怎麼上</a>
  </div>
</div>
'''

def faq(s):
    q1, a1 = s.get('faq_first', ['這份譜難不難？', '照「練的順序」走就好。'])
    return f'''
<div class="card reveal" style="margin-top:22px">
  <p class="dh">FAQ</p>
  <ul class="spec">
    <li><b>{E(q1)}</b><br><span style="color:#6b6a63">{E(a1)}</span></li>
    <li><b>要錢嗎？要留資料嗎？</b><br><span style="color:#6b6a63">不用。上面那顆按鈕直接下載。</span></li>
    <li><b>沒有鼓可以練嗎？</b><br><span style="color:#6b6a63">{E(s.get("faq_gear", "看譜上標的是手還是腳；純手的部分打點板就能練。"))}</span></li>
  </ul>
  <p class="fine" style="margin-top:16px">自己練、印出來、帶去教室都可以。請不要拿去賣，也不要改成自己的名字。</p>
  <p class="fine mono" style="font-size:12px">SHEET {E(s["no"])} ／ {E(s["slug"])}</p>
</div>
</div><!-- /wrap -->
'''

JS = '''
<script type="application/json" id="jdacSheetData">__DATA__</script>
<script>
(function () {
  var API  = 'https://www.jacobdrumemory.com/_functions';
  var QUIZ = 'https://www.jacobdrumemory.com/drummerquiz?src=sheet-__SLUG__';
  var COACH= 'https://www.jacobdrumemory.com/onlinecoaching?src=sheet-__SLUG__';
  var D = JSON.parse(document.getElementById('jdacSheetData').textContent);
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  /* youtu.be/ID → watch?v=ID，章節的 &t= 才會生效 */
  var YT = (D.youtube_url || D.video_url || '').trim()
    .replace(/^https?:\/\/youtu\.be\/([\w-]+).*$/, 'https://www.youtube.com/watch?v=$1');
  var BI = (D.bilibili_url || '').trim();
  var btn = function (href, label, mark) {
    return '<a class="jh-btn s wbtn" href="' + href + '" target="_blank" rel="noopener">'
      + '<span class="wm">' + mark + '</span>' + label + '</a>'; };
  var row = [];
  if (YT) row.push(btn(YT, '在 YouTube 看', '▶'));
  if (BI) row.push(btn(BI, '在 B站看', 'B'));
  $('watch').innerHTML = row.join('');
  $('herowatch').innerHTML = row.length
    ? '配套長片：' + [YT ? '<a href="' + YT + '" target="_blank" rel="noopener">YouTube</a>' : '',
                     BI ? '<a href="' + BI + '" target="_blank" rel="noopener">B站</a>' : '']
        .filter(Boolean).join(' ／ ')
    : '';

  $('dl').href = '../' + D.pdf;
  $('alt').href = D.pdf.replace(/^sheets\//, 'https://jdac-media.oss-cn-hongkong.aliyuncs.com/sheets/');
  $('thumb').src = '../' + D.thumb; $('quiz').href = QUIZ; $('coach').href = COACH;

  $('parts').innerHTML = D.parts.map(function (p) {
    return '<div class="part"><span class="ptag">' + esc(p.en) + '｜' + esc(p.zh) + '</span>'
      + '<p class="psub">' + esc(p.sub || '') + '</p>'
      + p.items.map(function (it) {
          return '<div class="ex"><div class="n">' + esc(it.num) + '</div><div>'
            + '<div class="t">' + esc(it.title) + (it.tag ? '<span class="tg">' + esc(it.tag) + '</span>' : '') + '</div>'
            + '<div class="s">' + esc(it.sticking) + '　<span style="color:#8a8579">' + esc(it.timesig) + '</span></div>'
            + (it.note ? '<div class="nt">' + esc(it.note) + '</div>' : '') + '</div></div>';
        }).join('') + '</div>';
  }).join('');

  $('order').innerHTML = D.order.map(function (t, i) {
    return '<li data-n="' + (i + 1) + '">' + esc(t.replace(/^[\\u2460-\\u2469]\\s*/, '')) + '</li>'; }).join('');

  $('chapters').innerHTML = D.chapters.map(function (c) {
    var skip = c.s.indexOf('課程介紹') >= 0;
    var sec = c.t.split(':').reduce(function (a, b) { return a * 60 + (+b); }, 0);
    var tm = YT ? '<a class="tm" href="' + YT + '&t=' + sec + 's" target="_blank" rel="noopener">' + c.t + '</a>'
                : '<span class="tm">' + c.t + '</span>';
    return '<div class="ch' + (skip ? ' skip' : '') + '">' + tm + '<span>' + esc(c.s) + '</span></div>';
  }).join('');

  $('subf').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('msg'); m.className = 'qz-emmsg'; m.textContent = '寄送中…';
    var src = (new URLSearchParams(location.search).get('src') || 'sheet-' + D.slug)
      .toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 20);
    fetch(API + '/handoutLead', { method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ email: $('em').value.trim(), handout: D.slug, source: src }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function () { m.className = 'qz-emmsg ok'; m.textContent = '寄出去了，去信箱看一下（可能會掉到促銷匣）。'; ev('sheet_sub'); })
      .catch(function () { m.className = 'qz-emmsg err'; m.textContent = '寄不出去。先把上面那顆下載鈕按下去，檔案照樣拿得到。'; });
  });

  var SID = (function () { try { var k = 'jdacSheetSid', v = sessionStorage.getItem(k);
    if (!v) { v = String(Date.now()) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem(k, v); } return v; } catch (e) { return 'x'; } })();
  function ev(n) { try { fetch(API + '/healthEvent', { method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ sid: SID, ev: n, source: 'sheet-' + D.slug }), keepalive: true }); } catch (e) {} }
  ev('sheet_arrive');
  $('dl').addEventListener('click', function () { ev('sheet_dl'); });
  document.querySelectorAll('.wbtn').forEach(function (a) {
    a.addEventListener('click', function () { ev(a.href.indexOf('bilibili') >= 0 ? 'sheet_bili' : 'sheet_yt'); }); });
  $('quiz').addEventListener('click', function () { ev('sheet_quiz'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in-view'); io.unobserve(x.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  } else { document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in-view'); }); }

  function rh() { if (window.parent === window) return;
    try { window.parent.postMessage({ jdacHeight: Math.ceil(document.documentElement.scrollHeight), jdacFrom: 'sheets' }, '*'); } catch (e) {} }
  window.addEventListener('load', rh); window.addEventListener('resize', rh);
  [0, 300, 800, 1500, 2500, 4000].forEach(function (ms) { setTimeout(rh, ms); });
})();
</script>
</body>
</html>
'''

def build_sheet(s):
    bullets = "".join(f'<li>{E(b)}</li>' for b in s.get('hero_bullets', []))
    body = f'''<div class="wrap">
<p class="mglab"><a href="../sheets.html" style="color:#2563ff;text-decoration:none">JDAC 練習講義</a> ／ SHEET {E(s["no"])}</p>
<h1>{s["h1"]}</h1>
<p class="sub">{s["sub"]}</p>
<p class="fine" id="herowatch" style="margin:-14px 0 24px"></p>

<div class="card">
  <div class="getrow">
    <img class="thumb" id="thumb" alt="練習譜第一頁預覽">
    <div>
      <ul class="spec">{bullets}
        <li class="mono" style="font-size:13.5px">R＝右手　L＝左手　K＝大鼓（右腳）</li>
      </ul>
      <div class="btnrow"><a class="jh-btn p" id="dl" href="#" download>下載 PDF（{E(s["pages"])} 頁）</a></div>
      <p class="fine">A4，印出來夾在譜架上就能用。也可以直接傳給你的團員。</p>
    </div>
  </div>
  <div class="note">在中國連不上？<a id="alt" href="#">用這個備用連結</a>（同一份檔）。</div>
  <div class="qz-em">
    <div style="font-weight:900;font-size:15.5px">要不要把這份的連結寄一份到你信箱？</div>
    <p class="fine" style="margin-top:6px">手機上看到、回家要印的時候比較好找。之後出新的講義我一起寄給你。</p>
    <form class="qz-emform" id="subf"><div class="qz-emrow">
      <input class="qz-emin" id="em" type="email" required placeholder="你的 email">
      <button class="qz-embtn" type="submit">寄給我</button></div></form>
    <p class="qz-emmsg" id="msg"></p>
    <p class="fine">只寄講義，不寄別的。隨時可以退訂。</p>
  </div>
</div>

<div class="card reveal">
  <p class="dh">Inside 講義內容</p>
  <p class="fine" style="margin:0 0 18px">全部先用 60–70 BPM 打順，再一格一格往上加。譜面位置：中線上方那一間＝小鼓，最下面那一間＝大鼓。</p>
  <div id="parts"></div>
</div>

<div class="card reveal">
  <p class="dh">How to practice 練的順序</p>
  <ol class="steps" id="order"></ol>
  <p class="fine">這幾步就印在 PDF 最後一頁，不用回來查。</p>
</div>

<div class="card reveal">
  <p class="dh">The video 配套長片</p>
  <div style="font-weight:900;font-size:18px;line-height:1.5;margin:0 0 10px">{E(s["video_title"])}</div>
  <p class="fine" style="margin:0 0 16px">{E(s.get("video_quote"))}</p>
  <div class="watch" id="watch"></div>
  <div id="chapters"></div>
  <p class="fine">{E(s.get("chapter_map"))}</p>
</div>
{SHARED_NOTATION}{SHARED_DARK}{faq(s)}'''
    html = (HEAD.replace('__TITLE__', f'{s["title"]} 練習譜｜JDAC 爵士鼓學校') + body
            + JS.replace('__DATA__', json.dumps(s, ensure_ascii=False)).replace('__SLUG__', s['slug']))
    p = f'sheets/{s["slug"]}.html'
    open(p, 'w', encoding='utf-8').write(html)
    return p

INDEX_JS = '''
<script>
(function () {
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in-view'); io.unobserve(x.target); } }); }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
  } else { document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in-view'); }); }
  function rh() { if (window.parent === window) return;
    try { window.parent.postMessage({ jdacHeight: Math.ceil(document.documentElement.scrollHeight), jdacFrom: 'sheets-index' }, '*'); } catch (e) {} }
  window.addEventListener('load', rh); window.addEventListener('resize', rh);
  [0, 300, 800, 1500, 2500].forEach(function (ms) { setTimeout(rh, ms); });
})();
</script>
</body>
</html>
'''

def build_index(sheets):
    n = len(sheets)
    cards = "".join(f'''
  <a class="ix reveal" href="sheets/{E(s["slug"])}.html">
    <img src="{E(s["thumb"])}" alt="">
    <div class="ixb">
      <span class="ixno">SHEET {E(s["no"])}</span>
      <div class="ixt">{E(s["title"])}</div>
      <p class="ixp">{E(s.get("card_line"))}</p>
      <p class="ixm mono">{E(s["pages"])} 頁 ・ {sum(len(p["items"]) for p in s["parts"])} 條 ・ 配套影片 {E(s.get("video_len"))}</p>
    </div>
  </a>''' for s in sheets)
    body = f'''<div class="wrap">
<p class="mglab">JDAC 練習講義</p>
<h1>每一支免費教學，<em>都配一份可以印出來的譜</em></h1>
<p class="sub">不是網路上抓來的鼓譜。每一份都對著我自己的影片寫，附「練的順序」——先練哪個、什麼時候可以往下走。<b>全部直接下載，不用留 email。</b></p>
<div class="ixgrid">{cards}</div>
<p class="fine" style="margin-top:18px">目前 {n} 份。之後每支免費長片都會配一份，放在這裡。</p>
{SHARED_DARK}
<div class="card reveal" style="margin-top:22px">
  <p class="dh">FAQ</p>
  <ul class="spec">
    <li><b>要錢嗎？要留資料嗎？</b><br><span style="color:#6b6a63">不用，點進去就能下載。想要之後出新的一起收到，可以在講義頁留 email。</span></li>
    <li><b>可以印出來給學生嗎？</b><br><span style="color:#6b6a63">可以。自己練、印出來、帶去教室都行。請不要拿去賣，也不要改成自己的名字。</span></li>
  </ul>
</div>
</div><!-- /wrap -->'''
    html = HEAD.replace('__TITLE__', 'JDAC 練習講義') + body + INDEX_JS
    open('sheets.html', 'w', encoding='utf-8').write(html)
    return 'sheets.html'

if __name__ == '__main__':
    # 底線開頭的是範本／備註，不是講義
    files = sorted(f for f in glob.glob('sheets/_data/*.json')
                   if not os.path.basename(f).startswith('_'))
    sheets = [json.load(open(f, encoding='utf-8')) for f in files]
    sheets.sort(key=lambda s: s['no'])
    for s in sheets:
        assert s['parts'] and s['order'], f'{s["slug"]}：parts/order 是空的，先跑 sheet_<片名>.py --json'
        print('✓', build_sheet(s))
    print('✓', build_index(sheets), f'（{len(sheets)} 份）')
