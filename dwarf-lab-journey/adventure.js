/* Gentle quest elements: the little spirits represent problems overcome. */
(() => {
  const challenges = [3, 7, 10, 14].filter(i => i < chapters.length);
  if (!challenges.length) return;
  const style = document.createElement('style');
  style.textContent = `
    .quest-hud{font:11px 'Songti SC',SimSun,serif;color:#f8e8cc;letter-spacing:.05em;margin-right:14px;white-space:nowrap}
    .quest-land{position:absolute;bottom:86px;z-index:0;pointer-events:none;opacity:.42;image-rendering:pixelated}
    .quest-mountain{width:180px;height:85px;background:#b69383;clip-path:polygon(0 100%,0 78%,12% 78%,12% 60%,24% 60%,24% 42%,38% 42%,38% 21%,52% 21%,52% 38%,65% 38%,65% 56%,78% 56%,78% 74%,90% 74%,90% 88%,100% 88%,100% 100%)}
    .quest-bridge{bottom:31px;width:100px;height:20px;background:repeating-linear-gradient(90deg,#ab795e 0 11px,#85584b 11px 14px);border-top:4px solid #85584b;opacity:.67}
    .quest-bridge:before,.quest-bridge:after{content:'';position:absolute;bottom:-5px;width:5px;height:27px;background:#85584b}.quest-bridge:before{left:0}.quest-bridge:after{right:0}
    .quest-steps{bottom:45px;width:76px;height:26px;background:#b89373;opacity:.65;clip-path:polygon(0 100%,0 72%,20% 72%,20% 50%,40% 50%,40% 28%,60% 28%,60% 0,80% 0,80% 28%,100% 28%,100% 100%)}
    .quest-spirit{position:absolute;bottom:56px;width:27px;height:25px;z-index:3;pointer-events:none;image-rendering:pixelated;transform:translateX(-50%);animation:spirit-bob 1s steps(2) infinite}
    .quest-spirit .body{position:absolute;inset:4px 2px 0;background:#c78b71;border:3px solid #865d50;clip-path:polygon(0 25%,15% 25%,15% 0,85% 0,85% 25%,100% 25%,100% 80%,85% 80%,85% 100%,15% 100%,15% 80%,0 80%)}
    .quest-spirit:nth-of-type(2n) .body{background:#d4ae74}.quest-spirit .eyes{position:absolute;left:8px;top:12px;width:3px;height:3px;background:#553d38;box-shadow:8px 0 #553d38}
    .quest-spirit .label{position:absolute;bottom:31px;left:50%;transform:translateX(-50%);padding:2px 3px;background:#fff3dd;border:1px solid #b58b72;color:#855142;font:9px 'Songti SC',SimSun,serif;white-space:nowrap}
    .quest-spirit.beaten{animation:spirit-poof 1.2s steps(4) forwards}.quest-spirit.past{visibility:hidden;animation:none}
    @keyframes spirit-bob{50%{margin-bottom:4px}}@keyframes spirit-poof{0%,35%{opacity:1;transform:translateX(-50%) scale(1)}75%{opacity:1;transform:translateX(-50%) scale(.7) rotate(10deg)}100%{opacity:0;transform:translateX(-50%) scale(.15)}}
    .quest-sheath{position:absolute;left:4px;top:26px;width:5px;height:25px;background:#7d5445;border:1px solid #e0bb80;transform:rotate(-21deg);z-index:-1}
    .traveler.walking.quest-climb{animation:quest-crossing 2.3s steps(8) both}
    @keyframes quest-crossing{0%,100%{margin-bottom:0}25%,75%{margin-bottom:9px}50%{margin-bottom:18px}}
    .quest-blade{position:absolute;right:-6px;top:24px;width:5px;height:25px;background:#eee4cf;border:1px solid #976c56;transform-origin:2px 24px;transform:rotate(50deg);opacity:0}
    .traveler.quest-strike .quest-blade{animation:blade-swing 1.15s steps(5) forwards}@keyframes blade-swing{0%{opacity:0;transform:rotate(50deg)}20%{opacity:1;transform:rotate(-80deg)}60%{opacity:1;transform:rotate(65deg)}100%{opacity:0;transform:rotate(65deg)}}
    .quest-bonus{position:absolute;left:50%;bottom:100px;transform:translateX(-50%);padding:3px 5px;background:#fff5df;border:2px solid #c09266;color:#8d503c;white-space:nowrap;font:10px 'Songti SC',SimSun,serif;opacity:0;pointer-events:none}
    .traveler.quest-strike .quest-bonus{animation:quest-bonus 1.5s steps(4) forwards}@keyframes quest-bonus{0%,20%{opacity:0}35%,80%{opacity:1}100%{opacity:0;transform:translate(-50%,-12px)}}
    .paused .quest-spirit,.paused .quest-blade,.paused .quest-bonus{animation-play-state:paused!important}
    /* A close-up makes the encounter legible even on a narrow screen. */
    .quest-battle{position:absolute;top:26px;left:0;width:236px;height:126px;transform:translateX(-50%);z-index:9;pointer-events:none;display:none;image-rendering:pixelated;background:#fff3dc;border:3px solid #8b5141;box-shadow:5px 5px 0 #b98869;font-family:'Songti SC',SimSun,serif;color:#773f32;overflow:hidden}
    .quest-battle.visible{display:block}.quest-battle .battle-title{height:24px;background:#914d40;color:#fff3dd;font-size:11px;line-height:24px;text-align:center;letter-spacing:.12em}
    .quest-battle .battle-ground{position:absolute;bottom:27px;left:15px;right:15px;border-bottom:4px solid #be9b78}
    .quest-battle .battle-hero{position:absolute;left:38px;bottom:31px;width:31px;height:48px;image-rendering:pixelated}
    .quest-battle .battle-hero:before{content:'';position:absolute;left:5px;top:0;width:21px;height:18px;background:#e5b18a;border-top:6px solid #4b3935;box-shadow:0 18px 0 #b9634e,0 26px 0 #b9634e,0 35px 0 #514541}
    .quest-battle .battle-sword{position:absolute;left:61px;bottom:53px;width:7px;height:37px;background:#f7e9c7;border:2px solid #9e7257;transform-origin:4px 34px;transform:rotate(42deg)}
    .quest-battle .battle-enemy{position:absolute;left:148px;bottom:32px;width:42px;height:36px;background:#d48c73;border:4px solid #8a5649;clip-path:polygon(0 23%,15% 23%,15% 0,85% 0,85% 23%,100% 23%,100% 85%,80% 85%,80% 100%,20% 100%,20% 85%,0 85%)}
    .quest-battle .battle-enemy:after{content:'';position:absolute;left:8px;top:13px;width:4px;height:4px;background:#523d39;box-shadow:14px 0 #523d39}
    .quest-battle .battle-result{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-size:11px;color:#98533d;font-weight:bold;letter-spacing:.04em;opacity:0}
    .quest-battle.play .battle-hero{animation:battle-lunge 3.7s steps(5) forwards}.quest-battle.play .battle-sword{animation:battle-slash 3.7s steps(6) forwards}.quest-battle.play .battle-enemy{animation:battle-enemy 3.7s steps(5) forwards}.quest-battle.play .battle-result{animation:battle-result 3.7s steps(3) forwards}
    .quest-battle.settled .battle-enemy{opacity:.35}.quest-battle.settled .battle-result{opacity:1}
    @keyframes battle-lunge{0%,20%{transform:translateX(0)}35%,58%{transform:translateX(36px)}80%,100%{transform:translateX(0)}}
    @keyframes battle-slash{0%,20%{transform:rotate(42deg)}34%{transform:translateX(36px) rotate(-65deg)}52%{transform:translateX(36px) rotate(70deg)}80%,100%{transform:rotate(42deg)}}
    @keyframes battle-enemy{0%,45%{opacity:1;transform:translateX(0)}58%,68%{opacity:1;transform:translateX(14px) rotate(10deg)}85%,100%{opacity:.2;transform:translateX(20px) scale(.65)}}
    @keyframes battle-result{0%,53%{opacity:0}65%,100%{opacity:1}}
    .paused .quest-battle:not(.manual) .battle-hero,.paused .quest-battle:not(.manual) .battle-sword,.paused .quest-battle:not(.manual) .battle-enemy,.paused .quest-battle:not(.manual) .battle-result{animation-play-state:paused}
    @media(max-width:600px){.quest-battle{top:24px;width:210px}.quest-battle .battle-enemy{left:137px}}
    @media(max-width:600px){.frame-top{height:auto;min-height:42px;flex-wrap:wrap;gap:4px;padding-top:7px;padding-bottom:7px}.quest-hud{font-size:10px;margin-right:7px}}
    @media(prefers-reduced-motion:reduce){.quest-spirit,.quest-spirit.beaten,.quest-blade,.quest-bonus,.traveler.walking.quest-climb,.quest-battle *{animation:none!important}.quest-spirit.beaten{visibility:hidden}.traveler.quest-strike .quest-bonus{opacity:1}.quest-battle .battle-result{opacity:1}.quest-battle .battle-enemy{opacity:.35}}
  `;
  document.head.appendChild(style);
  const hud = document.createElement('span');
  hud.className = 'quest-hud';
  hud.setAttribute('role', 'status');
  hud.setAttribute('aria-live', 'polite');
  document.querySelector('.frame-top').insertBefore(hud, document.querySelector('.window-dots'));
  const sword = document.createElement('span');sword.className = 'quest-sheath';sword.setAttribute('aria-hidden','true');traveler.appendChild(sword);
  const blade = document.createElement('span');blade.className = 'quest-blade';blade.setAttribute('aria-hidden','true');traveler.appendChild(blade);
  const bonus = document.createElement('span');bonus.className = 'quest-bonus';bonus.setAttribute('aria-hidden','true');traveler.appendChild(bonus);
  const battle=document.createElement('div');battle.className='quest-battle';battle.setAttribute('aria-hidden','true');
  battle.innerHTML='<div class="battle-title"></div><span class="battle-ground"></span><span class="battle-hero"></span><span class="battle-sword"></span><span class="battle-enemy"></span><span class="battle-result"></span>';
  scene.appendChild(battle);
  const pos = i => 8 + 84 * i / Math.max(1, chapters.length - 1);
  for (const i of [1.5, 6.5, 11.5]) {
    if (i >= chapters.length - 1) continue;
    const mountain = document.createElement('span');mountain.className='quest-land quest-mountain';mountain.style.left=`${pos(i)}%`;mountain.setAttribute('aria-hidden','true');scene.appendChild(mountain);
  }
  for (const [i, type] of [[5.5,'quest-bridge'], [12.5,'quest-steps']]) {
    if (i >= chapters.length - 1) continue;
    const land=document.createElement('span');land.className='quest-land '+type;land.style.left=`${pos(i)}%`;land.setAttribute('aria-hidden','true');scene.appendChild(land);
  }
  const spirits = new Map(), cleared = new Set();let pending=null;
  for(const [order,i] of challenges.entries()){
    const spirit=document.createElement('span');spirit.className='quest-spirit';spirit.style.left=`calc(${pos(i)}% + 55px)`;spirit.setAttribute('aria-hidden','true');
    spirit.innerHTML='<span class="body"></span><span class="eyes"></span><span class="label">'+['装配小挑战','方案小挑战','跟进小挑战','试作小挑战'][order]+'</span>';
    scene.appendChild(spirit);spirits.set(i,spirit);
  }
  function update(){hud.textContent='剑客 Lv.'+(1+Math.floor(cleared.size/2))+' · 经验 '+cleared.size+'/'+challenges.length}
  function cancelPending(){if(pending!==null&&!cleared.has(pending)){const spirit=spirits.get(pending);if(spirit)spirit.classList.remove('beaten','past')}pending=null}
  function complete(i){if(pending!==i||index!==i||cleared.has(i))return;cleared.add(i);pending=null;update()}
  battle.addEventListener('animationend',event=>{if(event.animationName==='battle-result'&&pending!==null)complete(pending)});
  function reset(){cancelPending();cleared.clear();traveler.classList.remove('quest-strike');battle.className='quest-battle';spirits.forEach(spirit=>spirit.classList.remove('beaten','past'));update()}
  const priorDisplay=display;
  display=function(i){
    priorDisplay(i);
    cancelPending();traveler.classList.remove('quest-strike','quest-climb');battle.className='quest-battle';
    const spirit=spirits.get(i);
    if(!spirit)return;
    battle.style.left=pos(i)+'%';
    battle.querySelector('.battle-title').textContent=['装配小挑战','方案小挑战','跟进小挑战','试作小挑战'][challenges.indexOf(i)];
    if(cleared.has(i)){spirit.classList.add('past');battle.querySelector('.battle-result').textContent='挑战已完成';battle.className='quest-battle visible settled';return}
    pending=i;
    bonus.textContent=(cleared.size+1)%2===0?'挑战通过 · 升级！':'挑战通过 · 经验 +1';
    battle.querySelector('.battle-result').textContent=bonus.textContent;
    // A direct jump pauses the journey but still plays the explicitly selected encounter.
    battle.className='quest-battle visible play'+(playing?'':' manual');
    if(playing){spirit.classList.remove('past');spirit.classList.add('beaten');void traveler.offsetWidth;traveler.classList.add('quest-strike')}
    else spirit.classList.add('past');
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)complete(i);
  };
  const priorGo=go;
  go=function(i,animate){
    if(!animate&&playing&&index===chapters.length-1&&i===0)reset();
    if(i!==index){cancelPending();battle.className='quest-battle'}
    traveler.classList.toggle('quest-climb',Boolean(animate && (i===6||i===13)));
    priorGo(i,animate);
  };
  // Core restart fires first; clear the accumulated quest immediately after it.
  document.getElementById('restart').addEventListener('click',reset);
  update();
})();
