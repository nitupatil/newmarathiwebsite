const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase
const SUPABASE_URL = 'https://ediqthdjnsrorcktldiu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF0aGRqbnNyb3Jja3RsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDMxMzQsImV4cCI6MjEwMzIxOTEzNH0.uYsfs-T7qR-2krUushlPI0tDqONTYU1AIzEIud-_BNM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_BASE = '/newmarathiwebsite'; 

const globalScripts = `
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5T2TC3J4G2"></script>
  <script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-5T2TC3J4G2');</script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const db = window.supabase.createClient('${SUPABASE_URL}', '${SUPABASE_KEY}');
    async function trackBlogView(id) { await db.rpc('increment_blog_view', { row_id: id }); }
    async function trackAdView(id) { await db.rpc('increment_ad_view', { row_id: id }); }
    async function trackAdClick(id, url) { 
      await db.rpc('increment_ad_click', { row_id: id }); 
      if(url) window.open(url, '_blank'); 
    }
    function copyLink() {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  </script>
`;

const globalCSS = `
  :root { --bg: #f4f6f8; --card: #ffffff; --text: #1a1a1a; --muted: #666; --primary: #0056b3; --accent: #ff9800; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 0; line-height: 1.6; }
  .header-banner { background: #fff; text-align: center; border-bottom: 3px solid var(--accent); box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 10px 0; }
  .header-banner img { max-width: 100%; height: auto; max-height: 120px; object-fit: contain; }
  nav { background: var(--primary); padding: 12px 20px; display: flex; justify-content: center; gap: 20px; }
  nav a { color: white; text-decoration: none; font-weight: 600; font-size: 1rem; }
  .container { max-width: 900px; margin: 30px auto; padding: 0 16px; min-height: 70vh; }
  .featured-post { background: var(--card); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 24px; text-decoration: none; color: inherit; display: block; }
  .featured-content { padding: 24px; }
  .featured-title { font-size: 1.8rem; font-weight: 800; margin: 0 0 10px 0; color: var(--primary); }
  .news-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  .news-item { display: flex; background: var(--card); border-radius: 10px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-decoration: none; color: inherit; align-items: center; gap: 16px; }
  .news-thumbnail { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; background: #e0e0e0; flex-shrink: 0; }
  .news-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 6px 0; }
  .news-excerpt { font-size: 0.9rem; color: var(--muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .article-card { background: var(--card); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
  .article-title { font-size: 2.2rem; margin-top: 0; margin-bottom: 20px; line-height: 1.3; }
  .share-bar { display: flex; gap: 10px; margin: 20px 0; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .share-btn { padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; color: white; cursor: pointer; border: none; display: flex; align-items: center; gap: 6px; }
  .share-wa { background: #25D366; } .share-link { background: var(--muted); }
  .ad-unit { margin: 24px 0; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; }
  .ad-label { font-size: 0.75rem; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
  .ad-media { width: 100%; max-width: 728px; height: auto; max-height: 350px; object-fit: contain; border-radius: 8px; display: block; margin: 0 auto; }
  @media (max-width: 600px) {
    .article-card { padding: 20px; }
    .article-title { font-size: 1.6rem; }
    .news-item { flex-direction: row-reverse; }
    .news-thumbnail { width: 80px; height: 80px; }
  }
`;

const headerHTML = `
  <header class="header-banner">
    <img src="https://i.ibb.co/3s6q2XQ/bjp351SB.png" alt="Vitthal Speaks" onerror="this.src='https://placehold.co/800x120?text=Vitthal+Speaks'">
  </header>
  <nav>
    <a href="${SITE_BASE}/">Home</a>
    <a href="${SITE_BASE}/contact">Contact</a>
    <a href="${SITE_BASE}/privacy-policy">Privacy</a>
  </nav>
`;

