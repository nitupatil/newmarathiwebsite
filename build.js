const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase
const SUPABASE_URL = 'https://ediqthdjnsrorcktldiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF0aGRqbnNyb3Jja3RsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDMxMzQsImV4cCI6MjEwMzIxOTEzNH0.uYsfs-T7qR-2krUushlPI0tDqONTYU1AIzEIud-_BNM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_BASE = '/newmarathiwebsite'; 
const FULL_SITE_URL = 'https://nitupatil.github.io' + SITE_BASE;
const AVATAR_URL = 'https://i.ibb.co/BVw78vKq/394000910-240835825678358-5228163708350764536-n-removebg-preview.png';
const FAVICON_URL = 'https://i.ibb.co/SwTxjYrw/394000910-240835825678358-5228163708350764536-n.jpg';

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
  try {
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('watch')) videoId = new URLSearchParams(url.split('?')[1]).get('v');
    else if (url.includes('embed/')) return url;
    return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0` : url;
  } catch(e) { return url; }
}

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&display=swap');
  
  :root { --primary: #001f3f; --primary-dark: #000000; --accent-yellow: #ffc107; --accent-orange: #ff9800; --accent-red: #d32f2f; --bg-light: #f4f6f8; --card-bg: #ffffff; --text-main: #1e293b; --text-muted: #475569; --radius: 12px; --shadow: 0 4px 12px rgba(0,0,0,0.05); }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { width: 100%; max-width: 100vw; margin: 0; padding: 0; overflow-x: clip; overscroll-behavior-x: none; touch-action: pan-y; -webkit-text-size-adjust: 100%; }
  body { font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif; background: var(--bg-light); color: var(--text-main); line-height: 1.7; }
  img, iframe, video { max-width: 100%; height: auto; display: block; border: none; }
  a { text-decoration: none; color: inherit; }
  
  #progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--accent-yellow); width: 0%; z-index: 10005; transition: width 0.1s; }
  
  .main-header { background: #fff; border-bottom: 1px solid #e2e8f0; width: 100%; position: relative; z-index: 10005; }
  .header-top { display: flex; justify-content: space-between; align-items: center; padding: 12px 4%; max-width: 1600px; margin: 0 auto; width: 100%; }
  .custom-brand { display: flex; align-items: center; gap: 12px; }
  .brand-avatar { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; background-color: var(--accent-orange); border: 2px solid var(--primary-dark); flex-shrink: 0; }
  .brand-text-wrapper { display: flex; flex-direction: column; justify-content: center; }
  .brand-text { font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--primary-dark); line-height: 1; display: flex; align-items: baseline; gap: 2px; margin-bottom: 2px; flex-wrap: wrap; }
  .brand-tld { font-size: 0.85rem; font-weight: 600; color: var(--primary); }
  .brand-tagline { font-size: 0.75rem; font-weight: 700; color: var(--primary); overflow-wrap: break-word; }

  .header-right { display: flex; align-items: center; gap: 20px; }
  .datetime-box { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); background: #f8fafc; padding: 6px 12px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: nowrap; }
  
  .search-wrapper { position: relative; width: 100%; max-width: 300px; }
  .search-input { width: 100%; padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 20px; outline: none; font-size: 16px !important; background: #f8fafc; transition: all 0.2s; }
  .search-input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px rgba(0,31,63,0.1); }
  .search-results { display: none; position: absolute; top: 45px; left: 0; right: 0; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; max-height: 350px; overflow-y: auto; border: 1px solid #e2e8f0; padding: 8px 0; z-index: 1001; }
  .search-result-item { padding: 10px 20px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600; color: var(--text-main); border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
  .search-result-item:last-child { border-bottom: none; }
  .search-result-item:hover { background: #f8fafc; color: var(--accent-orange); }

  .nav-bar { background: var(--primary-dark); color: #fff; display: flex; justify-content: center; align-items: center; border-bottom: 3px solid var(--accent-yellow); position: -webkit-sticky; position: sticky; top: 0; z-index: 10000; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; }
  .horizontal-nav { display: flex; justify-content: flex-start; gap: 30px; width: 100%; max-width: 1600px; padding: 0 4%; margin: 0 auto; }
  .horizontal-nav a { font-size: 0.95rem; font-weight: 600; padding: 12px 0; transition: color 0.2s; white-space: nowrap; }
  .horizontal-nav a:hover { color: var(--accent-yellow); }

  .ticker-wrap { display: flex; align-items: center; background: #fff; padding: 6px 4%; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; width: 100%; overflow: hidden; }
  .ticker-label { background: var(--accent-red); color: #fff; font-weight: 700; padding: 2px 10px; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; flex-shrink: 0; }
  .ticker-move { display: inline-block; animation: ticker 25s linear infinite; white-space: nowrap; padding-left: 100%; }
  .ticker-item { margin-right: 40px; font-weight: 600; color: var(--primary-dark); }

  .container { width: 100%; max-width: 1600px; margin: 25px auto; padding: 0 4%; min-height: 70vh; }
  .section-title { font-size: 1.4rem; font-weight: 800; border-bottom: 3px solid var(--accent-yellow); padding-bottom: 4px; margin: 0 0 20px; color: var(--primary-dark); display: inline-block; }
  
  .article-layout { display: flex; flex-direction: column; gap: 30px; width: 100%; }
  .article-main { flex: 1; min-width: 0; width: 100%; }
  .article-sidebar { width: 100%; display: block; } 
  @media (min-width: 1024px) {
    .article-layout { flex-direction: row; align-items: flex-start; }
    .article-main { flex: 3; } 
    .article-sidebar { flex: 1; min-width: 320px; max-width: 400px; position: sticky; top: 60px; max-height: calc(100vh - 80px); overflow-y: auto; padding-right: 10px; }
  }

  .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; width: 100%; }
  .post-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: transform 0.2s; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
  .post-card:hover { transform: translateY(-4px); box-shadow: 0 6px 15px rgba(0,0,0,0.08); }
  .card-img-wrap { height: 160px; overflow: hidden; width: 100%; }
  .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .post-card:hover .card-img-wrap img { transform: scale(1.05); }
  .card-content { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; overflow-wrap: break-word; }
  .card-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 8px; line-height: 1.4; color: var(--primary-dark); }
  .card-category { font-size: 0.75rem; font-weight: 800; color: var(--accent-red); text-transform: uppercase; margin-bottom: 4px; }

  .article-card { background: var(--card-bg); border-radius: var(--radius); padding: 35px; box-shadow: var(--shadow); width: 100%; overflow-x: hidden; border: 1px solid #e2e8f0; }
  .article-category { display: inline-block; background: #fee2e2; color: #dc2626; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; }
  .article-title { font-size: 2.2rem; font-weight: 800; color: var(--primary-dark); line-height: 1.3; margin: 0 0 15px; overflow-wrap: break-word; }
  .article-meta { font-size: 0.95rem; color: var(--text-muted); padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; margin-bottom: 25px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .article-content { font-size: 1.15rem; line-height: 1.8; color: #333; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; }
  .article-content img { width: 100%; height: auto; border-radius: 8px; margin: 20px 0; box-shadow: var(--shadow); }

  .share-section { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center; }
  .share-buttons { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 15px; }
  .share-btn { padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 0.95rem; color: #fff; cursor: pointer; border: none; display: flex; align-items: center; gap: 6px; }
  .btn-wa { background: #25D366; } .btn-copy { background: var(--primary); }

  .toast { visibility: hidden; min-width: 200px; background-color: #333; color: #fff; text-align: center; border-radius: 8px; padding: 10px; position: fixed; z-index: 10001; left: 50%; bottom: 30px; transform: translateX(-50%); font-weight: 600; font-size: 0.95rem; opacity: 0; transition: opacity 0.3s, bottom 0.3s; }
  .toast.show { visibility: visible; opacity: 1; bottom: 50px; }

  .ad-slider-container { width: 100%; background: transparent; border-radius: 12px; margin: 25px 0; position: relative; overflow: hidden; text-align: center; touch-action: pan-y; }
  .ad-label { position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; font-size: 0.7rem; border-radius: 4px; z-index: 10; font-weight: bold; }
  .ad-slide { display: none; width: 100%; animation: fade 0.5s; background: transparent; }
  .ad-slide.active { display: block; }
  .ad-media-img { width: 100%; height: auto; max-height: 450px; object-fit: contain; cursor: pointer; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); pointer-events: none; }
  .ad-media-yt { width: 100%; max-width: 800px; aspect-ratio: 16/9; border: none; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); pointer-events: auto; }
  
  .ad-dots { position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: center; gap: 8px; z-index: 10; }
  .ad-dot { height: 10px; width: 10px; background-color: rgba(255,255,255,0.4); border-radius: 50%; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  .ad-dot.active { background-color: var(--accent-yellow); }

  .ad-prev, .ad-next { cursor: pointer; position: absolute; top: 50%; width: auto; padding: 12px; margin-top: -22px; color: white; font-weight: bold; font-size: 18px; transition: 0.3s ease; border-radius: 0 4px 4px 0; user-select: none; background-color: rgba(0,0,0,0.3); border:none; z-index: 20; }
  .ad-prev { left: 0; }
  .ad-next { right: 0; border-radius: 4px 0 0 4px; }
  .ad-prev:hover, .ad-next:hover { background-color: rgba(0,0,0,0.8); }

  /* Standard Forms and Standard Page Layout */
  .page-card { max-width: 1000px; background: white; padding: 40px; border-radius: 12px; margin: 40px auto; box-shadow: var(--shadow); border: 1px solid #e2e8f0; }
  .page-card h1 { color: var(--primary-dark); margin-bottom: 20px; }
  .page-card p, .page-card li { font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 15px; }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--primary-dark); }
  .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 1rem; }
  .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent-orange); box-shadow: 0 0 0 3px rgba(255,152,0,0.1); }
  .btn-submit { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; width: 100%; transition: 0.2s; }
  .btn-submit:hover { background: var(--primary-dark); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  @media (max-width: 768px) {
    body { background: #ffffff; }
    .header-top { flex-direction: column; gap: 12px; padding: 15px 4%; align-items: flex-start; }
    .header-right { width: 100%; justify-content: center; }
    .search-wrapper { max-width: 100%; }
    .datetime-box { display: none; }
    .horizontal-nav { justify-content: space-between; gap: 5px; padding: 0 4%; }
    .horizontal-nav a { font-size: 0.85rem; padding: 10px 0; }
    
    .container { padding: 0; margin: 0; width: 100%; max-width: 100%; }
    .article-layout { gap: 0; }
    .page-card { margin: 20px 16px; padding: 25px 16px; border: none; box-shadow: none; border-bottom: 1px solid #e2e8f0; border-radius: 0; }
    .grid-2 { grid-template-columns: 1fr; }
    
    .article-card { padding: 20px 16px; border-radius: 0; box-shadow: none; border: none; border-bottom: 1px solid #e2e8f0; }
    .article-title { font-size: 1.8rem; margin-top: 10px; }
    .article-sidebar { padding: 20px 16px; }
    .news-grid { padding: 0; margin: 0; grid-template-columns: 1fr; gap: 0; }
    
    .post-card { border-radius: 0; border: none; border-bottom: 1px solid #e2e8f0; box-shadow: none; margin-bottom: 0; }
    .post-card:hover { transform: none; box-shadow: none; }
    .card-img-wrap { height: 180px; border-radius: 0; }
    .section-title { margin: 20px 16px; }
    
    .ad-slider-container { border-radius: 0; margin: 15px 0; }
    .ad-media-img, .ad-media-yt { border-radius: 0; box-shadow: none; max-width: 100%; }
    .ad-prev, .ad-next { padding: 8px; font-size: 14px; }
  }

  @keyframes fade { from { opacity: 0.4 } to { opacity: 1 } }
  @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
`;

