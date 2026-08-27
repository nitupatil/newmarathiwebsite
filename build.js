const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase (Preserving Existing Configuration)
const SUPABASE_URL = 'https://ediqthdjnsrorcktldiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF0aGRqbnNyb3Jja3RsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDMxMzQsImV4cCI6MjEwMzIxOTEzNH0.uYsfs-T7qR-2krUushlPI0tDqONTYU1AIzEIud-_BNM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_BASE = '/newmarathiwebsite'; 
const FULL_SITE_URL = 'https://nitupatil.github.io' + SITE_BASE; // Update base domain if needed
const INSTAGRAM_URL = 'https://instagram.com/vitthalspeaks'; // Replace with actual profile URL

// Helper: Escape HTML attributes to prevent XSS
const escapeAttr = (str) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Helper: Marathi Date Formatter (Node Side)
function formatMarathiDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
  const date = String(d.getDate()).replace(/\d/g, x => '०१२३४५६७८९'[x]);
  const year = String(d.getFullYear()).replace(/\d/g, x => '०१२३४५६७८९'[x]);
  return `📅 ${date} ${months[d.getMonth()]} ${year}`;
}

// Helper: Safely extract image (Handles single/double quotes and lazy loading)
const extractImg = (html) => {
  if (!html) return 'https://placehold.co/300x200?text=News';
  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return match ? match[1] : 'https://placehold.co/300x200?text=News';
};

