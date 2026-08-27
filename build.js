const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ============================================================
// 1. INITIALIZE SUPABASE
// ============================================================

const SUPABASE_URL = 'https://ediqthdjnsrorcktldiu.supabase.co';
const SUPABASE_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXF0aGRqbnNyb3Jja3RsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDMxMzQsImV4cCI6MjEwMzIxOTEzNH0.uYsfs-T7qR-2krUushlPI0tDqONTYU1AIzEIud-_BNM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_BASE = '/newmarathiwebsite';
const FULL_SITE_URL = 'https://nitupatil.github.io' + SITE_BASE;

const AVATAR_URL =
  'https://i.ibb.co/BVw78vKq/394000910-240835825678358-5228163708350764536-n-removebg-preview.png';

const FAVICON_URL =
  'https://i.ibb.co/SwTxjYrw/394000910-240835825678358-5228163708350764536-n.jpg';

// ============================================================
// HELPERS
// ============================================================

const escapeAttr = (str) => {
  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

function formatMarathiDate(dateString) {
  if (!dateString) return '';

  const d = new Date(dateString);

  if (isNaN(d)) return '';

  const months = [
    'जानेवारी',
    'फेब्रुवारी',
    'मार्च',
    'एप्रिल',
    'मे',
    'जून',
    'जुलै',
    'ऑगस्ट',
    'सप्टेंबर',
    'ऑक्टोबर',
    'नोव्हेंबर',
    'डिसेंबर'
  ];

  const date = String(d.getDate()).replace(
    /\d/g,
    x => '०१२३४५६७८९'[x]
  );

  const year = String(d.getFullYear()).replace(
    /\d/g,
    x => '०१२३४५६७८९'[x]
  );

  return `📅 ${date} ${months[d.getMonth()]} ${year}`;
}

const extractImg = (html) => {
  if (!html) {
    return 'https://placehold.co/600x400?text=News';
  }

  const match = html.match(
    /<img[^>]+src=['"]([^'"]+)['"]/i
  );

  return match
    ? match[1]
    : 'https://placehold.co/600x400?text=News';
};

// ============================================================
// YOUTUBE URL PARSER
// ============================================================

function getYouTubeEmbedUrl(url) {
  if (!url) return '';

  try {
    let videoId = '';

    if (url.includes('youtu.be/')) {
      videoId = url
        .split('youtu.be/')[1]
        .split('?')[0];
    } else if (url.includes('watch')) {
      videoId = new URLSearchParams(
        url.split('?')[1]
      ).get('v');
    } else if (url.includes('embed/')) {
      return url;
    }

    return videoId
      ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`
      : url;

  } catch (e) {
    return url;
  }
}

// ============================================================
// GLOBAL CSS
// MOBILE FIX:
// - NO horizontal page movement
// - NO 100vw overflow
// - Stable touch scrolling
// - Images/videos stay inside viewport
// - Flex/grid children can shrink
// - Mobile navigation cannot push page sideways
// ============================================================

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&display=swap');

  :root {
    --primary: #001f3f;
    --primary-dark: #000000;
    --accent-yellow: #ffc107;
    --accent-orange: #ff9800;
    --accent-red: #d32f2f;
    --bg-light: #f4f6f8;
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #475569;
    --radius: 8px;
    --shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  /* =========================================================
     GLOBAL MOBILE / VIEWPORT SAFETY
     ========================================================= */

  html {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-x: clip;
    overscroll-behavior-x: none;
    touch-action: pan-y;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    max-width: 100%;
  }

  body {
    font-family: 'Noto Sans Devanagari', 'Poppins', sans-serif;
    background: var(--bg-light);
    color: var(--text-main);
    margin: 0;
    padding: 0;
    line-height: 1.7;

    /* IMPORTANT:
       Do NOT use width:100vw.
       100vw can include the scrollbar width and create
       horizontal page movement on mobile/desktop. */
    width: 100%;
    max-width: 100%;
    min-width: 0;

    overflow-x: hidden;
    overflow-x: clip;

    overscroll-behavior-x: none;
    touch-action: pan-y;
  }

  body,
  main,
  header,
  section,
  article,
  footer,
  div,
  nav {
    min-width: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  img,
  video,
  iframe,
  svg,
  canvas {
    max-width: 100%;
  }

  img {
    height: auto;
  }

  iframe {
    border: 0;
  }

  input,
  textarea,
  button,
  select {
    font-family: inherit;
    max-width: 100%;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  /* Prevent long text / URLs from creating horizontal overflow */
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
  a,
  li,
  td,
  th,
  pre,
  code {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  pre {
    max-width: 100%;
    overflow-x: auto;
  }

  #progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--accent-yellow);
    width: 0%;
    max-width: 100%;
    z-index: 9999;
    pointer-events: none;
  }

  /* =========================================================
     HEADER
     ========================================================= */

  .main-header {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 4%;

    max-width: 1600px;
    margin: 0 auto;

    width: 100%;
    min-width: 0;
  }

  .custom-brand {
    display: flex;
    align-items: center;
    gap: 12px;

    min-width: 0;
    max-width: 100%;
  }

  .brand-avatar {
    width: 50px;
    height: 50px;

    min-width: 50px;
    max-width: 50px;

    border-radius: 50%;
    object-fit: cover;

    background-color: var(--accent-orange);
    border: 2px solid var(--primary-dark);

    flex-shrink: 0;
  }

  .brand-text-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;

    min-width: 0;
    max-width: 100%;
  }

  .brand-text {
    font-family: 'Poppins', sans-serif;

    font-size: 1.5rem;
    font-weight: 800;

    color: var(--primary-dark);

    line-height: 1;

    display: flex;
    align-items: baseline;

    gap: 2px;
    margin-bottom: 4px;

    min-width: 0;
    max-width: 100%;

    overflow-wrap: anywhere;
  }

  .brand-tld {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary);

    flex-shrink: 0;
  }

  .brand-tagline {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--primary);

    max-width: 100%;
    overflow-wrap: anywhere;
  }

  /* =========================================================
     SEARCH + DATE
     ========================================================= */

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    min-width: 0;
    max-width: 100%;
  }

  .datetime-box {
    font-size: 0.85rem;
    font-weight: 600;

    color: var(--text-muted);
    background: #f8fafc;

    padding: 6px 12px;

    border-radius: 6px;
    border: 1px solid #e2e8f0;

    white-space: nowrap;
    flex-shrink: 1;
  }

  .search-wrapper {
    position: relative;

    width: 100%;
    max-width: 300px;
    min-width: 0;

    flex-shrink: 1;
  }

  .search-input {
    display: block;

    width: 100%;
    max-width: 100%;

    padding: 8px 16px;

    border: 1px solid #cbd5e1;
    border-radius: 20px;

    outline: none;

    font-size: 0.9rem;
    background: #f8fafc;

    min-width: 0;
  }

  .search-input:focus {
    border-color: var(--primary);
    background: #fff;
  }

  .search-results {
    display: none;

    position: absolute;

    top: 40px;
    left: 0;
    right: 0;

    width: 100%;
    max-width: 100%;

    background: #fff;

    box-shadow: var(--shadow);

    border-radius: 8px;

    max-height: 300px;

    overflow-y: auto;
    overflow-x: hidden;

    z-index: 1001;
  }

  .search-result-item {
    padding: 10px 15px;

    border-bottom: 1px solid #f1f5f9;

    display: block;

    font-size: 0.85rem;
    font-weight: 600;

    color: var(--primary);

    max-width: 100%;

    overflow-wrap: anywhere;
  }

  .search-result-item:hover {
    background: #f8fafc;
    color: var(--accent-orange);
  }

  /* =========================================================
     STICKY NAVIGATION
     ========================================================= */

  .nav-bar {
    background: var(--primary-dark);
    color: #fff;

    display: flex;
    justify-content: center;
    align-items: center;

    border-bottom: 3px solid var(--accent-yellow);

    position: sticky;
    top: 0;

    z-index: 1000;

    box-shadow: 0 4px 10px rgba(0,0,0,0.1);

    width: 100%;
    max-width: 100%;

    overflow: hidden;

    /* Prevent horizontal gesture from moving nav/page */
    touch-action: pan-y;
  }

  .horizontal-nav {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    gap: 30px;

    width: 100%;
    max-width: 1600px;

    padding: 0 4%;
    margin: 0 auto;

    min-width: 0;

    overflow: hidden;

    touch-action: pan-y;
  }

  .horizontal-nav a {
    font-size: 0.95rem;
    font-weight: 600;

    padding: 10px 0;

    transition: color 0.2s;

    white-space: nowrap;

    flex-shrink: 0;
  }

  .horizontal-nav a:hover {
    color: var(--accent-yellow);
  }

  /* =========================================================
     TICKER
     ========================================================= */

  .ticker-wrap {
    display: flex;
    align-items: center;

    background: #fff;

    padding: 6px 4%;

    border-bottom: 1px solid #e2e8f0;

    font-size: 0.9rem;

    width: 100%;
    max-width: 100%;

    overflow: hidden;

    touch-action: pan-y;
  }

  .ticker-label {
    background: var(--accent-red);
    color: #fff;

    font-weight: 700;

    padding: 2px 10px;

    border-radius: 4px;

    margin-right: 15px;

    display: flex;
    align-items: center;

    flex-shrink: 0;

    white-space: nowrap;
  }

  .ticker-wrap > div {
    min-width: 0;
    overflow: hidden;
  }

  .ticker-move {
    display: inline-block;

    animation: ticker 25s linear infinite;

    white-space: nowrap;

    padding-left: 100%;

    will-change: transform;
  }

  .ticker-item {
    margin-right: 40px;

    font-weight: 600;
    color: var(--primary-dark);

    white-space: nowrap;
  }

  /* =========================================================
     MAIN LAYOUT
     ========================================================= */

  .container {
    width: 100%;
    max-width: 1600px;

    margin: 25px auto;

    padding: 0 4%;

    min-height: 70vh;

    min-width: 0;
  }

  .section-title {
    font-size: 1.4rem;
    font-weight: 800;

    border-bottom: 3px solid var(--accent-yellow);

    padding-bottom: 4px;

    margin: 0 0 20px;

    color: var(--primary-dark);

    display: inline-block;

    max-width: 100%;

    overflow-wrap: anywhere;
  }

  .article-layout {
    display: flex;

    flex-direction: column;

    gap: 30px;

    width: 100%;
    max-width: 100%;

    min-width: 0;
  }

  .article-main {
    flex: 1 1 auto;

    min-width: 0;

    width: 100%;
    max-width: 100%;
  }

  .article-sidebar {
    width: 100%;
    max-width: 100%;

    display: block;

    min-width: 0;
  }

  /* =========================================================
     DESKTOP LAYOUT
     ========================================================= */

  @media (min-width: 1024px) {

    .article-layout {
      flex-direction: row;
      align-items: flex-start;
    }

    .article-main {
      flex: 3 1 0;
      min-width: 0;
    }

    .article-sidebar {
      flex: 1 1 0;

      min-width: 320px;
      max-width: 400px;

      position: sticky;
      top: 60px;

      max-height: calc(100vh - 80px);

      overflow-y: auto;
      overflow-x: hidden;

      padding-right: 10px;
    }
  }

  /* =========================================================
     GRID + CARDS
     ========================================================= */

  .news-grid {
    display: grid;

    grid-template-columns:
      repeat(auto-fill, minmax(min(280px, 100%), 1fr));

    gap: 20px;

    width: 100%;
    max-width: 100%;

    min-width: 0;
  }

  .post-card {
    background: var(--card-bg);

    border-radius: var(--radius);

    overflow: hidden;

    box-shadow: var(--shadow);

    transition:
      transform 0.2s,
      box-shadow 0.2s;

    border: 1px solid #e2e8f0;

    display: flex;
    flex-direction: column;

    min-width: 0;
    max-width: 100%;

    width: 100%;
  }

  .post-card:hover {
    transform: translateY(-4px);

    box-shadow:
      0 6px 15px rgba(0,0,0,0.08);
  }

  .card-img-wrap {
    height: 160px;

    overflow: hidden;

    width: 100%;
    max-width: 100%;

    flex-shrink: 0;
  }

  .card-img-wrap img {
    width: 100%;
    height: 100%;

    max-width: 100%;

    object-fit: cover;

    transition: transform 0.5s;

    display: block;
  }

  .post-card:hover .card-img-wrap img {
    transform: scale(1.05);
  }

  .card-content {
    padding: 15px;

    flex-grow: 1;

    display: flex;
    flex-direction: column;

    min-width: 0;
    max-width: 100%;
  }

  .card-title {
    font-size: 1.1rem;

    font-weight: 700;

    margin: 0 0 8px;

    line-height: 1.4;

    color: var(--primary-dark);

    min-width: 0;
    max-width: 100%;

    overflow-wrap: anywhere;
  }

  /* =========================================================
     ARTICLE
     ========================================================= */

  .article-card {
    background: var(--card-bg);

    border-radius: var(--radius);

    padding: 30px;

    box-shadow: var(--shadow);

    width: 100%;
    max-width: 100%;

    min-width: 0;

    overflow: hidden;
  }

  .article-title {
    font-size: 2.2rem;

    font-weight: 800;

    color: var(--primary-dark);

    line-height: 1.3;

    margin: 0 0 15px;

    min-width: 0;
    max-width: 100%;

    overflow-wrap: anywhere;
  }

  .article-meta {
    font-size: 0.95rem;

    color: var(--text-muted);

    padding-bottom: 15px;

    border-bottom: 1px solid #e2e8f0;

    margin-bottom: 25px;

    font-weight: 600;

    max-width: 100%;

    overflow-wrap: anywhere;
  }

  .article-content {
    font-size: 1.15rem;

    line-height: 1.8;

    color: #333;

    min-width: 0;
    max-width: 100%;

    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .article-content img {
    display: block;

    width: 100%;
    max-width: 100%;

    height: auto;

    border-radius: 8px;

    margin: 20px 0;

    box-shadow: var(--shadow);

    object-fit: contain;
  }

  .article-content iframe,
  .article-content video {
    display: block;

    width: 100%;
    max-width: 100%;

    height: auto;

    margin: 20px 0;

    border: 0;
  }

  .article-content table {
    display: block;

    width: 100%;
    max-width: 100%;

    overflow-x: auto;
    overflow-y: hidden;

    border-collapse: collapse;
  }

  .article-content pre {
    width: 100%;
    max-width: 100%;

    overflow-x: auto;

    white-space: pre;
  }

  /* =========================================================
     SHARE SECTION
     ========================================================= */

  .share-section {
    margin-top: 30px;

    padding: 20px;

    background: #f8fafc;

    border-radius: 8px;

    border: 1px solid #e2e8f0;

    text-align: center;

    width: 100%;
    max-width: 100%;

    min-width: 0;

    overflow: hidden;
  }

  .share-buttons {
    display: flex;

    justify-content: center;

    gap: 15px;

    flex-wrap: wrap;

    margin-top: 15px;

    width: 100%;
    max-width: 100%;
  }

  .share-btn {
    padding: 10px 20px;

    border-radius: 6px;

    font-weight: 600;

    font-size: 0.95rem;

    color: #fff;

    cursor: pointer;

    border: none;

    display: flex;
    align-items: center;

    justify-content: center;

    gap: 6px;

    max-width: 100%;

    min-width: 0;
  }

  .btn-wa {
    background: #25D366;
  }

  .btn-copy {
    background: var(--primary);
  }

  /* =========================================================
     TOAST
     ========================================================= */

  .toast {
    visibility: hidden;

    min-width: 200px;
    max-width: calc(100% - 30px);

    background-color: #333;

    color: #fff;

    text-align: center;

    border-radius: 8px;

    padding: 10px;

    position: fixed;

    z-index: 1000;

    left: 50%;

    bottom: 30px;

    transform: translateX(-50%);

    font-weight: 600;

    font-size: 0.95rem;

    opacity: 0;

    transition:
      opacity 0.3s,
      bottom 0.3s;

    overflow-wrap: anywhere;

    pointer-events: none;
  }

  .toast.show {
    visibility: visible;

    opacity: 1;

    bottom: 50px;
  }

  /* =========================================================
     AD CAROUSEL
     ========================================================= */

  .ad-slider-container {
    width: 100%;
    max-width: 100%;

    background: #000;

    border-radius: 8px;

    box-shadow: var(--shadow);

    margin: 25px 0;

    position: relative;

    overflow: hidden;

    text-align: center;

    min-width: 0;

    touch-action: pan-y;
  }

  .ad-label {
    position: absolute;

    top: 5px;
    left: 5px;

    background: rgba(0,0,0,0.7);

    color: #fff;

    padding: 2px 8px;

    font-size: 0.7rem;

    border-radius: 4px;

    z-index: 10;

    pointer-events: none;
  }

  .ad-slide {
    display: none;

    width: 100%;
    max-width: 100%;

    animation: fade 0.5s;

    background: #000;

    min-width: 0;

    overflow: hidden;
  }

  .ad-slide.active {
    display: block;
  }

  .ad-media-img {
    width: 100%;
    max-width: 100%;

    height: auto;

    max-height: 450px;

    object-fit: contain;

    cursor: pointer;

    display: block;

    margin: 0 auto;
  }

  .ad-media-yt {
    width: 100%;
    max-width: 100%;

    aspect-ratio: 16 / 9;

    border: none;

    display: block;

    margin: 0;

    padding: 0;
  }

  .ad-dots {
    position: absolute;

    bottom: 10px;

    left: 0;

    width: 100%;
    max-width: 100%;

    display: flex;

    justify-content: center;

    gap: 8px;

    z-index: 10;

    pointer-events: auto;
  }

  .ad-dot {
    height: 10px;
    width: 10px;

    min-width: 10px;

    background-color: rgba(255,255,255,0.4);

    border-radius: 50%;

    cursor: pointer;
  }

  .ad-dot.active {
    background-color: var(--accent-yellow);
  }

  /* =========================================================
     MOBILE
     ========================================================= */

  @media (max-width: 768px) {

    html,
    body {
      width: 100%;
      max-width: 100%;

      margin: 0;
      padding: 0;

      overflow-x: hidden;
      overflow-x: clip;

      overscroll-behavior-x: none;

      /* Allow vertical finger scrolling only */
      touch-action: pan-y;
    }

    /* ---------------------------------------------------------
       HEADER
       --------------------------------------------------------- */

    .header-top {
      flex-direction: column;

      gap: 12px;

      padding: 15px 4%;

      align-items: center;

      width: 100%;
      max-width: 100%;

      overflow: hidden;
    }

    .custom-brand {
      width: 100%;
      max-width: 100%;

      justify-content: center;

      min-width: 0;
    }

    .brand-text-wrapper {
      min-width: 0;
      max-width: calc(100% - 62px);
    }

    .brand-text {
      font-size: 1.35rem;

      max-width: 100%;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;
    }

    .brand-tagline {
      font-size: 0.72rem;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;
    }

    .header-right {
      width: 100%;
      max-width: 100%;

      justify-content: center;

      min-width: 0;
    }

    .search-wrapper {
      width: 100%;
      max-width: 100%;
      min-width: 0;
    }

    .search-input {
      width: 100%;
      max-width: 100%;
    }

    /* Hide date/time on mobile */
    .datetime-box {
      display: none;
    }

    /* ---------------------------------------------------------
       MOBILE NAV
       --------------------------------------------------------- */

    .nav-bar {
      width: 100%;
      max-width: 100%;

      overflow: hidden;

      touch-action: pan-y;
    }

    .horizontal-nav {
      width: 100%;
      max-width: 100%;

      justify-content: space-between;

      align-items: center;

      gap: 0;

      padding: 0 5%;

      overflow: hidden;

      touch-action: pan-y;
    }

    .horizontal-nav a {
      font-size: 0.78rem;

      padding: 10px 0;

      flex: 0 0 auto;

      white-space: nowrap;

      text-align: center;
    }

    /* ---------------------------------------------------------
       TICKER
       --------------------------------------------------------- */

    .ticker-wrap {
      width: 100%;
      max-width: 100%;

      padding-left: 3%;
      padding-right: 3%;

      overflow: hidden;

      touch-action: pan-y;
    }

    .ticker-label {
      margin-right: 8px;

      padding-left: 7px;
      padding-right: 7px;

      font-size: 0.75rem;
    }

    .ticker-move {
      animation-duration: 22s;
    }

    /* ---------------------------------------------------------
       CONTAINER
       --------------------------------------------------------- */

    .container {
      width: 100%;
      max-width: 100%;

      margin: 18px auto;

      padding-left: 4%;
      padding-right: 4%;

      min-width: 0;

      overflow: visible;
    }

    /* ---------------------------------------------------------
       ARTICLE
       --------------------------------------------------------- */

    .article-layout {
      width: 100%;
      max-width: 100%;

      gap: 20px;

      min-width: 0;
    }

    .article-main {
      width: 100%;
      max-width: 100%;

      min-width: 0;
    }

    .article-card {
      width: 100%;
      max-width: 100%;

      padding: 16px;

      border-radius: 8px;

      overflow: hidden;
    }

    .article-title {
      font-size: 1.55rem;

      line-height: 1.4;

      margin-bottom: 12px;

      max-width: 100%;
    }

    .article-meta {
      font-size: 0.82rem;

      line-height: 1.6;

      margin-bottom: 18px;

      padding-bottom: 12px;
    }

    .article-content {
      font-size: 1rem;

      line-height: 1.75;

      width: 100%;
      max-width: 100%;

      min-width: 0;
    }

    .article-content img {
      width: 100%;
      max-width: 100%;

      height: auto;

      margin: 15px 0;

      border-radius: 6px;
    }

    .article-content iframe {
      width: 100%;
      max-width: 100%;

      min-height: 200px;
    }

    /* ---------------------------------------------------------
       SHARE BUTTONS
       --------------------------------------------------------- */

    .share-section {
      padding: 15px;

      margin-top: 22px;

      width: 100%;
      max-width: 100%;

      overflow: hidden;
    }

    .share-buttons {
      flex-direction: column;

      align-items: stretch;

      gap: 10px;

      width: 100%;
      max-width: 100%;
    }

    .share-btn {
      width: 100%;
      max-width: 100%;

      min-height: 44px;

      padding: 10px 12px;

      font-size: 0.9rem;
    }

    /* ---------------------------------------------------------
       SIDEBAR
       --------------------------------------------------------- */

    .article-sidebar {
      width: 100%;
      max-width: 100%;

      min-width: 0;

      overflow: hidden;
    }

    /* ---------------------------------------------------------
       GRID
       --------------------------------------------------------- */

    .news-grid {
      grid-template-columns: minmax(0, 1fr);

      gap: 15px;

      width: 100%;
      max-width: 100%;

      min-width: 0;
    }

    .post-card {
      width: 100%;
      max-width: 100%;

      min-width: 0;

      overflow: hidden;
    }

    .card-img-wrap {
      width: 100%;
      max-width: 100%;

      height: 180px;
    }

    .card-content {
      width: 100%;
      max-width: 100%;

      padding: 13px;
    }

    .card-title {
      font-size: 1rem;

      line-height: 1.45;
    }

    /* ---------------------------------------------------------
       ADS
       --------------------------------------------------------- */

    .ad-slider-container {
      width: 100%;
      max-width: 100%;

      margin: 18px 0;

      border-radius: 6px;

      overflow: hidden;
    }

    .ad-media-img {
      width: 100%;
      max-width: 100%;

      height: auto;

      max-height: none;

      object-fit: contain;
    }

    .ad-media-yt {
      width: 100%;
      max-width: 100%;

      aspect-ratio: 16 / 9;
    }

    .ad-dots {
      bottom: 7px;

      gap: 6px;
    }

    .ad-dot {
      width: 8px;
      height: 8px;

      min-width: 8px;
    }

    /* ---------------------------------------------------------
       TITLES
       --------------------------------------------------------- */

    .section-title {
      font-size: 1.2rem;

      max-width: 100%;
    }

    /* ---------------------------------------------------------
       404
       --------------------------------------------------------- */

    .container[style*="text-align: center"] {
      width: 100% !important;
      max-width: 100% !important;

      padding-left: 4% !important;
      padding-right: 4% !important;
    }
  }

  /* =========================================================
     VERY SMALL PHONES
     ========================================================= */

  @media (max-width: 380px) {

    .header-top {
      padding-left: 3%;
      padding-right: 3%;
    }

    .brand-avatar {
      width: 44px;
      height: 44px;

      min-width: 44px;
      max-width: 44px;
    }

    .custom-brand {
      gap: 8px;
    }

    .brand-text-wrapper {
      max-width: calc(100% - 52px);
    }

    .brand-text {
      font-size: 1.15rem;
    }

    .brand-tagline {
      font-size: 0.65rem;
    }

    .horizontal-nav {
      padding-left: 3%;
      padding-right: 3%;
    }

    .horizontal-nav a {
      font-size: 0.72rem;
    }

    .container {
      padding-left: 3%;
      padding-right: 3%;
    }

    .article-card {
      padding: 13px;
    }

    .article-title {
      font-size: 1.4rem;
    }

    .article-content {
      font-size: 0.96rem;
    }
  }

  /* =========================================================
     ANIMATIONS
     ========================================================= */

  @keyframes fade {
    from {
      opacity: 0.4;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes ticker {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }

  /* =========================================================
     REDUCE MOTION
     ========================================================= */

  @media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ============================================================
// CLIENT SCRIPTS
// ============================================================

const generateGlobalScripts = (postsData) => `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <script>
    const db = window.supabase.createClient(
      '${SUPABASE_URL}',
      '${SUPABASE_KEY}'
    );

    // ========================================================
    // SUPABASE TRACKING
    // ========================================================

    async function trackBlogView(id) {
      try {
        await db.rpc('increment_blog_view', {
          row_id: id
        });
      } catch (e) {
        console.error('Blog view tracking error:', e);
      }
    }

    async function trackAdView(id) {
      try {
        await db.rpc('increment_ad_view', {
          row_id: id
        });
      } catch (e) {
        console.error('Ad view tracking error:', e);
      }
    }

    async function trackAdClick(id, url) {
      try {
        await db.rpc('increment_ad_click', {
          row_id: id
        });
      } catch (e) {
        console.error('Ad click tracking error:', e);
      }

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }

    // ========================================================
    // LIVE TIME
    // ========================================================

    function updateLiveTime() {
      const el = document.getElementById('live-time');

      if (!el) return;

      const now = new Date(
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata'
        })
      );

      const days = [
        'रविवार',
        'सोमवार',
        'मंगळवार',
        'बुधवार',
        'गुरुवार',
        'शुक्रवार',
        'शनिवार'
      ];

      const months = [
        'जानेवारी',
        'फेब्रुवारी',
        'मार्च',
        'एप्रिल',
        'मे',
        'जून',
        'जुलै',
        'ऑगस्ट',
        'सप्टेंबर',
        'ऑक्टोबर',
        'नोव्हेंबर',
        'डिसेंबर'
      ];

      const dayName = days[now.getDay()];

      const dayNum = String(now.getDate()).replace(
        /\\d/g,
        d => '०१२३४५६७८९'[d]
      );

      const year = String(now.getFullYear()).replace(
        /\\d/g,
        d => '०१२३४५६७८९'[d]
      );

      const mHours = String(
        now.getHours() % 12 || 12
      ).replace(
        /\\d/g,
        d => '०१२३४५६७८९'[d]
      );

      const mMin = String(
        now.getMinutes()
      )
        .padStart(2, '0')
        .replace(
          /\\d/g,
          d => '०१२३४५६७८९'[d]
        );

      el.innerText =
        \`📅 \${dayNum} \${months[now.getMonth()]} \${year} | 🕒 \${mHours}:\${mMin}\`;
    }

    setInterval(updateLiveTime, 1000);

    window.addEventListener(
      'DOMContentLoaded',
      updateLiveTime
    );

    // ========================================================
    // SCROLL PROGRESS
    // ========================================================

    window.addEventListener(
      'scroll',
      function() {

        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        const bar =
          document.getElementById('progress-bar');

        if (!bar || height <= 0) return;

        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;

        const percentage =
          Math.min(
            100,
            Math.max(
              0,
              (scrollTop / height) * 100
            )
          );

        bar.style.width =
          percentage + '%';
      },
      {
        passive: true
      }
    );

    // ========================================================
    // SEARCH
    // ========================================================

    const allPosts =
      ${JSON.stringify(postsData)};

    function handleSearch() {

      const inputEl =
        document.getElementById('searchInput');

      const resultsDiv =
        document.getElementById('searchResults');

      if (!inputEl || !resultsDiv) return;

      const input =
        inputEl.value
          .toLowerCase()
          .trim();

      if (input.length < 2) {
        resultsDiv.style.display = 'none';
        return;
      }

      const filtered =
        allPosts.filter(
          p =>
            p.title &&
            p.title
              .toLowerCase()
              .includes(input)
        );

      if (filtered.length > 0) {

        resultsDiv.innerHTML =
          filtered
            .slice(0, 6)
            .map(
              p =>
                \`<a href="${SITE_BASE}/\${p.slug}" class="search-result-item">\${p.title}</a>\`
            )
            .join('');

      } else {

        resultsDiv.innerHTML =
          '<div class="search-result-item" style="color:red;">काहीही सापडले नाही...</div>';
      }

      resultsDiv.style.display = 'block';
    }

    document.addEventListener(
      'click',
      e => {

        const resultsDiv =
          document.getElementById(
            'searchResults'
          );

        if (!resultsDiv) return;

        if (
          !e.target.closest(
            '.search-wrapper'
          )
        ) {
          resultsDiv.style.display =
            'none';
        }
      }
    );

    // ========================================================
    // TOAST
    // ========================================================

    function showToast() {

      const x =
        document.getElementById(
          'toast'
        );

      if (!x) return;

      x.className =
        'toast show';

      setTimeout(
        () => {
          x.className =
            x.className.replace(
              'show',
              ''
            );
        },
        3000
      );
    }

    // ========================================================
    // COPY LINK
    // ========================================================

    function copyCurrentLink() {

      const url =
        window.location.href;

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {

        navigator.clipboard
          .writeText(url)
          .then(() => {
            showToast();
          })
          .catch(() => {
            fallbackCopy(url);
          });

      } else {
        fallbackCopy(url);
      }
    }

    function fallbackCopy(text) {

      const textarea =
        document.createElement(
          'textarea'
        );

      textarea.value = text;

      textarea.style.position =
        'fixed';

      textarea.style.left =
        '-9999px';

      document.body.appendChild(
        textarea
      );

      textarea.select();

      try {
        document.execCommand(
          'copy'
        );
      } catch (e) {
        console.error(
          'Copy failed',
          e
        );
      }

      textarea.remove();

      showToast();
    }

    // ========================================================
    // WHATSAPP SHARE
    // ========================================================

    function shareWhatsApp(title) {

      const shareText =
        title +
        ' - येथे वाचा: ';

      const url =
        'https://api.whatsapp.com/send?text=' +
        encodeURIComponent(
          shareText
        ) +
        encodeURIComponent(
          window.location.href
        );

      window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      );
    }

    // ========================================================
    // AD CAROUSEL
    // ========================================================

    let slideIndex = 0;
    let slideInterval;

    function showSlides() {

      const slides =
        document.getElementsByClassName(
          'ad-slide'
        );

      const dots =
        document.getElementsByClassName(
          'ad-dot'
        );

      if (
        !slides ||
        slides.length === 0
      ) {
        return;
      }

      for (
        let i = 0;
        i < slides.length;
        i++
      ) {

        slides[i].className =
          slides[i].className.replace(
            ' active',
            ''
          );

        if (dots.length > 0) {

          dots[i].className =
            dots[i].className.replace(
              ' active',
              ''
            );
        }
      }

      slideIndex++;

      if (
        slideIndex >
        slides.length
      ) {
        slideIndex = 1;
      }

      slides[
        slideIndex - 1
      ].className += ' active';

      if (dots.length > 0) {

        dots[
          slideIndex - 1
        ].className += ' active';
      }

      const hasIframe =
        slides[
          slideIndex - 1
        ].querySelector(
          'iframe'
        );

      const delay =
        hasIframe
          ? 60000
          : 5000;

      clearTimeout(
        slideInterval
      );

      slideInterval =
        setTimeout(
          showSlides,
          delay
        );
    }

    window.addEventListener(
      'DOMContentLoaded',
      () => {

        if (
          document.getElementsByClassName(
            'ad-slide'
          ).length > 0
        ) {
          showSlides();
        }
      }
    );

    // ========================================================
    // EXTRA MOBILE SAFETY
    // Prevent accidental horizontal gesture on the page.
    // Vertical scrolling remains completely normal.
    // ========================================================

    document.addEventListener(
      'touchmove',
      function(e) {

        /*
         * Do not preventDefault here.
         * That would break normal mobile scrolling.
         *
         * CSS touch-action: pan-y is used instead.
         */
      },
      {
        passive: true
      }
    );
  </script>
`;

// ============================================================
// HTML COMPONENTS
// ============================================================

const generateSEO = (
  title,
  pathStr
) => `
  <title>${escapeAttr(title)}</title>

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  >

  <meta
    name="theme-color"
    content="#000000"
  >

  <link
    rel="icon"
    type="image/jpeg"
    href="${FAVICON_URL}"
  >
`;

// ============================================================
// HEADER
// ============================================================

const generateHeader = () => `
  <div id="progress-bar"></div>

  <header class="main-header">

    <div class="header-top">

      <a
        href="${SITE_BASE}/"
        class="custom-brand"
      >

        <img
          src="${AVATAR_URL}"
          alt="Vitthal Speaks"
          class="brand-avatar"
        >

        <div class="brand-text-wrapper">

          <div class="brand-text">
            VitthalSpeaks
            <span class="brand-tld">
              .com
            </span>
          </div>

          <div class="brand-tagline">
            शासकीय योजना • माहिती • ग्रामपंचायत
          </div>

        </div>

      </a>

      <div class="header-right">

        <div
          class="datetime-box"
          id="live-time"
        >
          लोड होत आहे...
        </div>

        <div class="search-wrapper">

          <input
            type="text"
            id="searchInput"
            class="search-input"
            placeholder="🔍 शोधा..."
            onkeyup="handleSearch()"
            autocomplete="off"
          >

          <div
            id="searchResults"
            class="search-results"
          ></div>

        </div>

      </div>

    </div>

  </header>

  <div class="nav-bar">

    <div class="horizontal-nav">

      <a href="${SITE_BASE}/">
        🏠 Home
      </a>

      <a href="${SITE_BASE}/contact">
        📞 Contact
      </a>

      <a href="${SITE_BASE}/privacy-policy">
        🔒 Privacy Policy
      </a>

    </div>

  </div>
`;

// ============================================================
// AD GENERATOR
// ============================================================

const generateAdCarousel = (
  ads,
  location,
  postSlug = null
) => {

  if (
    !ads ||
    ads.length === 0
  ) {
    return '';
  }

  const activeAds =
    ads.filter(ad => {

      const rule =
        ad.display_rule ||
        'all';

      if (
        rule === 'all'
      ) {
        return true;
      }

      if (
        location === 'home' &&
        (
          rule === 'home_only' ||
          rule === 'home_and_post'
        )
      ) {
        return true;
      }

      if (
        location === 'post' &&
        (
          rule === 'specific_post' ||
          rule === 'home_and_post'
        )
      ) {

        if (
          rule === 'specific_post' &&
          ad.target_slug !== postSlug
        ) {
          return false;
        }

        return true;
      }

      return false;
    });

  if (
    activeAds.length === 0
  ) {
    return '';
  }

  const slidesHtml =
    activeAds
      .map(
        (ad, i) => {

          const isYT =
            ad.media_url.includes(
              'youtube.com'
            ) ||
            ad.media_url.includes(
              'youtu.be'
            ) ||
            ad.media_type ===
              'youtube';

          let media;

          if (isYT) {

            media =
              `<iframe
                class="ad-media-yt"
                src="${getYouTubeEmbedUrl(ad.media_url)}"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
                loading="lazy"
              ></iframe>`;

          } else {

            media =
              `<img
                src="${escapeAttr(ad.media_url)}"
                class="ad-media-img"
                alt="Sponsored advertisement"
                onclick="trackAdClick(${ad.id}, '${escapeAttr(ad.target_url) || ''}')"
              >`;
          }

          return `
            <div class="ad-slide">
              ${media}

              <script>
                window.addEventListener(
                  'DOMContentLoaded',
                  () => trackAdView(${ad.id})
                );
              </script>

            </div>
          `;
        }
      )
      .join('');

  const dotsHtml =
    activeAds.length > 1
      ? `
        <div class="ad-dots">
          ${
            activeAds
              .map(
                (_, i) =>
                  `<span class="ad-dot"></span>`
              )
              .join('')
          }
        </div>
      `
      : '';

  return `
    <div class="ad-slider-container">

      <div class="ad-label">
        प्रायोजित
      </div>

      ${slidesHtml}

      ${dotsHtml}

    </div>
  `;
};

// ============================================================
// CORE BUILDER
// ============================================================

async function buildSite() {

  const rootPath =
    __dirname;

  const {
    data: posts
  } =
    await supabase
      .from('blogs')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false
        }
      );

  const {
    data: ads
  } =
    await supabase
      .from('ads')
      .select('*')
      .order(
        'created_at',
        {
          ascending: false
        }
      );

  const minimalSearchData =
    posts
      ? posts.map(
          p => ({
            title: p.title,
            slug: p.slug
          })
        )
      : [];

  const dynamicScripts =
    generateGlobalScripts(
      minimalSearchData
    );

  const headerNavHtml =
    generateHeader();

  // ==========================================================
  // 1. GENERATE INDIVIDUAL POSTS
  // ==========================================================

  if (posts) {

    posts.forEach(
      (post) => {

        const postAdsHtml =
          generateAdCarousel(
            ads,
            'post',
            post.slug
          );

        const relatedHtml =
          posts
            .filter(
              p =>
                p.id !== post.id
            )
            .slice(0, 6)
            .map(
              p => `
                <a
                  href="${SITE_BASE}/${p.slug}"
                  class="post-card"
                  style="margin-bottom:20px;border-radius:8px;"
                >

                  <div
                    class="card-img-wrap"
                    style="height:100px;"
                  >

                    <img
                      src="${extractImg(p.content)}"
                      alt="${escapeAttr(p.title)}"
                    >

                  </div>

                  <div
                    class="card-content"
                    style="padding:12px;"
                  >

                    <h4
                      style="
                        font-size:1rem;
                        margin:0;
                        color:var(--primary-dark);
                      "
                    >
                      ${escapeAttr(p.title)}
                    </h4>

                  </div>

                </a>
              `
            )
            .join('');

        const postHtml = `
          <!DOCTYPE html>

          <html lang="mr">

          <head>

            <meta charset="UTF-8">

            ${generateSEO(
              post.title,
              `/${post.slug}`
            )}

            <style>
              ${globalCSS}
            </style>

            ${dynamicScripts}

          </head>

          <body>

            ${headerNavHtml}

            <div
              class="container article-layout"
            >

              <div class="article-main">

                <div class="article-card">

                  <h1 class="article-title">
                    ${post.title}
                  </h1>

                  <div class="article-meta">
                    📅 प्रकाशित:
                    ${formatMarathiDate(
                      post.published_at ||
                      post.created_at
                    )}
                  </div>

                  <div class="article-content">
                    ${post.content}
                  </div>

                  <div class="share-section">

                    <h4
                      style="
                        margin-top:0;
                        margin-bottom:10px;
                        font-size:1.05rem;
                        color:var(--primary-dark);
                      "
                    >
                      ही माहिती इतरांसोबत शेअर करा
                    </h4>

                    <div class="share-buttons">

                      <button
                        onclick="shareWhatsApp('${escapeAttr(post.title)}')"
                        class="share-btn btn-wa"
                        type="button"
                      >
                        📱 WhatsApp वर पाठवा
                      </button>

                      <button
                        onclick="copyCurrentLink()"
                        class="share-btn btn-copy"
                        type="button"
                      >
                        🔗 लिंक कॉपी करा
                      </button>

                    </div>

                  </div>

                </div>

                ${postAdsHtml}

              </div>

              <div class="article-sidebar">

                <h3
                  class="section-title"
                  style="margin-top:0;"
                >
                  📌 संबंधित बातम्या
                </h3>

                ${relatedHtml}

              </div>

            </div>

            <div
              id="toast"
              class="toast"
            >
              लिंक कॉपी झाली!
            </div>

            <script>
              window.addEventListener(
                'DOMContentLoaded',
                () => trackBlogView(${post.id})
              );
            </script>

          </body>

          </html>
        `;

        fs.writeFileSync(
          path.join(
            rootPath,
            `${post.slug}.html`
          ),
          postHtml
        );
      }
    );
  }

  // ==========================================================
  // 2. GENERATE HOME PAGE
  // ==========================================================

  if (
    posts &&
    posts.length > 0
  ) {

    const homeAdsHtml =
      generateAdCarousel(
        ads,
        'home'
      );

    const tickerItems =
      posts
        .slice(0, 5)
        .map(
          p =>
            `<a href="${SITE_BASE}/${p.slug}" class="ticker-item">${escapeAttr(p.title)} •</a>`
        )
        .join(' ');

    const tickerHtml = `
      <div class="ticker-wrap">

        <div class="ticker-label">
          ताज्या बातम्या :
        </div>

        <div
          style="
            overflow:hidden;
            flex-grow:1;
            min-width:0;
          "
        >

          <div class="ticker-move">
            ${tickerItems}
            ${tickerItems}
          </div>

        </div>

      </div>
    `;

    const homeCards =
      posts
        .map(
          p => `
            <a
              href="${SITE_BASE}/${p.slug}"
              class="post-card"
            >

              <div class="card-img-wrap">

                <img
                  src="${extractImg(p.content)}"
                  alt="${escapeAttr(p.title)}"
                  loading="lazy"
                >

              </div>

              <div class="card-content">

                <h3 class="card-title">
                  ${escapeAttr(p.title)}
                </h3>

                <div
                  style="
                    margin-top:auto;
                    font-size:0.85rem;
                    color:var(--text-muted);
                    font-weight:600;
                  "
                >
                  ${formatMarathiDate(
                    p.published_at ||
                    p.created_at
                  )}
                </div>

              </div>

            </a>
          `
        )
        .join('');

    const indexHtml = `
      <!DOCTYPE html>

      <html lang="mr">

      <head>

        <meta charset="UTF-8">

        ${generateSEO(
          'Vitthal Speaks',
          '/'
        )}

        <style>
          ${globalCSS}
        </style>

        ${dynamicScripts}

      </head>

      <body>

        ${headerNavHtml}

        ${tickerHtml}

        <div class="container">

          ${homeAdsHtml}

          <h2 class="section-title">
            📰 ताज्या पोस्ट
          </h2>

          <div class="news-grid">
            ${homeCards}
          </div>

        </div>

      </body>

      </html>
    `;

    fs.writeFileSync(
      path.join(
        rootPath,
        'index.html'
      ),
      indexHtml
    );
  }

  // ==========================================================
  // 3. GENERATE 404 PAGE
  // ==========================================================

  let suggestedHtml = '';

  if (
    posts &&
    posts.length > 0
  ) {

    suggestedHtml =
      posts
        .slice(0, 3)
        .map(
          p => `
            <a
              href="${SITE_BASE}/${p.slug}"
              class="post-card"
            >

              <div class="card-img-wrap">

                <img
                  src="${extractImg(p.content)}"
                  alt="${escapeAttr(p.title)}"
                  loading="lazy"
                >

              </div>

              <div class="card-content">

                <h3 class="card-title">
                  ${escapeAttr(p.title)}
                </h3>

              </div>

            </a>
          `
        )
        .join('');
  }

  const notFoundHtml = `
    <!DOCTYPE html>

    <html lang="mr">

    <head>

      <meta charset="UTF-8">

      ${generateSEO(
        'Page Not Found',
        '/404'
      )}

      <style>
        ${globalCSS}
      </style>

      ${dynamicScripts}

    </head>

    <body>

      ${headerNavHtml}

      <div
        class="container"
        style="
          text-align:center;
          max-width:800px;
          padding:60px 20px;
        "
      >

        <h1
          style="
            color:var(--accent-red);
            font-size:5rem;
            margin:0;
            line-height:1;
          "
        >
          ४०४
        </h1>

        <h2
          style="
            font-size:2rem;
            color:var(--primary-dark);
          "
        >
          माफ करा, ही पोस्ट उपलब्ध नाही.
        </h2>

        <p
          style="
            color:var(--text-muted);
            font-size:1.1rem;
            margin-bottom:40px;
          "
        >
          तुम्ही शोधत असलेली पोस्ट डिलीट केली गेली असू शकते
          किंवा लिंक चुकीची असू शकते.
        </p>

        <a
          href="${SITE_BASE}/"
          style="
            background:var(--primary-dark);
            color:white;
            padding:12px 30px;
            border-radius:30px;
            font-weight:700;
            font-size:1rem;
            display:inline-block;
            max-width:100%;
          "
        >
          मुख्यपृष्ठावर परत जा
        </a>

      </div>

      <div class="container">

        <h3 class="section-title">
          📌 नवीनतम लेख वाचा
        </h3>

        <div class="news-grid">
          ${suggestedHtml}
        </div>

      </div>

    </body>

    </html>
  `;

  fs.writeFileSync(
    path.join(
      rootPath,
      '404.html'
    ),
    notFoundHtml
  );
}

// ============================================================
// BUILD SITE
// ============================================================

buildSite()
  .then(() => {
    console.log(
      '✅ Website generated successfully.'
    );
  })
  .catch((error) => {
    console.error(
      '❌ Website build failed:',
      error
    );

    process.exit(1);
  });
