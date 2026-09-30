// Cloudflare Worker: /news?id=... linki üçün xəbərə xas önizləmə (WhatsApp/Telegram)
// Static saytı (index.html) `env.ASSETS` ilə verir; yalnız /news və /og-img üçün <head> dəyişir.
const SB = "https://cpzwliqlgaplroscvduo.supabase.co";
const KEY = "sb_publishable_1clDyHhxAiSCurwGHwMi3g_rrs17eYF";

async function getNews(id) {
  const q = /^\d+$/.test(id) ? `id.eq.${id},data->>slug.eq.${id}` : `data->>slug.eq.${id}`;
  const r = await fetch(`${SB}/rest/v1/dq_v2_store?collection=eq.news&or=(${encodeURIComponent(q)})&select=id,data&limit=1`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  const j = await r.json().catch(() => []);
  return j && j[0] ? { _id: j[0].id, ...j[0].data } : null;
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);

    // Qapaq şəkli (base64) → real şəkil faylı
    if (u.pathname === "/og-img") {
      const n = await getNews(u.searchParams.get("id") || "");
      const m = n && /^data:(image\/[\w+.-]+);base64,(.+)$/.exec(n.img || "");
      if (!m) return new Response("Not found", { status: 404 });
      const bin = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
      return new Response(bin, { headers: { "content-type": m[1], "cache-control": "public, max-age=3600" } });
    }

    // Xəbər linki
    if (u.pathname.replace(/\/$/, "") === "/news" && u.searchParams.get("id")) {
      const id = u.searchParams.get("id");
      const n = await getNews(id);
      const page = await env.ASSETS.fetch(new Request(u.origin + "/", req));
      if (!n) return page;
      const title = `DQPlatform - ${n.title}`;
      const desc = (n.sum || String(n.body || "").replace(/\s+/g, " ").slice(0, 160));
      const img = n.img ? `${u.origin}/og-img?id=${encodeURIComponent(id)}` : "";
      const set = (attr, val) => ({ element: el => el.setAttribute("content", val) });
      const rw = new HTMLRewriter()
        .on("title", { element: el => el.setInnerContent(title) })
        .on('meta[property="og:title"]', set(0, title))
        .on('meta[property="og:description"]', set(0, desc))
        .on('meta[property="og:type"]', set(0, "article"))
        .on('meta[name="description"]', set(0, desc))
        .on("head", { element: el => {
          el.append(`<meta property="og:url" content="${u.href}">` +
            (img ? `<meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">` : ""), { html: true });
        } });
      return rw.transform(new Response(page.body, page));
    }
    return env.ASSETS.fetch(req);
  }
};
