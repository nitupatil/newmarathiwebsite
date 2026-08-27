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

// Helpers
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

// --- GLOBAL CSS ---
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;600;700;800&family=Poppins:wght@400;600;700&display=swap');
  
  :root {
    --primary: #002147; --accent-orange: #ff9800; --accent-red: #d32f2f;
    --bg-light: #f8fafc; --card-bg: #ffffff; --text-main: #1e293b; --text-muted: #64748b;
    --radius: 12px; --shadow: 0 4px 15px rgba(0,0,0,0.06); --hover-shadow: 0 10px 25px rgba(0,0,0,0.12);
  }

  body { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif; background: var(--bg-light); color: var(--text-main); margin: 0; padding: 0; line-height: 1.7; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  
  /* Reading Progress Bar */
  #progress-bar { position: fixed; top: 0; left: 0; height: 4px; background: var(--accent-orange); width: 0%; z-index: 9999; transition: width 0.1s; }

  /* Header & Branding */
  .main-header { background: #fff; text-align: center; padding: 20px; border-bottom: 2px solid var(--accent-orange); }
  .logo-img { width: 100%; max-width: 350px; height: auto; max-height: 120px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); animation: pulseGlow 3s infinite; }
  .badges-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 15px; }
  .brand-badge { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }

  /* Date/Time Bar */
  .datetime-bar { background: var(--primary); color: #fff; text-align: center; padding: 6px 10px; font-size: 0.9rem; font-weight: 600; }
  
  /* Navigation & Search */
  nav { background: #fff; padding: 12px 20px; display: flex; justify-content: center; align-items: center; gap: 20px; position: sticky; top: 0; z-index: 1000; box-shadow: var(--shadow); flex-wrap: wrap; }
  nav a { color: var(--text-main); font-weight: 600; font-size: 1rem; padding: 6px 14px; border-radius: 8px; transition: all 0.3s; white-space: nowrap; }
  nav a:hover { background: rgba(255, 152, 0, 0.15); color: var(--accent-orange); }
  
  .search-wrapper { position: relative; display: flex; align-items: center; }
  .search-input { padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 20px; outline: none; font-family: inherit; width: 220px; transition: border-color 0.3s; }
  .search-input:focus { border-color: var(--accent-orange); }
  .search-results { display: none; position: absolute; top: 40px; right: 0; width: 300px; background: #fff; box-shadow: var(--hover-shadow); border-radius: 8px; max-height: 350px; overflow-y: auto; z-index: 1001; text-align: left; }
  .search-result-item { padding: 10px 15px; border-bottom: 1px solid #f1f5f9; display: block; font-size: 0.9rem; color: var(--primary); font-weight: 600; }
  .search-result-item:hover { background: #f8fafc; color: var(--accent-orange); }

  /* Ticker */
  .ticker-wrap { display: flex; align-items: center; background: #fff; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; overflow: hidden; white-space: nowrap; }
  .ticker-label { background: var(--accent-red); color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 0.9rem; margin-right: 15px; z-index: 2; display: flex; align-items: center; gap: 5px; }
  .ticker-label .pulse { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: blink 1s infinite; }
  .ticker-move { display: inline-block; animation: ticker 25s linear infinite; padding-left: 100%; }
  .ticker-wrap:hover .ticker-move { animation-play-state: paused; }
  .ticker-item { margin-right: 30px; font-weight: 600; font-size: 1rem; color: var(--text-main); }
  .ticker-item:hover { color: var(--accent-orange); }

  /* Main Layout */
  .container { max-width: 1200px; margin: 25px auto; padding: 0 16px; min-height: 70vh; }
  .section-title { font-size: 1.5rem; font-weight: 800; border-bottom: 3px solid var(--accent-orange); padding-bottom: 8px; margin: 40px 0 20px; color: var(--primary); display: inline-block; }
  
  /* YouTube Style Desktop Post Layout */
  .article-layout { display: flex; flex-direction: column; gap: 30px; }
  .article-main { flex: 1; }
  .article-sidebar { flex: 1; display: none; } /* Hidden on mobile by default */
  
  @media (min-width: 992px) {
    .article-layout { flex-direction: row; align-items: flex-start; }
    .article-main { flex: 2.5; max-width: calc(100% - 380px); }
    .article-sidebar { flex: 1; display: block; position: sticky; top: 90px; max-height: calc(100vh - 110px); overflow-y: auto; padding-right: 10px; }
    
    /* Custom Scrollbar for Sidebar */
    .article-sidebar::-webkit-scrollbar { width: 6px; }
    .article-sidebar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
    .article-sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .article-sidebar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  }

  /* Cards & Articles */
  .article-card { background: var(--card-bg); border-radius: var(--radius); padding: 35px; box-shadow: var(--shadow); }
  .article-title { font-size: 2.2rem; font-weight: 800; color: var(--primary); line-height: 1.3; margin: 15px 0 20px; }
  .article-meta { display: flex; gap: 20px; color: var(--text-muted); font-size: 0.95rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
  .article-content { font-size: 1.15rem; line-height: 1.8; color: #334155; }
  .article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }

  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .post-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column; transition: all 0.3s; border: 1px solid #f1f5f9; }
  .post-card:hover { transform: translateY(-4px); box-shadow: var(--hover-shadow); }
  .card-img-wrap { height: 180px; overflow: hidden; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .post-card:hover .card-img-wrap img { transform: scale(1.05); }
  .card-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
  .card-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 10px; line-height: 1.4; color: var(--primary); }
  
  /* Fix for Ads - Ensures Image takes space and is highly visible */
  .ad-unit { margin: 30px auto; text-align: center; cursor: pointer; display: block; max-width: 728px; background: #fff; padding: 10px; border-radius: 12px; box-shadow: var(--shadow); }
  .ad-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
  .ad-media { width: 100%; height: auto; min-height: 100px; max-height: 300px; object-fit: contain; border-radius: 8px; display: block; }

  /* Share Section & Footer */
  .share-section { margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; }
  .share-buttons { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 15px; }
  .share-btn { padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; color: #fff; cursor: pointer; border: none; }
  .btn-wa { background: #25D366; } .btn-ig { background: #E1306C; } .btn-share { background: var(--primary); } .btn-copy { background: #475569; }
  
  footer { background: var(--primary); color: #fff; text-align: center; padding: 40px 20px; margin-top: 60px; }
  
  /* Animations */
  @keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 152, 0, 0.1)); } 50% { filter: drop-shadow(0 0 15px rgba(255, 152, 0, 0.3)); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
  
  @media (max-width: 768px) {
    .main-header { padding: 15px; }
    .search-input { width: 150px; }
    .article-card { padding: 20px 15px; }
    .article-title { font-size: 1.7rem; }
    nav { gap: 10px; }
  }
`;

// --- CLIENT-SIDE SCRIPTS ---
const generateGlobalScripts = (postsData) => `
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5T2TC3J4G2"></script>
  <script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-5T2TC3J4G2');</script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const db = window.supabase.createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');
    async function trackBlogView(id) { await db.rpc('increment_blog_view', { row_id: id }); }
    async function trackAdView(id) { await db.rpc('increment_ad_view', { row_id: id }); }
    async function trackAdClick(id, url) { await db.rpc('increment_ad_click', { row_id: id }); if(url) window.open(url, '_blank'); }
    
    // Live Marathi Time
    function updateLiveTime() {
      const el = document.getElementById('live-time');
      if(!el) return;
      const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const days = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
      
      const dayName = days[now.getDay()];
      const dayNum = String(now.getDate()).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const month = months[now.getMonth()];
      const year = String(now.getFullYear()).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      
      let hours = now.getHours();
      let ampm = 'सकाळी';
      if (hours >= 12 && hours < 17) ampm = 'दुपारी';
      else if (hours >= 17 && hours < 20) ampm = 'संध्याकाळी';
      else if (hours >= 20 || hours < 4) ampm = 'रात्री';
      
      hours = hours % 12 || 12;
      const mHours = String(hours).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const mMin = String(now.getMinutes()).padStart(2, '0').replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      
      el.innerText = \`\${dayName}, \${dayNum} \${month} \${year} | \${ampm} \${mHours}:\${mMin}\`;
    }
    setInterval(updateLiveTime, 1000);
    window.addEventListener('DOMContentLoaded', updateLiveTime);

    // Reading Progress Bar
    window.onscroll = function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const bar = document.getElementById("progress-bar");
      if(bar) bar.style.width = scrolled + "%";
    };

    // Instant Search Logic (Runs entirely on frontend without database)
    const allPosts = ${JSON.stringify(postsData)};
    function handleSearch() {
      const input = document.getElementById('searchInput').value.toLowerCase();
      const resultsDiv = document.getElementById('searchResults');
      if (input.length < 2) {
        resultsDiv.style.display = 'none';
        return;
      }
      
      const filtered = allPosts.filter(p => p.title.toLowerCase().includes(input));
      if (filtered.length > 0) {
        resultsDiv.innerHTML = filtered.slice(0, 8).map(p => 
          \`<a href="${SITE_BASE}/\${p.slug}" class="search-result-item">\${p.title}</a>\`
        ).join('');
        resultsDiv.style.display = 'block';
      } else {
        resultsDiv.innerHTML = '<div class="search-result-item" style="color:red;">काहीही सापडले नाही...</div>';
        resultsDiv.style.display = 'block';
      }
    }
    
    // Hide search when clicking outside
    document.addEventListener('click', function(event) {
      const searchContainer = document.querySelector('.search-wrapper');
      const resultsDiv = document.getElementById('searchResults');
      if (searchContainer && !searchContainer.contains(event.target)) {
        resultsDiv.style.display = 'none';
      }
    });

    // Share Functions
    function copyCurrentLink() { navigator.clipboard.writeText(window.location.href); alert("लिंक कॉपी झाली!"); }
    function shareWhatsApp(title) { window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(title + " - येथे वाचा: ") + encodeURIComponent(window.location.href), '_blank'); }
    async function webShare(title) { if (navigator.share) { await navigator.share({ title: title, url: window.location.href }); } else { copyCurrentLink(); } }
  </script>
`;

// --- UI COMPONENTS ---
const generateSEO = (title, desc, img, pathStr) => `
  <title>${escapeAttr(title)}</title>
  <meta name="description" content="${escapeAttr(desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${FULL_SITE_URL}${pathStr}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(desc)}">
  <meta property="og:image" content="${escapeAttr(img)}">
  <meta property="og:url" content="${FULL_SITE_URL}${pathStr}">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/jpeg" href="https://i.ibb.co/SwTxjYrw/394000910-240835825678358-5228163708350764536-n.jpg">
`;

const generateHeader = () => `
  <div id="progress-bar"></div>
  <header class="main-header">
    <a href="${SITE_BASE}/"><img src="https://i.ibb.co/JWXdjnf7/Chat-GPT-Image-Aug-21-2026-08-02-54-PM.png" alt="Vitthal Speaks" class="logo-img"></a>
    <div class="badges-container">
      <span class="brand-badge">माहिती</span> <span class="brand-badge">शासकीय योजना</span> <span class="brand-badge">नोकरी</span> <span class="brand-badge">शिक्षण</span> <span class="brand-badge">बातम्या</span>
    </div>
  </header>
  <div class="datetime-bar"><span>🕒</span> <span id="live-time">लोड होत आहे...</span></div>
`;

const generateNav = () => `
  <nav>
    <a href="${SITE_BASE}/">🏠 मुख्यपृष्ठ | Home</a>
    <a href="${SITE_BASE}/contact">📞 संपर्क | Contact</a>
    <a href="${SITE_BASE}/privacy-policy">🔒 गोपनीयता धोरण | Privacy</a>
    <div class="search-wrapper">
      <input type="text" id="searchInput" class="search-input" placeholder="🔍 वेबसाइटवर शोधा..." onkeyup="handleSearch()">
      <div id="searchResults" class="search-results"></div>
    </div>
  </nav>
`;

const generateTicker = (posts) => {
  if (!posts || posts.length === 0) return '';
  const tickerItems = posts.slice(0, 5).map(p => `<a href="${SITE_BASE}/${p.slug}" class="ticker-item">${escapeAttr(p.title)} •</a>`).join(' ');
  return `<div class="ticker-wrap"><div class="ticker-label"><div class="pulse"></div> ताज्या पोस्ट :</div><div style="overflow: hidden; flex-grow: 1;"><div class="ticker-move">${tickerItems} ${tickerItems}</div></div></div>`;
};

const generateAd = (ads) => {
  if (!ads || ads.length === 0) return '';
  const ad = ads[0];
  let media = ad.media_type === 'youtube' 
    ? `<iframe width="100%" height="250" src="${escapeAttr(ad.media_url)}" frameborder="0" style="border-radius:8px; max-width:728px; display:block; margin:0 auto;"></iframe>`
    : `<img src="${escapeAttr(ad.media_url)}" class="ad-media">`;
  return `<div class="ad-unit" onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.target_url) || ''}')"><div class="ad-label">Advertisement</div>${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
};

// --- BUILD CORE ---
async function buildSite() {
  const rootPath = __dirname;
  const { data: posts } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  // Prepare search data for client side
  const minimalSearchData = posts ? posts.map(p => ({ title: p.title, slug: p.slug })) : [];
  const dynamicScripts = generateGlobalScripts(minimalSearchData);

  const adHtml = generateAd(ads);
  const headerNavHtml = generateHeader() + generateNav() + generateTicker(posts);

  // Generate Individual Posts (YouTube Layout)
  if (posts) {
    posts.forEach((post, index) => {
      const isFeatured = index === 0;
      
      // Right Sidebar: Related posts
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 6).map(p => `
        <a href="${SITE_BASE}/${p.slug}" class="post-card" style="margin-bottom: 15px; border:none; border-bottom:1px solid #eee; box-shadow:none; border-radius:0;">
          <div class="card-img-wrap" style="height: 120px; border-radius:8px;"><img src="${extractImg(p.content)}"></div>
          <div class="card-content" style="padding: 10px 0;">
            <h4 style="font-size: 1rem; margin:0; color:var(--text-main);">${escapeAttr(p.title)}</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">${formatMarathiDate(p.published_at || p.created_at)}</span>
          </div>
        </a>
      `).join('');

      const postHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${generateSEO(post.title, post.excerpt, extractImg(post.content), `/${post.slug}`)}
        <style>${globalCSS}</style>${dynamicScripts}</head>
        <body>${headerNavHtml}
        <div class="container article-layout">
          <div class="article-main">
            <div class="breadcrumb">मुख्यपृष्ठ → ब्लॉग → ${escapeAttr(post.title)}</div>
            <div class="article-card">
              ${isFeatured ? '<span class="brand-badge" style="background:var(--accent-orange); color:white;">⭐ विशेष पोस्ट</span>' : ''}
              <h1 class="article-title">${post.title}</h1>
              <div class="article-meta"><span>📅 प्रकाशित: ${formatMarathiDate(post.published_at || post.created_at)}</span></div>
              <div class="article-content">${post.content}</div>
            </div>
            
            <div class="share-section">
              <h4>ही माहिती इतरांसोबत शेअर करा</h4>
              <div class="share-buttons">
                <button onclick="shareWhatsApp('${escapeAttr(post.title)}')" class="share-btn btn-wa">📱 WhatsApp</button>
                <a href="${INSTAGRAM_URL}" target="_blank" class="share-btn btn-ig">📷 Instagram</a>
                <button onclick="webShare('${escapeAttr(post.title)}')" class="share-btn btn-share">↗ शेअर करा</button>
                <button onclick="copyCurrentLink()" class="share-btn btn-copy">🔗 लिंक कॉपी करा</button>
              </div>
            </div>
            ${adHtml}
          </div>
          
          <div class="article-sidebar">
            <h3 class="section-title" style="margin-top:0; font-size:1.3rem;">📌 संबंधित बातम्या</h3>
            ${relatedHtml}
          </div>
        </div>
        <footer style="background: var(--primary); color: #fff; text-align: center; padding: 40px 20px; margin-top: 60px;">© २०२६ Vitthal Speaks. सर्व हक्क राखीव.</footer>
        <script>window.addEventListener('DOMContentLoaded', () => trackBlogView(${post.id}));</script>
        </body></html>`;
      fs.writeFileSync(path.join(rootPath, `${post.slug}.html`), postHtml);
    });
  }

  // Generate Home & Static Pages...
  // (Home page generation remains largely the same, utilizing the updated CSS)
  if (posts && posts.length > 0) {
    let homeCards = posts.map(p => `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${extractImg(p.content)}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content">
          <h3 class="card-title">${escapeAttr(p.title)}</h3>
          <div style="margin-top:auto; font-size: 0.85rem; color:#94a3b8; display:flex; justify-content:space-between;">
            <span>${formatMarathiDate(p.published_at || p.created_at)}</span> <span style="color:var(--accent-orange); font-weight:bold;">वाचा →</span>
          </div>
        </div>
      </a>`).join('');

    const indexHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${generateSEO("Vitthal Speaks - होम", "ताज्या बातम्या", extractImg(posts[0].content), "/")}
      <style>${globalCSS}</style>${dynamicScripts}</head>
      <body>${headerNavHtml}<div class="container">${adHtml}<h2 class="section-title">📰 नवीन माहिती</h2><div class="news-grid">${homeCards}</div></div><footer style="background: var(--primary); color: #fff; text-align: center; padding: 40px 20px; margin-top: 60px;">© २०२६ Vitthal Speaks. सर्व हक्क राखीव.</footer></body></html>`;
    fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);
  }
}
buildSite();
