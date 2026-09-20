(function(){
if(window.customElements&&customElements.get("jdac-live"))return;
var CSS="\n.jdlive{--blue:#2563ff;--blue-deep:#1c4fd0;--ink:#0c0c0c;--paper:#f4f3ee;--card:#fff;--line:#e3e1d8;\n  --muted:#6f6d64;--orange:#fa5a1e;--dark:#0a0a0a;--dark-ink:#e8eaf0;--dark-muted:#8a93a8;\n  background:var(--paper);color:var(--ink);font-family:\"Noto Sans TC\",system-ui,sans-serif;line-height:1.6;\n  -webkit-font-smoothing:antialiased}\n.jdlive *{box-sizing:border-box}\n.jdlive .jd-in{max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,40px)}\n.jdlive .arch{font-family:Archivo,system-ui,sans-serif;font-style:italic;font-weight:900;letter-spacing:-.02em;line-height:.95}\n.jdlive .eyebrow{font-family:\"JetBrains Mono\",monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--blue);font-weight:700}\n.jdlive .btn{display:inline-block;background:var(--blue);color:#fff;border:0;border-radius:12px;padding:14px 26px;\n  font-weight:900;font-size:16px;cursor:pointer;text-decoration:none;font-family:inherit;text-align:center}\n.jdlive .btn:hover{background:var(--blue-deep)}\n.jdlive .btn[disabled]{opacity:.55;cursor:default}\n.jdlive .tag{display:inline-block;background:var(--orange);color:#fff;font-size:11px;font-weight:900;\n  letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:20px}\n.jdlive .card{background:var(--card);border:1.5px solid var(--ink);border-radius:16px;box-shadow:6px 6px 0 var(--ink)}\n\n.jdlive .topbar{background:var(--ink);color:#fff;padding:10px 0}\n.jdlive .topbar .jd-in{display:flex;align-items:center;gap:14px;flex-wrap:wrap}\n.jdlive .brand{font-family:Archivo;font-style:italic;font-weight:900;font-size:18px;letter-spacing:-.02em}\n.jdlive .livedot{display:inline-flex;align-items:center;gap:7px;background:var(--orange);color:#fff;\n  font-size:12px;font-weight:900;letter-spacing:.08em;padding:4px 12px;border-radius:20px}\n.jdlive .livedot s{width:7px;height:7px;border-radius:50%;background:#fff;animation:jdblink 1.4s infinite}\n@keyframes jdblink{0%,100%{opacity:1}50%{opacity:.25}}\n.jdlive .topbar .meta{margin-left:auto;font-family:\"JetBrains Mono\",monospace;font-size:12px;color:#9aa0ae}\n\n.jdlive .stagewrap{background:var(--dark);padding:26px 0 30px}\n.jdlive .stage2{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px;align-items:start}\n.jdlive .player{aspect-ratio:16/9;background:#000;border:1.5px solid #2a2a2a;border-radius:14px;overflow:hidden;\n  display:flex;align-items:center;justify-content:center;position:relative}\n.jdlive .player video{width:100%;height:100%;display:block;background:#000}\n.jdlive .player .ph{color:#4a5060;font-family:\"JetBrains Mono\",monospace;font-size:13px;text-align:center;line-height:2;padding:20px}\n.jdlive .player .ph b{display:block;font-size:40px;color:#2a3040}\n.jdlive .nowtitle{margin:16px 0 0;color:#fff}\n.jdlive .nowtitle h1{margin:0;font-size:clamp(26px,4.6vw,44px)}\n.jdlive .nowtitle .sub{color:var(--dark-muted);font-size:15px;margin-top:8px;line-height:1.7}\n.jdlive .pin{background:#10224a;border:1.5px solid var(--blue);border-radius:12px;padding:10px 13px;\n  color:#cddaff;font-size:13px;font-weight:700;margin-bottom:14px}\n\n.jdlive .chat{background:#111319;border:1.5px solid #2a2a2a;border-radius:14px;display:flex;flex-direction:column;height:520px}\n.jdlive .chat h3{margin:0;padding:13px 15px;border-bottom:1px solid #23252d;color:#fff;font-size:14px;font-weight:900;display:flex;align-items:center;gap:8px}\n.jdlive .chat h3 .n{margin-left:auto;font-family:\"JetBrains Mono\",monospace;font-size:11px;color:var(--dark-muted);font-weight:500}\n.jdlive .msgs{flex:1;overflow-y:auto;padding:12px 15px;display:flex;flex-direction:column;gap:11px}\n.jdlive .msgs.blur{overflow:hidden;position:relative}\n.jdlive .msgs.blur::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:56px;\n  background:linear-gradient(to bottom,rgba(17,19,25,0),#111319);pointer-events:none}\n.jdlive .m{font-size:13.5px;line-height:1.6;color:#cfd3dd;word-break:break-word}\n.jdlive .m b{color:#fff;font-weight:800;margin-right:6px}\n.jdlive .m.q{background:#2a1a10;border-left:3px solid var(--orange);padding:8px 10px;border-radius:0 8px 8px 0}\n.jdlive .m.q i{font-style:normal;font-size:10px;font-weight:900;background:var(--orange);color:#fff;\n  padding:1px 6px;border-radius:8px;margin-right:6px;letter-spacing:.06em}\n.jdlive .m.done{background:#16220f;border-left-color:#4f9e3f}\n.jdlive .m.done i{background:#4f9e3f}\n.jdlive .m.mine b{color:#7fa2ff}\n.jdlive .m.sys{color:var(--dark-muted);font-size:12.5px;text-align:center}\n.jdlive .chatbar{border-top:1px solid #23252d;padding:11px 12px;display:flex;flex-direction:column;gap:8px}\n.jdlive .chatbar textarea{width:100%;min-width:min(120px,100%);background:#0c0e13;border:1.5px solid #2a2a2a;\n  border-radius:10px;color:#e8eaf0;padding:9px 11px;font:inherit;font-size:13px;resize:none}\n.jdlive .chatbar .row{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--dark-muted)}\n.jdlive .chatbar .row .btn{margin-left:auto;padding:9px 18px;font-size:14px;border-radius:10px}\n.jdlive .chatbar .hint{margin:0;font-size:11.5px;color:var(--orange);min-height:1em}\n.jdlive .loginwall{text-align:center;padding:16px 14px}\n.jdlive .loginwall p{margin:0 0 12px;color:#cfd3dd;font-size:13px;line-height:1.7}\n.jdlive .loginwall p b{color:#fff}\n.jdlive .loginwall .btn{width:100%;padding:12px;font-size:15px;border-radius:10px}\n.jdlive .loginwall small{display:block;margin-top:10px;color:var(--dark-muted);font-size:11.5px;line-height:1.6}\n\n.jdlive .next{padding:clamp(40px,7vw,80px) 0}\n.jdlive .nextgrid{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(24px,4vw,48px);align-items:center}\n.jdlive .next h1{margin:14px 0 0;font-size:clamp(40px,7vw,78px)}\n.jdlive .next h1 em{font-style:italic;color:var(--blue)}\n.jdlive .next .zh{font-size:clamp(19px,2.4vw,26px);font-weight:900;margin:18px 0 0;line-height:1.5}\n.jdlive .next p.lead{color:var(--muted);font-size:16px;line-height:1.9;margin:16px 0 0;max-width:52ch}\n.jdlive .countdown{display:flex;gap:10px;margin:26px 0 0}\n.jdlive .cd{background:var(--ink);color:#fff;border-radius:14px;padding:14px 8px;text-align:center;min-width:78px;flex:1;max-width:96px}\n.jdlive .cd b{display:block;font-family:\"JetBrains Mono\",monospace;font-size:clamp(26px,4vw,36px);font-weight:700;line-height:1}\n.jdlive .cd span{display:block;font-family:\"JetBrains Mono\",monospace;font-size:10px;letter-spacing:.14em;color:#8a93a8;margin-top:7px}\n.jdlive .remind{padding:22px}\n.jdlive .remind h3{margin:12px 0 6px;font-size:17px;font-weight:900}\n.jdlive .remind p{margin:0 0 14px;color:var(--muted);font-size:13.5px;line-height:1.7}\n.jdlive .remind .btn{width:100%}\n.jdlive .remind small{display:block;margin-top:10px;color:var(--muted);font-size:11.5px;line-height:1.6}\n.jdlive .remind small b{color:var(--ink)}\n\n.jdlive .lab{background:var(--dark);color:var(--dark-ink);padding:clamp(40px,6vw,72px) 0}\n.jdlive .lab .secname{display:flex;align-items:baseline;gap:14px;margin-bottom:26px;flex-wrap:wrap}\n.jdlive .lab .secname .en{font-family:Archivo;font-style:italic;font-weight:900;font-size:clamp(22px,3vw,32px);color:#fff}\n.jdlive .lab .secname .zh{font-family:\"JetBrains Mono\",monospace;font-size:12px;letter-spacing:.2em;color:var(--blue)}\n.jdlive .scope{height:42px;border:1px solid #23252d;border-radius:10px;background:#0c0e13;margin-bottom:22px;overflow:hidden}\n.jdlive .scope svg{width:100%;height:100%;display:block}\n.jdlive .scope polyline{fill:none;stroke:var(--blue);stroke-width:1.6;stroke-dasharray:5 7;animation:jddash 9s linear infinite}\n@keyframes jddash{to{stroke-dashoffset:-260}}\n.jdlive .rows{display:grid;gap:11px}\n.jdlive .row2{display:grid;grid-template-columns:78px 1fr;gap:14px;align-items:center;\n  background:#111319;border:1px solid #23252d;border-radius:12px;padding:13px 15px}\n.jdlive .row2 .ch{font-family:\"JetBrains Mono\",monospace;font-size:11px;color:var(--blue);letter-spacing:.1em}\n.jdlive .row2 .t{font-size:14.5px;font-weight:700;color:#fff}\n\n.jdlive .who{background:var(--card);border-top:1.5px solid var(--ink);border-bottom:1.5px solid var(--ink);padding:clamp(36px,5vw,64px) 0}\n.jdlive .whogrid{display:grid;grid-template-columns:200px 1fr;gap:clamp(20px,4vw,40px);align-items:center}\n.jdlive .photo{aspect-ratio:1;background:linear-gradient(135deg,#dcdcd4,#c8c8bf);border:1.5px solid var(--ink);\n  border-radius:14px;box-shadow:6px 6px 0 var(--blue);background-size:cover;background-position:center}\n.jdlive .who h3{margin:10px 0 0;font-size:clamp(24px,3.4vw,34px)}\n.jdlive .who p{color:var(--muted);font-size:15px;line-height:1.9;margin:14px 0 0;max-width:56ch}\n.jdlive .cta{background:var(--blue);color:#fff;padding:clamp(40px,6vw,68px) 0;text-align:center}\n.jdlive .cta h2{margin:0;font-size:clamp(28px,4.6vw,46px)}\n.jdlive .cta p{margin:14px auto 26px;max-width:46ch;font-size:16px;line-height:1.8;color:#dbe4ff}\n.jdlive .cta .btn{background:#fff;color:var(--blue)}\n.jdlive .cta .btn:hover{background:#eef3ff}\n.jdlive .boot{padding:80px 20px;text-align:center;color:var(--muted);font-size:14px}\n\n@media(max-width:900px){\n  .jdlive .stage2{grid-template-columns:minmax(0,1fr)}\n  .jdlive .chat{height:420px}\n  .jdlive .nextgrid{grid-template-columns:minmax(0,1fr)}\n  .jdlive .whogrid{grid-template-columns:minmax(0,1fr)}\n  .jdlive .photo{max-width:180px}\n}\n@media(max-width:560px){\n  .jdlive .row2{grid-template-columns:1fr;gap:6px}\n  .jdlive .countdown .cd{min-width:0;padding:12px 4px}\n}\n";

/* ═══════════════════════════════════════════════════════════════════════════
   JDAC 公開直播頁 /live
   ─────────────────────────────────────────────────────────────────────────
   兩種狀態：直播中（播放器＋聊天）／未開播（下一場預告＋註冊動線）。
   往期直播**刻意不在這裡陳列**——開播過的場次一律收進學員專區的講座課程，
   「想看回放」本身就是註冊的理由（Jacob 2026-09-20 決定）。

   身分的分界（整個漏斗的核心）：
     「看」  → 走公開端點 /_functions/live?scope=public，**不需要登入**（門檻越低越好）
     「留言」→ 走 webMethod（page code 橋接），**一定要登入**＝轉換點
   元件 fetch http function 拿不到登入會員，所以留言只能走 page code 那條路。

   即時性用**輪詢**不用 Realtime：公開頁訪客數不可控，而且 Realtime 要 page code
   訂閱＋轉發 attribute，多一層會壞的東西。直播中每 5 秒抓一次，夠用了。
   ═══════════════════════════════════════════════════════════════════════════ */
function jdacLiveInit(root){
  var API='https://www.jacobdrumemory.com/_functions/';
  var $=function(s){return root.querySelector(s);};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};

  var S=null;            // 後端回的狀態
  var hls=null;          // hls.js 實例
  var pollT=null, cdT=null, renewT=null;
  var seq=0, pending={};
  var lastKey='';        // 上次渲染的狀態指紋——一樣就不重畫（不然打字會被洗掉）
  var sending=false;
  // ⚠️ 登入狀態**不能**靠後端那支公開端點判斷：元件 fetch /_functions/ 永遠拿不到登入會員，
  //    所以 getLive 回的 guest 對這頁永遠是 true，登入了也一樣。真正的登入狀態只有 page code
  //    問得到（authentication.loggedIn()），它會寫進 jdac-auth attribute 告訴我們。
  //    沒有 page code 的環境（直接開這個 html）＝永遠當未登入，顯示登入牆，這是對的 fallback。
  var loggedIn=false;

  /* ── 跟 Wix page code 溝通 ──────────────────────────────────────────────
     元件 dispatch 'jdac-action'，page code 呼叫 webMethod 後把結果寫回
     'jdac-result' attribute（Wix 的 $w wrapper 沒有 dispatchEvent，只能走 attribute）。
     沒有 page code 的環境（例如直接開這個 html）會逾時回 null，介面顯示「請到官網」。 */
  root._jdacOnResult=function(v){
    try{ var r=JSON.parse(v); var fn=pending[r.id]; if(fn){delete pending[r.id]; fn(r.result);} }catch(e){}
  };
  root._jdacOnAuth=function(v){
    try{ var a=JSON.parse(v); var was=loggedIn; loggedIn=!!a.loggedIn; if(was!==loggedIn) render(true); }catch(e){}
  };
  function action(type,payload,ms){
    return new Promise(function(res){
      var id='q'+(++seq), done=false;
      var settle=function(v){ if(done)return; done=true; delete pending[id]; res(v); };
      pending[id]=settle;
      try{
        (root.host||root).dispatchEvent(new CustomEvent('jdac-action',
          {detail:{type:type,payload:Object.assign({reqId:id},payload||{})},bubbles:true,composed:true}));
      }catch(e){ settle(null); }
      setTimeout(function(){ settle(null); }, ms||12000);
    });
  }

  /* ── 取狀態 ───────────────────────────────────────────────────────────── */
  function load(){
    return fetch(API+'live?scope=public&cb='+Date.now())
      .then(function(r){return r.json();})
      .catch(function(){return null;});
  }

  /* ── HLS ──────────────────────────────────────────────────────────────── */
  function ensureHls(){
    if(window.Hls) return Promise.resolve(true);
    return new Promise(function(res){
      var s=document.getElementById('jdac-hlsjs');
      if(!s){
        s=document.createElement('script'); s.id='jdac-hlsjs';
        s.src='https://cdn.jsdelivr.net/npm/hls.js@1.5/dist/hls.min.js';
        document.head.appendChild(s);
      }
      s.addEventListener('load',function(){res(!!window.Hls);});
      s.addEventListener('error',function(){res(false);});
      setTimeout(function(){res(!!window.Hls);},8000);
    });
  }
  function killHls(){ try{ if(hls){hls.destroy(); hls=null;} }catch(e){ hls=null; } }
  function attach(video,url){
    killHls();
    if(video.canPlayType&&video.canPlayType('application/vnd.apple.mpegurl')){ video.src=url; return; }
    ensureHls().then(function(ok){
      if(!video.isConnected) return;
      if(ok&&window.Hls&&window.Hls.isSupported()){
        var h=new window.Hls({lowLatencyMode:true,liveSyncDurationCount:3});
        hls=h;
        // 鑑權過期（403）表現成致命載入錯誤 → 重抓一組新網址接上去
        h.on(window.Hls.Events.ERROR,function(_e,d){ if(d&&d.fatal) renew(true); });
        h.loadSource(url); h.attachMedia(video);
      } else { video.src=url; }
    });
  }
  function renew(force){
    load().then(function(r){
      if(!r||!r.playUrl) return;
      S=r;
      var v=$('#jdPlayer');
      if(!v) return;
      if(force||!hls){ attach(v,r.playUrl); }
      else { try{ hls.loadSource(r.playUrl); }catch(e){ attach(v,r.playUrl); } }
    });
  }

  /* ── 小工具 ───────────────────────────────────────────────────────────── */
  function fmtWhen(iso){
    if(!iso) return '';
    try{
      var d=new Date(iso), w='日一二三四五六'[d.getDay()];
      return d.getMonth()+1+'/'+d.getDate()+'（'+w+'）'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    }catch(e){ return ''; }
  }
  // 「本場重點」＝場次說明每行一條（老師排場次時填在說明欄）
  function bullets(desc){
    return String(desc||'').split('\n').map(function(x){return x.trim();}).filter(Boolean).slice(0,6);
  }

  /* ── 渲染 ─────────────────────────────────────────────────────────────── */
  function msgHTML(m){
    var cls='m'+(m.q?' q':'')+(m.answered?' done':'')+(m.mine?' mine':'');
    return '<div class="'+cls+'" data-mid="'+esc(m.id)+'">'
      +(m.q?'<i>'+(m.answered?'已回答':'提問')+'</i>':'')
      +'<b>'+esc(m.name)+'</b>'+esc(m.text)+'</div>';
  }
  function chatBar(){
    if(!S.canChat) return '<div class="chatbar"><p class="hint" style="color:#8a93a8">這一場沒有開放留言。</p></div>';
    if(!loggedIn){
      return '<div class="chatbar loginwall">'
        +'<p><b>想留言或提問？</b><br>免費註冊會員就能發言，Jacob 會挑題現場回答。</p>'
        +'<button class="btn" id="jdLogin">登入 / 免費註冊</button>'
        +'<small>已經是學員的話，用原本的帳號登入就好。</small></div>';
    }
    return '<div class="chatbar">'
      +'<textarea id="jdText" rows="2" maxlength="300" placeholder="說點什麼，或勾「這是問題」讓 Jacob 看到"></textarea>'
      +'<div class="row"><label><input type="checkbox" id="jdIsQ"> 這是問題</label>'
      +'<button class="btn" id="jdSend">送出</button></div>'
      +'<p class="hint" id="jdHint"></p></div>';
  }
  function ctaHTML(){
    return '<div class="cta"><div class="jd-in">'
      +'<h2 class="arch">想把今天講的真的練起來？</h2>'
      +'<p>直播講的是「為什麼」，線上教練課帶你走完「怎麼做」——有課表、有作業，我一個一個批改。</p>'
      +'<a class="btn" href="/線上教練課">看線上教練課</a>'
      +'</div></div>';
  }

  function viewLive(){
    var s=S.session, bs=bullets(s.desc);
    var msgs=(S.messages||[]).map(msgHTML).join('')
      || '<div class="m sys">還沒有人發言。打個招呼吧。</div>';
    return '<div class="topbar"><div class="jd-in">'
      +'<span class="brand">JDAC</span><span class="livedot"><s></s>LIVE</span>'
      +'<span class="meta">'+esc(fmtWhen(s.startedAt||s.scheduledAt))+'</span></div></div>'
      +'<div class="stagewrap"><div class="jd-in">'
      + (s.pinnedText?'<div class="pin">📌 '+esc(s.pinnedText)+'</div>':'')
      +'<div class="stage2"><div>'
      +'<div class="player">'+(S.playUrl
          ? '<video id="jdPlayer" controls playsinline autoplay muted></video>'
          : '<div class="ph"><b>▶</b>直播準備中，稍後重新整理</div>')+'</div>'
      +'<div class="nowtitle"><h1 class="arch">'+esc(s.title)+'</h1></div>'
      +'</div>'
      +'<div class="chat"><h3>💬 聊天室<span class="n" id="jdCnt">'+((S.messages||[]).length)+' 則</span></h3>'
      +'<div class="msgs'+(loggedIn?'':' blur')+'" id="jdMsgs">'+msgs+'</div>'
      +chatBar()+'</div>'
      +'</div></div></div>'
      + (bs.length?('<div class="lab"><div class="jd-in">'
          +'<div class="secname"><span class="en">TONIGHT\'S SET</span><span class="zh">本場重點</span></div>'
          +'<div class="scope"><svg viewBox="0 0 600 42" preserveAspectRatio="none"><polyline points="0,21 40,21 52,7 64,35 76,21 130,21 142,12 154,30 166,21 240,21 252,4 264,38 276,21 340,21 352,14 364,28 376,21 450,21 462,8 474,34 486,21 600,21"/></svg></div>'
          +'<div class="rows">'+bs.map(function(b,i){
              return '<div class="row2"><span class="ch">CH.'+String(i+1).padStart(2,'0')+'</span><span class="t">'+esc(b)+'</span></div>';
            }).join('')+'</div></div></div>'):'')
      + ctaHTML();
  }

  function viewIdle(){
    var s=S.session;
    var when=s?fmtWhen(s.scheduledAt):'';
    var bs=s?bullets(s.desc):[];
    var head=s
      ? '<span class="eyebrow">NEXT SESSION / 下一場直播</span>'
        +'<h1 class="arch">'+esc(s.title)+'</h1>'
        +'<p class="zh">'+esc(when)+' · 免費 · 線上</p>'
        + (bs.length?'<p class="lead">'+esc(bs.join('｜'))+'</p>':'')
        +'<div class="countdown" id="jdCd"><div class="cd"><b>--</b><span>DAYS</span></div>'
        +'<div class="cd"><b>--</b><span>HRS</span></div><div class="cd"><b>--</b><span>MIN</span></div></div>'
      : '<span class="eyebrow">JDAC LIVE</span>'
        +'<h1 class="arch">下一場<br><em>還在排</em></h1>'
        +'<p class="lead">每一場挑一個大家真的卡住的點，講清楚、當場示範、當場回答。排好會公告，註冊會員就會收到通知。</p>';
    return '<div class="topbar"><div class="jd-in"><span class="brand">JDAC</span>'
      +'<span class="meta" style="margin-left:0;color:#8a93a8">LIVE</span>'
      + (when?'<span class="meta">下一場 '+esc(when)+'</span>':'')+'</div></div>'
      +'<div class="next"><div class="jd-in"><div class="nextgrid"><div>'+head+'</div>'
      +'<div class="card remind"><span class="tag">Free</span>'
      +'<h3>'+(loggedIn?'開播時會通知你':'註冊就通知你開播')+'</h3>'
      +'<p>'+(loggedIn
          ?'你已經登入了，開播時會通知你。直播時可以直接留言提問。'
          :'免費註冊會員，開播前寄提醒給你。直播時也才能留言、提問——Jacob 會挑題現場回答。')+'</p>'
      +(loggedIn?'':'<button class="btn" id="jdLogin">免費註冊 / 登入</button>')
      +'<small>往期的直播不會放在這裡，開播過的場次會收進<b>學員專區的講座課程</b>。</small>'
      +'</div></div></div></div>'
      +'<div class="who"><div class="jd-in"><div class="whogrid">'
      +'<div class="photo"></div><div>'
      +'<span class="eyebrow">MEET JACOB / 關於你的教練</span>'
      +'<h3 class="arch">教鼓十幾年，<br>最常看到的還是同一批問題</h3>'
      +'<p>所以我開這個直播。每一場挑一個大家真的卡住的點，講清楚、當場示範、當場回答。不賣關子，也不留一半到課程裡。</p>'
      +'</div></div></div></div>'
      + ctaHTML();
  }

  /* ── 主渲染：狀態指紋一樣就不重畫（避免洗掉打到一半的留言）────────────── */
  function key(){
    if(!S) return 'boot';
    var s=S.session;
    return [S.live?'L':'I', s?s.id:'-', s?s.status:'-', loggedIn?'m':'g', S.canChat?'c':'-',
            s?s.pinnedText:'', S.playUrl?'p':'-'].join('|');
  }
  function render(force){
    var k=key();
    if(!force && k===lastKey){ patchMsgs(); return; }
    lastKey=k;
    root.innerHTML = S ? (S.live?viewLive():viewIdle()) : '<div class="boot">載入中…</div>';
    wire();
  }
  // 只換訊息區，不動輸入框
  function patchMsgs(){
    var box=$('#jdMsgs'); if(!box||!S) return;
    var html=(S.messages||[]).map(msgHTML).join('')||'<div class="m sys">還沒有人發言。打個招呼吧。</div>';
    if(box.getAttribute('data-sig')===html) return;
    var near=box.scrollHeight-box.scrollTop-box.clientHeight<60;
    box.setAttribute('data-sig',html);
    box.innerHTML=html;
    var c=$('#jdCnt'); if(c) c.textContent=((S.messages||[]).length)+' 則';
    if(near) box.scrollTop=box.scrollHeight;
  }

  /* ── 接線 ─────────────────────────────────────────────────────────────── */
  function wire(){
    var v=$('#jdPlayer');
    if(v&&S&&S.playUrl){
      attach(v,S.playUrl);
      if(renewT) clearTimeout(renewT);
      renewT=setTimeout(function(){renew(false);}, Math.max(60,Number(S.renewInSec)||1500)*1000);
    }
    var box=$('#jdMsgs'); if(box) box.scrollTop=box.scrollHeight;

    var lg=$('#jdLogin');
    if(lg) lg.addEventListener('click',function(){
      lg.disabled=true;
      action('prompt-login',{},60000).then(function(r){
        lg.disabled=false;
        // 登入成功 → 重抓狀態（guest 會變 false，輸入框就出現了）
        if(r&&r.ok){ loggedIn=true; refresh(true); }
        else if(r===null){ lg.textContent='請到 jacobdrumemory.com 登入'; }
      });
    });

    var send=$('#jdSend'), ta=$('#jdText');
    if(send&&ta){
      var go=function(){
        if(sending) return;
        var text=(ta.value||'').trim();
        var hint=$('#jdHint');
        if(!text||!S.session) return;
        sending=true; send.disabled=true; if(hint) hint.textContent='';
        var q=$('#jdIsQ');
        action('live-msg',{sessionId:S.session.id,text:text,isQuestion:!!(q&&q.checked)}).then(function(r){
          sending=false; send.disabled=false;
          if(r&&r.ok){
            ta.value=''; if(q) q.checked=false;
            S.messages=(S.messages||[]).concat([r.msg]);
            patchMsgs();
          } else if(hint){
            hint.textContent = !r ? '沒送出去，再試一次。'
              : r.reason==='too-fast' ? '慢一點，兩秒後再送。'
              : r.reason==='login-required' ? '請先登入。'
              : r.reason==='chat-off' ? '留言已關閉。' : '沒送出去，再試一次。';
          }
        });
      };
      send.addEventListener('click',go);
      ta.addEventListener('keydown',function(e){
        if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();go();}
      });
    }
    startCountdown();
  }

  function startCountdown(){
    if(cdT){clearInterval(cdT);cdT=null;}
    var el=$('#jdCd'); if(!el||!S||!S.session||!S.session.scheduledAt) return;
    var target=new Date(S.session.scheduledAt).getTime();
    var tick=function(){
      var d=target-Date.now();
      if(d<=0){ el.innerHTML='<div class="cd" style="max-width:none"><b style="font-size:20px">即將開始</b></div>'; clearInterval(cdT); cdT=null; return; }
      var day=Math.floor(d/864e5), hr=Math.floor(d%864e5/36e5), mi=Math.floor(d%36e5/6e4);
      var b=el.querySelectorAll('b');
      if(b.length>=3){ b[0].textContent=String(day).padStart(2,'0'); b[1].textContent=String(hr).padStart(2,'0'); b[2].textContent=String(mi).padStart(2,'0'); }
    };
    tick(); cdT=setInterval(tick,30000);
  }

  /* ── 輪詢：直播中 5 秒（聊天要跟得上），沒播 60 秒（只是等開播）────────── */
  function refresh(force){
    return load().then(function(r){
      if(!r) return;
      S=r; render(force);
      schedule();
    });
  }
  function schedule(){
    if(pollT) clearTimeout(pollT);
    pollT=setTimeout(function(){refresh(false);}, (S&&S.live)?5000:60000);
  }

  refresh(true);
}


function build(host){
 if(host._jdacLiveDone)return;host._jdacLiveDone=true;
 if(!document.getElementById('jdac-live-fonts')){var l=document.createElement('link');l.id='jdac-live-fonts';l.rel='stylesheet';l.href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,600;0,800;1,800;1,900&family=JetBrains+Mono:wght@500;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap";document.head.appendChild(l);}
 if(!document.getElementById('jdac-live-css')){var st=document.createElement('style');st.id='jdac-live-css';st.textContent=CSS;document.head.appendChild(st);}
 host.classList.add('jdlive');
 host.innerHTML='<div class="boot">載入中…</div>';
 jdacLiveInit(host);
}
function reg(t){if(!customElements.get(t)){try{customElements.define(t,class extends HTMLElement{
  static get observedAttributes(){return ['jdac-result','jdac-auth'];}
  connectedCallback(){build(this);}
  attributeChangedCallback(n,o,v){if(!v)return;
    if(n==='jdac-result'&&this._jdacOnResult){this._jdacOnResult(v);}
    if(n==='jdac-auth'&&this._jdacOnAuth){this._jdacOnAuth(v);}}
});}catch(e){}}}
reg("jdac-live");
})();