const generateGlobalScripts = (postsData) => `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const db = window.supabase.createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');
    
    async function trackBlogView(id) {
      try {
        const sessionKey = 'viewed_post_' + id;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          await db.rpc('increment_blog_view', { row_id: id });
        }
      } catch (err) { console.error('Tracking error:', err); }
    }

    async function trackAdView(id) {
      try {
        const sessionKey = 'viewed_ad_' + id;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          await db.rpc('increment_ad_view', { row_id: id });
        }
      } catch (err) { console.error('Ad view error:', err); }
    }

    async function trackAdClick(id, url) {
      try { await db.rpc('increment_ad_click', { row_id: id }); } catch (err) {}
      if (url) window.open(url, '_blank');
    }
    
    function updateLiveTime() {
      const el = document.getElementById('live-time');
      if(!el) return;
      const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      const days = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
      const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
      const dayNum = String(now.getDate()).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const year = String(now.getFullYear()).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const mHours = String(now.getHours() % 12 || 12).replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      const mMin = String(now.getMinutes()).padStart(2, '0').replace(/\\d/g, d => '०१२३४५६७८९'[d]);
      el.innerText = \`📅 \${dayNum} \${months[now.getMonth()]} \${year} | 🕒 \${mHours}:\${mMin}\`;
    }
    setInterval(updateLiveTime, 1000); window.addEventListener('DOMContentLoaded', updateLiveTime);

    const allPosts = ${JSON.stringify(postsData).replace(/</g, '\\u003c')};
    
    function handleSearch() {
      const input = document.getElementById('searchInput').value.toLowerCase().trim();
      const resultsDiv = document.getElementById('searchResults');
      
      if (input.length < 1) { 
        resultsDiv.style.display = 'none'; 
        return; 
      }
      
      const filtered = allPosts.filter(p => 
        (p.title && p.title.toLowerCase().includes(input)) ||
        (p.title_en && p.title_en.toLowerCase().includes(input))
      );

      if (filtered.length > 0) {
        resultsDiv.innerHTML = filtered.slice(0, 8).map(p => \`
          <a href="${SITE_BASE}/\${p.slug}" class="search-result-item">
            <span style="color:#cbd5e1; font-size:12px;">🔍</span> \${p.title}
          </a>
        \`).join('');
      } else {
        resultsDiv.innerHTML = '<div class="search-result-item" style="color:red; justify-content:center;">काहीही सापडले नाही...</div>';
      }
      resultsDiv.style.display = 'block';
    }
    
    document.addEventListener('click', e => { 
      if (!e.target.closest('.search-wrapper')) {
        const res = document.getElementById('searchResults');
        if(res) res.style.display = 'none';
      } 
    });

    function showToast() {
      const x = document.getElementById("toast");
      x.className = "toast show";
      setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
    }
    function copyCurrentLink() { navigator.clipboard.writeText(window.location.href); showToast(); }
    function shareWhatsApp(title) { window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(title + " - येथे वाचा: ") + encodeURIComponent(window.location.href), '_blank'); }

    let slideIndex = 1;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function currentSlide(n) { showSlides(slideIndex = n); }
    function plusSlides(n) { showSlides(slideIndex += n); }

    function showSlides(n) {
      let slides = document.getElementsByClassName("ad-slide");
      let dots = document.getElementsByClassName("ad-dot");
      if(slides.length === 0) return;

      if (n !== undefined) { slideIndex = n; } else { slideIndex++; }
      if (slideIndex > slides.length) {slideIndex = 1}    
      if (slideIndex < 1) {slideIndex = slides.length}

      for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(" active", "");
        if(dots.length > 0) dots[i].className = dots[i].className.replace(" active", "");
      }
      
      slides[slideIndex-1].className += " active";
      if(dots.length > 0) dots[slideIndex-1].className += " active";

      if (slides.length <= 1) return;

      let hasIframe = slides[slideIndex-1].querySelector('iframe');
      let delay = hasIframe ? 10000 : 5000; 
      
      clearTimeout(slideInterval);
      slideInterval = setTimeout(() => showSlides(), delay);
    }

    function handleSwipe() {
      if (touchEndX < touchStartX - 40) plusSlides(1); 
      if (touchEndX > touchStartX + 40) plusSlides(-1); 
    }

    window.addEventListener('DOMContentLoaded', () => { 
      let slider = document.querySelector('.ad-slider-container');
      if(slider) {
        slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        slider.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, {passive: true});
        showSlides(1); 
      }
    });

    // Handle Contact Form Submission from Contact Page
    async function submitContactForm(e) {
      e.preventDefault();
      const btn = document.getElementById('c-submit');
      const status = document.getElementById('c-status');
      
      const name = document.getElementById('c-name').value;
      const email = document.getElementById('c-email').value;
      const message = document.getElementById('c-message').value;

      btn.disabled = true;
      btn.innerText = 'Sending Message... / संदेश पाठवत आहे...';
      
      try {
        const { error } = await db.from('contact_messages').insert([{ name, email, message }]);
        if (error) throw error;
        
        status.style.color = 'green';
        status.innerText = '✅ Message sent successfully! We will get back to you soon. / संदेश यशस्वीरीत्या पाठवला!';
        document.getElementById('contactForm').reset();
      } catch (err) {
        console.error(err);
        status.style.color = 'red';
        status.innerText = '❌ Error sending message. Please try again later. / संदेश पाठवताना त्रुटी आली.';
      } finally {
        btn.disabled = false;
        btn.innerText = 'Send Message / संदेश पाठवा';
      }
    }
  </script>
`;

