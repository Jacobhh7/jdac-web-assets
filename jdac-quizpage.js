(function(){
if(window.customElements&&customElements.get("jdac-quizpage"))return;
var CSS="\n.pg{background:#f4f3ee;color:#0c0c0c;font-family:\"Noto Sans TC\",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}\n.pg *{box-sizing:border-box}\n.wrap{max-width:720px;margin:0 auto;padding:0 clamp(18px,5vw,40px) 56px}\n.mglab{font-family:\"Archivo\",sans-serif;font-weight:500;letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:#3a3a36}\n.lab{color:#2563ff;margin:26px 0 10px}\nh1{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(30px,7.2vw,44px);line-height:1.12;letter-spacing:-.015em;margin:0 0 12px}\nh1 em{font-style:italic;color:#2563ff}\n.sub{font-size:clamp(14.5px,1.5vw,16px);color:#3a3a36;line-height:1.85;margin:0 0 26px}\n.sub b{color:#0c0c0c;border-bottom:2px solid #fa5a1e;font-weight:700}\n.trust{font-size:12.5px;color:#8a8579;margin:18px 0 0;line-height:1.7}\nfooter{max-width:720px;margin:0 auto;padding:18px clamp(18px,5vw,40px) 40px;border-top:1.5px solid rgba(12,12,12,.15);font-size:12.5px;color:#8a8579;line-height:1.8}\nfooter a{color:#2563ff;text-decoration:none;font-weight:700}\n.jh-btn{font-family:\"Noto Sans TC\",sans-serif;font-weight:700;font-size:15px;padding:14px 24px;border:1.5px solid #0c0c0c;border-radius:12px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .14s,background .14s;background:#fff;color:#0c0c0c}\n.jh-btn:hover{transform:translate(-2px,-2px)}\n.jh-btn.p{background:#2563ff;color:#fff;border-color:#2563ff}\n.jh-btn.p:hover{background:#1f56e0}\n.jh-btn.line{background:#06c755;color:#fff;border-color:#06c755}\n.jh-btn.line:hover{background:#05b34c}\n.qz-panel{background:#fff;border:1.5px solid #0c0c0c;border-radius:18px;box-shadow:8px 9px 0 #0c0c0c;padding:clamp(22px,3vw,40px)}\n.qz-step{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;color:#2563ff;margin-bottom:9px}\n.qz-bar{height:8px;background:rgba(12,12,12,.1);border-radius:99px;overflow:hidden;margin-bottom:22px}\n.qz-bar i{display:block;height:100%;background:#2563ff;transition:width .3s ease}\n.qz-q{font-weight:900;font-size:clamp(19px,2.2vw,24px);line-height:1.5;margin:0 0 18px;color:#0c0c0c}\n.qz-opt{display:block;width:100%;text-align:left;background:#f7f5ec;border:1.5px solid #0c0c0c;border-radius:12px;padding:14px 16px;font-family:\"Noto Sans TC\",sans-serif;font-size:15px;font-weight:600;color:#0c0c0c;cursor:pointer;margin-bottom:11px;box-shadow:2px 2px 0 #0c0c0c;transition:transform .1s,background .12s,box-shadow .1s}\n.qz-opt:hover{background:#e8efff}\n.qz-opt:active{transform:translate(2px,2px);box-shadow:0 0 0 #0c0c0c}\n.qz-rtag{display:inline-block;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:12px;letter-spacing:.14em;background:#0c0c0c;color:#f4f3ee;padding:4px 14px;border-radius:99px;margin-bottom:12px}\n.qz-rname{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(26px,3.4vw,40px);line-height:1;margin:0 0 16px;color:#0c0c0c}\n.qz-diag{font-size:15px;line-height:1.95;color:#2c2c28;background:#f7f5ec;border-left:4px solid #fa5a1e;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 20px}\n.qz-dh{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;color:#2563ff;margin:0 0 12px;text-transform:uppercase}\n.qz-dir{margin:0 0 22px;padding:0;list-style:none}\n.qz-dir li{font-size:14.5px;line-height:1.85;padding:10px 0 10px 40px;position:relative;border-bottom:1px dashed rgba(12,12,12,.12);color:#3a3a36}\n.qz-dir li::before{content:attr(data-n);position:absolute;left:0;top:9px;width:26px;height:26px;background:#2563ff;color:#fff;border-radius:50%;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center}\n.qz-bridge{font-size:14px;line-height:1.9;color:#1c3a7a;background:#e8efff;border-radius:10px;padding:13px 16px;margin:0 0 22px}\n.qz-em{border-top:1px dashed #d8d5cc;padding-top:20px}\n.qz-em .lb{font-weight:900;font-size:16.5px;color:#0c0c0c;margin:0 0 5px;line-height:1.5}\n.qz-em .sb{font-size:13.5px;color:#55524a;margin:0 0 14px;line-height:1.75}\n.qz-emrow{display:flex;gap:12px;flex-wrap:wrap}\n.qz-emin{flex:1;width:100%;min-width:min(200px,100%);font-family:\"Noto Sans TC\",sans-serif;font-size:15px;padding:14px 16px;border:1.5px solid #d8d5cc;border-radius:12px;background:#fff;color:#0c0c0c;box-sizing:border-box;transition:border-color .14s,box-shadow .14s}\n.qz-emin:focus{outline:none;border-color:#2563ff;box-shadow:0 0 0 3px rgba(37,99,255,.15)}\n.qz-emin::placeholder{color:#a8a49a}\n.qz-embtn{font-family:\"Noto Sans TC\",sans-serif;font-weight:700;font-size:15px;padding:14px 24px;border:1.5px solid #2563ff;background:#2563ff;color:#fff;border-radius:12px;cursor:pointer;white-space:nowrap;transition:transform .14s,background .14s}\n.qz-embtn:hover{transform:translate(-2px,-2px);background:#1f56e0}\n.qz-embtn:disabled{opacity:.6;cursor:default;transform:none}\n.qz-emmsg{font-size:14px;font-weight:700;margin:12px 0 0;line-height:1.6}\n.qz-emmsg.ok{color:#1f7a3d}.qz-emmsg.err{color:#c0392b}\n.qz-cta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:22px}\n.qz-retry{background:none;border:none;color:#8a8579;font-size:13px;font-weight:600;cursor:pointer;font-family:\"Noto Sans TC\",sans-serif;text-decoration:underline;padding:6px 0}\n.qz-wxhint{font-size:13px;color:#3a3a36;margin:10px 0 0;line-height:1.7}\n@media(max-width:620px){.qz-emrow{flex-direction:column}.qz-embtn{width:100%}\n  .qz-cta{flex-direction:column;align-items:stretch;gap:10px}\n  .qz-cta .jh-btn{width:100%;justify-content:center;padding:15px 20px}\n  .qz-retry{width:100%;text-align:center}}\n/* 加碼關卡「節奏視奏 · 公開試玩版」樣式。\n   視覺沿用學員練功房的白卡硬陰影＋橘色打點鈕，色票換成行銷頁的電光藍/橘/米白。\n   三支頁面（首頁／教練課頁／獨立測驗頁）共用這一份，改樣式只要改這裡。\n   結果卡刻意做成黑底＝跟白色測驗卡對比，讓人想截圖分享。 */\n.qb{border-top:1px dashed #d8d5cc;padding-top:20px;margin-top:22px}\n\n/* ── 入口 ── */\n.qb-open{background:#f7f5ec;border:1.5px dashed #0c0c0c;border-radius:14px;padding:18px 20px;text-align:center}\n.qb-openbtn{font-family:\"Noto Sans TC\",sans-serif;font-weight:800;font-size:15.5px;padding:13px 22px;border:1.5px solid #0c0c0c;background:#fa5a1e;color:#fff;border-radius:12px;cursor:pointer;box-shadow:3px 3px 0 #0c0c0c;transition:transform .1s,box-shadow .1s}\n.qb-openbtn:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #0c0c0c}\n.qb-openbtn:active{transform:translate(3px,3px);box-shadow:0 0 0 #0c0c0c}\n.qb-hint{font-size:13px;color:#55524a;margin:10px 0 0;line-height:1.7}\n\n/* ── 遊戲畫面 ── */\n.qb-gtitle{font-weight:900;font-size:18px;color:#0c0c0c;margin:0 0 6px;line-height:1.4}\n.qb-gtitle span{font-family:\"Archivo\",sans-serif;font-weight:700;font-size:11.5px;letter-spacing:.08em;color:#2563ff;margin-left:8px}\n.qb-ghow{font-size:13.5px;color:#55524a;line-height:1.8;margin:0 0 16px}\n/* 譜面容器：VexFlow 會把 SVG 塞進來，載不到 CDN 時是手繪 SVG */\n.qb-staff{background:#fff;border:1.5px solid #0c0c0c;border-radius:14px;box-shadow:4px 5px 0 #0c0c0c;padding:10px 8px;min-height:120px;overflow-x:auto}\n.qb-staff svg{display:block;max-width:100%}\n.qb-acts{display:flex;justify-content:center;margin:16px 0 4px}\n.qb-start{font-family:\"Noto Sans TC\",sans-serif;font-weight:800;font-size:15px;padding:12px 26px;border:1.5px solid #2563ff;background:#2563ff;color:#fff;border-radius:12px;cursor:pointer;box-shadow:2px 2px 0 #0c0c0c}\n.qb-start:active{transform:translate(2px,2px);box-shadow:0 0 0 #0c0c0c}\n.qb-start:disabled{opacity:.55;cursor:default;transform:none;box-shadow:2px 2px 0 #0c0c0c}\n.qb-status{font-size:13px;color:#55524a;text-align:center;margin:6px 0 10px;min-height:20px;line-height:1.7}\n.qb-taprow{display:flex;align-items:center;justify-content:center;gap:16px;margin:14px 0 0;flex-wrap:wrap}\n/* touch-action:manipulation＝拿掉手機連點縮放的 300ms 延遲（節奏遊戲不能有那個） */\n.qb-tapbtn{width:180px;height:58px;font-size:16px;font-weight:800;font-family:\"Noto Sans TC\",sans-serif;background:#fa5a1e;color:#fff;border:0;border-radius:12px;cursor:pointer;box-shadow:3px 3px 0 #0c0c0c;touch-action:manipulation;-webkit-user-select:none;user-select:none}\n.qb-tapbtn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #0c0c0c}\n.qb-tiphint{font-size:12px;color:#8a8579;display:flex;align-items:center;gap:8px}\n.qb-pulse{width:12px;height:12px;border-radius:50%;background:rgba(12,12,12,.13);display:inline-block;transition:background .05s,transform .05s}\n.qb-pulse.lit{background:#2563ff;transform:scale(1.35)}\n\n/* ── 結果卡（可截圖分享的那張）── */\n.qb-card{background:#0c0c0c;border-radius:16px;padding:clamp(20px,3vw,28px);color:#f4f3ee;text-align:center}\n.qb-tag{display:inline-block;font-family:\"Archivo\",sans-serif;font-weight:800;font-size:11px;letter-spacing:.16em;color:#fa5a1e;border:1px solid #fa5a1e;padding:3px 11px;border-radius:99px;margin-bottom:14px}\n.qb-kicker{font-size:12.5px;color:#a8a49a;margin:0 0 2px;letter-spacing:.04em}\n.qb-ms{font-family:\"Archivo\",sans-serif;font-style:italic;font-weight:900;font-size:clamp(52px,9vw,78px);line-height:1;margin:0;color:#fff}\n.qb-ms em{font-style:normal;font-size:.34em;font-weight:800;letter-spacing:.04em;color:#2563ff;margin-left:8px;vertical-align:.55em}\n.qb-metrics{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:14px 0 0}\n.qb-metrics span{font-size:12.5px;color:#c9c6bd;background:rgba(244,243,238,.09);border-radius:99px;padding:6px 14px}\n.qb-metrics b{font-family:\"Archivo\",sans-serif;color:#fff;font-size:13.5px}\n.qb-metrics b.qb-g{color:#3fd39b}.qb-metrics b.qb-y{color:#f0a020}.qb-metrics b.qb-r{color:#ff6b58}\n.qb-tier{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-size:16.5px;font-weight:900;color:#fff;margin:18px 0 0}\n/* 標籤是「可挑戰 SYNCO」這種中英混排，字距要收一點、字型要帶中文 fallback */\n.qb-tierlv{font-family:\"Archivo\",\"Noto Sans TC\",sans-serif;font-weight:800;font-size:12px;letter-spacing:.07em;background:#2563ff;color:#fff;padding:4px 12px;border-radius:99px;white-space:nowrap}\n.qb-verdict{font-size:14px;line-height:1.9;color:#e4e2da;background:rgba(37,99,255,.16);border-left:3px solid #2563ff;padding:13px 16px;border-radius:0 8px 8px 0;margin:16px 0 0;text-align:left}\n.qb-cal{font-size:12px;line-height:1.8;color:#55524a;background:#eef3ff;border-radius:10px;padding:11px 14px;margin:12px 0 0}\n.qb-note{font-size:12.5px;line-height:1.85;color:#55524a;background:#f7f5ec;border-radius:10px;padding:12px 15px;margin:10px 0 0}\n.qb-again{background:none;border:none;color:#8a8579;font-size:13px;font-weight:600;cursor:pointer;font-family:\"Noto Sans TC\",sans-serif;text-decoration:underline;padding:6px 0;margin-top:10px}\n\n@media(max-width:620px){\n  .qb-openbtn,.qb-tapbtn{width:100%}\n  .qb-gtitle span{display:block;margin:4px 0 0}\n  .qb-taprow{gap:12px}\n}\n";
var HTML="<div class=\"pg\">\n  <main class=\"wrap\">\n    <p class=\"mglab lab\">60-Second Quiz · 5 題</p>\n    <h1>60 秒，測出你的<em>鼓手型別</em></h1>\n    <p class=\"sub\">5 題選一選，<b>馬上看結果</b>——不留 email 也看得到。測完直接告訴你「你現在該練的三件事」。</p>\n    <div class=\"qz-panel\"><div id=\"jdacQuizBody\"></div></div>\n    <p class=\"trust\">出題的是 Jacob——JDAC 爵士鼓學校創辦人，批改超過 3,000 份學員作業之後，整理出這五種最常見的鼓手型別。</p>\n  </main>\n  <footer>JDAC 爵士鼓學校 · <a href=\"https://www.jacobdrumemory.com\" target=\"_blank\" rel=\"noopener\">jacobdrumemory.com</a><br>LINE 官方帳號 @jdactw · 微信 jdac_drums</footer>\n</div>\n<script type=\"application/json\" id=\"jdacQuizData\">\n{\n  \"qs\": [\n    {\"q\":\"你跟鼓的關係，現在是哪一種？\",\"opts\":[\n      [\"完全沒碰過，都在看別人打\",{\"A\":2}],\n      [\"自學一陣子了（YouTube／自己摸）\",{\"B\":2}],\n      [\"以前學過或玩過團，停了好幾年\",{\"D\":2}],\n      [\"一直有在打，想更上一層\",{\"C\":1,\"E\":1}]\n    ]},\n    {\"q\":\"如果只能達成一件事，你選哪個？\",\"opts\":[\n      [\"打出我心中那首歌\",{\"A\":1,\"B\":1}],\n      [\"上台表演一次（成發、婚禮、教會都算）\",{\"E\":2}],\n      [\"跟節拍器、跟歌都穩穩的，不再忽快忽慢\",{\"C\":2}],\n      [\"把以前的手感撿回來\",{\"D\":2}],\n      [\"往職業／教學的方向走\",{\"E\":2}]\n    ]},\n    {\"q\":\"現在最卡的是什麼？\",\"opts\":[\n      [\"不知道從哪裡開始，怕自己沒天分\",{\"A\":2}],\n      [\"練很久但感覺沒在進步，好像哪裡怪怪的\",{\"B\":2}],\n      [\"一個人打還行，一跟音樂就趕拍、越打越快\",{\"C\":2}],\n      [\"以前會的現在都生疏了，不知道從哪接回去\",{\"D\":2}],\n      [\"沒有一條有效率的路徑，時間有限\",{\"E\":1,\"B\":1}]\n    ]},\n    {\"q\":\"節拍器只響第 2、4 拍，你跟得住嗎？\",\"opts\":[\n      [\"沒試過，光想就頭暈\",{\"A\":1,\"B\":1}],\n      [\"試過，撐不到四小節就跑掉\",{\"C\":2}],\n      [\"可以，但要很專心，不能同時打複雜的東西\",{\"B\":1,\"C\":1}],\n      [\"穩，這是我熱身的一部分\",{\"E\":2}]\n    ]},\n    {\"q\":\"給你一段沒看過的鼓譜，你直接打得出來嗎？\",\"opts\":[\n      [\"我看不懂鼓譜\",{\"A\":1}],\n      [\"四分八分可以，十六分或切分就卡住\",{\"B\":1}],\n      [\"以前看得懂，現在都忘光了\",{\"D\":1}],\n      [\"大部分可以，三連音要想一下\",{\"C\":1}],\n      [\"可以，看到就打得出來\",{\"E\":1}]\n    ]}\n  ],\n  \"types\": {\n    \"A\":{\"tag\":\"TYPE A\",\"name\":\"空白鼓手\",\"diag\":\"你不是沒天分——你只是還沒開始。每一個你在影片裡看到的鼓手，都當過現在的你。零底子反而是優勢：沒有壞習慣要拆。\",\"dir\":[\"坐姿與握棒先弄對（第一週就能打出真的節奏，不是敲玩具）\",\"從四分音符到你的第一首歌——不用會看五線譜也能開始\",\"每天 15 分鐘就夠。重點是打「對」，不是打久\"],\"bridge\":\"教練課的 Pre-school 就是為你設計的：零底子入學，第一個月打出第一首歌。\"},\n    \"B\":{\"tag\":\"TYPE B\",\"name\":\"自學卡關鼓手\",\"diag\":\"YouTube 看了幾百支，會的節奏不少——但你自己知道，有些東西怪怪的，而且最近沒什麼進步。缺的不是努力，是系統。我這幾年批改超過 3,000 份作業，自學者卡關的原因九成出在同一個地方：基本功的隱形壞習慣。\",\"dir\":[\"基本功健檢：運棒、支點、力度——先找出那個「怪怪的」是什麼\",\"把會的東西打「熟」：同樣的節奏，用節拍器降速重建，不是一直收集新招\",\"照學習路徑補洞——你缺的可能只是中間那三塊拼圖\"],\"bridge\":\"教練課入學第一件事就是健檢定位。很多自學的同學補完地基之後，原本卡半年的東西兩週就過了。\"},\n    \"C\":{\"tag\":\"TYPE C\",\"name\":\"時間感浮動鼓手\",\"diag\":\"一個人打都好好的，一跟 click 或跟歌就趕拍——尤其反拍會越打越快，對吧？這不是手的問題，是時間感還沒內化。好消息：時間感是可以練的，而且有明確的方法。\",\"dir\":[\"節拍器不是敵人：gap click 訓練——響兩小節、靜兩小節，靜音時你撐住\",\"反拍專項：節拍器只響 2、4 拍還能穩住，backbeat 才算真的進到身體\",\"錄下自己：把「感覺怪」變成聽得出來的東西——自己的耳朵是最誠實的節拍器\"],\"bridge\":\"我們的練功房有一整區 time 訓練遊戲（gap click、反拍挑戰）；教練課每週交作業，我親自看你的影片、盯你的 time。\"},\n    \"D\":{\"tag\":\"TYPE D\",\"name\":\"回鍋鼓手\",\"diag\":\"以前學過、打過團，停了幾年，手感掉了、譜也忘了。先講好消息：肌肉記憶還在，回來比從零開始快很多。但別直接從「當年的進度」接——那是挫折感的來源。\",\"dir\":[\"兩週恢復菜單：運棒手感重建，讓手記起來\",\"程度健檢：從你「現在」的實際程度接回去，不是記憶中的程度\",\"挑一首當年就想打的歌當第一個目標——這次把它拿下\"],\"bridge\":\"教練課入學會先健檢定位。回鍋的同學通常一到兩個月就追回當年水準，然後突破它。\"},\n    \"E\":{\"tag\":\"TYPE E\",\"name\":\"目標衝刺鼓手\",\"diag\":\"你有明確的目標——上台、成發、甚至往職業走。你缺的不是熱情，是一條從目標回推的路徑，和一個盯你進度的人。這種學生我帶法不一樣：嚴格，但你每週都會知道為什麼練這個。\",\"dir\":[\"從目標日期回推的訓練計畫——幾月要上台，現在就知道每週該做什麼\",\"每週作業＋批改，進度不靠自律靠系統\",\"舞台層級的細節：速度穩定度、動態控制、fill 的取捨\"],\"bridge\":\"拚目標的學生，教練課是最短路徑——你負責練，路徑和進度我來顧。\"}\n  },\n  \"bonus\": {\n    \"tag\":\"BONUS ROUND\",\n    \"cta\":\"🎼 加碼：玩一次「節奏視奏」\",\n    \"teaser\":\"看譜、跟著節拍器打出來。5 題，每題打完立刻告訴你哪一下準、哪一下歪。這是學員練功房裡真的那款遊戲，入門難度 BASIC。\",\n    \"how\":\"聽到「預備」的 4 拍先跟著打（順便量你裝置的延遲）→ 第 5 拍開始照譜打。打完譜上會出現綠／黃／紅點，就是你每一下的準度。\",\n    \"hint\":\"記得開聲音或戴耳機。預備 4 拍也要跟著打\",\n    \"note\":\"這是 JDAC 學員練功房「節奏視奏」的入門難度 BASIC，每關 50 題、共 5 關（BASIC 四分八分／SIXTEEN 十六分／SYNCO 切分／TRIPLET 三連音／FUSION 綜合），另有無盡挑戰把 50 小節連成一條不間斷。\",\n    \"qs\": [\n      [\"q\",\"q\",\"q\",\"q\"],\n      [\"q\",\"q\",\"q\",\"e2\"],\n      [\"q\",\"q\",\"qr\",\"e2\"],\n      [\"q\",\"er_e\",\"q\",\"q\"],\n      [\"e2\",\"qr\",\"e2\",\"q\"]\n    ]\n  }\n}\n    </script>";

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
/* 加碼關卡「節奏視奏 · 公開試玩版」——測驗結果頁的第二段，真的可以玩。
 *
 * 引擎搬自學員練功房的 _wireRhythmLab／_rlRenderVex／_rlRenderHand／_rlExpand
 * （jacobdrumemory-wix 的 dashboard element）。判定窗、防彈跳 60ms、節拍器音色、
 * 過關四條件（準度≥95%＋黃點≤1＋紅點 0＋亂打 0）、綠黃紅門檻（150／300ms）全部照搬，
 * 手感要跟學員版一致。改這裡前先去看那份原始碼。
 * 公開版拿掉：Level 分頁（固定 BASIC）、50 題題庫（只取 5 題）、無盡挑戰、XP／討論區解鎖、
 * 後端紀錄、過關打勾、BPM 滑桿（固定 90）。
 *
 * 🥁 記譜鐵則（Jacob 拍板，別改）：正拍單擊一律四分音符，不可「八分＋八分休止」；
 *    反拍切分用 er_e；音符畫小鼓位置 c/5；符桿一律朝上。
 * 🥁 VexFlow 符梁要「手動逐拍」——generateBeams 按 1/4 分組會分錯，別改回去。
 *
 * 🎯 校準藏在「預備拍」裡（學員版是明確的「打 8 下校準」＋滑桿，公開行銷頁不能叫人先暖身）：
 *    綠點門檻只有 150ms，藍牙延遲 100~150ms 會讓每個人都變黃紅、遊戲等於壞的。
 *    所以預備 4 拍也請他跟著打，那 4 下取中位數＝裝置延遲，正式那小節才計分。
 *    音樂上也自然（就是數 1234 進來）。校準值跨題沿用、每題有好資料就更新。
 *
 * 放在 email 表單「之後」：主漏斗（型別→留 email）完全不受影響。
 * 三頁共用這一份：獨立測驗頁靠 shared include 展開，兩支銷售頁由 build-jdac-salespage.py 讀檔併進去。
 */
var jdacRlAudio = null, jdacRlSilent = null, jdacRlVexPromise = null;

function jdacQuizBonus(panel, DATA) {
  var B = DATA && DATA.bonus;
  if (!B || !B.qs || !B.qs.length) return;
  var anchor = panel.querySelector('.qz-cta');
  if (!anchor) return;

  var BPM = 90, BEAT = 60000 / BPM, LEAD = 4, PASS = 95, DEBOUNCE = 60;
  var INK = '#0c0c0c';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var wrap = document.createElement('div');
  wrap.className = 'qb';
  anchor.parentNode.insertBefore(wrap, anchor);

  // ── 音符 token → 音符／拍點（照搬 _rlCells／_rlDur／_rlExpand）──
  var CELLS = {
    q: [['q', false]],
    qr: [['qr', true]],
    e2: [['8', false], ['8', false]],
    er_e: [['8r', true], ['8', false]]
  };
  var DUR = { q: 1, qr: 1, '8': 0.5, '8r': 0.5 };
  function expand(tokens) {
    var notes = [], onsets = [], beat = 0;
    (tokens || ['q', 'q', 'q', 'q']).forEach(function (tk) {
      (CELLS[tk] || CELLS.q).forEach(function (pair) {
        notes.push({ dur: pair[0], rest: pair[1] });
        if (!pair[1]) onsets.push(beat);
        beat += DUR[pair[0]];
      });
    });
    return { notes: notes, onsets: onsets };
  }

  // ── 狀態 ──
  var qi = 0, cur = null, hits = [], wild = 0, running = false, calibrating = false;
  var timers = [], startT = 0, lastTap = 0, offset = 0, calibTaps = [], keyHandler = null;
  var scores = [];

  function stopAll() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = []; running = false; calibrating = false;
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
  }
  // 測驗「重測一次」會重畫整個 panel → wrap 被移除，但排好的 setTimeout 還會繼續響
  function alive() { if (wrap.isConnected) return true; stopAll(); return false; }

  function unlock() {
    try {
      if (!jdacRlAudio) jdacRlAudio = new (window.AudioContext || window.webkitAudioContext)();
      if (jdacRlAudio.state === 'suspended' && jdacRlAudio.resume) jdacRlAudio.resume();
    } catch (e) { /* ignore */ }
    try {
      if (!jdacRlSilent) {
        var sr = 8000, n = 800, buf = new ArrayBuffer(44 + n * 2), dv = new DataView(buf);
        var wr = function (o, s) { for (var i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
        wr(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); wr(8, 'WAVE');
        wr(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
        dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
        wr(36, 'data'); dv.setUint32(40, n * 2, true);
        for (var i2 = 0; i2 < n; i2++) dv.setInt16(44 + i2 * 2, Math.round(Math.sin(i2 / sr * 2 * Math.PI * 40) * 2), true);
        var el = document.createElement('audio');
        el.setAttribute('playsinline', ''); el.setAttribute('webkit-playsinline', '');
        el.loop = true; el.preload = 'auto'; el.volume = 0.02;
        el.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
        jdacRlSilent = el;
      }
      var p = jdacRlSilent.play(); if (p && p.catch) p.catch(function () {});
    } catch (e) { /* ignore */ }
  }

  // 節拍器音色照搬學員版，換了手感就不一樣
  function playClick(accent) {
    try {
      if (!jdacRlAudio) jdacRlAudio = new (window.AudioContext || window.webkitAudioContext)();
      var ctx = jdacRlAudio;
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = accent ? 1300 : 900;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(accent ? 0.9 : 0.7, ctx.currentTime + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.09);
    } catch (e) { /* ignore */ }
  }

  // ── VexFlow：動態載入三個 CDN，載不到就退手繪（照搬 _rlEnsureVexflow）──
  function VF() { return window.Vex && window.Vex.Flow ? window.Vex.Flow : null; }
  function ensureVexflow() {
    if (VF()) return Promise.resolve(true);
    if (jdacRlVexPromise) return jdacRlVexPromise;
    var urls = [
      'https://cdnjs.cloudflare.com/ajax/libs/vexflow/3.0.9/vexflow-min.js',
      'https://cdn.jsdelivr.net/npm/vexflow@3.0.9/releases/vexflow-min.js',
      'https://unpkg.com/vexflow@3.0.9/releases/vexflow-min.js'
    ];
    jdacRlVexPromise = new Promise(function (resolve) {
      var idx = 0;
      var tryNext = function () {
        if (VF()) return resolve(true);
        if (idx >= urls.length) return resolve(false);
        var s = document.createElement('script');
        s.src = urls[idx++]; s.async = true;
        var to = setTimeout(function () { s.onload = s.onerror = null; s.remove(); tryNext(); }, 6000);
        s.onload = function () { clearTimeout(to); if (VF()) resolve(true); else tryNext(); };
        s.onerror = function () { clearTimeout(to); s.remove(); tryNext(); };
        document.head.appendChild(s);
      };
      tryNext();
    });
    return jdacRlVexPromise;
  }

  function marksOf() {
    var out = [];
    hits.forEach(function (v, i) {
      if (v === undefined) return;
      var a = Math.abs(v);
      out.push({ idx: i, q: a < 150 ? 'good' : a < 300 ? 'ok' : 'bad' });
    });
    return out;
  }

  // 正規譜（照搬 _rlRenderVex；符梁手動逐拍）
  function renderVex(host, V, src, marks) {
    host.innerHTML = '';
    var W = Math.max(320, Math.min(660, host.clientWidth || 600));
    var renderer = new V.Renderer(host, V.Renderer.Backends.SVG);
    renderer.resize(W, 120);
    var ctx = renderer.getContext();
    var stave = new V.Stave(4, 12, W - 12);
    stave.addClef('percussion').addTimeSignature('4/4');
    stave.setContext(ctx).draw();
    var notes = src.map(function (n) {
      return new V.StaveNote({ clef: 'percussion', keys: ['c/5'], duration: n.dur, stem_direction: 1 });
    });
    var voice = new V.Voice({ num_beats: 4, beat_value: 4 }).setStrict(false).addTickables(notes);
    var beams = [], bt = 0, gStart = 0;
    var flushBeat = function (from, to) {
      var idxs = [];
      for (var i = from; i < to; i++) { var n = src[i]; if (!n.rest && n.dur !== 'q') idxs.push(i); }
      if (idxs.length >= 2) {
        try { beams.push(new V.Beam(idxs.map(function (i) { return notes[i]; }))); } catch (e) { /* ignore */ }
      }
    };
    src.forEach(function (n, i) {
      if (i > gStart && Math.abs(bt - Math.round(bt)) < 1e-6) { flushBeat(gStart, i); gStart = i; }
      bt += DUR[n.dur];
    });
    flushBeat(gStart, src.length);
    new V.Formatter().joinVoices([voice]).format([voice], W - 70);
    voice.draw(ctx, stave);
    beams.forEach(function (b) { b.setContext(ctx).draw(); });
    var svg = host.querySelector('svg');
    if (svg && marks && marks.length) {
      var oi = -1;
      notes.forEach(function (sn, i) {
        if (src[i].rest) return;
        oi++;
        var m = null;
        for (var k = 0; k < marks.length; k++) if (marks[k].idx === oi) { m = marks[k]; break; }
        if (!m) return;
        var x = 0; try { x = sn.getAbsoluteX(); } catch (e) { x = 0; }
        if (!(x > 0)) return;
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', 8); c.setAttribute('r', 4.5);
        c.setAttribute('fill', m.q === 'good' ? '#1d9e75' : m.q === 'ok' ? '#f0a020' : '#c0392b');
        svg.appendChild(c);
      });
    }
  }

  // 手繪保底（照搬 _rlRenderHand）：CDN 被擋或 VexFlow 出錯時還是要看得到譜
  function renderHand(host, src, marks) {
    var NS = 'http://www.w3.org/2000/svg';
    host.innerHTML = '';
    var svg = document.createElementNS(NS, 'svg');
    var VW = 640, Y = 62, X0 = 60, X1 = 612, span = X1 - X0;
    svg.setAttribute('viewBox', '0 0 ' + VW + ' 120');
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '120');
    var bx = function (beat) { return X0 + (beat / 4) * span; };
    var mk = function (tag, attrs) {
      var e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      svg.appendChild(e); return e;
    };
    mk('line', { x1: X0 - 12, x2: X1 + 8, y1: Y, y2: Y, stroke: INK, 'stroke-width': 1.5 });
    var ts = mk('text', { x: X0 - 44, y: Y + 5, 'font-family': 'serif', 'font-size': 26, 'font-weight': 700, fill: INK }); ts.textContent = '4';
    var ts2 = mk('text', { x: X0 - 44, y: Y + 24, 'font-family': 'serif', 'font-size': 26, 'font-weight': 700, fill: INK }); ts2.textContent = '4';
    var beat = 0, group = [];
    var flushGroup = function () {
      if (!group.length) return;
      if (group.length === 1) {
        var g = group[0];
        if (g.dur === '8') mk('path', { d: 'M' + (g.x + 6.5) + ',' + (Y - 38) + ' q7,3 6,12', fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linecap': 'round' });
      } else {
        var x1 = group[0].x + 6.5, x2 = group[group.length - 1].x + 6.5;
        mk('rect', { x: x1, y: Y - 41, width: x2 - x1, height: 4.5, fill: INK });
      }
      group = [];
    };
    src.forEach(function (n) {
      var x = bx(beat);
      if (Math.abs(beat - Math.round(beat)) < 0.001) flushGroup();
      if (n.rest) {
        flushGroup();
        if (n.dur === 'qr') {
          mk('path', { d: 'M' + (x - 5) + ',' + (Y - 13) + ' L' + (x + 4) + ',' + (Y - 5) + ' L' + (x - 4) + ',' + (Y + 3) + ' L' + (x + 4) + ',' + (Y + 11) + ' L' + (x - 5) + ',' + (Y + 16), fill: 'none', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        } else {
          mk('circle', { cx: x, cy: Y - 4, r: 3.2, fill: INK });
          mk('path', { d: 'M' + (x + 2) + ',' + (Y - 6) + ' q6,8 -3,18', fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linecap': 'round' });
        }
      } else {
        mk('ellipse', { cx: x, cy: Y, rx: 6.8, ry: 5.3, fill: INK });
        mk('line', { x1: x + 6.5, x2: x + 6.5, y1: Y, y2: Y - 40, stroke: INK, 'stroke-width': 1.8 });
        if (n.dur === '8') group.push({ x: x, dur: n.dur }); else flushGroup();
      }
      beat += DUR[n.dur];
    });
    flushGroup();
    mk('line', { x1: X1 + 8, x2: X1 + 8, y1: Y - 22, y2: Y + 22, stroke: INK, 'stroke-width': 2 });
    if (marks && marks.length) {
      var bt2 = 0, oi = -1;
      src.forEach(function (n) {
        if (!n.rest) {
          oi++;
          for (var k = 0; k < marks.length; k++) {
            if (marks[k].idx === oi) {
              mk('circle', { cx: bx(bt2), cy: 10, r: 4.5, fill: marks[k].q === 'good' ? '#1d9e75' : marks[k].q === 'ok' ? '#f0a020' : '#c0392b' });
              break;
            }
          }
        }
        bt2 += DUR[n.dur];
      });
    }
    host.appendChild(svg);
  }

  function renderStaff(marks) {
    var host = wrap.querySelector('#qbStaff');
    if (!host || !cur) return;
    var V = VF();
    try {
      if (V) renderVex(host, V, cur.notes, marks); else renderHand(host, cur.notes, marks);
    } catch (e) {
      try { renderHand(host, cur.notes, marks); } catch (e2) { /* ignore */ }
    }
  }

  // ── 打點（照搬 registerTap 的一般模式）──
  function tap() {
    var now = performance.now();
    if (calibrating) {
      if (now - lastTap < DEBOUNCE) return;
      lastTap = now; calibTaps.push(now);
      flashPulse(); return;
    }
    if (!running) return;
    if (now - lastTap < DEBOUNCE) return;
    lastTap = now;
    flashPulse();
    var onsets = cur.onsets, bestIdx = -1, bestDelta = Infinity;
    for (var i = 0; i < onsets.length; i++) {
      if (hits[i] !== undefined) continue;
      var exp = startT + (LEAD + onsets[i]) * BEAT + offset;
      var d = now - exp;
      if (Math.abs(d) < Math.abs(bestDelta)) { bestDelta = d; bestIdx = i; }
    }
    // 容忍窗＝半拍；搆不到任何拍點的多餘打點記「亂打」（前導拍不罰）
    if (bestIdx === -1 || Math.abs(bestDelta) > BEAT * 0.5) {
      if (now - startT > LEAD * BEAT) wild++;
      return;
    }
    hits[bestIdx] = bestDelta;
    renderStaff(marksOf());
  }

  function flashPulse() {
    var p = wrap.querySelector('#qbPulse');
    if (p) { p.classList.add('lit'); setTimeout(function () { p.classList.remove('lit'); }, 90); }
  }
  function setStatus(t) { var e = wrap.querySelector('#qbStatus'); if (e) e.textContent = t; }

  function run() {
    stopAll(); unlock();
    hits = []; wild = 0; calibTaps = []; calibrating = true; running = false;
    renderStaff([]);
    startT = performance.now();
    var btn = wrap.querySelector('#qbStart');
    if (btn) { btn.disabled = true; btn.textContent = '進行中…'; }
    var clicks = LEAD + 4;
    for (var c = 0; c < clicks; c++) {
      (function (c2) {
        timers.push(setTimeout(function () {
          if (!alive()) return;
          playClick(c2 % 4 === 0);
          if (c2 < LEAD) setStatus('預備 ' + (c2 + 1) + '——跟著打（這 4 下用來校準你的裝置延遲）');
          else if (c2 === LEAD) setStatus('🥁 照譜打！');
        }, c2 * BEAT));
      })(c);
    }
    // 前導拍結束：用那 4 下算出裝置延遲，正式小節才開始計分
    timers.push(setTimeout(function () {
      if (!alive()) return;
      calibrating = false; running = true;
      var deltas = calibTaps.map(function (tp) {
        var k = Math.round((tp - startT) / BEAT);
        return tp - (startT + k * BEAT);
      }).filter(function (d) { return Math.abs(d) < BEAT * 0.5; });
      if (deltas.length >= 3) {
        deltas.sort(function (a, b) { return a - b; });
        offset = Math.max(-50, Math.min(300, Math.round(deltas[Math.floor(deltas.length / 2)])));
      }
    }, LEAD * BEAT - 60));
    timers.push(setTimeout(function () {
      if (!alive()) return;
      running = false;
      score();
    }, clicks * BEAT + 250));
  }

  function score() {
    var recorded = hits.filter(function (h) { return h !== undefined; });
    var total = cur.onsets.length;
    var acc = total ? Math.round(recorded.length / total * 100) : 0;
    var mk = marksOf();
    var okN = mk.filter(function (m) { return m.q === 'ok'; }).length;
    var badN = mk.filter(function (m) { return m.q === 'bad'; }).length;
    // 過關四條件照搬學員版：準度≥95%＋黃點≤1＋紅點 0＋亂打 0
    var passed = !!(total && acc >= PASS && okN <= 1 && badN === 0 && wild === 0);
    scores.push({ acc: acc, passed: passed, good: mk.filter(function (m) { return m.q === 'good'; }).length, ok: okN, bad: badN, wild: wild });
    renderStaff(mk);
    var why = !recorded.length ? '這題沒打到'
      : wild > 0 ? '多打了 ' + wild + ' 下沒有的拍點'
      : badN > 0 ? badN + ' 個紅點（偏差太大）'
      : okN > 1 ? okN + ' 個黃點（最多能有 1 個）'
      : '準度 ' + acc + '%（要 ' + PASS + '%）';
    setStatus(passed ? '✓ 過了（' + acc + '%・' + (okN ? '1 個黃點' : '全綠') + '）' : '沒過：' + why);
    var btn = wrap.querySelector('#qbStart');
    if (btn) {
      btn.disabled = false;
      btn.textContent = (qi + 1 >= B.qs.length) ? '看結果 →' : '下一題 →';
      btn.setAttribute('data-next', '1');
    }
  }

  // ── 畫面 ──
  function board() {
    stopAll();
    cur = expand(B.qs[qi]);
    hits = []; wild = 0;
    wrap.innerHTML =
      '<div class="qb-game">' +
      '<p class="qb-gtitle">🎼 節奏視奏 <span>BASIC・第 ' + (qi + 1) + ' / ' + B.qs.length + ' 題・' + BPM + ' bpm</span></p>' +
      '<p class="qb-ghow">' + esc(B.how) + '</p>' +
      '<div class="qb-staff" id="qbStaff"></div>' +
      '<div class="qb-acts"><button type="button" class="qb-start" id="qbStart">▶ 開始</button></div>' +
      '<p class="qb-status" id="qbStatus">' + esc(B.hint) + '</p>' +
      '<div class="qb-taprow">' +
      '<button type="button" class="qb-tapbtn" id="qbTap">按這裡打點</button>' +
      '<span class="qb-tiphint">或按 <b>空白鍵</b><span class="qb-pulse" id="qbPulse"></span></span>' +
      '</div>' +
      '</div>';
    renderStaff([]);
    ensureVexflow().then(function (ok) { if (alive() && ok && cur) renderStaff(marksOf()); });
    wrap.querySelector('#qbStart').addEventListener('click', function (e) {
      unlock();
      if (e.currentTarget.getAttribute('data-next')) {
        qi++;
        if (qi >= B.qs.length) return summary();
        return board();
      }
      run();
    });
    wrap.querySelector('#qbTap').addEventListener('click', function () { unlock(); tap(); });
    keyHandler = function (ev) {
      if (!wrap.isConnected) { stopAll(); return; }
      if (ev.code === 'Space') { ev.preventDefault(); unlock(); tap(); }
    };
    document.addEventListener('keydown', keyHandler);
    try { wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
  }

  function summary() {
    stopAll();
    var n = scores.length;
    var passN = scores.filter(function (s) { return s.passed; }).length;
    var avg = n ? Math.round(scores.reduce(function (a, s) { return a + s.acc; }, 0) / n) : 0;
    var g = scores.reduce(function (a, s) { return a + s.good; }, 0);
    var y = scores.reduce(function (a, s) { return a + s.ok; }, 0);
    var rd = scores.reduce(function (a, s) { return a + s.bad; }, 0);
    // 代號要寫成「可挑戰 XXX」——那幾個字在練功房是難度名稱不是成績，單掛會被誤讀
    var tier = passN >= 5 ? { tag: '可挑戰 SYNCO', name: '讀譜很穩 🏆', note: 'BASIC 對你太簡單了。真正會卡的是切分跟三連音——那才是視奏開始有趣的地方。' }
      : passN >= 3 ? { tag: '可挑戰 SIXTEEN', name: '底子在 👍', note: '四分八分讀得動，下一關是十六分一多就亂的那種。' }
      : passN >= 1 ? { tag: '先練穩 BASIC', name: '看得懂，但手還沒跟上', note: '譜你讀得出來，卡的是「讀到」跟「打出來」之間那段。這是練得起來的，而且很快。' }
      : { tag: '先練穩 BASIC', name: '先從讀譜開始', note: '很正常。鼓譜是所有樂器裡最好讀的——不用管音高，只要管什麼時候打。從全四分音符開始就好。' };

    wrap.innerHTML =
      '<div class="qb-card">' +
      '<span class="qb-tag">' + esc(B.tag) + '</span>' +
      '<p class="qb-kicker">你在 BASIC 通過的題數</p>' +
      '<p class="qb-ms">' + passN + '<em>/ ' + n + '</em></p>' +
      '<div class="qb-metrics">' +
      '<span><b>' + avg + '%</b> 平均準度</span>' +
      '<span><b class="qb-g">' + g + '</b>綠 <b class="qb-y">' + y + '</b>黃 <b class="qb-r">' + rd + '</b>紅</span>' +
      '</div>' +
      '<p class="qb-tier"><span class="qb-tierlv">' + esc(tier.tag) + '</span>' + esc(tier.name) + '</p>' +
      '<p class="qb-verdict">' + esc(tier.note) + '</p>' +
      '</div>' +
      '<p class="qb-cal">🎯 每題的「預備 4 拍」都拿去量了你的裝置延遲並自動補償（藍牙耳機通常 100ms 以上）——所以綠黃紅是你自己的，不是你耳機的。</p>' +
      (B.note ? '<p class="qb-note">' + esc(B.note) + '</p>' : '') +
      '<button type="button" class="qb-again">↺ 再玩一次</button>';
    wrap.querySelector('.qb-again').addEventListener('click', function () {
      qi = 0; scores = []; board();
    });
  }

  function teaser() {
    stopAll();
    wrap.innerHTML =
      '<div class="qb-open">' +
      '<button type="button" class="qb-openbtn">' + esc(B.cta) + '</button>' +
      '<p class="qb-hint">' + esc(B.teaser) + '</p>' +
      '</div>';
    wrap.querySelector('.qb-openbtn').addEventListener('click', function () { qi = 0; scores = []; board(); });
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
