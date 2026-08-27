const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase
const SUPABASE_URL = 'https://ediqthdjnsrorcktldiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF0aGRqbnNyb3Jja3RsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDMxMzQsImV4cCI6MjEwMzIxOTEzNH0.uYsfs-T7qR-2krUushlPI0tDqONTYU1AIzEIud-_BNM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_BASE = '/newmarathiwebsite'; 
const FULL_SITE_URL = 'https://nitupatil.github.io' + SITE_BASE;
const INSTAGRAM_URL = 'https://instagram.com/vitthalspeaks';
const AVATAR_URL = 'https://i.ibb.co/BVw78vKq/394000910-240835825678358-5228163708350764536-n-removebg-preview.png';

// --- HELPERS ---
const escapeAttr = (str) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

function formatMarathiDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
  const date = String(d.getDate()).replace(/\d/g, x => '०१२३४५६७८९'[x]);
  const year = String(d.getFullYear()).replace(/\d/g, x => '०१२३४५६७८९'[x]);
  return `📅 ${date} ${months[d.getMonth()]} ${year}`;
}

const extractImg = (html) => {
  if (!html) return 'https://placehold.co/600x400?text=News';
  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return match ? match[1] : 'https://placehold.co/600x400?text=News';
};

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1].split('&')[0];
  else if (url.includes('embed/')) return url;
  return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : url;
}

