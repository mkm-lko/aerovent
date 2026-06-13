// Main interaction script for AeroVent landing
// Implements: particles, cursor parallax, reveal on scroll, flow progress, counters

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

/* ---------- Performance helpers ---------- */
const raf = window.requestAnimationFrame.bind(window);
const now = () => performance.now();

/* ---------- Particles (Canvas) ---------- */
(function particles(){
  const canvas = qs('#particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h, particles = [];

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(canvas.clientWidth * dpr);
    h = canvas.height = Math.floor(canvas.clientHeight * dpr);
    ctx.scale(dpr,dpr);
    initParticles();
  }

  function initParticles(){
    particles = [];
    const count = Math.max(24, Math.floor((canvas.clientWidth/100)* (canvas.clientHeight/400)));
    for(let i=0;i<count;i++) particles.push({x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight, r:Math.random()*1.6+0.6, vx:(Math.random()-0.5)/6, vy:-0.1 - Math.random()/6});
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.save();
    // subtle fog overlay
    ctx.fillStyle = 'rgba(2,6,12,0.25)';
    ctx.fillRect(0,0,canvas.width/dpr, canvas.height/dpr);
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.y < -10) { p.y = canvas.clientHeight + 10; p.x = Math.random()*canvas.clientWidth; }
      ctx.beginPath();
      ctx.fillStyle = 'rgba(77,125,255,0.08)';
      ctx.arc(p.x, p.y, p.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    raf(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  raf(draw);
})();

/* ---------- Cursor parallax for hero shoe ---------- */
(function cursorParallax(){
  const shoe = qs('#shoe');
  if(!shoe) return;
  const bounds = shoe.getBoundingClientRect();
  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    mx = x; my = y;
  });
  function update(){
    shoe.style.transform = `translate3d(${mx*12}px, ${my*8}px, 0) rotate(${mx*6}deg)`;
    raf(update);
  }
  raf(update);
})();

/* ---------- Reveal on scroll (IntersectionObserver) ---------- */
(function reveal(){
  const items = qsa('[data-reveal]');
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('reveal-show');
    });
  },{threshold:0.18});
  items.forEach(i=>io.observe(i));
})();

/* ---------- Flow step tracking ---------- */
(function flowSteps(){
  const steps = qsa('[data-step]');
  if(!steps.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('active');
      } else {
        en.target.classList.remove('active');
      }
    });
  },{threshold:0.6, rootMargin:'0px 0px -20% 0px'});
  steps.forEach(s=>io.observe(s));
})();

/* ---------- Counters ---------- */
(function counters(){
  const els = qsa('.stat');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const el = en.target; const target = +el.dataset.count || 0; const num = el.querySelector('.num');
        if(!num) return; let start=0; const dur=1200; const t0=now();
        const tick = ()=>{
          const dt = Math.min(1, (now()-t0)/dur); const val = Math.floor(dt*target);
          num.textContent = val;
          if(dt<1) raf(tick);
        };
        tick();
        io.unobserve(el);
      }
    });
  },{threshold:0.3});
  els.forEach(e=>io.observe(e));
})();

/* ---------- Nav interactions ---------- */
(function nav(){
  const nav = qs('#site-nav');
  const links = qsa('[data-nav]');
  const toggle = qs('.nav-toggle');
  const navLinks = qs('.nav-links');
  // sticky blur on scroll
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y>40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    // scroll progress
    const prog = (window.scrollY / (document.body.scrollHeight - window.innerHeight))*100;
    const bar = qs('.scroll-progress span'); if(bar) bar.style.width = prog + '%';
  },{passive:true});

  // mobile toggle
  if(toggle && navLinks){
    toggle.addEventListener('click', ()=>{
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      navLinks.classList.toggle('open');
    });
  }

  // page transition overlay
  const transition = document.querySelector('.page-transition');
  const navigateTo = (target)=>{
    if(!target || !transition) return;
    transition.classList.add('active');
    setTimeout(()=>{
      const top = window.scrollY + target.getBoundingClientRect().top;
      window.scrollTo({top, behavior:'auto'});
      transition.classList.add('exiting');
      transition.classList.remove('active');
      setTimeout(()=>transition.classList.remove('exiting'), 650);
    }, 260);
  };

  links.forEach(link=>{
    link.addEventListener('click', (event)=>{
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if(target){
        navigateTo(target);
        history.pushState(null,'',link.getAttribute('href'));
      }
      if(navLinks.classList.contains('open')){
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // active link tracking
  const sections = links.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===('#'+en.target.id)));
      }
    });
  },{threshold:0.4});
  sections.forEach(s=>io.observe(s));
})();

/* ---------- Accessibility helpers ---------- */
(function a11y(){
  // keyboard trap etc could go here
})();

/* ---------- Reduced motion support ---------- */
(function reduced(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.classList.add('reduced-motion');
  }
})();