async function buildSite() {
  const rootPath = __dirname;
  const { data: posts } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  const { data: ads } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  let adHtml = '';
  if (ads && ads.length > 0) {
    const ad = ads[0];
    let media = ad.media_type === 'youtube' 
      ? `<iframe width="100%" height="250" src="${ad.media_url}" frameborder="0" style="border-radius:8px; max-width:728px;"></iframe>`
      : `<img src="${ad.media_url}" class="ad-media">`;
    adHtml = `<div class="ad-unit" onclick="trackAdClick(${ad.id}, '${ad.target_url || ''}')"><div class="ad-label">Advertisement</div>${media}<script>window.addEventListener('DOMContentLoaded', () => trackAdView(${ad.id}));</script></div>`;
  }

  const extractImg = (html) => { const match = html.match(/<img[^>]+src="([^">]+)"/); return match ? match[1] : 'https://placehold.co/150x150?text=News'; };

  // Generate Index Page
  let featuredHtml = '', othersHtml = '';
  if (posts && posts.length > 0) {
    const featured = posts[0];
    const others = posts.slice(1);
    featuredHtml = `<a href="${SITE_BASE}/${featured.slug}" class="featured-post"><div class="featured-content"><h2 class="featured-title">${featured.title}</h2><p>${featured.excerpt}</p></div></a>`;
    othersHtml = others.map(p => `<a href="${SITE_BASE}/${p.slug}" class="news-item"><div><h3 class="news-title">${p.title}</h3><p class="news-excerpt">${p.excerpt}</p></div><img src="${extractImg(p.content)}" class="news-thumbnail"></a>`).join('');
  } else {
    featuredHtml = `<div class="featured-post" style="text-align: center; padding: 40px; background: var(--card); border-radius: 12px;"><h2 class="featured-title">नवीन माहिती लवकरच येत आहे!</h2><p style="color: var(--muted);">सध्या कोणतीही बातमी उपलब्ध नाही.</p></div>`;
  }

  const indexHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Vitthal Speaks - News</title><style>${globalCSS}</style>${globalScripts}</head><body>${headerHTML}<div class="container">${featuredHtml}${adHtml}<div class="news-grid">${othersHtml}</div></div></body></html>`;
  fs.writeFileSync(path.join(rootPath, 'index.html'), indexHtml);

  // Generate Individual Posts
  if (posts) {
    posts.forEach(post => {
      let relatedHtml = posts.filter(p => p.id !== post.id).slice(0, 3).map(p => `<a href="${SITE_BASE}/${p.slug}" class="news-item"><div><h4 class="news-title" style="font-size:1rem;">${p.title}</h4></div><img src="${extractImg(p.content)}" class="news-thumbnail" style="width:60px; height:60px;"></a>`).join('');
      const postHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${post.title} - Vitthal Speaks</title><style>${globalCSS}</style>${globalScripts}</head><body>${headerHTML}<div class="container"><div class="article-card"><h1 class="article-title">${post.title}</h1><div class="share-bar"><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - Read here: ')}" class="share-btn share-wa" target="_blank" onclick="this.href += window.location.href;">WhatsApp</a><button onclick="copyLink()" class="share-btn share-link">Copy Link</button></div>${adHtml}<div class="article-content" style="font-size: 1.1rem;">${post.content}</div></div><h3 style="margin-top: 40px; border-bottom: 2px solid var(--accent); padding-bottom: 8px;">Related News</h3><div class="news-grid" style="margin-top: 20px;">${relatedHtml}</div></div><script>window.addEventListener('DOMContentLoaded', () => trackBlogView(${post.id}));</script></body></html>`;
      fs.writeFileSync(path.join(rootPath, `${post.slug}.html`), postHtml);
    });
  }

  // Generate 404 Error Page (The New Addition!)
  let suggestedHtml = '';
  if (posts && posts.length > 0) {
    suggestedHtml = posts.slice(0, 3).map(p => `<a href="${SITE_BASE}/${p.slug}" class="news-item"><div><h4 class="news-title" style="font-size:1rem;">${p.title}</h4></div><img src="${extractImg(p.content)}" class="news-thumbnail" style="width:60px; height:60px;"></a>`).join('');
  }
  
  const notFoundHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Page Not Found - Vitthal Speaks</title><style>${globalCSS}</style>${globalScripts}</head><body>${headerHTML}<div class="container"><div class="article-card" style="text-align: center; padding: 60px 20px;"><h1 style="color: var(--accent); font-size: 4rem; margin: 0 0 10px 0;">४०४</h1><h2 style="font-size: 1.8rem; margin-top: 0;">माफ करा, ही पोस्ट उपलब्ध नाही.</h2><p style="color: var(--muted); margin-bottom: 30px; font-size: 1.1rem;">तुम्ही शोधत असलेली पोस्ट डिलीट केली गेली असू शकते किंवा लिंक चुकीची असू शकते.</p><a href="${SITE_BASE}/" style="display: inline-block; background: var(--primary); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">मुख्यपृष्ठावर परत जा (Go to Home)</a></div><h3 style="margin-top: 40px; border-bottom: 2px solid var(--accent); padding-bottom: 8px;">नवीनतम लेख वाचा (Read Latest Posts)</h3><div class="news-grid" style="margin-top: 20px;">${suggestedHtml}</div></div></body></html>`;
  fs.writeFileSync(path.join(rootPath, '404.html'), notFoundHtml);

  // Generate Static Pages
  const staticPages = [
    { slug: 'contact', title: 'Contact Us', content: '<div class="article-card"><h1 class="article-title">Contact Us</h1><p>Email us at: support@example.com</p></div>' },
    { slug: 'privacy-policy', title: 'Privacy Policy', content: '<div class="article-card"><h1 class="article-title">Privacy Policy</h1><p>Your privacy is important to us.</p></div>' }
  ];
  staticPages.forEach(page => {
    const pageHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${page.title} - Vitthal Speaks</title><style>${globalCSS}</style>${globalScripts}</head><body>${headerHTML}<div class="container">${page.content}</div></body></html>`;
    fs.writeFileSync(path.join(rootPath, `${page.slug}.html`), pageHtml);
  });
}
buildSite();
