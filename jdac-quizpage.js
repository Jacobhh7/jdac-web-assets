(function(){
if(window.customElements&&customElements.get("jdac-quizpage"))return;
var CSS="\n.pg{background:#f4f3ee;color:#0c0c0c;font-family:\"Noto Sans TC\",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}\n.pg *{box-sizing:border-box}\n.wrap{max-width:720px;margin:0 auto;padding:0 clamp(18px,5vw,40px) 56px}\n.mglab{font-family:\"Archivo\",sans-serif;font-weight:500;letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:#3a3a36}\n.lab{color:#2563ff;margin:26px 0 10px}\nh1{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(30px,7.2vw,44px);line-height:1.12;letter-spacing:-.015em;margin:0 0 12px}\nh1 em{font-style:italic;color:#2563ff}\n.sub{font-size:clamp(14.5px,1.5vw,16px);color:#3a3a36;line-height:1.85;margin:0 0 26px}\n.sub b{color:#0c0c0c;border-bottom:2px solid #fa5a1e;font-weight:700}\n.trust{font-size:12.5px;color:#8a8579;margin:18px 0 0;line-height:1.7}\nfooter{max-width:720px;margin:0 auto;padding:18px clamp(18px,5vw,40px) 40px;border-top:1.5px solid rgba(12,12,12,.15);font-size:12.5px;color:#8a8579;line-height:1.8}\nfooter a{color:#2563ff;text-decoration:none;font-weight:700}\n.jh-btn{font-family:\"Noto Sans TC\",sans-serif;font-weight:700;font-size:15px;padding:14px 24px;border:1.5px solid #0c0c0c;border-radius:12px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .14s,background .14s;background:#fff;color:#0c0c0c}\n.jh-btn:hover{transform:translate(-2px,-2px)}\n.jh-btn.p{background:#2563ff;color:#fff;border-color:#2563ff}\n.jh-btn.p:hover{background:#1f56e0}\n.jh-btn.line{background:#06c755;color:#fff;border-color:#06c755}\n.jh-btn.line:hover{background:#05b34c}\n.qz-panel{background:#fff;border:1.5px solid #0c0c0c;border-radius:18px;box-shadow:8px 9px 0 #0c0c0c;padding:clamp(22px,3vw,40px)}\n.qz-step{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;color:#2563ff;margin-bottom:9px}\n.qz-bar{height:8px;background:rgba(12,12,12,.1);border-radius:99px;overflow:hidden;margin-bottom:22px}\n.qz-bar i{display:block;height:100%;background:#2563ff;transition:width .3s ease}\n.qz-q{font-weight:900;font-size:clamp(19px,2.2vw,24px);line-height:1.5;margin:0 0 18px;color:#0c0c0c}\n.qz-opt{display:block;width:100%;text-align:left;background:#f7f5ec;border:1.5px solid #0c0c0c;border-radius:12px;padding:14px 16px;font-family:\"Noto Sans TC\",sans-serif;font-size:15px;font-weight:600;color:#0c0c0c;cursor:pointer;margin-bottom:11px;box-shadow:2px 2px 0 #0c0c0c;transition:transform .1s,background .12s,box-shadow .1s}\n.qz-opt:hover{background:#e8efff}\n.qz-opt:active{transform:translate(2px,2px);box-shadow:0 0 0 #0c0c0c}\n.qz-rtag{display:inline-block;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:12px;letter-spacing:.14em;background:#0c0c0c;color:#f4f3ee;padding:4px 14px;border-radius:99px;margin-bottom:12px}\n.qz-rname{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(26px,3.4vw,40px);line-height:1;margin:0 0 16px;color:#0c0c0c}\n.qz-diag{font-size:15px;line-height:1.95;color:#2c2c28;background:#f7f5ec;border-left:4px solid #fa5a1e;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 20px}\n.qz-dh{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;color:#2563ff;margin:0 0 12px;text-transform:uppercase}\n.qz-dir{margin:0 0 22px;padding:0;list-style:none}\n.qz-dir li{font-size:14.5px;line-height:1.85;padding:10px 0 10px 40px;position:relative;border-bottom:1px dashed rgba(12,12,12,.12);color:#3a3a36}\n.qz-dir li::before{content:attr(data-n);position:absolute;left:0;top:9px;width:26px;height:26px;background:#2563ff;color:#fff;border-radius:50%;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center}\n.qz-bridge{font-size:14px;line-height:1.9;color:#1c3a7a;background:#e8efff;border-radius:10px;padding:13px 16px;margin:0 0 22px}\n.qz-em{border-top:1px dashed #d8d5cc;padding-top:20px}\n.qz-em .lb{font-weight:900;font-size:16.5px;color:#0c0c0c;margin:0 0 5px;line-height:1.5}\n.qz-em .sb{font-size:13.5px;color:#55524a;margin:0 0 14px;line-height:1.75}\n.qz-emrow{display:flex;gap:12px;flex-wrap:wrap}\n.qz-emin{flex:1;width:100%;min-width:min(200px,100%);font-family:\"Noto Sans TC\",sans-serif;font-size:15px;padding:14px 16px;border:1.5px solid #d8d5cc;border-radius:12px;background:#fff;color:#0c0c0c;box-sizing:border-box;transition:border-color .14s,box-shadow .14s}\n.qz-emin:focus{outline:none;border-color:#2563ff;box-shadow:0 0 0 3px rgba(37,99,255,.15)}\n.qz-emin::placeholder{color:#a8a49a}\n.qz-embtn{font-family:\"Noto Sans TC\",sans-serif;font-weight:700;font-size:15px;padding:14px 24px;border:1.5px solid #2563ff;background:#2563ff;color:#fff;border-radius:12px;cursor:pointer;white-space:nowrap;transition:transform .14s,background .14s}\n.qz-embtn:hover{transform:translate(-2px,-2px);background:#1f56e0}\n.qz-embtn:disabled{opacity:.6;cursor:default;transform:none}\n.qz-emmsg{font-size:14px;font-weight:700;margin:12px 0 0;line-height:1.6}\n.qz-emmsg.ok{color:#1f7a3d}.qz-emmsg.err{color:#c0392b}\n.qz-cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:22px}\n.qz-retry{background:none;border:none;color:#8a8579;font-size:13px;font-weight:600;cursor:pointer;font-family:\"Noto Sans TC\",sans-serif;text-decoration:underline;padding:6px 0}\n.qz-wxhint{font-size:13px;color:#3a3a36;margin:10px 0 0;line-height:1.7}\n@media(max-width:620px){.qz-emrow{flex-direction:column}.qz-embtn{width:100%}\n  .qz-cta{flex-direction:column;align-items:stretch;gap:10px}\n  .qz-cta .jh-btn{width:100%;justify-content:center;padding:15px 20px}\n  .qz-retry{width:100%;text-align:center}}\n/* 加碼關卡「節奏感三圍」——結果頁 email 表單之後、CTA 之前的區塊。\n   三支頁面（首頁／教練課頁／獨立測驗頁）共用這一份，改樣式只要改這裡。\n   結果卡刻意做成黑底＝跟白色測驗卡對比，讓人想截圖分享（這區的目的就是話題性）。 */\n.qb{border-top:1px dashed #d8d5cc;padding-top:20px;margin-top:22px}\n.qb-open{background:#f7f5ec;border:1.5px dashed #0c0c0c;border-radius:14px;padding:18px 20px;text-align:center}\n.qb-openbtn{font-family:\"Noto Sans TC\",sans-serif;font-weight:800;font-size:15.5px;padding:13px 22px;border:1.5px solid #0c0c0c;background:#fa5a1e;color:#fff;border-radius:12px;cursor:pointer;box-shadow:3px 3px 0 #0c0c0c;transition:transform .1s,box-shadow .1s}\n.qb-openbtn:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #0c0c0c}\n.qb-openbtn:active{transform:translate(3px,3px);box-shadow:0 0 0 #0c0c0c}\n.qb-hint{font-size:13px;color:#55524a;margin:10px 0 0;line-height:1.7}\n.qb-step{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;color:#fa5a1e;margin-bottom:9px}\n.qb-q{font-weight:900;font-size:clamp(17px,2vw,21px);line-height:1.55;margin:0 0 16px;color:#0c0c0c}\n.qb-opt{display:block;width:100%;text-align:left;background:#f7f5ec;border:1.5px solid #0c0c0c;border-radius:12px;padding:13px 15px;font-family:\"Noto Sans TC\",sans-serif;font-size:14.5px;font-weight:600;color:#0c0c0c;cursor:pointer;margin-bottom:10px;box-shadow:2px 2px 0 #0c0c0c;transition:transform .1s,background .12s,box-shadow .1s}\n.qb-opt:hover{background:#ffe9df}\n.qb-opt:active{transform:translate(2px,2px);box-shadow:0 0 0 #0c0c0c}\n/* ── 結果卡（可截圖分享的那張）── */\n.qb-card{background:#0c0c0c;border-radius:16px;padding:clamp(20px,3vw,28px);color:#f4f3ee}\n.qb-tag{display:inline-block;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:11px;letter-spacing:.16em;color:#fa5a1e;border:1px solid #fa5a1e;padding:3px 11px;border-radius:99px;margin-bottom:12px}\n.qb-title{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(22px,3vw,32px);line-height:1;margin:0 0 20px;color:#fff}\n.qb-rows{margin:0 0 18px;padding:0;list-style:none}\n.qb-row{display:grid;grid-template-columns:64px 1fr auto;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(244,243,238,.14)}\n.qb-row:last-child{border-bottom:none}\n.qb-ax{font-size:13px;font-weight:700;color:#a8a49a;letter-spacing:.04em}\n.qb-dots{display:flex;gap:6px}\n.qb-dot{width:11px;height:11px;border-radius:50%;background:rgba(244,243,238,.2)}\n.qb-dot.on{background:#2563ff}\n.qb-dot.top{background:#fa5a1e}\n.qb-lv{font-family:\"Archivo\",sans-serif;font-weight:800;font-size:clamp(15px,1.8vw,19px);letter-spacing:.06em;color:#fff;white-space:nowrap}\n.qb-verdict{font-size:14px;line-height:1.9;color:#e4e2da;background:rgba(37,99,255,.16);border-left:3px solid #2563ff;padding:13px 16px;border-radius:0 8px 8px 0;margin:0}\n.qb-note{font-size:12.5px;line-height:1.85;color:#55524a;background:#f7f5ec;border-radius:10px;padding:12px 15px;margin:14px 0 0}\n.qb-again{background:none;border:none;color:#8a8579;font-size:13px;font-weight:600;cursor:pointer;font-family:\"Noto Sans TC\",sans-serif;text-decoration:underline;padding:6px 0;margin-top:10px}\n@media(max-width:620px){\n  .qb-openbtn{width:100%}\n  .qb-row{grid-template-columns:56px 1fr;gap:8px 10px}\n  .qb-lv{grid-column:2;justify-self:start;font-size:16px}\n  .qb-dots{grid-column:2;grid-row:1}\n}\n";
var HTML="<div class=\"pg\">\n  <main class=\"wrap\">\n    <p class=\"mglab lab\">60-Second Quiz · 5 題</p>\n    <h1>60 秒，測出你的<em>鼓手型別</em></h1>\n    <p class=\"sub\">5 題選一選，<b>馬上看結果</b>——不留 email 也看得到。測完直接告訴你「你現在該練的三件事」。</p>\n    <div class=\"qz-panel\"><div id=\"jdacQuizBody\"></div></div>\n    <p class=\"trust\">出題的是 Jacob——JDAC 爵士鼓學校創辦人，批改超過 3,000 份學員作業之後，整理出這五種最常見的鼓手型別。</p>\n  </main>\n  <footer>JDAC 爵士鼓學校 · <a href=\"https://www.jacobdrumemory.com\" target=\"_blank\" rel=\"noopener\">jacobdrumemory.com</a><br>LINE 官方帳號 @jdactw · 微信 jdac_drums</footer>\n</div>\n<script type=\"application/json\" id=\"jdacQuizData\">\n{\n  \"qs\": [\n    {\"q\":\"你跟鼓的關係，現在是哪一種？\",\"opts\":[\n      [\"完全沒碰過，都在看別人打\",{\"A\":2}],\n      [\"自學一陣子了（YouTube／自己摸）\",{\"B\":2}],\n      [\"以前學過或玩過團，停了好幾年\",{\"D\":2}],\n      [\"一直有在打，想更上一層\",{\"C\":1,\"E\":1}]\n    ]},\n    {\"q\":\"如果只能達成一件事，你選哪個？\",\"opts\":[\n      [\"打出我心中那首歌\",{\"A\":1,\"B\":1}],\n      [\"上台表演一次（成發、婚禮、教會都算）\",{\"E\":2}],\n      [\"跟節拍器、跟歌都穩穩的，不再忽快忽慢\",{\"C\":2}],\n      [\"把以前的手感撿回來\",{\"D\":2}],\n      [\"往職業／教學的方向走\",{\"E\":2}]\n    ]},\n    {\"q\":\"現在最卡的是什麼？\",\"opts\":[\n      [\"不知道從哪裡開始，怕自己沒天分\",{\"A\":2}],\n      [\"練很久但感覺沒在進步，好像哪裡怪怪的\",{\"B\":2}],\n      [\"一個人打還行，一跟音樂就趕拍、越打越快\",{\"C\":2}],\n      [\"以前會的現在都生疏了，不知道從哪接回去\",{\"D\":2}],\n      [\"沒有一條有效率的路徑，時間有限\",{\"E\":1,\"B\":1}]\n    ]},\n    {\"q\":\"節拍器只響第 2、4 拍，你跟得住嗎？\",\"opts\":[\n      [\"沒試過，光想就頭暈\",{\"A\":1,\"B\":1}],\n      [\"試過，撐不到四小節就跑掉\",{\"C\":2}],\n      [\"可以，但要很專心，不能同時打複雜的東西\",{\"B\":1,\"C\":1}],\n      [\"穩，這是我熱身的一部分\",{\"E\":2}]\n    ]},\n    {\"q\":\"給你一段沒看過的鼓譜，你直接打得出來嗎？\",\"opts\":[\n      [\"我看不懂鼓譜\",{\"A\":1}],\n      [\"四分八分可以，十六分或切分就卡住\",{\"B\":1}],\n      [\"以前看得懂，現在都忘光了\",{\"D\":1}],\n      [\"大部分可以，三連音要想一下\",{\"C\":1}],\n      [\"可以，看到就打得出來\",{\"E\":1}]\n    ]}\n  ],\n  \"types\": {\n    \"A\":{\"tag\":\"TYPE A\",\"name\":\"空白鼓手\",\"diag\":\"你不是沒天分——你只是還沒開始。每一個你在影片裡看到的鼓手，都當過現在的你。零底子反而是優勢：沒有壞習慣要拆。\",\"dir\":[\"坐姿與握棒先弄對（第一週就能打出真的節奏，不是敲玩具）\",\"從四分音符到你的第一首歌——不用會看五線譜也能開始\",\"每天 15 分鐘就夠。重點是打「對」，不是打久\"],\"bridge\":\"教練課的 Pre-school 就是為你設計的：零底子入學，第一個月打出第一首歌。\"},\n    \"B\":{\"tag\":\"TYPE B\",\"name\":\"自學卡關鼓手\",\"diag\":\"YouTube 看了幾百支，會的節奏不少——但你自己知道，有些東西怪怪的，而且最近沒什麼進步。缺的不是努力，是系統。我這幾年批改超過 3,000 份作業，自學者卡關的原因九成出在同一個地方：基本功的隱形壞習慣。\",\"dir\":[\"基本功健檢：運棒、支點、力度——先找出那個「怪怪的」是什麼\",\"把會的東西打「熟」：同樣的節奏，用節拍器降速重建，不是一直收集新招\",\"照學習路徑補洞——你缺的可能只是中間那三塊拼圖\"],\"bridge\":\"教練課入學第一件事就是健檢定位。很多自學的同學補完地基之後，原本卡半年的東西兩週就過了。\"},\n    \"C\":{\"tag\":\"TYPE C\",\"name\":\"時間感浮動鼓手\",\"diag\":\"一個人打都好好的，一跟 click 或跟歌就趕拍——尤其反拍會越打越快，對吧？這不是手的問題，是時間感還沒內化。好消息：時間感是可以練的，而且有明確的方法。\",\"dir\":[\"節拍器不是敵人：gap click 訓練——響兩小節、靜兩小節，靜音時你撐住\",\"反拍專項：節拍器只響 2、4 拍還能穩住，backbeat 才算真的進到身體\",\"錄下自己：把「感覺怪」變成聽得出來的東西——自己的耳朵是最誠實的節拍器\"],\"bridge\":\"我們的練功房有一整區 time 訓練遊戲（gap click、反拍挑戰）；教練課每週交作業，我親自看你的影片、盯你的 time。\"},\n    \"D\":{\"tag\":\"TYPE D\",\"name\":\"回鍋鼓手\",\"diag\":\"以前學過、打過團，停了幾年，手感掉了、譜也忘了。先講好消息：肌肉記憶還在，回來比從零開始快很多。但別直接從「當年的進度」接——那是挫折感的來源。\",\"dir\":[\"兩週恢復菜單：運棒手感重建，讓手記起來\",\"程度健檢：從你「現在」的實際程度接回去，不是記憶中的程度\",\"挑一首當年就想打的歌當第一個目標——這次把它拿下\"],\"bridge\":\"教練課入學會先健檢定位。回鍋的同學通常一到兩個月就追回當年水準，然後突破它。\"},\n    \"E\":{\"tag\":\"TYPE E\",\"name\":\"目標衝刺鼓手\",\"diag\":\"你有明確的目標——上台、成發、甚至往職業走。你缺的不是熱情，是一條從目標回推的路徑，和一個盯你進度的人。這種學生我帶法不一樣：嚴格，但你每週都會知道為什麼練這個。\",\"dir\":[\"從目標日期回推的訓練計畫——幾月要上台，現在就知道每週該做什麼\",\"每週作業＋批改，進度不靠自律靠系統\",\"舞台層級的細節：速度穩定度、動態控制、fill 的取捨\"],\"bridge\":\"拚目標的學生，教練課是最短路徑——你負責練，路徑和進度我來顧。\"}\n  },\n  \"bonus\": {\n    \"cta\":\"🎮 加碼：3 題測你的「節奏感三圍」\",\n    \"hint\":\"三題各對應一款節奏遊戲的難度分級，30 秒測完。\",\n    \"tag\":\"BONUS ROUND\",\n    \"title\":\"你的節奏感三圍\",\n    \"qs\": [\n      {\"axis\":\"READING\",\"label\":\"視奏\",\"q\":\"看譜打點——哪一種音型會先讓你卡住？\",\"opts\":[\n        [\"我還看不懂鼓譜\",\"BASIC\"],\n        [\"十六分音符一多就亂\",\"SIXTEEN\"],\n        [\"切分一進來就抓不到拍\",\"SYNCO\"],\n        [\"三連音會讓我開始亂\",\"TRIPLET\"],\n        [\"都還好，混在一起我也讀得出來\",\"FUSION\"]\n      ]},\n      {\"axis\":\"TIME\",\"label\":\"穩定度\",\"q\":\"節拍器響兩小節、然後靜音兩小節——靜音那段，你回得到原本的拍點嗎？\",\"opts\":[\n        [\"從來沒這樣練過，聽起來就可怕\",\"CLASSIC\"],\n        [\"回得來，但明顯飄掉，而且幾乎都是越打越快\",\"HALF\"],\n        [\"差一點點，而且我自己聽得出來差在哪\",\"EIGHTH\"],\n        [\"穩，靜四小節我也回得來\",\"GHOST\"]\n      ]},\n      {\"axis\":\"OFFBEAT\",\"label\":\"反拍\",\"q\":\"反拍練習——節拍器不響正拍，你自己數 1234。你的極限在哪？\",\"opts\":[\n        [\"沒真的試過\",\"BACKBEAT\"],\n        [\"只響第 2、4 拍，我還撐得住\",\"UPBEAT\"],\n        [\"只響第 2 拍或第 4 拍，也還可以\",\"SPARSE\"],\n        [\"一小節只響一下，我也穩得住\",\"LONE\"],\n        [\"只響「4 的後半拍」，我還是回得去\",\"AND-4\"]\n      ]}\n    ],\n    \"advice\": {\n      \"READING\":\"三圍裡，看譜是你最先卡住的一塊。好消息：鼓譜是所有樂器裡最好讀的——不用管音高，只要管「什麼時候打、打哪裡」。先把十六分的四種組合讀到不用想，剩下的全是它的變形。\",\n      \"TIME\":\"三圍裡，穩定度是你最該補的一塊。這不是手的問題，是時間感還沒內化。練法很具體：節拍器調成只響第 1 拍，你撐得住幾小節不飄掉，那才是你真正的 time。\",\n      \"OFFBEAT\":\"三圍裡，反拍是你最弱的一環——這也是最多人卡的地方。反拍站得穩，backbeat 才算真的進到身體。從只響 2、4 拍開始，能撐八小節再往下一級。\"\n    },\n    \"top\":\"三項都在高段——你缺的大概不是節奏感，是一個把它用進音樂裡的方向。這種階段最怕的是自己亂練：你需要的是有人告訴你「下一個該練的是什麼」。\",\n    \"note\":\"這三組代號不是我編的——是 JDAC 學員練功房裡三款節奏遊戲的實際難度分級。真的打起來會發現：自己感覺的等級，跟機器量出來的常常差一級。\"\n  }\n}\n    </script>";

/* jdacQuizInit(root)：獨立頁傳 document、Wix custom element 傳 host——同一份邏輯兩處用。
   custom element 跑在頁面本體（非 iframe），所以 location.search 讀得到 /drummerquiz?src=xxx 的歸因參數。 */
function jdacQuizInit(root){
var sp=new URLSearchParams(location.search);
var sfx=(sp.get('src')||'').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,20);
var SRC='獨立測驗頁'+(sfx?'-'+sfx:'');
function qzEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
var panel=root.querySelector('#jdacQuizBody');
var dataEl=root.querySelector('#jdacQuizData');
var DATA;try{DATA=JSON.parse(dataEl.textContent);}catch(e){return;}
var QS=DATA.qs,TYPES=DATA.types;
var i,score,picks;
function reset(){i=0;score={A:0,B:0,C:0,D:0,E:0};picks=[];render();try{panel.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}}
function render(){
 if(i<QS.length){var Q=QS[i];
  var h='<div class="qz-step">DRUMMER TYPE QUIZ · 第 '+(i+1)+' / '+QS.length+' 題</div>'+'<div class="qz-bar"><i style="width:'+Math.round(i/QS.length*100)+'%"></i></div>'+'<p class="qz-q">'+qzEsc(Q.q)+'</p>';
  for(var o=0;o<Q.opts.length;o++){h+='<button type="button" class="qz-opt" data-oi="'+o+'">'+qzEsc(Q.opts[o][0])+'</button>';}
  panel.innerHTML=h;
  panel.querySelectorAll('.qz-opt').forEach(function(b){b.addEventListener('click',function(){var oi=Number(b.getAttribute('data-oi'));var pts=Q.opts[oi][1];Object.keys(pts).forEach(function(k){score[k]=(score[k]||0)+(pts[k]||0);});picks.push(oi);i++;render();});});
 }else{result();}
}
function result(){
 // 平手偏向高意向型別（E>D>C>B>A），與銷售頁內嵌版同一套邏輯。
 var PRIO=['E','D','C','B','A'],win=PRIO[0],best=-1;PRIO.forEach(function(k){if((score[k]||0)>best){best=score[k]||0;win=k;}});
 var T=TYPES[win];var dirs='';for(var d=0;d<T.dir.length;d++){dirs+='<li data-n="'+(d+1)+'">'+qzEsc(T.dir[d])+'</li>';}
 var em='<div class="qz-em"><p class="lb">把「'+qzEsc(T.name)+'」的 3 天客製練習菜單寄給你</p><p class="sb">留個 email，我把照你型別排好的 3 天菜單寄過去——每天一步，附我 YouTube 上對應的教學影片。看完覺得對味，再談加入。</p><form class="qz-emform" novalidate><div class="qz-emrow"><input class="qz-emin" type="email" name="email" required maxlength="120" placeholder="你的 Email" autocomplete="email" inputmode="email"><button type="submit" class="qz-embtn">寄給我 3 天菜單</button></div><p class="qz-emmsg" hidden></p></form></div>';
 panel.innerHTML='<span class="qz-rtag">'+qzEsc(T.tag)+' · 你的鼓手型別</span>'+'<p class="qz-rname">'+qzEsc(T.name)+'</p>'+'<div class="qz-diag">'+qzEsc(T.diag)+'</div>'+'<p class="qz-dh">你現在該練的三件事</p>'+'<ul class="qz-dir">'+dirs+'</ul>'+'<div class="qz-bridge">🥁 '+qzEsc(T.bridge)+'</div>'+em+
  '<div class="qz-cta"><a class="jh-btn p" href="https://www.jacobdrumemory.com/onlinecoaching" target="_blank" rel="noopener">看線上教練課 →</a><a class="jh-btn line" href="https://line.me/R/ti/p/@jdactw" target="_blank" rel="noopener">加 LINE 諮詢</a><button type="button" class="jh-btn" id="qzWechat">複製微信號</button><button type="button" class="qz-retry">↺ 重測一次</button></div><p class="qz-wxhint" id="qzWxHint" hidden></p>';
 panel.querySelector('.qz-retry').addEventListener('click',reset);
 var wb=panel.querySelector('#qzWechat');
 wb.addEventListener('click',function(){
  var id='jdac_drums';var hint=panel.querySelector('#qzWxHint');
  var done=function(ok){if(!hint)return;hint.hidden=false;hint.innerHTML=(ok?'✓ 微信號 <b>'+id+'</b> 已複製！':'微信號：<b>'+id+'</b>（請長按複製）')+'　打開微信 → 搜尋加好友';};
  var fb=function(){try{var ta=document.createElement('textarea');ta.value=id;ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.focus();ta.select();var ok=document.execCommand('copy');ta.remove();done(ok);}catch(e){done(false);}};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(id).then(function(){done(true);},function(){fb();});}else{fb();}}catch(e){fb();}
 });
 var f=panel.querySelector('.qz-emform');
 f.addEventListener('submit',function(e){e.preventDefault();var msg=f.querySelector('.qz-emmsg');var em2=(f.elements['email'].value||'').trim();var btn=f.querySelector('.qz-embtn');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em2)){msg.hidden=false;msg.className='qz-emmsg err';msg.textContent='Email 格式好像怪怪的，再確認一下～';return;}
  var old=btn.textContent;btn.disabled=true;btn.textContent='寄送中…';msg.hidden=true;
  fetch('https://www.jacobdrumemory.com/_functions/quizLead',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({email:em2,type:win,answers:'picks:'+picks.join(','),source:SRC})}).then(function(r){return r.json();}).then(function(j){if(j&&j.ok){f.reset();btn.style.display='none';msg.hidden=false;msg.className='qz-emmsg ok';msg.innerHTML=j.sent?'✓ 菜單第一天已經寄出！請收信（沒看到就找一下垃圾郵件夾）。接下來 3 天，每天會收到一步。':'✓ 已經幫你登記好了！菜單會盡快寄到你信箱（記得看一下垃圾郵件夾），接下來幾天每天一步。';}else{btn.disabled=false;btn.textContent=old;msg.hidden=false;msg.className='qz-emmsg err';msg.textContent='寄送失敗，請稍後再試一次～';}}).catch(function(){btn.disabled=false;btn.textContent=old;msg.hidden=false;msg.className='qz-emmsg err';msg.textContent='寄送失敗，請檢查網路後再試一次。';});
 });
 jdacQuizBonus(panel,DATA);
}
reset();
}
/* 加碼關卡「節奏感三圍」——測驗結果頁的第二段。
   三題各對應練功房一款遊戲，選項一對一映射該遊戲的實際難度代號（不加總、不用平手判定）。
   刻意放在 email 表單「之後」：主漏斗（型別→留 email）完全不受影響，這區純粹是話題性／分享素材。
   三支頁面共用這一份：獨立測驗頁靠 shared include 展開，兩支銷售頁由 build-jdac-salespage.py 讀檔併進去。
   自帶跳脫函式（不依賴 qzEsc——它在獨立測驗頁是包在 jdacQuizInit 裡的區域函式，這裡看不到）。 */
