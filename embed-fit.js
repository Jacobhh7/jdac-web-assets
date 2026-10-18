/* JDAC 官網：嵌入頁自動高度＋錨點捲動（2026-10-18）
 *
 * 放在 Wix「設定 → 自訂程式碼」：所有頁面、Body 結尾、載入一次。
 *   <script src="https://jacobhh7.github.io/jdac-web-assets/embed-fit.js" defer></script>
 *
 * 為什麼要這支：首頁／教練課頁／7-day 等頁是 HtmlComponent（iframe）嵌 GitHub Pages。
 * Velo 的 HtmlComponent 沒有 height 屬性，masterPage.js 的 `c.height = h` 從來沒生效，
 * 框一直停在編輯器設的高度、內容在框裡自己捲。Velo 程式跑在 worker 碰不到版面，
 * 自訂元素又會撞學員專區佔走的 wix-default-custom-element 標籤（2026-07-01 全站卡住過），
 * 所以改由「自訂程式碼」這支跑在頁面本體的腳本來撐高。
 *
 * 只理 jacobhh7.github.io 送來、帶 jdacFrom 的訊息：
 *   {jdacFrom, jdacHeight}            → 把那個 iframe 和它外面幾層 Wix 包裝改成內容高度
 *   {jdacFrom, jdacScrollTo, block}    → 嵌入頁裡的錨點／scrollIntoView，改捲外層頁面
 * 撐高之後回 {jdacFit:1} 給嵌入頁，嵌入頁才會把 scrollIntoView 改走外層（見 embed-child.js）。
 */
(function () {
  if (window.__jdacEmbedFit) return;
  window.__jdacEmbedFit = 1;
  var ORIGIN = /^https:\/\/jacobhh7\.github\.io$/;
  var MAX = 60000;

  function frameOf(win) {
    var fs = document.getElementsByTagName('iframe');
    for (var i = 0; i < fs.length; i++) { try { if (fs[i].contentWindow === win) return fs[i]; } catch (e) {} }
    return null;
  }
  function imp(n, k, v) { if (n.style.getPropertyValue(k) !== v || n.style.getPropertyPriority(k) !== 'important') n.style.setProperty(k, v, 'important'); }

  // Wix 的 HtmlComponent：<div id="comp-xxx">（grid 裡的一格）裡面包著 position:absolute 的 iframe，
  // 高度其實是那一格 grid 列撐出來的（編輯器設的高度，Studio 還會跟著視窗寬度等比例縮放）。
  // 做法：comp 直接給明確高度；往外每一層 grid，把「這個 comp 所在那一列」的固定 px 改成 auto，height 改 auto。
  // ⚠️ 不能把 comp 設成 height:auto——裡面的 iframe 是絕對定位，auto 會量到 0，整段縮成 0、整頁不能捲（第一版就是這樣壞的）。
  function closestComp(f) { var n = f.parentElement; while (n && !(n.id && n.id.indexOf('comp-') === 0)) n = n.parentElement; return n; }
  function fit(f, h) {
    imp(f, 'height', h + 'px');
    imp(f, 'max-height', 'none');
    var comp = closestComp(f);
    if (!comp) return;
    imp(comp, 'height', h + 'px');
    imp(comp, 'min-height', h + 'px');
    imp(comp, 'max-height', 'none');
    var sec = comp.closest('section');
    // section 裡只有這個嵌入框時，連編輯器留的最小高度也拿掉（不然框下面會留一大塊空白，例如 /7-day 原本多 1336px）
    var only = !!sec && countComps(sec) === 1;
    var child = comp, n = comp.parentElement, i = 0;
    while (n && n.tagName !== 'BODY' && n.id !== 'SITE_PAGES' && i < 12) {
      var cs = getComputedStyle(n);
      if (cs.display === 'contents') { n = n.parentElement; i++; continue; }   // <main> 是 display:contents，grid 的格子其實是裡面的 section
      imp(n, 'height', 'auto');
      imp(n, 'max-height', 'none');
      if (only && sec && sec.contains(n)) imp(n, 'min-height', '0px');
      if (cs.display.indexOf('grid') >= 0) {
        var rows = cs.gridTemplateRows.split(' ');
        if (rows.every(function (r) { return /^[\d.]+px$/.test(r); })) {
          if (rows.length === 1) imp(n, 'grid-template-rows', 'auto');
          else {
            var r0 = parseInt(getComputedStyle(child).gridRowStart, 10);
            if (r0 > 0 && r0 <= rows.length && rows[r0 - 1] !== 'auto') { rows[r0 - 1] = 'auto'; imp(n, 'grid-template-rows', rows.join(' ')); }
          }
        }
      }
      child = n; n = n.parentElement; i++;
    }
  }
  // section 裡有幾個「最外層」的 Wix 元件（comp-xxx）——只有嵌入框一個時才敢拿掉最小高度
  function countComps(sec) {
    var n = 0, all = sec.querySelectorAll('[id^="comp-"]');
    for (var i = 0; i < all.length; i++) {
      var p = all[i].parentElement, nested = false;
      while (p && p !== sec) { if (p.id && p.id.indexOf('comp-') === 0) { nested = true; break; } p = p.parentElement; }
      if (!nested) n++;
    }
    return n;
  }

  function scrollToIn(f, y, h, block, smooth) {
    var r = f.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    var abs = r.top + window.pageYOffset + y, top;
    if (block === 'nearest') {
      var t = r.top + y, b = t + (h || 0);
      if (t >= 0 && b <= vh) return;                          // 已經整個看得到就不動
      top = (t < 0 || (h || 0) > vh) ? abs - 12 : abs + (h || 0) - vh + 12;
    } else if (block === 'center') {
      top = abs + (h || 0) / 2 - vh / 2;
    } else {
      top = abs - 12;
    }
    try { window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }

  window.addEventListener('message', function (e) {
    if (!ORIGIN.test(e.origin || '')) return;
    var d = e.data;
    if (!d || typeof d !== 'object' || !d.jdacFrom) return;
    var f = frameOf(e.source);
    if (!f) return;
    if (d.jdacHeight != null) {
      var h = Math.ceil(Number(d.jdacHeight) || 0);
      if (h < 100 || h > MAX || f.__jdacStop) return;
      // 保險：嵌入頁如果有跟著視窗高度長的樣式（vh），撐高→內容又變高→再撐高會停不下來。
      // 同一個框 10 秒內變高超過 25 次就停手，維持現狀。
      var now = Date.now(), g = f.__jdacGrow || (f.__jdacGrow = []);
      if (h > (f.__jdacH || 0)) { g.push(now); while (g.length && now - g[0] > 10000) g.shift(); if (g.length > 25) { f.__jdacStop = 1; return; } }
      f.__jdacH = h;
      fit(f, h);
      try { e.source.postMessage({ jdacFit: 1 }, e.origin); } catch (err) {}
    }
    if (d.jdacScrollTo != null) scrollToIn(f, Number(d.jdacScrollTo) || 0, Number(d.jdacH) || 0, d.block, d.smooth !== false);
  });
})();
