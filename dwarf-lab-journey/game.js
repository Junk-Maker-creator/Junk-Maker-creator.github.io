/* Journey feedback: a collectible between adjacent stops, and scene-specific arrival gestures. */
(() => {
  const css=document.createElement('style');
  css.textContent=`
    .game-score{font:11px 'DotGothic16',monospace;color:#f8e8cc;letter-spacing:.08em;margin-left:auto;margin-right:18px;white-space:nowrap}
    .game-coin{position:absolute;bottom:89px;width:15px;height:19px;border:3px solid #ae793f;background:#efd078;box-shadow:inset 2px 0 #fff1ba;transform:translateX(-50%);z-index:2;pointer-events:none;animation:coin-shine 1.2s steps(2) infinite}
    .game-coin.collected{opacity:0;animation:none;transition:opacity .15s}.paused .game-coin{animation-play-state:paused}
    .game-feedback{position:absolute;bottom:70px;left:50%;transform:translateX(-50%);white-space:nowrap;color:#9a4d35;background:#fff1d4;border:2px solid #bf895f;font:10px/1.3 'Songti SC',SimSun,serif;padding:3px 5px;opacity:0;pointer-events:none}
    .game-feedback.show{animation:gain .9s steps(4) forwards}@keyframes gain{0%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-20px)}}
    .traveler.celebrate[data-action=inspect]{animation:inspect .65s steps(3) 1}.traveler.celebrate[data-action=work]{animation:work .7s steps(4) 1}.traveler.celebrate[data-action=wave]{animation:wave-person .7s steps(4) 1}.traveler.celebrate[data-action=check]{animation:check .7s steps(4) 1}
    .traveler.celebrate[data-action=look]{animation:look-up .95s steps(4) 1}.traveler.celebrate[data-action=observe]{animation:peer-in 1s steps(4) 1}
    .traveler.celebrate[data-action=write]{animation:write-note .9s steps(4) 1}.traveler.celebrate[data-action=compare]{animation:compare-sides 1s steps(4) 1}
    .traveler.celebrate[data-action=lift]{animation:lift-tool 1s steps(4) 1}.traveler.celebrate[data-action=adjust]{animation:adjust-part .95s steps(4) 1}
    .traveler.celebrate[data-action=test]{animation:test-step 1s steps(4) 1}.traveler.celebrate[data-action=farewell]{animation:farewell 1.2s steps(4) 1}
    .paused .traveler.celebrate{animation-play-state:paused}
    @keyframes inspect{35%{transform:translateX(-50%) rotate(-8deg)}70%{transform:translateX(-50%) rotate(8deg)}}
    @keyframes work{30%{transform:translateX(-50%) rotate(-10deg)}65%{transform:translateX(-50%) rotate(6deg)}}
    @keyframes wave-person{30%{transform:translateX(-50%) rotate(10deg)}60%{transform:translateX(-50%) rotate(-10deg)}}
    @keyframes check{35%{margin-bottom:7px;transform:translateX(-50%) rotate(7deg)}75%{transform:translateX(-50%) rotate(-5deg)}}
    @keyframes look-up{25%{transform:translateX(-50%) rotate(8deg)}65%{margin-bottom:4px;transform:translateX(-50%) rotate(8deg)}}
    @keyframes peer-in{35%{transform:translateX(-55%) rotate(-13deg)}70%{transform:translateX(-55%) rotate(-13deg)}}
    @keyframes write-note{25%,75%{transform:translateX(-50%) rotate(-8deg)}50%{transform:translateX(-50%) rotate(3deg)}}
    @keyframes compare-sides{25%{transform:translateX(-56%) rotate(-9deg)}75%{transform:translateX(-44%) rotate(9deg)}}
    @keyframes lift-tool{25%{margin-bottom:-4px}65%{margin-bottom:9px;transform:translateX(-50%) rotate(5deg)}}
    @keyframes adjust-part{25%{transform:translateX(-55%) rotate(-12deg)}50%{transform:translateX(-45%) rotate(8deg)}75%{transform:translateX(-54%) rotate(-6deg)}}
    @keyframes test-step{25%{margin-bottom:5px;transform:translateX(-55%)}65%{margin-bottom:0;transform:translateX(-45%)}}
    @keyframes farewell{25%{margin-bottom:8px;transform:translateX(-50%) rotate(12deg)}50%{margin-bottom:0;transform:translateX(-50%) rotate(-10deg)}75%{margin-bottom:5px;transform:translateX(-50%) rotate(8deg)}}
    @media(max-width:600px){.game-score{margin-right:8px;font-size:10px}}
    @media(prefers-reduced-motion:reduce){.game-coin,.game-feedback.show,.traveler.celebrate[data-action]{animation:none!important}.game-feedback.show{opacity:1}}
  `;
  document.head.appendChild(css);
  const score=document.createElement('span');score.className='game-score';score.setAttribute('aria-live','polite');document.querySelector('.frame-top').insertBefore(score,document.querySelector('.window-dots'));
  const feedback=document.createElement('span');feedback.className='game-feedback';feedback.setAttribute('aria-hidden','true');feedback.textContent='金币 +1';traveler.appendChild(feedback);
  const coins=[];const collected=new Set();let pickupTimer=null,pendingCoin=null;
  for(let i=0;i<chapters.length-1;i++){
    const coin=document.createElement('span');coin.className='game-coin';coin.style.left=(8+84*(i+.5)/Math.max(1,chapters.length-1))+'%';coin.setAttribute('aria-hidden','true');scene.appendChild(coin);coins.push(coin);
  }
  function updateScore(){score.textContent='金币 '+collected.size+' / '+coins.length}
  function pickup(i){if(i===null||!coins[i]||collected.has(i))return;collected.add(i);coins[i].classList.add('collected');updateScore();feedback.classList.remove('show');void feedback.offsetWidth;feedback.classList.add('show');setTimeout(()=>feedback.classList.remove('show'),1000)}
  function resetCoins(){collected.clear();pendingCoin=null;clearTimeout(pickupTimer);coins.forEach(coin=>coin.classList.remove('collected'));feedback.classList.remove('show');updateScore()}
  const baseClear=clearTimers;
  clearTimers=function(){baseClear();clearTimeout(pickupTimer)};
  const baseGo=go;
  go=function(destination,animate){
    const start=index;
    if(!animate&&playing&&destination===0&&start===chapters.length-1)resetCoins();
    if(animate){
      if(destination!==start)pendingCoin=destination>start?destination-1:destination;
      clearTimeout(pickupTimer);
      if(pendingCoin!==null && coins[pendingCoin] && !collected.has(pendingCoin)){
        const width=scene.offsetWidth;
        const from=parseFloat(getComputedStyle(traveler).left);
        const target=width*(8+84*destination/Math.max(1,chapters.length-1))/100;
        const coin=width*(8+84*(pendingCoin+.5)/Math.max(1,chapters.length-1))/100;
        const remaining=target-from;
        const ratio=Math.abs(remaining)<1 ? 0 : (coin-from)/remaining;
        pickupTimer=setTimeout(()=>pickup(pendingCoin),Math.max(0,Math.min(1,ratio))*2300);
      }
    }
    else pendingCoin=null;
    baseGo(destination,animate);
  };
  const actions={fan:'inspect',measurement:'inspect',thermal:'inspect',cable:'work',gear:'work',assembly:'work',teamwork:'wave',workshop:'work',trial:'check',documentation:'check',microscope:'inspect'};
  // The condensed journey uses a different gesture at each stop, even when
  // two consecutive stops share a broad work category.
  const journeyActions=['wave','compare','look','work','observe','test','observe','compare','write','adjust','write','wave','lift','check','inspect','adjust','farewell'];
  const baseDisplay=display;
  display=function(i){traveler.dataset.action=(chapters.length===17&&journeyActions[i])||actions[chapters[i].scene]||'check';baseDisplay(i)};
  traveler.dataset.action=(chapters.length===17&&journeyActions[index])||actions[chapters[index].scene]||'check';
  document.getElementById('restart').addEventListener('click',resetCoins);
  updateScore();
})();