const generateSEO = (title, pathStr, post = null) => {
  let finalTitle = title;
  let desc = "ताज्या बातम्या आणि शासकीय योजनांची माहितीसाठी विठ्ठल स्पीक्स";
  let keywords = "Vitthal Speaks, Marathi News, योजना, महाराष्ट्र, नोकरी";
  let ogImage = FAVICON_URL;

  if (post) {
    finalTitle = post.seo_title || post.title;
    desc = post.seo_description || post.excerpt || desc;
    keywords = post.seo_keywords || keywords;
    ogImage = post.featured_image || extractImg(post.content) || FAVICON_URL;
  }

  return `
    <title>${escapeAttr(finalTitle)}</title>
    <meta name="description" content="${escapeAttr(desc)}">
    <meta name="keywords" content="${escapeAttr(keywords)}">
    <meta property="og:title" content="${escapeAttr(finalTitle)}">
    <meta property="og:description" content="${escapeAttr(desc)}">
    <meta property="og:image" content="${escapeAttr(ogImage)}">
    <meta property="og:url" content="${FULL_SITE_URL}${pathStr}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="icon" type="image/jpeg" href="${FAVICON_URL}">
  `;
};

const generateHeader = () => `
  <div id="progress-bar"></div>
  <header class="main-header">
    <div class="header-top">
      <a href="${SITE_BASE}/" class="custom-brand">
        <img src="${AVATAR_URL}" alt="Vitthal Speaks" class="brand-avatar">
        <div class="brand-text-wrapper">
          <div class="brand-text">VitthalSpeaks<span class="brand-tld">.com</span></div>
          <div class="brand-tagline">शासकीय योजना • माहिती • ग्रामपंचायत</div>
        </div>
      </a>
      
      <div class="header-right">
        <div class="datetime-box" id="live-time">लोड होत आहे...</div>
        <div class="search-wrapper">
          <input type="text" id="searchInput" class="search-input" placeholder="🔍 माहिती शोधा..." oninput="handleSearch()" onfocus="handleSearch()" autocomplete="off">
          <div id="searchResults" class="search-results"></div>
        </div>
      </div>
    </div>
  </header>
  
  <div class="nav-bar">
    <div class="horizontal-nav">
      <a href="${SITE_BASE}/">🏠 Home</a>
      <a href="${SITE_BASE}/contact">📞 Contact</a>
      <a href="${SITE_BASE}/privacy-policy">🔒 Privacy Policy</a>
    </div>
  </div>
`;

