/* JDAC 嵌入頁（被官網 iframe 嵌的那一邊）：回報內容高度＋把 scrollIntoView 交給外層（2026-10-18）
 *   <script src="./embed-child.js" data-from="salespage"></script>   ← 放在 body 最後
 * 外層是 Wix 自訂程式碼載入的 embed-fit.js：收到高度就把框撐成內容高，回 {jdacFit:1}。
 *
 * 高度量 body，不量 documentElement.scrollHeight：框被撐高之後 scrollHeight 會等於框高，
 * 內容變短（例如收起 FAQ）就再也縮不回來。
 * scrollIntoView：框撐成全高後，框裡自己不會捲，錨點要改捲外層頁面。沒收到 jdacFit
 * （外層還沒裝 embed-fit.js、或單獨開這頁）就照瀏覽器原本的行為。
 */
(function () {
  if (window.top === window) return;
  var me = document.currentScript;
  var FROM = (me && me.getAttribute('data-from')) || 'embed';
  var fitted = false, last = -1, lastAt = 0;

  function height() {
    var b = document.body;
    if (!b) return 0;
    return Math.ceil(Math.max(b.getBoundingClientRect().height, b.scrollHeight));
  }
  function send(force) {
    var h = height(), now = Date.now();
    if (!h) return;
    // 有變就馬上送；沒變也每 3 秒補一次（Wix 偶爾會把框的高度蓋回去，外層靠這個補回來）
    if (!force && h === last && now - lastAt < 3000) return;
    last = h; lastAt = now;
    try { parent.postMessage({ jdacFrom: FROM, jdacHeight: h }, '*'); } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    if (e.source === parent && e.data && e.data.jdacFit) fitted = true;
  });

  var native = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (arg) {
    if (!fitted) return native.apply(this, arguments);
    var o = (arg && typeof arg === 'object') ? arg : { block: arg === false ? 'nearest' : 'start' };
    var r = this.getBoundingClientRect();
    try {
      parent.postMessage({ jdacFrom: FROM, jdacScrollTo: r.top + (window.pageYOffset || 0), jdacH: r.height,
        block: o.block || 'start', smooth: o.behavior === 'smooth' }, '*');
    } catch (e) { return native.apply(this, arguments); }
  };

  window.addEventListener('load', function () { send(true); });
  window.addEventListener('resize', function () { send(false); });
  document.addEventListener('toggle', function () { send(false); }, true);   // <details> 開合
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(function () { send(false); });
    var watch = function () { if (document.body) ro.observe(document.body); else setTimeout(watch, 50); };
    watch();
  }
  setInterval(function () { send(false); }, 1000);
  send(true);
})();
