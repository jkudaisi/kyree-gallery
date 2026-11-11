(()=>{const d=document,w=window,RM=w.matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=w.matchMedia('(pointer:fine)').matches;
const $=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
/* hero video: tall on phones, wide elsewhere */
const hv=$('#heroVid');if(hv){const tall=w.matchMedia('(max-width:960px)').matches;const src=tall?hv.dataset.tall:hv.dataset.wide;hv.poster=tall?hv.dataset.ptall:hv.dataset.pwide;
 if(!RM){hv.src=src;hv.play().catch(()=>{})}else{hv.removeAttribute('autoplay')}}
/* smooth scroll on desktop only */
let lenis=null;if(!RM&&FINE&&w.Lenis){lenis=new Lenis({duration:1.05,smoothWheel:true});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
 $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-56})}}))}
/* cover tilt + scroll scale */
const cover=$('.cover');if(cover&&!RM){if(FINE){$('.hero').addEventListener('pointermove',e=>{const r=cover.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cover.style.setProperty('--ry',(x*7).toFixed(2)+'deg');cover.style.setProperty('--rx',(-y*5).toFixed(2)+'deg')});
 $('.hero').addEventListener('pointerleave',()=>{cover.style.setProperty('--ry','0deg');cover.style.setProperty('--rx','0deg')})}}
/* parallax on spread photos, rAF-throttled */
const pages=$$('.spread .page.photo');let tick=false;const onScroll=()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{tick=false;const vh=innerHeight;
 if(cover&&!RM){const p=Math.min(1,scrollY/vh);cover.style.setProperty('--cs',(1-p*.08).toFixed(3))}
 if(!RM)pages.forEach(pg=>{const r=pg.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=(r.top+r.height/2-vh/2)/vh;pg.style.setProperty('--ps',(1.08-Math.abs(p)*.06).toFixed(3))})})};
addEventListener('scroll',onScroll,{passive:true});onScroll();
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});$$('.rv').forEach(el=>io.observe(el));
/* contents hover peek */
const peek=$('.peek');if(peek&&FINE){$$('.toc a').forEach(a=>{a.addEventListener('pointerenter',()=>{peek.src=a.dataset.peek;peek.classList.add('on')});a.addEventListener('pointerleave',()=>peek.classList.remove('on'))});
 addEventListener('pointermove',e=>{peek.style.left=e.clientX+140+'px';peek.style.top=e.clientY+'px'},{passive:true})}
/* strips: drag to scroll + arrows */
$$('.strip').forEach(s=>{let down=false,sx=0,sl=0,moved=0;s.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=s.scrollLeft});
 addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));if(moved>4)s.classList.add('drag');s.scrollLeft=sl-dx});
 addEventListener('pointerup',()=>{if(!down)return;down=false;setTimeout(()=>s.classList.remove('drag'),0)});
 s.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation()}},true);
 const ar=s.parentElement.querySelector('.arrows');if(ar){ar.children[0].onclick=()=>s.scrollBy({left:-s.clientWidth*.8,behavior:RM?'auto':'smooth'});ar.children[1].onclick=()=>s.scrollBy({left:s.clientWidth*.8,behavior:RM?'auto':'smooth'})}});
/* reels: play only when visible */
const clips=$$('.clip video');const pio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.poster=e.target.dataset.poster;pio.unobserve(e.target)}}),{rootMargin:'400px'});clips.forEach(v=>pio.observe(v));const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting&&e.intersectionRatio>.55){if(!v.src)v.src=v.dataset.src;if(!RM)v.play().catch(()=>{})}else{v.pause()}}),{threshold:[0,.55,1]});clips.forEach(v=>vio.observe(v));
/* lightbox */
const lb=$('#lb'),st=$('.stage',lb),cap=$('.lcap',lb);let group=[],idx=0;
const show=()=>{const it=group[idx];st.innerHTML='';let el;if(it.type==='video'){el=d.createElement('video');el.src=it.src;el.muted=true;el.loop=true;el.playsInline=true;el.controls=true;if(!RM)el.autoplay=true;el.poster=it.poster||''}else{el=d.createElement('img');el.src=it.src;el.alt=it.alt||''}
 st.appendChild(el);cap.innerHTML=(it.cap||'')+(it.post?` &nbsp;·&nbsp; <a href="${it.post}" target="_blank" rel="noopener">View on Instagram</a>`:'')};
const open=(g,i)=>{group=g;idx=i;show();lb.showModal();lenis&&lenis.stop()};
lb.addEventListener('close',()=>{st.innerHTML='';lenis&&lenis.start()});
$('.x',lb).onclick=()=>lb.close();$('.prev',lb).onclick=()=>{idx=(idx-1+group.length)%group.length;show()};$('.next',lb).onclick=()=>{idx=(idx+1)%group.length;show()};
lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('.prev',lb).click();if(e.key==='ArrowRight')$('.next',lb).click()});
lb.addEventListener('click',e=>{if(e.target===lb||e.target===st)lb.close()});
let sx0=null;lb.addEventListener('touchstart',e=>{sx0=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',e=>{if(sx0==null)return;const dx=e.changedTouches[0].clientX-sx0;if(Math.abs(dx)>50)(dx>0?$('.prev',lb):$('.next',lb)).click();sx0=null});
$$('[data-group]').forEach(sec=>{const items=$$('[data-full]',sec);const g=items.map(el=>({type:el.dataset.type||'img',src:el.dataset.full,poster:el.dataset.poster,cap:el.dataset.cap,post:el.dataset.post,alt:el.getAttribute('aria-label')||''}));
 items.forEach((el,i)=>{el.addEventListener('click',()=>open(g,i));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(g,i)}})})});
/* booking card: compose a DM, copy it, open Instagram */
const f=$('#bookForm');if(f){f.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(f);const cov=fd.getAll('coverage').join(' + ')||'Not sure yet';
 const msg=`Hi Kyree! Booking request from your site.\nName: ${fd.get('name')}\nShoot: ${fd.get('type')}\nDate: ${fd.get('date')||'Flexible'}\nWhere: ${fd.get('where')}\nCoverage: ${cov}\nDetails: ${fd.get('details')||'None'}\nBest contact: ${fd.get('contact')}`;
 const s=$('.status',f);let ok=false;try{await navigator.clipboard.writeText(msg);ok=true}catch(_){}
 s.textContent=ok?'Your request is copied. Paste it into the DM that just opened.':'Copy this into the DM: '+msg.replace(/\n/g,' | ');
 w.open('https://ig.me/m/kyree_gallery','_blank','noopener')})}
})();
