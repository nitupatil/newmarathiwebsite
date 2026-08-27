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
  if (!html) return 'https://placehold.co/300x200?text=News';
  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return match ? match[1] : 'https://placehold.co/300x200?text=News';
};

// YouTube Link Converter for Ads
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1].split('&')[0];
  else if (url.includes('embed/')) return url;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// --- GLOBAL CSS (Clean, Professional, Animated) ---
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Poppins:wght@400;600;700&display=swap');
  
  :root {
    --primary: #002147; --accent-orange: #ff9800; --accent-red: #d32f2f;
    --bg-light: #f4f7f9; --card-bg: #ffffff; --text-main: #1e293b; --text-muted: #64748b;
    --radius: 12px; --shadow: 0 4px 15px rgba(0,0,0,0.05); --hover-shadow: 0 12px 30px rgba(0,0,0,0.12);
  }

  body { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif; background: var(--bg-light); color: var(--text-main); margin: 0; padding: 0; line-height: 1.6; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  
  /* Reading Progress Bar */
  #progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent-orange); width: 0%; z-index: 9999; }

  /* Compact Header */
  .main-header { background: #fff; padding: 10px 20px; border-bottom: 2px solid var(--accent-orange); box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000; }
  .header-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  
  .logo-img { height: 45px; width: auto; max-width: 200px; object-fit: contain; }
  
  .header-right { display: flex; align-items: center; gap: 20px; }
  .badges-container { display: flex; gap: 8px; }
  .brand-badge { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; transition: transform 0.2s; animation: floatY 4s ease-in-out infinite; }
  
  /* Search Box in Header */
  .search-wrapper { position: relative; }
  .search-input { padding: 6px 16px; border: 1px solid #cbd5e1; border-radius: 20px; outline: none; font-size: 0.85rem; width: 180px; transition: all 0.3s; background: #f8fafc; }
  .search-input:focus { border-color: var(--accent-orange); width: 220px; background: #fff; }
  .search-results { display: none; position: absolute; top: 35px; right: 0; width: 280px; background: #fff; box-shadow: var(--hover-shadow); border-radius: 8px; max-height: 300px; overflow-y: auto; z-index: 1001; }
  .search-result-item { padding: 10px; border-bottom: 1px solid #f1f5f9; display: block; font-size: 0.85rem; font-weight: 600; color: var(--primary); }
  .search-result-item:hover { background: #f8fafc; color: var(--accent-orange); }

  /* Date/Time Bar & Navigation */
  .nav-bar { background: var(--primary); color: #fff; padding: 0; display: flex; justify-content: space-between; align-items: center; }
  .datetime-box { padding: 8px 20px; font-size: 0.85rem; font-weight: 600; background: rgba(0,0,0,0.2); }
  .horizontal-nav { display: flex; padding: 8px 20px; gap: 20px; }
  .horizontal-nav a { font-size: 0.9rem; font-weight: 600; opacity: 0.9; transition: opacity 0.2s; white-space: nowrap; }
  .horizontal-nav a:hover { opacity: 1; color: var(--accent-orange); }

  /* Ticker */
  .ticker-wrap { display: flex; align-items: center; background: #fff; padding: 6px 15px; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
  .ticker-label { background: var(--accent-red); color: #fff; font-weight: bold; padding: 2px 8px; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; gap: 5px; }
  .ticker-label .pulse { width: 6px; height: 6px; background: #fff; border-radius: 50%; animation: blink 1s infinite; }
  .ticker-move { display: inline-block; animation: ticker 25s linear infinite; white-space: nowrap; padding-left: 100%; }
  .ticker-item { margin-right: 30px; font-weight: 600; color: var(--text-main); }
  
  /* Layout */
  .container { max-width: 1200px; margin: 20px auto; padding: 0 15px; }
  .section-title { font-size: 1.3rem; font-weight: 700; border-bottom: 2px solid var(--accent-orange); padding-bottom: 5px; margin: 30px 0 15px; color: var(--primary); display: inline-block; }
  
  /* YouTube Layout */
  .article-layout { display: flex; flex-direction: column; gap: 20px; }
  .article-main { flex: 1; }
  .article-sidebar { flex: 1; display: none; }
  
  @media (min-width: 992px) {
    .article-layout { flex-direction: row; align-items: flex-start; }
    .article-main { flex: 2.5; max-width: calc(100% - 320px); }
    .article-sidebar { flex: 1; display: block; position: sticky; top: 90px; max-height: calc(100vh - 110px); overflow-y: auto; }
  }

  /* Animated Post Cards */
  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
  .post-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); position: relative; transition: transform 0.3s; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
  .post-card:hover { transform: translateY(-5px); box-shadow: var(--hover-shadow); }
  
  /* Card Shine Animation */
  .post-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); transform: skewX(-25deg); z-index: 2; transition: none; }
  .post-card:hover::before { animation: shine 0.8s; }

  .card-img-wrap { height: 160px; overflow: hidden; position: relative; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .post-card:hover .card-img-wrap img { transform: scale(1.08); }
  
  .card-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
  .card-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 10px; line-height: 1.4; color: var(--primary); }
  
  /* Ads Rendering (Perfect Size & Embeds) */
  .ad-unit { margin: 25px auto; text-align: center; cursor: pointer; display: block; max-width: 100%; background: #fff; padding: 10px; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid #f1f5f9; }
  .ad-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
  .ad-media-img { width: 100%; height: auto; max-height: 300px; object-fit: contain; border-radius: 8px; }
  .ad-media-yt { width: 100%; aspect-ratio: 16/9; border-radius: 8px; box-shadow: inset 0 0 10px rgba(0,0,0,0.1); }

  /* Mobile Adjustments */
  @media (max-width: 768px) {
    .header-container { flex-direction: column; gap: 10px; }
    .header-right { width: 100%; justify-content: space-between; }
    .search-input { width: 140px; }
    .badges-container { display: none; } /* Hide badges on mobile header to save space */
    
    /* Force Mobile Nav onto ONE horizontal line */
    .nav-bar { flex-direction: column; align-items: stretch; }
    .datetime-box { text-align: center; }
    .horizontal-nav { display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 15px; padding: 10px; overflow-x: auto; flex-wrap: nowrap; }
    .horizontal-nav::-webkit-scrollbar { display: none; } /* Hide scrollbar if slightly too wide */
    .horizontal-nav a { font-size: 0.95rem; }
  }

  /* Animations */
  @keyframes shine { 100% { left: 200%; } }
  @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
`;

// --- CLIENT SCRIPTS ---
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
      const dayName = days[now.getDay()];
      const mHours = String(now.getHours() % 12 || 12).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const mMin = String(now.getMinutes()).padStart(2, '0').replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      el.innerText = \`\${dayName} | \${mHours}:\${mMin}\`;
    }
    setInterval(updateLiveTime, 1000); window.addEventListener('DOMContentLoaded', updateLiveTime);

    window.onscroll = function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const bar = document.getElementById("progress-bar");
      if(bar) bar.style.width = (winScroll / height) * 100 + "%";
    };

    const allPosts = ${JSON.stringify(postsData)};
    function handleSearch() {
      const input = document.getElementById('searchInput').value.toLowerCase();
      const resultsDiv = document.getElementById('searchResults');
      if (input.length < 2) { resultsDiv.style.display = 'none'; return; }
      const filtered = allPosts.filter(p => p.title.toLowerCase().includes(input));
      if (filtered.length > 0) {
        resultsDiv.innerHTML = filtered.slice(0, 5).map(p => \`<a href="${SITE_BASE}/\${p.slug}" class="search-result-item">\${p.title}</a>\`).join('');
      } else {
        resultsDiv.innerHTML = '<div class="search-result-item" style="color:red;">काहीही सापडले नाही...</div>';
      }
      resultsDiv.style.display = 'block';
    }
    document.addEventListener('click', function(e) {
      if (!document.querySelector('.search-wrapper').contains(e.target)) document.getElementById('searchResults').style.display = 'none';
    });
  </script>
`;

// --- UI COMPONENTS ---
const generateSEO = (title, pathStr) => `<title>${escapeAttr(title)}</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/jpeg" href="https://i.ibb.co/SwTxjYrw/394000910-240835825678358-5228163708350764536-n.jpg">`;

const generateHeader = () => `
  <div id="progress-bar"></div>
  <header class="main-header">
    <div class="header-container">
      <a href="${SITE_BASE}/"><img src="https://i.ibb.co/JWXdjnf7/Chat-GPT-Image-Aug-21-2026-08-02-54-PM.png" alt="Vitthal Speaks" class="logo-img"></a>
      <div class="header-right">
        <div class="search-wrapper">
          <input type="text" id="searchInput" class="search-input" placeholder="🔍 शोधा..." onkeyup="handleSearch()">
          <div id="searchResults" class="search-results"></div>
        </div>
        <div class="badges-container">
          <span class="brand-badge" style="animation-delay: 0s;">माहिती</span>
          <span class="brand-badge" style="animation-delay: 0.2s;">योजना</span>
          <span class="brand-badge" style="animation-delay: 0.4s;">नोकरी</span>
        </div>
      </div>
    </div>
  </header>
  <div class="nav-bar">
    <div class="horizontal-nav">
      <a href="${SITE_BASE}/">🏠 मुख्यपृष्ठ</a>
      <a href="${SITE_BASE}/contact">📞 संपर्क</a>
      <a href="${SITE_BASE}/privacy-policy">🔒 गोपनीयता</a>
    </div>
    <div class="datetime-box">🕒 <span id="live-time">लोड...</span></div>
  </div>
`;

// AD TARGETING LOGIC
const getAdsForLocation = (ads, location, postSlug = null) => {
  if (!ads) return '';
  // Filtering logic for the upcoming admin panel feature
  const filteredAds = ads.filter(ad => {
    const rule = ad.display_rule || 'all'; // Default to all if column doesn't exist yet
    if (rule === 'all') return true;
    if (location === 'home' && (rule === 'home_only' || rule === 'home_and_post')) return true;
    if (location === 'post' && (rule === 'specific_post' || rule === 'home_and_post')) {
      if (rule === 'specific_post' && ad.target_slug !== postSlug) return false;
      return true;
    }
    return false;
  });

  return filteredAds.map(ad => {
    let media = ad.media_type === 'youtube' 
      ? `<iframe class="ad-media-yt" src="${getYouTubeEmbedUrl(ad.media_url)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : `<img src="${escapeAttr(ad.media_url)}" class="ad-media-img">`;
    return `<div class="ad-unit" onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.target_url) || ''}')"><div class="ad-label">प्रायोजित (Sponsored)</div>${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
  }).join('');
};

// --- BUILD CORE ---
async function buildSite() {
  const rootPath = __dirname;
  const { data: posts } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  // Ensure we only fetch ads that haven't been deleted from the database
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  const minimalSearchData = posts ? posts.map(p => ({ title: p.title, slug: p.slug })) : [];
  const dynamicScripts = generateGlobalScripts(minimalSearchData);
  const headerNavHtml = generateHeader();

  // Individual Posts
  if (posts) {
    posts.forEach((post) => {
      const postAdsHtml = getAdsForLocation(ads, 'post', post.slug);
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 5).map(p => `
        <a href="${SITE_BASE}/${p.slug}" class="post-card" style="margin-bottom: 15px; border-radius: 8px;">
          <div class="card-img-wrap" style="height: 100px;"><img src="${extractImg(p.content)}"></div>
          <div class="card-content" style="padding: 10px;">
            <h4 style="font-size: 0.95rem; margin:0; color:var(--text-main);">${escapeAttr(p.title)}</h4>
          </div>
        </a>`).join('');

      const postHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
        ${generateSEO(post.title, `/${post.slug}`)}<style>${globalCSS}</style>${dynamicScripts}</head>
        <body>${headerNavHtml}
        <div class="container article-layout">
          <div class="article-main">
            <div style="background:var(--card-bg); padding:30px; border-radius:12px; box-shadow:var(--shadow);">
              <h1 style="font-size: 2rem; color:var(--primary); margin:0 0 10px;">${post.title}</h1>
              <div style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">📅 प्रकाशित: ${formatMarathiDate(post.published_at || post.created_at)}</div>
              <div style="font-size: 1.1rem; line-height: 1.8; color: #334155;">${post.content}</div>
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

  // Home Page
  if (posts && posts.length > 0) {
    const homeAdsHtml = getAdsForLocation(ads, 'home');
    let homeCards = posts.map(p => `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${extractImg(p.content)}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content">
          <h3 class="card-title">${escapeAttr(p.title)}</h3>
          <div style="margin-top:auto; font-size: 0.8rem; color:#94a3b8;">${formatMarathiDate(p.published_at || p.created_at)}</div>
        </div>
      </a>`).join('');

    const indexHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
      ${generateSEO("Vitthal Speaks - होम", "/")}<style>${globalCSS}</style>${dynamicScripts}</head>
      <body>${headerNavHtml}<div class="container">${homeAdsHtml}<h2 class="section-title">📰 ताज्या बातम्या</h2><div class="news-grid">${homeCards}</div></div></body></html>`;
    fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);
  }
}
buildSite();