// --- GLOBAL CSS ---
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&display=swap');
  
  :root {
    --primary: #002147; --accent-orange: #ff9800; --accent-red: #d32f2f;
    --bg-light: #f0f4f8; --card-bg: #ffffff; --text-main: #1e293b; --text-muted: #475569;
    --radius: 12px; --shadow: 0 4px 20px rgba(0,0,0,0.06); --hover-shadow: 0 12px 30px rgba(0,0,0,0.12);
  }

  body { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif; background: var(--bg-light); color: var(--text-main); margin: 0; padding: 0; line-height: 1.7; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  
  #progress-bar { position: fixed; top: 0; left: 0; height: 4px; background: var(--accent-orange); width: 0%; z-index: 9999; }

  /* --- HEADER & FLOATING VECTORS --- */
  .main-header { 
    background: linear-gradient(135deg, #ffffff 0%, #f4f7f9 100%); 
    padding: 15px 3%; 
    border-bottom: 2px solid var(--accent-orange); 
    box-shadow: 0 2px 15px rgba(0,0,0,0.08); 
    position: sticky; 
    top: 0; 
    z-index: 1000; 
    overflow: hidden; /* Contains floating vectors */
  }
  
  /* Floating Background Text */
  .floating-vector {
    position: absolute;
    color: rgba(0, 33, 71, 0.04);
    font-size: 2.5rem;
    font-weight: 800;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    z-index: 1;
  }
  .f-1 { top: -10px; left: 5%; animation: floatDrift 20s infinite alternate; }
  .f-2 { bottom: -15px; left: 30%; font-size: 3.5rem; animation: floatDrift 25s infinite alternate-reverse; }
  .f-3 { top: 20%; right: 10%; animation: floatDrift 22s infinite alternate; }
  .f-4 { top: 40%; right: 40%; font-size: 2rem; animation: floatDrift 18s infinite alternate-reverse; }
  .f-5 { bottom: 5%; right: -5%; font-size: 4rem; opacity: 0.5; animation: floatDrift 30s infinite alternate; }

  .header-container { width: 100%; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
  
  .custom-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .brand-avatar { width: 55px; height: 55px; border-radius: 50%; object-fit: cover; background: var(--primary); border: 2px solid var(--accent-orange); box-shadow: 0 4px 10px rgba(255,152,0,0.3); }
  
  /* Gradient Title Text */
  .brand-text { 
    font-family: 'Poppins', sans-serif; 
    font-size: 2.2rem; 
    font-weight: 800; 
    background: linear-gradient(90deg, var(--primary), #0056b3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px; 
    line-height: 1; 
    display: flex; 
    align-items: baseline; 
    gap: 4px; 
  }
  .brand-tld { font-size: 1rem; font-weight: 600; color: var(--accent-orange); -webkit-text-fill-color: var(--accent-orange); background: rgba(255,152,0,0.1); padding: 2px 6px; border-radius: 6px; }

  .header-right { display: flex; align-items: center; gap: 25px; flex-grow: 1; justify-content: flex-end; }
  .badges-container { display: flex; gap: 10px; }
  .brand-badge { background: linear-gradient(135deg, var(--primary) 0%, #003d80 100%); color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; animation: floatY 4s ease-in-out infinite; box-shadow: 0 4px 10px rgba(0,33,71,0.2); }
  
  /* Search Box */
  .search-wrapper { position: relative; width: 100%; max-width: 300px; }
  .search-input { width: 100%; padding: 10px 20px; border: 2px solid #e2e8f0; border-radius: 30px; outline: none; font-size: 0.95rem; font-family: inherit; transition: all 0.3s; background: rgba(255,255,255,0.8); backdrop-filter: blur(5px); box-sizing: border-box; }
  .search-input:focus { border-color: var(--accent-orange); background: #fff; box-shadow: 0 0 0 4px rgba(255,152,0,0.1); }
  .search-results { display: none; position: absolute; top: 45px; left: 0; right: 0; background: #fff; box-shadow: var(--hover-shadow); border-radius: 12px; max-height: 350px; overflow-y: auto; z-index: 1001; }
  .search-result-item { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; display: block; font-size: 0.9rem; font-weight: 600; color: var(--primary); }
  .search-result-item:hover { background: rgba(255,152,0,0.05); color: var(--accent-orange); }

  /* Navigation */
  .nav-bar { background: var(--primary); color: #fff; display: flex; justify-content: space-between; align-items: center; }
  .horizontal-nav { display: flex; padding: 0 3%; gap: 25px; }
  .horizontal-nav a { font-size: 1rem; font-weight: 600; padding: 12px 0; border-bottom: 3px solid transparent; transition: all 0.2s; }
  .horizontal-nav a:hover { color: var(--accent-orange); border-bottom-color: var(--accent-orange); }
  .datetime-box { padding: 12px 3%; font-size: 0.9rem; font-weight: 600; background: rgba(0,0,0,0.2); }

  /* Ticker */
  .ticker-wrap { display: flex; align-items: center; background: #fff; padding: 8px 3%; border-bottom: 1px solid #e2e8f0; font-size: 0.95rem; }
  .ticker-label { background: var(--accent-red); color: #fff; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-right: 20px; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .ticker-label .pulse { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: blink 1s infinite; }
  .ticker-move { display: inline-block; animation: ticker 25s linear infinite; white-space: nowrap; padding-left: 100%; }
  .ticker-item { margin-right: 40px; font-weight: 600; color: var(--text-main); }
  
  /* --- LAYOUT --- */
  .container { width: 96%; max-width: 1600px; margin: 30px auto; min-height: 70vh; }
  .section-title { font-size: 1.6rem; font-weight: 800; border-bottom: 3px solid var(--accent-orange); padding-bottom: 8px; margin: 0 0 25px; color: var(--primary); display: inline-block; }
  
  .article-layout { display: flex; flex-direction: column; gap: 30px; }
  .article-main { flex: 1; min-width: 0; }
  .article-sidebar { flex: 1; display: none; }
  
  @media (min-width: 1024px) {
    .article-layout { flex-direction: row; align-items: flex-start; }
    .article-main { flex: 3; } 
    .article-sidebar { flex: 1; min-width: 350px; max-width: 450px; display: block; position: sticky; top: 100px; max-height: calc(100vh - 120px); overflow-y: auto; padding-right: 15px; }
    .article-sidebar::-webkit-scrollbar { width: 6px; }
    .article-sidebar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
    .article-sidebar::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 10px; }
  }

  /* Grid & Cards */
  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
  .post-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.3s; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
  .post-card:hover { transform: translateY(-6px); box-shadow: var(--hover-shadow); }
  .card-img-wrap { height: 200px; overflow: hidden; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .post-card:hover .card-img-wrap img { transform: scale(1.08); }
  .card-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
  .card-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 12px; line-height: 1.4; color: var(--primary); }

  /* Article Details */
  .article-card { background: var(--card-bg); border-radius: var(--radius); padding: 40px 5%; box-shadow: var(--shadow); }
  .article-title { font-size: 2.8rem; font-weight: 800; color: var(--primary); line-height: 1.3; margin: 15px 0 20px; }
  .article-meta { font-size: 1rem; color: var(--text-muted); padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; margin-bottom: 30px; font-weight: 600; }
  .article-content { font-size: 1.25rem; line-height: 1.9; color: #334155; }
  .article-content img { width: 100%; max-width: 100%; height: auto; border-radius: 12px; margin: 25px 0; box-shadow: var(--shadow); }

  /* --- AD CAROUSEL --- */
  .ad-slider-container { width: 100%; background: #fff; border-radius: 12px; box-shadow: var(--shadow); padding: 15px; margin: 30px 0; border: 1px solid #e2e8f0; position: relative; overflow: hidden; text-align: center; }
  .ad-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px; font-weight: 700; letter-spacing: 1px; }
  .ad-slide { display: none; width: 100%; animation: fade 0.5s; }
  .ad-slide.active { display: block; }
  .ad-media-img { width: 100%; height: auto; max-height: 400px; object-fit: contain; border-radius: 8px; cursor: pointer; }
  .ad-media-yt { width: 100%; aspect-ratio: 16/9; border-radius: 8px; }
  .ad-dots { margin-top: 15px; display: flex; justify-content: center; gap: 8px; }
  .ad-dot { height: 10px; width: 10px; background-color: #cbd5e1; border-radius: 50%; cursor: pointer; transition: background-color 0.3s; }
  .ad-dot.active { background-color: var(--accent-orange); }

  /* Mobile Adjustments */
  @media (max-width: 768px) {
    .header-container { flex-direction: column; gap: 15px; }
    .header-right { width: 100%; justify-content: center; }
    .badges-container { display: none; }
    .search-wrapper { max-width: 100%; }
    .nav-bar { flex-direction: column; }
    .horizontal-nav { width: 100%; justify-content: space-between; padding: 0 15px; overflow-x: auto; }
    .horizontal-nav a { font-size: 0.95rem; padding: 10px 5px; }
    .datetime-box { width: 100%; text-align: center; padding: 8px; }
    .article-title { font-size: 1.8rem; }
    .article-content { font-size: 1.1rem; }
    .article-card { padding: 25px 20px; }
  }

  /* Animations */
  @keyframes fade { from { opacity: 0.4 } to { opacity: 1 } }
  @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
  @keyframes floatDrift { 0% { transform: translate(0, 0) rotate(0deg); } 100% { transform: translate(30px, 15px) rotate(2deg); } }
`;

// --- CLIENT SCRIPTS (Ad Logic & Time) ---
const generateGlobalScripts = (postsData) => `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const db = window.supabase.createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');
    async function trackBlogView(id) { await db.rpc('increment_blog_view', { row_id: id }); }
    async function trackAdView(id) { await db.rpc('increment_ad_view', { row_id: id }); }
    async function trackAdClick(id, url) { await db.rpc('increment_ad_click', { row_id: id }); if(url) window.open(url, '_blank'); }
    
    function updateLiveTime() {
      const el = document.getElementById('live-time');
      if(!el) return;
      const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const days = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const mHours = String(now.getHours() % 12 || 12).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const mMin = String(now.getMinutes()).padStart(2, '0').replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      el.innerText = \`\${days[now.getDay()]} | \${mHours}:\${mMin}\`;
    }
    setInterval(updateLiveTime, 1000); window.addEventListener('DOMContentLoaded', updateLiveTime);

    window.onscroll = function() {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const bar = document.getElementById("progress-bar");
      if(bar) bar.style.width = ((document.body.scrollTop || document.documentElement.scrollTop) / height) * 100 + "%";
    };

    const allPosts = ${JSON.stringify(postsData)};
    function handleSearch() {
      const input = document.getElementById('searchInput').value.toLowerCase();
      const resultsDiv = document.getElementById('searchResults');
      if (input.length < 2) { resultsDiv.style.display = 'none'; return; }
      const filtered = allPosts.filter(p => p.title.toLowerCase().includes(input));
      if (filtered.length > 0) {
        resultsDiv.innerHTML = filtered.slice(0, 6).map(p => \`<a href="${SITE_BASE}/\${p.slug}" class="search-result-item">\${p.title}</a>\`).join('');
      } else {
        resultsDiv.innerHTML = '<div class="search-result-item" style="color:red;">काहीही सापडले नाही...</div>';
      }
      resultsDiv.style.display = 'block';
    }
    document.addEventListener('click', e => { if (!e.target.closest('.search-wrapper')) document.getElementById('searchResults').style.display = 'none'; });

    // Ad Carousel Logic
    let slideIndex = 0;
    let slideInterval;
    function showSlides() {
      let slides = document.getElementsByClassName("ad-slide");
      let dots = document.getElementsByClassName("ad-dot");
      if(slides.length === 0) return;
      
      for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(" active", "");
        if(dots.length > 0) dots[i].className = dots[i].className.replace(" active", "");
      }
      slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1}    
      slides[slideIndex-1].className += " active";
      if(dots.length > 0) dots[slideIndex-1].className += " active";

      let hasIframe = slides[slideIndex-1].querySelector('iframe');
      let delay = hasIframe ? 60000 : 5000; // 60s for video, 5s for image
      
      clearTimeout(slideInterval);
      slideInterval = setTimeout(showSlides, delay);
    }
    function currentSlide(n) {
      slideIndex = n - 1;
      clearTimeout(slideInterval);
      showSlides();
    }
    window.addEventListener('DOMContentLoaded', () => { if(document.getElementsByClassName("ad-slide").length > 0) showSlides(); });
  </script>
`;

// --- HTML COMPONENTS ---
const generateSEO = (title, pathStr) => `<title>${escapeAttr(title)}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/png" href="${AVATAR_URL}">`;

const generateHeader = () => `
  <div id="progress-bar"></div>
  <header class="main-header">
    
    <!-- Floating Background Marathi Vectors -->
    <div class="floating-vector f-1">माहिती</div>
    <div class="floating-vector f-2">शासकीय योजना</div>
    <div class="floating-vector f-3">माझा हक्क</div>
    <div class="floating-vector f-4">नोकरी</div>
    <div class="floating-vector f-5">शासन आपल्या दारी</div>

    <div class="header-container">
      <a href="${SITE_BASE}/" class="custom-brand">
        <img src="${AVATAR_URL}" alt="Vitthal Speaks Avatar" class="brand-avatar">
        <div class="brand-text">VitthalSpeaks<span class="brand-tld">.com</span></div>
      </a>
      
      <div class="header-right">
        <div class="search-wrapper">
          <input type="text" id="searchInput" class="search-input" placeholder="🔍 वेबसाइटवर शोधा..." onkeyup="handleSearch()">
          <div id="searchResults" class="search-results"></div>
        </div>
        <div class="badges-container">
          <span class="brand-badge" style="animation-delay: 0s;">माहिती</span>
          <span class="brand-badge" style="animation-delay: 0.3s;">शासकीय योजना</span>
          <span class="brand-badge" style="animation-delay: 0.6s;">नोकरी</span>
          <span class="brand-badge" style="animation-delay: 0.9s;">शिक्षण</span>
          <span class="brand-badge" style="animation-delay: 1.2s;">बातम्या</span>
        </div>
      </div>
    </div>
  </header>
  <div class="nav-bar">
    <div class="horizontal-nav">
      <a href="${SITE_BASE}/">🏠 मुख्यपृष्ठ | Home</a>
      <a href="${SITE_BASE}/contact">📞 संपर्क | Contact</a>
      <a href="${SITE_BASE}/privacy-policy">🔒 गोपनीयता | Privacy</a>
    </div>
    <div class="datetime-box">🕒 <span id="live-time">लोड होत आहे...</span></div>
  </div>
`;

const generateAdCarousel = (ads, location, postSlug = null) => {
  if (!ads || ads.length === 0) return '';
  const activeAds = ads.filter(ad => {
    const rule = ad.display_rule || 'all';
    if (rule === 'all') return true;
    if (location === 'home' && (rule === 'home_only' || rule === 'home_and_post')) return true;
    if (location === 'post' && (rule === 'specific_post' || rule === 'home_and_post')) {
      if (rule === 'specific_post' && ad.target_slug !== postSlug) return false;
      return true;
    }
    return false;
  });

  if (activeAds.length === 0) return '';
  let slidesHtml = activeAds.map((ad, i) => {
    let media = ad.media_type === 'youtube' 
      ? `<iframe class="ad-media-yt" src="${getYouTubeEmbedUrl(ad.media_url)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : `<img src="${escapeAttr(ad.media_url)}" class="ad-media-img" onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.target_url) || ''}')">`;
    return `<div class="ad-slide">${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
  }).join('');
  let dotsHtml = activeAds.length > 1 ? `<div class="ad-dots">` + activeAds.map((_, i) => `<span class="ad-dot" onclick="currentSlide(${i + 1})"></span>`).join('') + `</div>` : '';

  return `<div class="ad-slider-container"><div class="ad-label">प्रायोजित (Sponsored)</div>${slidesHtml}${dotsHtml}</div>`;
};

// --- CORE BUILDER ---
async function buildSite() {
  const rootPath = __dirname;
  const { data: posts } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  const minimalSearchData = posts ? posts.map(p => ({ title: p.title, slug: p.slug })) : [];
  const dynamicScripts = generateGlobalScripts(minimalSearchData);
  const headerNavHtml = generateHeader();

  // 1. Generate Individual Posts
  if (posts) {
    posts.forEach((post) => {
      const postAdsHtml = generateAdCarousel(ads, 'post', post.slug);
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 6).map(p => `
        <a href="${SITE_BASE}/${p.slug}" class="post-card" style="margin-bottom: 20px; border-radius: 10px;">
          <div class="card-img-wrap" style="height: 120px;"><img src="${extractImg(p.content)}"></div>
          <div class="card-content" style="padding: 12px;">
            <h4 style="font-size: 1.05rem; margin:0 0 5px; color:var(--text-main);">${escapeAttr(p.title)}</h4>
            <span style="font-size:0.85rem; color:var(--text-muted);">${formatMarathiDate(p.published_at || p.created_at)}</span>
          </div>
        </a>`).join('');

      const postHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
        ${generateSEO(post.title, `/${post.slug}`)}<style>${globalCSS}</style>${dynamicScripts}</head>
        <body>${headerNavHtml}
        <div class="container article-layout">
          <div class="article-main">
            <div class="article-card">
              <h1 class="article-title">${post.title}</h1>
              <div class="article-meta">📅 प्रकाशित: ${formatMarathiDate(post.published_at || post.created_at)}</div>
              <div class="article-content">${post.content}</div>
            </div>
            ${postAdsHtml}
          </div>
          <div class="article-sidebar"><h3 class="section-title" style="margin-top:0;">📌 संबंधित बातम्या</h3>${relatedHtml}</div>
        </div>
        <script>window.addEventListener('DOMContentLoaded', () => trackBlogView(${post.id}));</script>
        </body></html>`;
      fs.writeFileSync(path.join(rootPath, `${post.slug}.html`), postHtml);
    });
  }

  // 2. Generate Home Page
  if (posts && posts.length > 0) {
    const homeAdsHtml = generateAdCarousel(ads, 'home');
    const tickerItems = posts.slice(0, 5).map(p => `<a href="${SITE_BASE}/${p.slug}" class="ticker-item">${escapeAttr(p.title)} •</a>`).join(' ');
    const tickerHtml = `<div class="ticker-wrap"><div class="ticker-label"><div class="pulse"></div> ताज्या बातम्या :</div><div style="overflow: hidden; flex-grow: 1;"><div class="ticker-move">${tickerItems} ${tickerItems}</div></div></div>`;

    let homeCards = posts.map(p => `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${extractImg(p.content)}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content">
          <h3 class="card-title">${escapeAttr(p.title)}</h3>
          <div style="margin-top:auto; font-size: 0.9rem; color:var(--text-muted); font-weight:600;">${formatMarathiDate(p.published_at || p.created_at)}</div>
        </div>
      </a>`).join('');

    const indexHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
      ${generateSEO("Vitthal Speaks", "/")}<style>${globalCSS}</style>${dynamicScripts}</head>
      <body>${headerNavHtml}${tickerHtml}<div class="container">${homeAdsHtml}<h2 class="section-title">📰 ताज्या पोस्ट</h2><div class="news-grid">${homeCards}</div></div></body></html>`;
    fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);
  }

  // 3. Generate 404 Page (With Suggested Posts)
  let suggestedHtml = '';
  if (posts && posts.length > 0) {
    suggestedHtml = posts.slice(0, 3).map(p => `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${extractImg(p.content)}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content"><h3 class="card-title">${escapeAttr(p.title)}</h3></div>
      </a>`).join('');
  }
  
  const notFoundHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
    ${generateSEO("Page Not Found", "/404")}<style>${globalCSS}</style>${dynamicScripts}</head>
    <body>${headerNavHtml}
    <div class="container" style="text-align: center; max-width: 800px; padding: 60px 20px;">
      <h1 style="color: var(--accent-red); font-size: 5rem; margin: 0; line-height:1;">४०४</h1>
      <h2 style="font-size: 2rem; color: var(--primary);">माफ करा, ही पोस्ट उपलब्ध नाही.</h2>
      <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 40px;">तुम्ही शोधत असलेली पोस्ट डिलीट केली गेली असू शकते किंवा लिंक चुकीची असू शकते.</p>
      <a href="${SITE_BASE}/" style="background: var(--primary); color: white; padding: 12px 30px; border-radius: 30px; font-weight: 700; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(0,33,71,0.3);">मुख्यपृष्ठावर परत जा</a>
    </div>
    <div class="container"><h3 class="section-title">📌 नवीनतम लेख वाचा</h3><div class="news-grid">${suggestedHtml}</div></div>
    </body></html>`;
  fs.writeFileSync(path.join(rootPath, '404.html'), notFoundHtml);
}

buildSite();
