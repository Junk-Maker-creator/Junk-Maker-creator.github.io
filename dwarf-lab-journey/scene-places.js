/* A pixel-art street: each stop is a place with an opening doorway. */
(() => {
  const css = document.createElement('style');
  css.textContent = `
    .place{position:absolute;bottom:53px;width:124px;height:132px;transform:translateX(-50%);pointer-events:none;z-index:1;image-rendering:pixelated;opacity:.86}
    .place .building{position:absolute;left:7px;right:7px;bottom:0;height:92px;background:#f3e1c4;border:5px solid #9f6956;box-shadow:inset 0 0 0 4px #e0bfa1,5px 5px 0 #aa806722}
    .place .roof{position:absolute;left:0;bottom:90px;width:124px;height:29px;background:#924e3f;clip-path:polygon(0 75%,12% 75%,19% 55%,29% 55%,29% 35%,40% 35%,40% 15%,60% 15%,60% 35%,71% 35%,71% 55%,81% 55%,88% 75%,100% 75%,100% 100%,0 100%)}
    .place .roof:after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:#c78b6b}
    .place .door{position:absolute;bottom:0;left:46px;width:32px;height:51px;border:4px solid #824a3d;background:#b9775c;box-shadow:inset 4px 0 #dfa98b,inset -3px 0 #75473b;transition:background .25s,box-shadow .25s}
    .place .door:after{content:'';position:absolute;right:4px;top:23px;width:3px;height:3px;background:#f5d387}
    .place.active .door{background:#5e3b36;box-shadow:inset 7px 0 #7d5147,inset -2px 0 #c69772}
    .place .window{position:absolute;bottom:38px;width:19px;height:25px;border:3px solid #a2715b;background:linear-gradient(90deg,transparent 43%,#b98a6e 43% 57%,transparent 57%),linear-gradient(transparent 43%,#b98a6e 43% 57%,transparent 57%),#f9ebce}
    .place .window.left{left:19px}.place .window.right{right:19px}
    .place .plaque{position:absolute;bottom:74px;left:50%;transform:translateX(-50%);background:#faf0da;border:2px solid #ad765c;padding:2px 4px;color:#8d4a3d;white-space:nowrap;font:10px/1.1 'Songti SC',SimSun,serif;letter-spacing:.1em}
    .place .ornament{position:absolute;bottom:107px;left:57px;width:10px;height:10px;background:#c58b67;box-shadow:0 -5px #b86b55}
    .place.lab .building{background:#eedfc9;border-color:#816b65}.place.lab .roof{background:#89504a;clip-path:polygon(0 70%,16% 70%,24% 40%,40% 40%,40% 10%,60% 10%,60% 40%,76% 40%,84% 70%,100% 70%,100% 100%,0 100%)}.place.lab .window{background-color:#e4d8c6}
    .place.lab .ornament{left:89px;height:23px;width:8px;bottom:102px;background:#907165;box-shadow:0 -5px #d8c4ad}
    .place.assembly .building{background:#efd4b6}.place.assembly .roof{background:#a45641}.place.assembly .window{background-color:#f2d29e}
    .place.assembly .building:after{content:'✦';position:absolute;left:6px;top:2px;color:#bd8f65;font-size:11px}
    .place.workshop .building{background:#e8d1b8;border-color:#795348}.place.workshop .roof{background:#805047;clip-path:polygon(0 60%,18% 60%,18% 35%,82% 35%,82% 60%,100% 60%,100% 100%,0 100%)}.place.workshop .door{width:38px;left:43px}
    .place.workshop .ornament{left:87px;bottom:105px;height:24px;background:#785549;box-shadow:0 -5px #bc9980}
    .place.team .building{background:#f3e7ce}.place.team .roof{background:#9b5c54}.place.team .window{background-color:#f5e2c6;border-radius:40% 40% 0 0}
    .place.team .building:before,.place.team .building:after{content:'';position:absolute;top:20px;width:7px;height:18px;background:#b75a49;box-shadow:0 3px #e8bf83}.place.team .building:before{left:-11px}.place.team .building:after{right:-11px}
    .place.archive .building{background:#f1ddbf}.place.archive .roof{background:#75483f}.place.archive .window{background-color:#e8d4ad}
    .place.archive .ornament{left:46px;bottom:103px;width:32px;height:19px;background:#ebd2b2;border:4px solid #89564a;box-shadow:0 -6px #89564a}
    /* Open-air vignettes make this a journey through different places, not a row of houses. */
    .place.open .building,.place.open .roof,.place.open .ornament,.place.open .window,.place.open .door{display:none}
    .place.open .plaque{bottom:100px;background:#fff4df}
    .place .set{position:absolute;inset:0}
    .set .table{position:absolute;left:10px;bottom:22px;width:100px;height:10px;background:#986552;border:3px solid #774b3f;box-shadow:0 7px #d3af8e}
    .set .table:after{content:'';position:absolute;left:8px;top:8px;width:7px;height:24px;background:#865445;box-shadow:65px 0 #865445}
    .set .box{position:absolute;left:19px;bottom:36px;width:22px;height:19px;background:#d5ae87;border:3px solid #9e715c;box-shadow:inset 4px 4px #efdab9}
    .set .tool{position:absolute;left:50px;bottom:38px;width:26px;height:7px;background:#a76a54;box-shadow:8px -8px #c79670}
    .set .spark{position:absolute;left:72px;bottom:51px;width:4px;height:4px;background:#d8a75e;box-shadow:0 -4px #d8a75e,0 4px #d8a75e,-4px 0 #d8a75e,4px 0 #d8a75e}
    .place.active .set .spark{animation:window-light 1s steps(2) infinite}
    .set .screen{position:absolute;left:14px;bottom:38px;width:28px;height:22px;border:4px solid #8d6c60;background:#e6d6ba;box-shadow:0 6px #b88c71}
    .set .screen:after{content:'✦';position:absolute;inset:0;color:#a57b6d;text-align:center;font-size:12px}
    .set .beaker{position:absolute;left:63px;bottom:37px;width:14px;height:21px;border:3px solid #a77766;background:linear-gradient(to top,#d9ad89 45%,#f8edda 45%);border-radius:0 0 4px 4px}
    .set .star{position:absolute;left:18px;bottom:77px;width:5px;height:5px;background:#dfb663;box-shadow:0 -5px #dfb663,0 5px #dfb663,-5px 0 #dfb663,5px 0 #dfb663,47px -8px #eacb8d}
    .set .scope{position:absolute;left:47px;bottom:39px;width:37px;height:17px;background:#8e6657;border:4px solid #6d4e44;transform:rotate(-23deg);box-shadow:inset 7px 0 #d6bca4}
    .set .tripod{position:absolute;left:63px;bottom:19px;width:5px;height:29px;background:#8b6452;box-shadow:-8px 13px #8b6452,8px 13px #8b6452}
    .set .belt{position:absolute;left:8px;bottom:26px;width:105px;height:14px;border:4px solid #785548;background:repeating-linear-gradient(90deg,#d3ab85 0 9px,#9b6b58 9px 13px)}
    .place.active .set .belt{animation:conveyor 1s steps(4) infinite}@keyframes conveyor{to{background-position:13px 0}}
    .set .parcel{position:absolute;left:24px;bottom:42px;width:22px;height:18px;background:#c68769;border:3px solid #986653;box-shadow:30px 0 #d6b496}
    .set .cart{position:absolute;right:5px;bottom:10px;width:26px;height:19px;background:#e7cda9;border:3px solid #8b6452;box-shadow:0 5px #9d765d}
    .set .cart:after{content:'';position:absolute;bottom:-8px;left:2px;width:6px;height:6px;background:#6e4c40;box-shadow:13px 0 #6e4c40}
    .set .books{position:absolute;left:21px;bottom:35px;width:12px;height:24px;background:#b66c55;border:2px solid #8d5d4b;box-shadow:12px 0 #d9b980,24px 0 #a1836f,36px 0 #d9b980}
    .set .paper{position:absolute;left:71px;bottom:36px;width:18px;height:13px;background:#f8eedc;border:2px solid #b38a70;transform:rotate(-8deg)}
    .place.team .building{display:none}.place.team .window,.place.team .door{display:none}.place.team .roof{bottom:83px}
    .place.team .roof:before{content:'';position:absolute;left:23px;bottom:-58px;width:5px;height:64px;background:#8e5d4d;box-shadow:69px 0 #8e5d4d}
    .place.team .set:before,.place.team .set:after{content:'';position:absolute;bottom:15px;width:6px;height:68px;background:#9c6b56}.place.team .set:before{left:20px}.place.team .set:after{right:20px}
    .place.team .plaque{bottom:89px}
    .npc{position:absolute;right:15px;bottom:8px;width:18px;height:25px;background:#a6604b;border:3px solid #654a3f;box-shadow:0 6px #6d5547;z-index:2}
    .npc:before{content:'';position:absolute;left:0;top:-13px;width:13px;height:12px;background:#e6b78d;border-top:5px solid #604b40}
    .npc:after{content:'';position:absolute;left:-6px;top:5px;width:6px;height:5px;background:#d49e7c}
    .place.active .npc{animation:npc-wave .8s steps(2) infinite;transform-origin:bottom}
    @keyframes npc-wave{50%{transform:rotate(-7deg)}}
    .speech{position:absolute;right:-5px;bottom:64px;padding:2px 4px;background:#fff5df;border:2px solid #bd8b6e;color:#8d4a3d;white-space:nowrap;font:10px 'Songti SC',SimSun,serif;opacity:0}
    .place.active .speech{opacity:1;animation:speech-pop 1.5s steps(3) infinite}@keyframes speech-pop{50%{transform:translateY(-3px)}}
    .event-art{position:absolute;left:0;bottom:5px;width:124px;height:106px;overflow:visible;shape-rendering:crispEdges}
    .event-art .motion{transform-box:fill-box;transform-origin:center;animation-play-state:paused}
    .place.active .event-art .spin{animation:artifact-spin 2s steps(8) infinite}
    .place.active .event-art .rock{animation:artifact-rock 1.2s steps(3) infinite}
    .place.active .event-art .pulse{animation:artifact-pulse 1.2s steps(2) infinite}
    .place.active .event-art .slide{animation:artifact-slide 1.8s steps(4) infinite}
    .place.active .event-art .write{animation:artifact-write 1.4s steps(4) infinite}
    @keyframes artifact-spin{to{transform:rotate(360deg)}}@keyframes artifact-rock{50%{transform:rotate(-9deg)}}
    @keyframes artifact-pulse{50%{opacity:.38}}@keyframes artifact-slide{50%{transform:translateX(18px)}}
    @keyframes artifact-write{50%{transform:translate(5px,-4px)}}
    .paused .event-art .motion{animation-play-state:paused!important}
    .place.story-event .plaque{bottom:105px}.place.story-event .set .event-art{z-index:1}
    /* Leave the instrument alongside the traveler rather than hiding it behind the sprite. */
    .place.stage-6 .event-art{left:-29px;width:150px;height:128px}
    .paused .npc,.paused .speech,.paused .set *{animation-play-state:paused}
    .place.active .window{animation:window-light 2s steps(2) infinite}
    .place.lab.active .ornament:after,.place.workshop.active .ornament:after{content:'';position:absolute;left:2px;top:-13px;width:5px;height:5px;background:#f5e9d9;box-shadow:5px -6px #f5e9d9;animation:chimney-smoke 1.8s steps(3) infinite}
    .place.team.active .building:before,.place.team.active .building:after{animation:lantern-glow 1.4s steps(2) infinite}
    @keyframes window-light{50%{filter:brightness(1.15)}}@keyframes chimney-smoke{to{transform:translate(4px,-9px);opacity:0}}@keyframes lantern-glow{50%{filter:brightness(1.22)}}
    .paused .place *{animation-play-state:paused}
    .vignette{bottom:161px;z-index:2;transform:translateX(-50%) scale(.76);transform-origin:bottom center}
    .traveler.enter-exit svg{animation:doorway 2.3s linear both}.paused .traveler.enter-exit svg,.paused .traveler.door-arrival svg{animation-play-state:paused}
    .traveler.door-arrival svg{animation:arrive-door .9s steps(4) both}
    @keyframes doorway{0%{opacity:1}9%{opacity:.18}20%{opacity:1}79%{opacity:1}91%{opacity:.18}100%{opacity:.15}}
    @keyframes arrive-door{0%{opacity:.15;transform:scale(.78)}45%{opacity:.35;transform:scale(.86)}100%{opacity:1;transform:scale(1)}}
    .place-caption{position:absolute;bottom:215px;transform:translateX(-50%);padding:3px 6px;background:#fff2dc;border:2px solid #ba8568;color:#874d3d;z-index:5;font:11px 'Songti SC',SimSun,serif;white-space:nowrap;pointer-events:none;opacity:0}
    .place-caption.show{animation:place-note 2s steps(4) forwards}@keyframes place-note{0%,80%{opacity:1}100%{opacity:0}}
    .story-main .journey-note{margin-top:12px;color:#a45c46;font-size:12px;line-height:1.7;border-left:2px solid #cfaa77;padding-left:9px}
    .paused .place-caption{animation-play-state:paused}
    /* Give every chapter its own broad setting, with the equipment readable at a glance. */
    .place{width:210px;height:150px;opacity:1}
    .place .building,.place .roof,.place .ornament,.place .window,.place .door{display:none!important}
    .place .setting{position:absolute;left:0;bottom:0;width:210px;height:150px;overflow:visible;pointer-events:none;shape-rendering:crispEdges;opacity:.78}
    .place .setting .scene-pulse{transform-box:fill-box;transform-origin:center}
    .place.active .setting .scene-pulse{animation:window-light 1.8s steps(2) infinite}
    .place .setting .scene-drift{transform-box:fill-box;transform-origin:bottom center}
    .place.active .setting .scene-drift{animation:scene-sway 2.8s steps(4) infinite}
    @keyframes scene-sway{50%{transform:rotate(5deg)}}
    .place .set{left:0;right:0}
    .place .event-art{left:24px;bottom:4px;width:162px;height:138px}
    .place.stage-6 .event-art{left:17px;bottom:4px;width:170px;height:145px}
    .place.team .set:before,.place.team .set:after{display:none}
    .place.team .npc{right:41px;bottom:8px;width:23px;height:31px}
    .place.team .npc:before{width:18px;height:15px;top:-16px}
    .place.team .speech{right:12px;bottom:74px;font-size:11px}
    .place.story-event .plaque,.place.team .plaque{bottom:130px;font-size:11px;border-color:#a5684f;color:#743d32;background:#fff5df}
    .scene .pagoda{opacity:.20}
    .paused .setting .scene-pulse{animation-play-state:paused!important}
    @media(max-width:800px){.place{height:150px;transform:translateX(-50%) scale(.92);transform-origin:bottom center}.place .event-art{left:24px;width:162px;height:138px}.place.stage-6 .event-art{left:17px;width:170px;height:145px}.vignette{bottom:145px}.place-caption{bottom:200px}}
    @media(prefers-reduced-motion:reduce){.traveler.enter-exit svg,.traveler.door-arrival svg,.place-caption.show,.place *{animation:none!important}.place-caption.show{opacity:1}.place .door{transition:none}}
  `;
  document.head.appendChild(css);
  const kinds={fan:['选型工位','bench'],thermal:['观察台','lab'],measurement:['观星台','observatory'],cable:['检验台','lab'],gear:['机巧工位','bench'],assembly:['装配台','bench'],teamwork:['会友亭','team'],workshop:['工具工位','production'],trial:['试作现场','production'],documentation:['书案','books'],microscope:['显微仪器','lab']};
  const notes={fan:'从使用需求出发，学习比较不同方案。',thermal:'在观察与记录中，理解环境与设备表现。',measurement:'把现象整理为可比较、可追溯的记录。',cable:'关注日常使用中的可靠性与验证方法。',gear:'从反复观察和测试中理解运动部件。',assembly:'将操作经验整理成清晰的工作步骤。',teamwork:'在交流与协作中了解团队的工作。',workshop:'围绕现场需要，准备工具与工作安排。',trial:'记录现场问题，为后续跟进留下线索。',documentation:'把过程与经验留存，方便后续查阅。',microscope:'从显微仪器出发，探索新的样机与方案。'};
  // Distinct visual beats for the 17-stop story. These are illustrative pixel
  // sets; they do not claim to be an exact rendering of an internal device.
  const paper='#f8ead0',ink='#775044',red='#a65f4b',gold='#d2a65f',muted='#b9967d';
  const box=(x,y,w,h,c=ink)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  const bench=`${box(9,77,106,6)}${box(18,83,5,18)}${box(99,83,5,18)}`;
  const stage=[
    {label:'Draco · 初遇',kind:'team',verb:'向伙伴问好',note:'新旅程从相互认识和熟悉工作开始。',art:''},
    {label:'部件选型',kind:'bench',verb:'比较样品',note:'阅读参数，再把不同样品放在一起观察。',art:`${bench}${box(17,49,27,27,ink)}${box(21,53,19,19,paper)}<g class="motion spin">${box(29,53,4,19,muted)}${box(21,61,19,4,muted)}</g>${box(57,52,18,24,red)}${box(78,55,18,21,gold)}${box(100,51,9,25,muted)}`},
    {label:'Draco · 观测',kind:'observatory',verb:'仰望星空',note:'让画面成为线索，把观察整理成记录。',art:`${box(62,51,6,36)}${box(51,85,6,15)}${box(73,85,6,15)}<g class="motion rock">${box(37,32,43,17,ink)}${box(42,35,29,11,muted)}${box(73,35,9,11,paper)}</g><g class="motion pulse">${box(14,25,5,15,gold)}${box(9,30,15,5,gold)}${box(91,17,4,13,gold)}${box(87,21,12,4,gold)}</g>`},
    {label:'装配探索',kind:'bench',verb:'安装与观察',note:'在动手装配时，记录需要继续跟进的问题。',art:`${bench}${box(21,48,31,27,muted)}${box(27,52,19,19,paper)}${box(31,56,11,11,red)}<g class="motion write">${box(73,42,5,30,ink)}${box(69,39,13,6,gold)}</g>${box(91,59,12,17,red)}`},
    {label:'环境观察',kind:'lab',verb:'观察变化',note:'留意环境变化，学习它与设备表现的关系。',art:`${bench}${box(18,48,33,28,muted)}${box(23,53,23,18,paper)}${box(27,61,15,4,gold)}${box(71,34,9,38,ink)}${box(73,39,5,28,paper)}${box(73,55,5,12,red)}<g class="motion pulse">${box(65,71,21,7,red)}${box(25,39,3,6,gold)}${box(35,36,3,7,gold)}</g>`},
    {label:'可靠性测试',kind:'lab',verb:'观察往复运动',note:'关注反复使用中的表现，学习如何验证可靠性。',art:`${bench}${box(15,52,15,19,ink)}${box(91,42,15,19,ink)}<g class="motion slide">${box(30,56,14,5,red)}${box(42,48,5,13,red)}${box(47,45,22,5,red)}${box(68,45,5,8,red)}${box(72,48,19,5,red)}</g>${box(39,68,38,5,muted)}`},
    {label:'显微仪器',kind:'lab',verb:'观察样本',note:'换个视角，探索显微仪器与样机方案。',art:`${bench}${box(30,72,59,5,ink)}${box(26,77,67,5,red)}${box(70,38,8,35,ink)}${box(63,30,15,8,red)}${box(54,26,13,7,red)}${box(36,57,36,6,ink)}${box(44,53,18,4,paper)}<g class="motion rock">${box(41,23,11,23,ink)}${box(35,18,19,7,red)}${box(37,14,13,5,ink)}${box(47,44,10,8,gold)}</g>${box(79,52,9,9,muted)}${box(81,54,5,5,paper)}`},
    {label:'方案对照',kind:'lab',verb:'逐一比对',note:'把不同方案并排观察，记录各自的表现。',art:`${bench}${box(17,41,35,34,ink)}${box(21,45,27,26,paper)}${box(66,41,35,34,ink)}${box(70,45,27,26,paper)}${box(24,61,6,10,red)}${box(34,55,6,16,gold)}${box(74,59,6,12,red)}${box(84,51,6,20,gold)}<g class="motion pulse">${box(54,52,9,4,red)}${box(57,48,4,12,red)}</g>`},
    {label:'装配记录',kind:'bench',verb:'边装边记',note:'将装机过程写成可查阅的步骤。',art:`${bench}${box(17,51,35,25,muted)}${box(21,47,27,5,red)}${box(56,44,30,31,paper)}${box(60,49,20,3,muted)}${box(60,57,20,3,muted)}<g class="motion write">${box(89,40,4,31,ink)}${box(87,38,8,5,gold)}</g>`},
    {label:'运动测试',kind:'bench',verb:'调校与测试',note:'反复观察运动状态，比较不同条件下的表现。',art:`${bench}<g class="motion spin">${box(27,47,28,28,ink)}${box(32,52,18,18,paper)}${box(39,45,5,32,red)}${box(25,58,32,5,red)}</g><g class="motion spin">${box(66,54,20,20,red)}${box(71,59,10,10,paper)}${box(74,52,4,24,muted)}${box(64,62,24,4,muted)}</g>`},
    {label:'维护追踪',kind:'books',verb:'记录线索',note:'将现象和处理线索留下，便于之后继续跟进。',art:`${bench}${box(21,43,31,34,paper)}${box(18,39,37,5,ink)}${box(25,50,21,3,muted)}${box(25,58,21,3,muted)}${box(25,66,16,3,muted)}<g class="motion write">${box(63,44,5,29,red)}${box(60,41,11,5,gold)}</g>${box(80,53,19,22,muted)}`},
    {label:'伙伴会面',kind:'team',verb:'交流想法',note:'与伙伴一起交换想法，梳理下一步。',art:''},
    {label:'装机准备',kind:'production',verb:'整理工具',note:'一边准备工具和物料，一边把工作步骤整理成文档。',art:`${bench}${box(15,55,28,20,red)}${box(19,51,20,5,ink)}${box(48,43,25,32,paper)}${box(52,49,17,3,muted)}${box(52,57,17,3,muted)}<g class="motion slide">${box(80,61,23,14,gold)}${box(84,56,15,5,ink)}</g>`},
    {label:'试作准备',kind:'lab',verb:'检查测试台',note:'为试作准备工具，也为长期使用整理测试思路。',art:`${bench}${box(14,44,39,31,ink)}${box(18,48,31,22,paper)}${box(23,57,5,8,red)}${box(32,53,5,12,gold)}${box(41,50,5,15,muted)}${box(66,50,29,25,red)}${box(70,54,21,17,paper)}<g class="motion pulse">${box(78,58,5,9,gold)}</g>`},
    {label:'试作现场',kind:'production',verb:'现场观察',note:'记录进展、回看协作，让问题成为改进线索。',art:`${box(8,75,108,10,ink)}${box(12,78,100,4,muted)}<g class="motion slide">${box(23,57,20,18,red)}${box(49,57,20,18,gold)}</g>${box(91,54,18,21,ink)}${box(95,58,10,11,paper)}${box(16,87,7,7,ink)}${box(94,87,7,7,ink)}`},
    {label:'工具改进',kind:'bench',verb:'改进工具',note:'从实际使用出发，整理让工具更顺手的建议。',art:`${bench}${box(18,54,35,21,muted)}${box(23,48,5,27,red)}${box(44,48,5,27,red)}<g class="motion rock">${box(69,42,5,31,ink)}${box(64,39,15,8,gold)}</g>${box(90,56,18,19,paper)}${box(93,61,12,3,red)}${box(93,67,12,3,red)}`},
    {label:'整理行囊',kind:'books',verb:'收好这一页',note:'把经历整理成行囊，继续走向新的旅程。',art:`${bench}${box(19,50,12,25,red)}${box(32,45,12,30,gold)}${box(45,53,12,22,muted)}${box(67,53,27,22,ink)}${box(71,57,19,14,paper)}<g class="motion pulse">${box(96,34,5,15,gold)}${box(91,39,15,5,gold)}</g>`}
  ];
  // Let equipment sit on distinct pedestals, stones and supports instead of
  // making every activity share the same long, repetitive workbench.
  const supports={
    1:`${box(12,77,36,6,ink)}${box(18,83,5,14,ink)}${box(48,77,47,5,muted)}${box(77,82,5,15,ink)}`,
    3:`${box(16,77,39,6,ink)}${box(23,83,5,13,muted)}${box(78,77,30,5,red)}${box(89,82,5,15,ink)}`,
    4:`${box(14,77,42,5,ink)}${box(22,82,5,16,ink)}${box(66,75,27,6,muted)}${box(75,81,5,16,ink)}`,
    5:`${box(11,77,31,5,ink)}${box(17,82,5,16,muted)}${box(74,77,38,5,ink)}${box(99,82,5,16,muted)}`,
    6:`${box(24,77,67,5,ink)}${box(31,82,6,15,muted)}${box(81,82,6,15,muted)}`,
    7:`${box(13,77,43,5,ink)}${box(22,82,5,15,muted)}${box(63,77,43,5,ink)}${box(98,82,5,15,muted)}`,
    8:`${box(12,77,47,5,ink)}${box(21,82,5,15,muted)}${box(62,76,39,5,muted)}${box(86,81,5,16,ink)}`,
    9:`${box(19,77,44,5,ink)}${box(35,82,5,15,muted)}${box(62,77,32,5,ink)}${box(72,82,5,15,muted)}`,
    10:`${box(15,77,44,5,muted)}${box(23,82,5,15,ink)}${box(75,77,30,5,muted)}${box(91,82,5,15,ink)}`,
    12:`${box(12,77,35,5,ink)}${box(18,82,5,15,muted)}${box(75,77,34,5,muted)}${box(95,82,5,15,ink)}`,
    13:`${box(10,77,48,5,ink)}${box(18,82,5,15,muted)}${box(64,77,38,5,muted)}${box(91,82,5,15,ink)}`,
    15:`${box(13,77,43,5,ink)}${box(20,82,5,15,muted)}${box(67,77,43,5,ink)}${box(98,82,5,15,muted)}`,
    16:`${box(13,78,48,5,muted)}${box(20,83,5,14,ink)}${box(66,77,35,5,ink)}${box(82,82,5,15,muted)}`
  };
  Object.entries(supports).forEach(([i,shape])=>{stage[Number(i)].art=stage[Number(i)].art.replace(bench,shape)});
  // Large, varied open-air backdrops make each chapter a place rather than
  // another small object on the same bench. They are illustrative only.
  const backdropInk='#9a7964', backdropLight='#ead7bc', backdropRed='#b67861', backdropGold='#d6aa6a';
  const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  const star=(x,y)=>`${r(x,y-6,4,16,backdropGold)}${r(x-6,y,16,4,backdropGold)}`;
  const landscape=i=>{
    const sprout=(x,y)=>`<g class="scene-drift">${r(x,y,3,14,'#8d9b79')}${r(x-5,y+3,5,4,'#9ea584')}${r(x+3,y,6,4,'#a5aa88')}</g>`;
    const rock=(x,y)=>`<path d="M${x} ${y+7}v-5h4v-3h11v3h5v5z" fill="#bca996"/>`;
    const bush=(x,y)=>`<path d="M${x} ${y+14}v-7h5v-5h8v-4h10v4h9v5h5v7z" fill="#a5a58b"/>`;
    const positions=i%3===0?[10,185]:i%3===1?[2,182]:[8,178];
    return `<path d="M7 143h25v-3h148v3h23v5H7z" fill="#bca58c" fill-opacity=".32"/>${rock(positions[0],133)}${rock(positions[1],134)}${sprout(positions[0]+23,124)}${sprout(positions[1]-13,126)}${i%2===0?bush(positions[1]-24,121):''}`;
  };
  const backdrops=[
    /* 01: camp entrance, friendly flags and a tree rather than a building */
    `${r(8,62,12,81,backdropInk)}${r(0,43,52,34,'#b78771')}${r(10,31,31,13,'#b78771')}${r(156,31,6,112,backdropInk)}<path d="M162 35h39v20h-13v5h-26z" fill="${backdropRed}"/>${r(169,42,23,4,backdropLight)}${r(167,50,17,4,backdropLight)}`,
    /* 02: wind tunnel with a large fan outline and flow marks */
    `<path d="M11 60h9V50h12V44h22v6h12v10h9v36h-9v10H54v6H32v-6H20V96h-9z" fill="${backdropInk}"/><path d="M20 64h8V57h27v7h9v29h-9v7H28v-7h-8z" fill="${backdropLight}"/>${r(30,68,24,24,paper)}<g class="scene-pulse">${r(116,58,58,4,backdropGold)}${r(132,72,51,4,backdropGold)}${r(121,86,57,4,backdropGold)}${r(139,100,42,4,backdropGold)}</g>`,
    /* 03: open night-sky lookout, rocks and large constellation */
    `<path d="M4 141V123h12v-12h18v-9h26v10h15v12h18v17z" fill="#b28c76"/>${star(22,30)}${star(157,19)}${r(125,37,5,5,backdropGold)}${r(149,49,5,5,backdropGold)}${r(177,33,5,5,backdropGold)}<path d="M127 39L151 51L179 35" fill="none" stroke="#c59357" stroke-width="2" stroke-dasharray="3 3"/>`,
    /* 04: oversized optical ring and assembly parts */
    `<path d="M13 55h8V46h11v-7h23v7h10v9h8v30h-8v9H55v7H32v-7H21v-9h-8z" fill="${backdropInk}"/><path d="M22 59h8v-8h26v8h8v22h-8v8H30v-8h-8z" fill="${backdropLight}"/>${r(31,60,24,19,paper)}${r(150,58,35,5,backdropInk)}${r(157,65,22,18,muted)}${r(161,69,14,10,paper)}`,
    /* 05: heat and dew test chamber */
    `<path d="M20 115V52h7V42h38v10h7v63z" fill="#cbb6a5"/><path d="M28 108V55h7v-7h23v7h7v53z" fill="${paper}"/><path d="M39 68h15v28H39z" fill="#c5b5a5"/>${r(159,43,9,67,backdropInk)}${r(162,49,3,55,paper)}${r(162,73,3,31,red)}<g class="scene-pulse">${r(128,44,4,12,backdropGold)}${r(138,37,4,15,backdropGold)}${r(148,45,4,11,backdropGold)}</g>`,
    /* 06: swinging test rig and repeated cycles */
    `${r(24,37,6,93,backdropInk)}${r(181,37,6,93,backdropInk)}<path d="M27 40h35m86 0h36" fill="none" stroke="${backdropInk}" stroke-width="5"/>${r(31,52,21,27,muted)}${r(158,52,21,27,muted)}<path d="M52 64h27v18h46V64h33" fill="none" stroke="#ad806b" stroke-width="4"/>${r(73,96,64,4,backdropGold)}`,
    /* 07: microscope observation, large optical lens and sample slide */
    `${r(23,48,6,64,backdropInk)}${r(23,45,37,5,backdropInk)}${r(34,52,18,17,'#b8c8bf')}${r(145,42,38,5,backdropInk)}${r(151,49,26,30,'#dec4a8')}${r(156,53,16,19,paper)}${star(164,60)}`,
    /* 08: cold-versus-warm comparison, not two houses */
    `${r(21,101,48,5,'#819b9a')}${r(26,80,7,21,'#81a7ac')}${r(38,68,7,33,'#81a7ac')}${r(50,61,7,40,'#81a7ac')}${r(141,101,48,5,backdropRed)}${r(148,81,7,20,'#c7805d')}${r(160,68,7,33,'#c7805d')}${r(172,54,7,47,'#c7805d')}<g class="scene-pulse">${r(29,45,4,15,'#86a6a7')}${r(23,50,16,4,'#86a6a7')}${r(161,39,4,16,backdropGold)}${r(155,45,16,4,backdropGold)}</g>`,
    /* 09: large blueprint frame, exploded assembly silhouettes */
    `<path d="M22 38h70v4H27v65h-5z" fill="#9bb3aa"/>${r(33,50,43,3,'#9bb3aa')}${r(33,61,49,3,'#9bb3aa')}${r(33,72,32,3,'#9bb3aa')}${r(128,52,39,9,backdropRed)}${r(133,70,29,9,backdropGold)}${r(138,88,19,9,backdropInk)}`,
    /* 10: mechanical gantry with a pair of gears */
    `<path d="M24 60h7V51h9v-7h17v7h9v9h7v17h-7v9h-9v7H40v-7h-9v-9h-7z" fill="${backdropRed}"/><path d="M38 62h8v-7h8v7h7v15h-7v7h-8v-7h-8z" fill="${paper}"/><path d="M148 65h6v-8h8v-6h13v6h8v8h6v15h-6v8h-8v6h-13v-6h-8v-8h-6z" fill="${backdropInk}"/>${r(161,67,14,14,backdropLight)}`,
    /* 11: maintenance route on a large map */
    `<path d="M18 104h33V79h31V55h37v32h28v-19h35" fill="none" stroke="#bb896d" stroke-width="4" stroke-dasharray="8 6"/>${r(18,100,8,8,backdropRed)}${r(79,75,8,8,backdropGold)}${r(177,64,8,8,backdropRed)}${r(25,42,30,3,muted)}${r(25,50,21,3,muted)}`,
    /* 12: forest clearing; the second character remains alongside the hero */
    `${r(14,57,10,84,backdropInk)}${r(2,38,51,35,'#a48272')}${r(11,27,32,13,'#a48272')}${r(181,62,10,79,backdropInk)}${r(159,42,51,34,'#b28874')}${r(168,31,33,12,'#b28874')}${r(44,131,118,7,'#bc9879')}${star(158,30)}`,
    /* 13: tool rack and cart */
    `${r(21,41,5,76,backdropInk)}${r(22,42,50,5,backdropInk)}${r(29,47,5,33,red)}${r(43,47,5,29,backdropGold)}${r(57,47,5,33,muted)}${r(145,84,44,29,backdropRed)}${r(149,88,36,20,backdropLight)}${r(148,113,9,9,backdropInk)}${r(178,113,9,9,backdropInk)}`,
    /* 14: instrument panel and test chamber */
    `${r(20,89,57,5,backdropInk)}${r(28,70,7,19,red)}${r(40,59,7,30,backdropGold)}${r(52,54,7,35,muted)}${r(64,64,7,25,red)}<path d="M144 110V57h6v-8h29v8h6v53" fill="none" stroke="${muted}" stroke-width="5"/>${star(162,67)}`,
    /* 15: factory conveyor and stacked material */
    `${r(5,107,198,12,backdropInk)}${r(10,111,188,4,backdropGold)}${r(20,82,28,25,red)}${r(52,82,28,25,gold)}${r(145,70,29,37,muted)}${r(179,55,21,52,backdropRed)}${r(19,122,11,11,backdropInk)}${r(177,122,11,11,backdropInk)}`,
    /* 16: substantial clamping fixture */
    `${r(14,109,182,12,backdropInk)}${r(26,59,10,50,backdropRed)}${r(174,59,10,50,backdropRed)}${r(36,55,52,9,backdropInk)}${r(122,55,52,9,backdropInk)}${r(87,78,36,28,backdropGold)}${r(96,84,18,16,paper)}${r(70,42,70,6,muted)}`,
    /* 17: summit flag and open scroll, instead of another building */
    `<path d="M0 144V126h22v-15h23v-15h29v17h30v16h27v15z" fill="#b18a72"/>${r(157,25,7,116,backdropInk)}${r(164,29,39,26,backdropRed)}${r(170,35,24,4,paper)}${r(170,43,16,4,paper)}${r(37,56,77,47,backdropInk)}${r(43,62,65,35,paper)}${r(51,70,43,3,muted)}${r(51,78,43,3,muted)}${r(51,86,32,3,muted)}${star(130,30)}`
  ];
  const stageAt=i=>chapters.length===17?stage[i]:null;
  const labelAt=i=>stageAt(i)?.label||(kinds[chapters[i].scene]||['旅途驿站'])[0];
  if(!scenes.microscope)scenes.microscope={label:'显微观察',svg:'<path fill="#704a3f" d="M20 48h28v5H16v-5h4zm8-30h6v28h-6zm-5-5h16v7H23zm6 33h14v4H29z"/><path fill="#d2a65f" d="M28 37h7v7h-7z"/>'};
  const note=document.createElement('p');note.className='journey-note';document.querySelector('.story-main').appendChild(note);
  const places=chapters.map((chapter,i)=>{
    const beat=stageAt(i);
    const [label,kind]=beat?[beat.label,beat.kind]:(kinds[chapter.scene]||['旅途驿站','team']);
    const place=document.createElement('div');place.className='place '+kind+' stage-'+i+(kind==='team'?'':' open');place.style.left=(8+84*i/Math.max(1,chapters.length-1))+'%';
    const sets={bench:'<span class="table"></span><span class="box"></span><span class="tool"></span><span class="spark"></span>',lab:'<span class="table"></span><span class="screen"></span><span class="beaker"></span>',observatory:'<span class="star"></span><span class="scope"></span><span class="tripod"></span>',production:'<span class="belt"></span><span class="parcel"></span><span class="cart"></span>',books:'<span class="table"></span><span class="books"></span><span class="paper"></span>',team:'<span class="npc"></span><span class="speech">一起加油</span>'};
    if(beat)place.classList.add('story-event');
    const actionArt=beat&&kind!=='team'?'<svg class="event-art" viewBox="0 0 124 106" aria-hidden="true">'+beat.art+'</svg>':(kind==='team'?'<span class="npc"></span><span class="speech">'+(i===0?'你好！':'一起想办法')+'</span>':(sets[kind]||''));
    const setting=beat?'<svg class="setting" viewBox="0 0 210 150" aria-hidden="true">'+landscape(i)+(backdrops[i]||'')+'</svg>':'';
    place.setAttribute('aria-hidden','true');place.innerHTML=setting+'<span class="building"></span><span class="roof"></span><span class="ornament"></span><span class="window left"></span><span class="window right"></span><span class="door"></span><span class="set">'+actionArt+'</span><span class="plaque">'+label+'</span>';
    scene.appendChild(place);return place;
  });
  const caption=document.createElement('div');caption.className='place-caption';caption.setAttribute('aria-hidden','true');scene.appendChild(caption);
  // Each condensed stop already has its own artwork; hiding the older generic
  // floating symbol prevents two labels from overlapping the new scene.
  if(chapters.length===17)vignette.style.display='none';
  const baseDisplay=display;
  display=function(i){
    baseDisplay(i);
    places.forEach((p,j)=>p.classList.toggle('active',j===i));
    caption.style.left=(8+84*i/Math.max(1,chapters.length-1))+'%';
    caption.textContent=(stageAt(i)?.verb||'抵达')+' · '+labelAt(i);
    note.textContent='沿途一记  ·  '+(stageAt(i)?.note||notes[chapters[i].scene]||'记录一路上的探索与收获。');
    caption.classList.remove('show');traveler.classList.remove('enter-exit','door-arrival');void traveler.offsetWidth;
    if(playing){caption.classList.add('show');traveler.classList.add('door-arrival')}
  };
  const baseGo=go;
  go=function(i,animate){
    if(animate){
      caption.classList.remove('show');caption.style.left=(8+84*index/Math.max(1,chapters.length-1))+'%';
      caption.textContent='出发 · '+labelAt(index);
      traveler.classList.remove('door-arrival','enter-exit');void traveler.offsetWidth;
      caption.classList.add('show');traveler.classList.add('enter-exit');places.forEach(p=>p.classList.remove('active'));
    }
    baseGo(i,animate);
  };
  places[index].classList.add('active');note.textContent='沿途一记  ·  '+(stageAt(index)?.note||notes[chapters[index].scene]||'记录一路上的探索与收获。');
})();