function jdacQuizBonus(panel, DATA) {
  var B = DATA && DATA.bonus;
  if (!B || !B.qs || !B.qs.length) return;            // 舊版題庫被快取住時安靜略過
  var anchor = panel.querySelector('.qz-cta');
  if (!anchor) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var wrap = document.createElement('div');
  wrap.className = 'qb';
  anchor.parentNode.insertBefore(wrap, anchor);

  var i, picks;

  function teaser() {
    wrap.innerHTML =
      '<div class="qb-open">' +
      '<button type="button" class="qb-openbtn">' + esc(B.cta) + '</button>' +
      '<p class="qb-hint">' + esc(B.hint) + '</p>' +
      '</div>';
    wrap.querySelector('.qb-openbtn').addEventListener('click', function () {
      i = 0; picks = []; step();
      try { wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
    });
  }

  function step() {
    if (i >= B.qs.length) { return card(); }
    var Q = B.qs[i];
    var h = '<div class="qb-step">' + esc(B.tag) + ' · 第 ' + (i + 1) + ' / ' + B.qs.length + ' 題</div>' +
            '<p class="qb-q">' + esc(Q.q) + '</p>';
    for (var o = 0; o < Q.opts.length; o++) {
      h += '<button type="button" class="qb-opt" data-oi="' + o + '">' + esc(Q.opts[o][0]) + '</button>';
    }
    wrap.innerHTML = h;
    wrap.querySelectorAll('.qb-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        picks.push(Number(b.getAttribute('data-oi')));
        i++; step();
      });
    });
  }

  function card() {
    // 每軸換算成 0~1 的相對位置，才能比較長度不同的量表（視奏/反拍 5 級、穩定度 4 級）
    var rows = B.qs.map(function (Q, n) {
      var oi = picks[n], last = Q.opts.length - 1;
      return { axis: Q.axis, label: Q.label, oi: oi, last: last,
               lv: Q.opts[oi][1], norm: last > 0 ? oi / last : 1 };
    });

    // 短評挑「最弱的一軸」；同分時 time 優先——時間感是地基，先講它最有用
    var PRIO = { TIME: 0, OFFBEAT: 1, READING: 2 };
    var weak = rows.slice().sort(function (a, b) {
      return a.norm - b.norm || (PRIO[a.axis] || 9) - (PRIO[b.axis] || 9);
    })[0];
    var allTop = rows.every(function (r) { return r.norm === 1; });
    var verdict = allTop ? B.top : ((B.advice || {})[weak.axis] || '');

    var lis = rows.map(function (r) {
      var dots = '';
      for (var d = 0; d <= r.last; d++) {
        dots += '<span class="qb-dot' + (d <= r.oi ? (r.oi === r.last ? ' on top' : ' on') : '') + '"></span>';
      }
      return '<li class="qb-row"><span class="qb-ax">' + esc(r.label) + '</span>' +
             '<span class="qb-dots">' + dots + '</span>' +
             '<span class="qb-lv">' + esc(r.lv) + '</span></li>';
    }).join('');

    wrap.innerHTML =
      '<div class="qb-card">' +
      '<span class="qb-tag">' + esc(B.tag) + '</span>' +
      '<p class="qb-title">' + esc(B.title) + '</p>' +
      '<ul class="qb-rows">' + lis + '</ul>' +
      (verdict ? '<p class="qb-verdict">' + esc(verdict) + '</p>' : '') +
      '</div>' +
      (B.note ? '<p class="qb-note">' + esc(B.note) + '</p>' : '') +
      '<button type="button" class="qb-again">↺ 重測加碼題</button>';
    wrap.querySelector('.qb-again').addEventListener('click', teaser);
  }

  teaser();
}


function build(host){
 if(host._jdacDone)return;host._jdacDone=true;
 if(!document.getElementById('jdac-qz-fonts')){var l=document.createElement('link');l.id='jdac-qz-fonts';l.rel='stylesheet';l.href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,800;1,800;1,900&family=Noto+Sans+TC:wght@400;500;700;900&display=swap";document.head.appendChild(l);}
 host.innerHTML='<style>'+CSS+'</style>'+HTML;
 jdacQuizInit(host);
}
function reg(t){if(!customElements.get(t)){try{customElements.define(t,class extends HTMLElement{connectedCallback(){build(this);}});}catch(e){}}}
reg("jdac-quizpage");reg('wix-default-custom-element');
})();
