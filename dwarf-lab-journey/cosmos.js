/* Quiet, hand-drawn pixel astronomy along the journey. */
(() => {
  const style=document.createElement('style');
  style.textContent=`
    .cosmos-sky{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;image-rendering:pixelated}
    .cosmos-sky .sky-art{position:absolute;transform:translateX(-50%);opacity:.76;image-rendering:pixelated}
    .cosmos-sky svg{width:100%;height:100%;display:block;overflow:visible;shape-rendering:crispEdges}
    .cosmos-sky .twinkle{animation:sky-twinkle 2.6s steps(2) infinite}
    .cosmos-sky .twinkle:nth-child(3n){animation-delay:-1.2s}
    @keyframes sky-twinkle{50%{opacity:.32}}
    .paused .cosmos-sky .twinkle{animation-play-state:paused}
    @media(prefers-reduced-motion:reduce){.cosmos-sky .twinkle{animation:none}}
  `;
  document.head.appendChild(style);
  const layer=document.createElement('div');layer.className='cosmos-sky';layer.setAttribute('aria-hidden','true');
  const ink='#ad7860',gold='#d1a566',light='#fff6d8',soft='#d7b996';
  const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  const star=(x,y,c=gold)=>`${rect(x+3,y,3,9,c)}${rect(x,y+3,9,3,c)}`;
  const arts=[
    {at:1.4,top:46,w:66,h:48,svg:`${rect(15,9,35,31,gold)}${rect(24,4,20,40,gold)}${rect(29,4,22,30,'#f4e7cf')}${star(52,4,light)}`},
    {at:3.8,top:38,w:82,h:48,svg:`<path d="M8 30L25 12L43 27L67 8" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 4"/>${star(4,26)}${star(21,8)}${star(39,23)}${star(63,4)}`},
    {at:6.3,top:43,w:82,h:46,svg:`${rect(22,11,37,22,gold)}${rect(28,7,25,30,gold)}${rect(29,15,23,14,soft)}<path d="M4 34L75 11" stroke="${ink}" stroke-width="4" stroke-dasharray="7 3"/>${star(67,32,light)}`},
    {at:8.8,top:34,w:93,h:48,svg:`${star(4,16)}${star(23,4,light)}${star(42,16)}${star(61,4,light)}${star(80,16)}<path d="M8 20L27 8L46 20L65 8L84 20" fill="none" stroke="${soft}" stroke-width="2" stroke-dasharray="3 4"/>`},
    {at:11.3,top:42,w:82,h:43,svg:`${rect(8,22,44,4,light)}${rect(20,17,34,4,light)}${rect(36,12,21,4,light)}${star(59,4,gold)}${star(68,22,light)}`},
    {at:13.8,top:40,w:90,h:40,svg:`${rect(7,14,15,13,gold)}${rect(35,10,20,20,gold)}${rect(69,14,15,13,gold)}${rect(7,14,8,13,'#f4e7cf')}${rect(47,10,9,20,'#f4e7cf')}`},
    {at:15.4,top:48,w:76,h:46,svg:`<path d="M11 32L31 10L52 27L65 9" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 4"/>${star(7,28)}${star(27,6,light)}${star(48,23)}${star(61,5,light)}`}
  ];
  for(const item of arts){
    if(item.at>=chapters.length-1)continue;
    const el=document.createElement('span');el.className='sky-art';el.style.left=(8+84*item.at/Math.max(1,chapters.length-1))+'%';el.style.top=item.top+'px';el.style.width=item.w+'px';el.style.height=item.h+'px';
    el.innerHTML=`<svg viewBox="0 0 ${item.w} ${item.h}">${item.svg}</svg>`;layer.appendChild(el);
  }
  // Small stars fill otherwise empty sky without competing with scene labels.
  for(let n=0;n<42;n++){
    const el=document.createElement('span');el.className='sky-art twinkle';el.style.left=(4+(n*37%92))+'%';el.style.top=(14+(n*23%75))+'px';el.style.width='8px';el.style.height='8px';
    el.innerHTML=`<svg viewBox="0 0 8 8">${rect(3,0,2,8,n%3?soft:light)}${rect(0,3,8,2,n%3?soft:light)}</svg>`;layer.appendChild(el);
  }
  scene.insertBefore(layer,scene.querySelector('.ground'));
})();