// --- GLOBAL CSS (Typography, Animations, Responsive Design) ---
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;600;700;800&family=Poppins:wght@400;600;700&display=swap');
  
  :root {
    --primary: #002147;
    --accent-orange: #ff9800;
    --accent-red: #d32f2f;
    --bg-light: #f8fafc;
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --radius: 12px;
    --shadow: 0 4px 15px rgba(0,0,0,0.06);
    --hover-shadow: 0 10px 25px rgba(0,0,0,0.12);
  }

  body { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif; background: var(--bg-light); color: var(--text-main); margin: 0; padding: 0; line-height: 1.7; overflow-x: hidden; }
  a { text-decoration: none; color: inherit; }
  
  /* Header & Branding */
  .main-header { background: #fff; text-align: center; padding: 15px 20px; border-bottom: 2px solid var(--accent-orange); animation: fadeIn 0.8s ease-out; }
  .logo-img { max-width: 100%; width: 280px; height: 90px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); transition: all 0.3s; animation: pulseGlow 3s infinite; }
  .badges-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 12px; }
  .brand-badge { background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: var(--primary); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; transition: transform 0.2s; }
  .brand-badge:hover { transform: translateY(-2px); background: var(--primary); color: #fff; }

  /* Date/Time Bar */
  .datetime-bar { background: var(--primary); color: #fff; text-align: center; padding: 6px 10px; font-size: 0.9rem; font-weight: 600; display: flex; justify-content: center; align-items: center; gap: 8px; }
  
  /* Navigation */
  nav { background: #fff; padding: 12px 20px; display: flex; justify-content: center; gap: 20px; position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow); }
  nav a { color: var(--text-main); font-weight: 600; font-size: 1.05rem; padding: 6px 14px; border-radius: 8px; transition: all 0.3s; }
  nav a:hover, nav a.active { background: rgba(255, 152, 0, 0.15); color: var(--accent-orange); }

  /* Ticker */
  .ticker-wrap { display: flex; align-items: center; background: #fff; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; overflow: hidden; white-space: nowrap; }
  .ticker-label { background: var(--accent-red); color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 0.9rem; margin-right: 15px; z-index: 2; display: flex; align-items: center; gap: 5px; }
  .ticker-label .pulse { width: 8px; height: 8px; background: #fff; border-radius: 50%; animation: blink 1s infinite; }
  .ticker-move { display: inline-block; animation: ticker 25s linear infinite; padding-left: 100%; }
  .ticker-wrap:hover .ticker-move { animation-play-state: paused; }
  .ticker-item { margin-right: 30px; font-weight: 600; font-size: 1rem; color: var(--text-main); }
  .ticker-item:hover { color: var(--accent-orange); text-decoration: underline; }

  /* Layout */
  .container { max-width: 1000px; margin: 25px auto; padding: 0 16px; min-height: 70vh; }
  .section-title { font-size: 1.5rem; font-weight: 800; border-bottom: 3px solid var(--accent-orange); padding-bottom: 8px; margin: 40px 0 20px; color: var(--primary); display: inline-block; }
  
  /* Post Cards */
  .featured-post { display: block; background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); margin-bottom: 30px; transition: all 0.3s ease; position: relative; border: 1px solid #f1f5f9; }
  .featured-post:hover { transform: translateY(-5px); box-shadow: var(--hover-shadow); }
  .special-badge { position: absolute; top: 15px; left: 15px; background: linear-gradient(135deg, var(--accent-orange), #f57c00); color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; z-index: 10; box-shadow: 0 4px 10px rgba(255,152,0,0.3); }
  .featured-img-wrap { width: 100%; height: 350px; overflow: hidden; }
  .featured-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .featured-post:hover .featured-img-wrap img { transform: scale(1.05); }
  .featured-content { padding: 24px; }
  .featured-title { font-size: 2rem; font-weight: 800; margin: 0 0 12px; color: var(--primary); line-height: 1.3; }

  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .post-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column; transition: all 0.3s; border: 1px solid #f1f5f9; }
  .post-card:hover { transform: translateY(-4px); box-shadow: var(--hover-shadow); }
  .card-img-wrap { height: 180px; overflow: hidden; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .post-card:hover .card-img-wrap img { transform: scale(1.05); }
  .card-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
  .card-title { font-size: 1.25rem; font-weight: 700; margin: 0 0 10px; line-height: 1.4; }
  .card-excerpt { font-size: 0.95rem; color: var(--text-muted); margin: 0 0 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .card-meta { margin-top: auto; font-size: 0.85rem; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; }
  .btn-read { font-weight: 700; color: var(--accent-orange); }

  /* Article Page */
  .breadcrumb { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px; }
  .article-card { background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: var(--shadow); margin-bottom: 30px; }
  .article-title { font-size: 2.4rem; font-weight: 800; color: var(--primary); line-height: 1.3; margin: 15px 0 20px; }
  .article-meta { display: flex; gap: 20px; color: var(--text-muted); font-size: 0.95rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
  .article-content { font-size: 1.15rem; line-height: 1.8; color: #334155; }
  .article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }

  /* Share Section */
  .share-section { margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; }
  .share-section h4 { margin: 0 0 15px 0; font-size: 1.1rem; color: var(--primary); }
  .share-buttons { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
  .share-btn { padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; color: #fff; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; transition: transform 0.2s; }
  .share-btn:hover { transform: scale(1.03); }
  .btn-wa { background: #25D366; } .btn-ig { background: #E1306C; } .btn-share { background: var(--primary); } .btn-copy { background: #475569; }
  
  /* Toast */
  .toast { visibility: hidden; min-width: 200px; background-color: #333; color: #fff; text-align: center; border-radius: 8px; padding: 12px; position: fixed; z-index: 1000; left: 50%; bottom: 30px; transform: translateX(-50%); font-weight: 600; font-size: 1rem; opacity: 0; transition: opacity 0.3s, bottom 0.3s; }
  .toast.show { visibility: visible; opacity: 1; bottom: 50px; }

  /* Footer */
  footer { background: var(--primary); color: #fff; text-align: center; padding: 40px 20px; margin-top: 60px; }
  footer .f-links { margin: 20px 0; }
  footer .f-links a { color: #cbd5e1; margin: 0 10px; font-size: 0.95rem; }
  footer .f-links a:hover { color: var(--accent-orange); }

  /* Ads */
  .ad-unit { margin: 30px 0; text-align: center; cursor: pointer; }
  .ad-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px; }
  .ad-media { width: 100%; max-width: 728px; height: auto; max-height: 250px; object-fit: contain; border-radius: 8px; }

  /* Animations & Utilities */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 152, 0, 0.1)); } 50% { filter: drop-shadow(0 0 15px rgba(255, 152, 0, 0.3)); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
  @media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }
  @media (max-width: 768px) {
    .article-card { padding: 25px 15px; } .article-title { font-size: 1.8rem; } .featured-title { font-size: 1.5rem; } .featured-img-wrap { height: 220px; }
  }
`;

// --- CLIENT-SIDE SCRIPTS ---
const globalScripts = `
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

    // Share Functions
    function showToast() {
      const x = document.getElementById("toast");
      x.className = "toast show";
      setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
    }
    function copyCurrentLink() {
      navigator.clipboard.writeText(window.location.href);
      showToast();
    }
    function shareWhatsApp(title) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(title + " - येथे वाचा: ");
      window.open('https://api.whatsapp.com/send?text=' + text + url, '_blank');
    }
    async function webShare(title) {
      if (navigator.share) {
        try {
          await navigator.share({ title: title, url: window.location.href });
        } catch(err) { console.log('Share error:', err); }
      } else {
        copyCurrentLink();
      }
    }
  </script>
`;

// --- UI GENERATORS ---
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
  <link rel="apple-touch-icon" href="https://i.ibb.co/SwTxjYrw/394000910-240835825678358-5228163708350764536-n.jpg">
  <meta name="theme-color" content="#002147">
`;

const generateHeader = () => `
  <header class="main-header">
    <a href="${SITE_BASE}/">
      <img src="https://i.ibb.co/JWXdjnf7/Chat-GPT-Image-Aug-21-2026-08-02-54-PM.png" alt="Vitthal Speaks" class="logo-img">
    </a>
    <div class="badges-container">
      <span class="brand-badge">माहिती</span>
      <span class="brand-badge">शासकीय योजना</span>
      <span class="brand-badge">नोकरी</span>
      <span class="brand-badge">शिक्षण</span>
      <span class="brand-badge">बातम्या</span>
    </div>
  </header>
  <div class="datetime-bar">
    <span>🕒</span> <span id="live-time">लोड होत आहे...</span>
  </div>
`;

const generateNav = () => `
  <nav>
    <a href="${SITE_BASE}/">🏠 मुख्यपृष्ठ</a>
    <a href="${SITE_BASE}/contact">📞 संपर्क</a>
    <a href="${SITE_BASE}/privacy-policy">🔒 गोपनीयता धोरण</a>
  </nav>
`;

const generateTicker = (posts) => {
  if (!posts || posts.length === 0) return '';
  const tickerItems = posts.slice(0, 5).map(p => `<a href="${SITE_BASE}/${p.slug}" class="ticker-item">${escapeAttr(p.title)} •</a>`).join(' ');
  return `
    <div class="ticker-wrap">
      <div class="ticker-label"><div class="pulse"></div> ताज्या पोस्ट :</div>
      <div style="overflow: hidden; flex-grow: 1;">
         <div class="ticker-move">${tickerItems} ${tickerItems}</div>
      </div>
    </div>
  `;
};

const generateShareSection = (title) => `
  <div class="share-section">
    <h4>ही माहिती इतरांसोबत शेअर करा</h4>
    <div class="share-buttons">
      <button onclick="shareWhatsApp('${escapeAttr(title)}')" class="share-btn btn-wa">📱 WhatsApp</button>
      <a href="${INSTAGRAM_URL}" target="_blank" class="share-btn btn-ig">📷 Instagram</a>
      <button onclick="webShare('${escapeAttr(title)}')" class="share-btn btn-share">↗ शेअर करा</button>
      <button onclick="copyCurrentLink()" class="share-btn btn-copy">🔗 लिंक कॉपी करा</button>
    </div>
  </div>
  <div id="toast" class="toast">लिंक कॉपी झाली!</div>
`;

const generateFooter = () => `
  <footer>
    <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Vitthal Speaks</div>
    <div style="color: #cbd5e1; font-size: 0.9rem;">माहिती | शासकीय योजना | नोकरी | शिक्षण | आणि बरंच काही...</div>
    <div class="f-links">
      <a href="${SITE_BASE}/">मुख्यपृष्ठ</a> • 
      <a href="${SITE_BASE}/contact">संपर्क</a> • 
      <a href="${SITE_BASE}/privacy-policy">गोपनीयता धोरण</a>
    </div>
    <div style="margin-top: 20px; font-size: 0.85rem; color: #94a3b8;">© २०२६ Vitthal Speaks. सर्व हक्क राखीव.</div>
  </footer>
`;

const generateAd = (ads) => {
  if (!ads || ads.length === 0) return '';
  const ad = ads[0];
  let media = ad.media_type === 'youtube' 
    ? `<iframe width="100%" height="250" src="${escapeAttr(ad.media_url)}" frameborder="0" style="border-radius:8px; max-width:728px;"></iframe>`
    : `<img src="${escapeAttr(ad.media_url)}" class="ad-media">`;
  return `<div class="ad-unit" onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.target_url) || ''}')"><div class="ad-label">Advertisement</div>${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
};


// --- BUILD PROCESS ---
async function buildSite() {
  const rootPath = __dirname;
  
  // Fetch data
  const { data: posts } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  const adHtml = generateAd(ads);
  const tickerHtml = generateTicker(posts);
  const headerNavHtml = generateHeader() + generateNav() + tickerHtml;

  // 1. Generate Index Page
  if (posts && posts.length > 0) {
    const featured = posts[0];
    const others = posts.slice(1);
    const featuredDate = formatMarathiDate(featured.published_at || featured.created_at);
    
    let featuredHtml = `
      <a href="${SITE_BASE}/${featured.slug}" class="featured-post">
        <span class="special-badge">⭐ विशेष पोस्ट</span>
        <div class="featured-img-wrap"><img src="${extractImg(featured.content)}" alt="${escapeAttr(featured.title)}"></div>
        <div class="featured-content">
          <h2 class="featured-title">${escapeAttr(featured.title)}</h2>
          <p class="card-excerpt">${escapeAttr(featured.excerpt)}</p>
          <div class="card-meta"><span>${featuredDate}</span> <span class="btn-read">पूर्ण माहिती वाचा →</span></div>
        </div>
      </a>
    `;

    let othersHtml = others.map(p => {
      const date = formatMarathiDate(p.published_at || p.created_at);
      return `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${extractImg(p.content)}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content">
          <h3 class="card-title">${escapeAttr(p.title)}</h3>
          <p class="card-excerpt">${escapeAttr(p.excerpt)}</p>
          <div class="card-meta"><span>${date}</span> <span class="btn-read">वाचा →</span></div>
        </div>
      </a>`;
    }).join('');

    const indexHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${generateSEO("Vitthal Speaks - माहिती, शासकीय योजना आणि बातम्या", "महाराष्ट्रातील ताज्या बातम्या, शासकीय योजना, शिक्षण आणि नोकरीविषयक अद्ययावत माहिती मिळवा.", extractImg(featured.content), "/")}
      <style>${globalCSS}</style>${globalScripts}</head>
      <body>${headerNavHtml}<div class="container">${featuredHtml}${adHtml}
      <h2 class="section-title">📰 नवीन माहिती / ताज्या पोस्ट</h2>
      <div class="news-grid">${othersHtml}</div></div>${generateFooter()}</body></html>`;
    
    fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);
  }

  // 2. Generate Individual Posts
  if (posts) {
    posts.forEach((post, index) => {
      const isFeatured = index === 0;
      const dateStr = formatMarathiDate(post.published_at || post.created_at);
      const viewCountStr = post.views ? ` • 👁 वाचले: ${String(post.views).replace(/\d/g, x => '०१२३४५६७८९'[x])}` : '';
      
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 3).map(p => `
        <a href="${SITE_BASE}/${p.slug}" class="post-card">
          <div class="card-img-wrap" style="height: 140px;"><img src="${extractImg(p.content)}"></div>
          <div class="card-content" style="padding: 15px;">
            <h4 class="card-title" style="font-size: 1.1rem; margin-bottom: 5px;">${escapeAttr(p.title)}</h4>
            <div class="card-meta"><span>${formatMarathiDate(p.published_at || p.created_at)}</span> <span style="color:var(--primary)">→</span></div>
          </div>
        </a>
      `).join('');

      const postHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${generateSEO(post.title, post.excerpt, extractImg(post.content), `/${post.slug}`)}
        <style>${globalCSS}</style>${globalScripts}</head>
        <body>${headerNavHtml}
        <div class="container">
          <div class="breadcrumb">मुख्यपृष्ठ → ब्लॉग → ${escapeAttr(post.title)}</div>
          <div class="article-card">
            ${isFeatured ? '<span class="brand-badge" style="background:var(--accent-orange); color:white;">⭐ विशेष पोस्ट</span>' : ''}
            <h1 class="article-title">${post.title}</h1>
            <div class="article-meta"><span>📅 प्रकाशित: ${dateStr}${viewCountStr}</span></div>
            <div class="article-content">${post.content}</div>
          </div>
          ${generateShareSection(post.title)}
          ${adHtml}
          <h3 class="section-title">📌 संबंधित माहिती</h3>
          <div class="news-grid">${relatedHtml}</div>
        </div>
        ${generateFooter()}
        <script>window.addEventListener('DOMContentLoaded', () => trackBlogView(${post.id}));</script>
        </body></html>`;
      fs.writeFileSync(path.join(rootPath, `${post.slug}.html`), postHtml);
    });
  }

  // 3. Generate Static Pages
  const staticPages = [
    { slug: 'contact', title: 'संपर्क (Contact)', content: '<div class="article-card"><h1 class="article-title">संपर्क साधा</h1><p>कोणत्याही प्रश्नांसाठी किंवा माहितीसाठी आमच्याशी संपर्क साधा: support@vitthalspeaks.com</p></div>' },
    { slug: 'privacy-policy', title: 'गोपनीयता धोरण (Privacy Policy)', content: '<div class="article-card"><h1 class="article-title">गोपनीयता धोरण</h1><p>तुमची गोपनीयता आमच्यासाठी महत्त्वाची आहे. आम्ही तुमची माहिती सुरक्षित ठेवण्यासाठी वचनबद्ध आहोत.</p></div>' },
    { slug: '404', title: 'Page Not Found', content: `<div class="article-card" style="text-align: center;"><h1 style="color: var(--accent-red); font-size: 4rem; margin: 0;">४०४</h1><h2>माफ करा, ही पोस्ट उपलब्ध नाही.</h2><p style="color: var(--text-muted); margin-bottom: 30px;">तुम्ही शोधत असलेली पोस्ट डिलीट केली गेली असू शकते.</p><a href="${SITE_BASE}/" class="share-btn btn-share">मुख्यपृष्ठावर परत जा</a></div>` }
  ];
  
  staticPages.forEach(page => {
    const pageHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${generateSEO(page.title, page.title, 'https://i.ibb.co/JWXdjnf7/Chat-GPT-Image-Aug-21-2026-08-02-54-PM.png', `/${page.slug}`)}
      <style>${globalCSS}</style>${globalScripts}</head>
      <body>${headerNavHtml}<div class="container">${page.content}</div>${generateFooter()}</body></html>`;
    fs.writeFileSync(path.join(rootPath, `${page.slug}.html`), pageHtml);
  });
}

buildSite();