const generateAdCarousel = (ads, location, postId = null) => {
  if (!ads || ads.length === 0) return '';
  const activeAds = ads.filter(ad => {
    const rule = ad.display_rule || 'all';
    if (ad.status && ad.status !== 'active') return false; 
    
    if (rule === 'all') return true;
    if (location === 'home') return rule === 'home_only' || rule === 'home_and_specific_posts';
    if (location === 'post') {
      if (rule === 'specific_posts' || rule === 'home_and_specific_posts') {
        return ad.target_post_ids && Array.isArray(ad.target_post_ids) && ad.target_post_ids.includes(postId);
      }
    }
    return false;
  });

  if (activeAds.length === 0) return '';
  
  let slidesHtml = activeAds.map((ad, i) => {
    const isYT = ad.media_type === 'youtube' || (ad.media_url && (ad.media_url.includes('youtube.com') || ad.media_url.includes('youtu.be')));
    let media = isYT
      ? `<iframe class="ad-media-yt" src="${getYouTubeEmbedUrl(ad.media_url)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : `<img src="${escapeAttr(ad.media_url)}" class="ad-media-img" onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.destination_url) || ''}')">`;
    
    let activeClass = i === 0 ? ' active' : '';
    return `<div class="ad-slide${activeClass}">${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
  }).join('');
  
  let arrowsHtml = activeAds.length > 1 ? `
    <button class="ad-prev" onclick="plusSlides(-1)">&#10094;</button>
    <button class="ad-next" onclick="plusSlides(1)">&#10095;</button>
  ` : '';
  let dotsHtml = activeAds.length > 1 ? `<div class="ad-dots">` + activeAds.map((_, i) => `<span class="ad-dot" onclick="currentSlide(${i+1})"></span>`).join('') + `</div>` : '';
  
  return `<div class="ad-slider-container"><div class="ad-label">प्रायोजित</div>${slidesHtml}${arrowsHtml}${dotsHtml}</div>`;
};

async function buildSite() {
  const rootPath = __dirname;
  
  const { data: fetchedPosts } = await supabase.from('blogs').select('*').eq('status', 'published').order('created_at', { ascending: false });
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  const posts = fetchedPosts ? fetchedPosts.map(p => {
    let cleanSlug = (p.slug || p.title || 'post-' + p.id)
      .trim()
      .replace(/\s+/g, '-') 
      .replace(/[^a-zA-Z0-9-]/g, '') 
      .replace(/-+/g, '-') 
      .replace(/^-|-$/g, '') 
      .toLowerCase();
      
    if(!cleanSlug) cleanSlug = 'post-' + p.id;
    return { ...p, slug: cleanSlug };
  }) : [];

  const minimalSearchData = posts ? posts.map(p => ({ title: p.title, title_en: p.title_en || '', slug: p.slug })) : [];
  const dynamicScripts = generateGlobalScripts(minimalSearchData);
  const headerNavHtml = generateHeader();

  // 1. GENERATE ALL BLOG POST PAGES
  if (posts) {
    posts.forEach((post) => {
      const postAdsHtml = generateAdCarousel(ads, 'post', post.id);
      
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 6).map(p => {
        const thumb = p.featured_image || extractImg(p.content);
        return `
        <a href="${SITE_BASE}/${p.slug}" class="post-card" style="margin-bottom: 20px; border-radius: 8px;">
          <div class="card-img-wrap" style="height: 100px;"><img src="${thumb}"></div>
          <div class="card-content" style="padding: 12px;"><h4 style="font-size: 1rem; margin:0; color:var(--primary-dark);">${escapeAttr(p.title)}</h4></div>
        </a>`;
      }).join('');

      const categoryBadge = post.category ? `<span class="article-category">${escapeAttr(post.category)}</span>` : '';

      const postHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
        ${generateSEO(post.title, `/${post.slug}`, post)}<style>${globalCSS}</style>${dynamicScripts}</head>
        <body>${headerNavHtml}
        <div class="container article-layout">
          <div class="article-main">
            <div class="article-card">
              ${categoryBadge}
              <h1 class="article-title">${post.title}</h1>
              <div class="article-meta"><span style="color:var(--text-muted);">प्रकाशित:</span> &nbsp;${formatMarathiDate(post.published_at || post.created_at)}</div>
              <div class="article-content">${post.content}</div>
              
              <div class="share-section">
                <h4 style="margin-top:0; margin-bottom:10px; font-size:1.05rem; color:var(--primary-dark);">ही माहिती इतरांसोबत शेअर करा</h4>
                <div class="share-buttons">
                  <button onclick="shareWhatsApp('${escapeAttr(post.title)}')" class="share-btn btn-wa">📱 WhatsApp वर पाठवा</button>
                  <button onclick="copyCurrentLink()" class="share-btn btn-copy">🔗 लिंक कॉपी करा</button>
                </div>
              </div>
            </div>
            ${postAdsHtml}
          </div>
          <div class="article-sidebar"><h3 class="section-title" style="margin-top:0;">📌 संबंधित बातम्या</h3>${relatedHtml}</div>
        </div>
        <div id="toast" class="toast">लिंक कॉपी झाली!</div>
        <script>window.addEventListener('DOMContentLoaded', () => trackBlogView(${post.id}));</script>
        </body></html>`;
      fs.writeFileSync(path.join(rootPath, `${post.slug}.html`), postHtml);
    });
  }

  // 2. GENERATE HOMEPAGE (index.html)
  let homeAdsHtml = generateAdCarousel(ads, 'home');
  let tickerHtml = '';
  let homeCards = '<div style="padding: 40px; text-align: center; color: var(--text-muted); grid-column: 1 / -1;">नवीन अपडेट्स लवकरच येत आहेत...</div>';

  if (posts && posts.length > 0) {
    const tickerItems = posts.slice(0, 5).map(p => `<a href="${SITE_BASE}/${p.slug}" class="ticker-item">${escapeAttr(p.title)} •</a>`).join(' ');
    tickerHtml = `<div class="ticker-wrap"><div class="ticker-label">ताज्या बातम्या :</div><div style="overflow: hidden; flex-grow: 1;"><div class="ticker-move">${tickerItems} ${tickerItems}</div></div></div>`;

    homeCards = posts.map(p => {
      const thumb = p.featured_image || extractImg(p.content);
      const catBadge = p.category ? `<div class="card-category">${escapeAttr(p.category)}</div>` : '';
      return `
      <a href="${SITE_BASE}/${p.slug}" class="post-card">
        <div class="card-img-wrap"><img src="${thumb}" alt="${escapeAttr(p.title)}"></div>
        <div class="card-content">
          ${catBadge}
          <h3 class="card-title">${escapeAttr(p.title)}</h3>
          <div style="margin-top:auto; font-size: 0.85rem; color:var(--text-muted); font-weight:600;"><span style="color:var(--text-muted);"></span> ${formatMarathiDate(p.published_at || p.created_at)}</div>
        </div>
      </a>`;
    }).join('');
  }

  const indexHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
    ${generateSEO("Vitthal Speaks - शासकीय योजना आणि नोकरी माहिती", "/", null)}<style>${globalCSS}</style>${dynamicScripts}</head>
    <body>${headerNavHtml}${tickerHtml}<div class="container">${homeAdsHtml}<h2 class="section-title">📰 ताज्या पोस्ट</h2><div class="news-grid">${homeCards}</div></div></body></html>`;
  fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);

  // 3. GENERATE UPGRADED BILINGUAL CONTACT PAGE (contact.html)
  const contactContent = `
    <div class="page-card" style="max-width: 900px; padding: 30px 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin-bottom: 5px;">Contact Us | आमच्याशी संपर्क साधा</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">If you have any questions regarding government schemes, feel free to reach out. <br> शासकीय योजनांबद्दल तुमचे काही प्रश्न असल्यास, कृपया खालील फॉर्म भरा किंवा ईमेल करा.</p>
      </div>
      
      <div class="grid-2" style="gap: 30px; align-items: start;">
        <div class="contact-info" style="background: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; height: 100%;">
          <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">Direct Contact <br><span style="font-size: 1rem; color: var(--accent-orange);">थेट संपर्क</span></h3>
          
          <div style="margin-top: 25px; display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; background: var(--primary); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.3rem; flex-shrink: 0;">✉️</div>
            <div>
              <strong style="display: block; color: var(--text-main); font-size: 1.05rem;">Email / ईमेल:</strong>
              <a href="mailto:vitthalaherblogs@gmail.com" style="color: var(--accent-orange); font-weight: 600; font-size: 1.05rem; word-break: break-all;">vitthalaherblogs@gmail.com</a>
            </div>
          </div>
          
          <div style="margin-top: 25px; display: flex; align-items: center; gap: 15px;">
            <div style="width: 50px; height: 50px; background: #25D366; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.3rem; flex-shrink: 0;">🌐</div>
            <div>
              <strong style="display: block; color: var(--text-main); font-size: 1.05rem;">Website / वेबसाईट:</strong>
              <a href="https://www.vitthalspeaks.com" style="color: var(--accent-orange); font-weight: 600; font-size: 1.05rem;">www.vitthalspeaks.com</a>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 10px;">
          <form id="contactForm" onsubmit="submitContactForm(event)">
            <div class="form-group">
              <label>Your Name / तुमचे नाव <span style="color:red">*</span></label>
              <input type="text" id="c-name" required placeholder="Enter your full name">
            </div>
            <div class="form-group">
              <label>Your Email / तुमचा ईमेल <span style="color:red">*</span></label>
              <input type="email" id="c-email" required placeholder="Enter your email address">
            </div>
            <div class="form-group">
              <label>Message / तुमचा संदेश <span style="color:red">*</span></label>
              <textarea id="c-message" required rows="5" placeholder="Write your message here..."></textarea>
            </div>
            <button type="submit" id="c-submit" class="btn-submit">Send Message / संदेश पाठवा</button>
            <div id="c-status" style="text-align: center; margin-top: 15px; font-weight: 600;"></div>
          </form>
        </div>
      </div>
    </div>
  `;
  const contactHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    ${generateSEO("Contact Us - Vitthal Speaks", "/contact", null)}<style>${globalCSS}</style>${dynamicScripts}</head>
    <body>${headerNavHtml}<div class="container">${contactContent}</div></body></html>`;
  fs.writeFileSync(path.join(rootPath, 'contact.html'), contactHtml);

  // 4. GENERATE CLEAN BILINGUAL PRIVACY POLICY PAGE (privacy-policy.html)
  const privacyContent = `
    <div class="page-card" style="max-width: 1000px; padding: 30px 20px;">
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px;">
        <h1 style="font-size: 2.5rem; margin-bottom: 5px; color: var(--primary-dark);">Privacy Policy</h1>
        <h2 style="font-size: 1.8rem; color: var(--accent-orange); margin-top: 0;">गोपनीयता धोरण</h2>
        <p style="font-weight: 600; color: var(--text-muted);">Last updated / अंतिम अद्यतन: ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">1. Introduction / प्रस्तावना</h3>
        <p style="margin-bottom: 10px;">At Vitthal Speaks, accessible from https://www.vitthalspeaks.com/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.</p>
        <p style="color: var(--text-main); font-weight: 500; margin-top: 0;">विठ्ठल स्पीक्स (https://www.vitthalspeaks.com/) वर, आमच्या अभ्यागतांची गोपनीयता ही आमची मुख्य प्राथमिकता आहे. या गोपनीयता धोरणाच्या दस्तऐवजात आम्ही कोणती माहिती गोळा करतो आणि ती कशी वापरतो याचे तपशील आहेत.</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">2. Google DoubleClick DART Cookie / गुगल डार्ट कुकीज</h3>
        <p style="margin-bottom: 10px;">Google is one of a third-party vendor on our site. It uses DART cookies to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" style="color:var(--primary); font-weight:bold;">Google Privacy Policy</a>.</p>
        <p style="color: var(--text-main); font-weight: 500; margin-top: 0;">गुगल हे आमच्या साइटवरील तृतीय-पक्ष विक्रेत्यांपैकी एक आहे. इंटरनेटवरील इतर साइट्स आणि आमच्या साइटच्या भेटीवर आधारित अभ्यागतांना जाहिराती दाखवण्यासाठी गुगल DART कुकीज वापरते. अभ्यागत गुगल जाहिरात नेटवर्क गोपनीयता धोरणाला भेट देऊन DART कुकीजचा वापर नाकारू शकतात.</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">3. Our Advertising Partners / आमचे जाहिरातदार</h3>
        <p style="margin-bottom: 10px;">Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Each of our advertising partners has their own Privacy Policy for their policies on user data.</p>
        <p style="color: var(--text-main); font-weight: 500; margin-top: 0;">आमच्या साइटवरील काही जाहिरातदार कुकीज वापरू शकतात. आमच्या जाहिरात भागीदारांमध्ये Google AdSense समाविष्ट आहे. वापरकर्त्यांच्या डेटावरील धोरणांसाठी त्यांच्याकडे स्वतःचे गोपनीयता धोरण आहे.</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">4. Log Files / लॉग फाइल्स</h3>
        <p style="margin-bottom: 10px;">Vitthal Speaks follows a standard procedure of using log files. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
        <p style="color: var(--text-main); font-weight: 500; margin-top: 0;">विठ्ठल स्पीक्स लॉग फाइल्स वापरण्याच्या मानक प्रक्रियेचे पालन करते. या फाइल्स अभ्यागत जेव्हा वेबसाइटला भेट देतात तेव्हा त्यांची नोंद घेतात. यामध्ये आयपी (IP) ॲड्रेस, ब्राउझर प्रकार, तारीख आणि वेळेची नोंद असते. ही कोणतीही वैयक्तिकरीत्या ओळखता येण्याजोगी माहिती नसते.</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.3rem;">5. Consent / संमती</h3>
        <p style="margin-bottom: 10px;">By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
        <p style="color: var(--text-main); font-weight: 500; margin-top: 0;">आमची वेबसाइट वापरून, तुम्ही याद्वारे आमच्या गोपनीयता धोरणास संमती देता आणि त्यातील अटी व शर्तींना सहमती दर्शवता.</p>
      </div>

      <div style="margin-bottom: 10px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 30px;">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 1.4rem;">6. Contact Us / संपर्क साधा</h3>
        <p style="margin-bottom: 10px;">If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us through email.</p>
        <p style="color: var(--text-main); font-weight: 600; margin-bottom: 20px;">तुम्हाला आमच्या गोपनीयता धोरणाबद्दल काही प्रश्न असल्यास किंवा अधिक माहितीची आवश्यकता असल्यास, कृपया आमच्याशी संपर्क साधा.</p>
        <a href="mailto:vitthalaherblogs@gmail.com" class="btn-submit" style="display:inline-block; width:auto; text-decoration:none; font-size: 1.1rem; padding: 12px 30px;">✉️ Email: vitthalaherblogs@gmail.com</a>
      </div>
    </div>
  `;
  const privacyHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    ${generateSEO("Privacy Policy - Vitthal Speaks", "/privacy-policy", null)}<style>${globalCSS}</style>${dynamicScripts}</head>
    <body>${headerNavHtml}<div class="container">${privacyContent}</div></body></html>`;
  fs.writeFileSync(path.join(rootPath, 'privacy-policy.html'), privacyHtml);

  // 5. GENERATE 404 PAGE
  const notFoundHtml = `<!DOCTYPE html><html lang="mr"><head><meta charset="UTF-8">
    ${generateSEO("Page Not Found", "/404", null)}<style>${globalCSS}</style>${dynamicScripts}</head>
    <body>${headerNavHtml}
    <div class="container" style="text-align: center; max-width: 800px; padding: 60px 20px;">
      <h1 style="color: var(--accent-red); font-size: 5rem; margin: 0; line-height:1;">४०४</h1>
      <h2 style="font-size: 2rem; color: var(--primary-dark);">माफ करा, ही पोस्ट उपलब्ध नाही.</h2>
      <a href="${SITE_BASE}/" style="background: var(--primary-dark); color: white; padding: 12px 30px; border-radius: 30px; font-weight: 700; font-size: 1rem;">मुख्यपृष्ठावर परत जा</a>
    </div></body></html>`;
  fs.writeFileSync(path.join(rootPath, '404.html'), notFoundHtml);
}

buildSite();
