/* A continuous, walkable mountain path and a journey-driven day/night cycle. */
(() => {
  const heights = [0,0,0,12,28,48,70,52,28,8,0,0,12,40,68,28,0];
  const count = chapters.length;
  const heightAt = i => heights[Math.max(0, Math.min(heights.length - 1, i))] || 0;
  const fractionAt = i => 8 + 84 * i / Math.max(1, count - 1);
  const style = document.createElement('style');
  style.textContent = `
    .terrain-track{position:absolute;left:0;right:0;bottom:0;width:100%;height:160px;z-index:1;pointer-events:none;overflow:visible;image-rendering:pixelated}
    .terrain-track svg{width:100%;height:100%;display:block;overflow:visible}
    .scene .path{display:none}
    .scene .sun{display:none}
    .terrain-orb{position:absolute;top:38px;width:42px;height:42px;z-index:1;pointer-events:none;image-rendering:pixelated;background:#f5dda2;clip-path:polygon(20% 0,80% 0,80% 10%,90% 10%,90% 20%,100% 20%,100% 80%,90% 80%,90% 90%,80% 90%,80% 100%,20% 100%,20% 90%,10% 90%,10% 80%,0 80%,0 20%,10% 20%,10% 10%,20% 10%)}
    .terrain-orb.moon{background:#fff0c9;clip-path:polygon(25% 0,55% 0,55% 15%,40% 15%,40% 30%,30% 30%,30% 65%,40% 65%,40% 80%,55% 80%,55% 90%,80% 90%,80% 100%,25% 100%,25% 90%,10% 90%,10% 75%,0 75%,0 25%,10% 25%,10% 10%,25% 10%)}
    .scene .sky,.scene .mountains,.scene .hills{transition:background-color .35s linear}
    .terrain-clock{font:11px 'Songti SC',SimSun,serif;color:#f8e8cc;white-space:nowrap;margin-right:12px;letter-spacing:.06em}
    @media(max-width:600px){.terrain-clock{font-size:10px;margin-right:6px}}
    @media(prefers-reduced-motion:reduce){.scene .sky,.scene .mountains,.scene .hills{transition:none}}
  `;
  document.head.appendChild(style);
  const layer = document.createElement('div');
  layer.className = 'terrain-track';
  layer.setAttribute('aria-hidden','true');
  const points = chapters.map((_, i) => `${(fractionAt(i)*10).toFixed(2)},${160-44-heightAt(i)}`);
  const left = (fractionAt(0)*10).toFixed(2), right = (fractionAt(count-1)*10).toFixed(2);
  const surface = points.join(' ');
  layer.innerHTML = `<svg viewBox="0 0 1000 160" preserveAspectRatio="none" shape-rendering="crispEdges"><polygon points="${left},160 ${surface} ${right},160" fill="#d4b79a" fill-opacity=".83"/><polyline points="${surface}" fill="none" stroke="#8d6553" stroke-width="3" vector-effect="non-scaling-stroke"/><polyline points="${surface}" fill="none" stroke="#f5dfba" stroke-width="1" stroke-dasharray="5 8" vector-effect="non-scaling-stroke"/></svg>`;
  scene.insertBefore(layer, scene.querySelector('.nodes'));

  // Keep the route markers and every stop's scenery on the same elevation.
  [...nodes.children].forEach((node,i) => { node.style.top = -heightAt(i)+'px'; });
  [...scene.querySelectorAll('.place')].forEach((place,i) => { place.style.bottom = (53+heightAt(i))+'px'; });
  [...scene.querySelectorAll('.game-coin')].forEach((coin,i) => { coin.style.bottom = (89+(heightAt(i)+heightAt(i+1))/2)+'px'; });
  const challenges = [3,7,10,14].filter(i => i < count);
  [...scene.querySelectorAll('.quest-spirit')].forEach((spirit,i) => { spirit.style.bottom = (56+heightAt(challenges[i]))+'px'; });
  const bridge = scene.querySelector('.quest-bridge');
  if (bridge) bridge.style.bottom = (31+(heightAt(5)+heightAt(6))/2)+'px';
  const steps = scene.querySelector('.quest-steps');
  if (steps) steps.style.bottom = (45+(heightAt(12)+heightAt(13))/2)+'px';
  const placeCaption = scene.querySelector('.place-caption');

  // Interpolate the sky from dawn to day, dusk, night and dawn as the traveler moves.
  const phases = [
    {at:0, name:'晨光', sky:[246,225,199], horizon:[225,195,170], mountain:[199,166,147], hills:[184,145,128], stars:.45},
    {at:.25, name:'白昼', sky:[238,231,211], horizon:[228,207,180], mountain:[202,180,158], hills:[188,160,139], stars:.26},
    {at:.50, name:'暮色', sky:[224,177,158], horizon:[206,151,136], mountain:[177,131,126], hills:[156,112,109], stars:.52},
    {at:.75, name:'夜空', sky:[65,76,104], horizon:[108,97,115], mountain:[104,97,116], hills:[112,92,105], stars:1},
    {at:1, name:'晨光', sky:[246,225,199], horizon:[225,195,170], mountain:[199,166,147], hills:[184,145,128], stars:.45}
  ];
  const sky=scene.querySelector('.sky'), mountains=scene.querySelector('.mountains'), hills=scene.querySelector('.hills'), cosmos=scene.querySelector('.cosmos-sky');
  const orb=document.createElement('span');orb.className='terrain-orb';orb.setAttribute('aria-hidden','true');scene.insertBefore(orb,scene.querySelector('.mountains'));
  const clock=document.createElement('span');clock.className='terrain-clock';clock.setAttribute('aria-live','off');document.querySelector('.frame-top').insertBefore(clock,document.querySelector('.window-dots'));
  let currentPhase = '';
  const rgb=a=>'rgb('+a.map(v=>Math.round(v)).join(',')+')';
  const blend=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t);
  function setSky(progress){
    progress=Math.max(0,Math.min(1,progress));
    const p=Math.min(phases.length-2,Math.floor(progress*4)), a=phases[p], b=phases[p+1], t=(progress-a.at)/(b.at-a.at);
    const top=blend(a.sky,b.sky,t), lower=blend(a.horizon,b.horizon,t);
    sky.style.background=`linear-gradient(${rgb(top)} 0%, ${rgb(lower)} 100%)`;
    mountains.style.backgroundColor=rgb(blend(a.mountain,b.mountain,t));
    hills.style.backgroundColor=rgb(blend(a.hills,b.hills,t));
    if(cosmos)cosmos.style.opacity=String(a.stars+(b.stars-a.stars)*t);
    const x=scene.offsetWidth*(.08+.84*progress);
    orb.style.left=Math.max(0,Math.min(scene.offsetWidth-42,x+viewport.clientWidth*.28))+'px';
    orb.classList.toggle('moon',progress>=.625&&progress<.9);
    orb.style.top=(33+Math.round(10*Math.abs(Math.sin(progress*Math.PI*2))))+'px';
    const phase=t<.5?a.name:b.name;
    if(phase!==currentPhase){currentPhase=phase;clock.textContent='时景 · '+phase;}
  }
  const baseDisplay=display;
  display=function(i){
    baseDisplay(i);
    if(placeCaption)placeCaption.style.bottom=Math.min(215+heightAt(i),scene.clientHeight-27)+'px';
    setSky(i/Math.max(1,count-1));
  };
  const baseGo=go;
  go=function(destination,animate){
    baseGo(destination,animate);
    traveler.style.transition=animate?'left 2.3s linear, bottom 2.3s linear':'none';
    traveler.style.bottom=(53+heightAt(destination))+'px';
    if(!animate)setSky(destination/Math.max(1,count-1));
  };
  // The existing pause code freezes horizontal position; freeze height too.
  document.getElementById('toggle').addEventListener('click',()=>{
    if(playing && inTransit){
      const computed=getComputedStyle(traveler), left=computed.left, bottom=computed.bottom;
      traveler.style.transition='none';traveler.style.left=left;traveler.style.bottom=bottom;
    }
  },true);
  function tick(){
    if(playing && inTransit){
      const x=parseFloat(getComputedStyle(traveler).left), width=scene.offsetWidth;
      if(Number.isFinite(x)&&width)setSky((x/width-.08)/.84);
    }
    requestAnimationFrame(tick);
  }
  traveler.style.bottom=(53+heightAt(index))+'px';
  if(placeCaption)placeCaption.style.bottom=Math.min(215+heightAt(index),scene.clientHeight-27)+'px';
  setSky(index/Math.max(1,count-1));
  requestAnimationFrame(tick);
})();
