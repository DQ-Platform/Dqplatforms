// Cloudflare Worker: /news?id=... linkləri üçün WhatsApp/Telegram önizləməsi (şəkil + başlıq + xülasə)
const SB = "https://cpzwliqlgaplroscvduo.supabase.co";
const KEY = "sb_publishable_1clDyHhxAiSCurwGHwMi3g_rrs17eYF";

async function getNews(id) {
  const q = f => fetch(`${SB}/rest/v1/dq_v2_store?collection=eq.news&${f}&select=id,data&limit=1`,
    { headers: { apikey: KEY, Authorization: "Bearer " + KEY } }).then(r => r.json()).catch(() => []);
  let a = await q(`data->>slug=eq.${encodeURIComponent(id)}`);
  if (!a.length && /^\d+$/.test(id)) a = await q(`id=eq.${id}`);
  return a[0] ? a[0].data : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    // Önizləmə şəkli: verilənlər bazasındakı base64 şəkli real şəkil kimi qaytarır
    if (url.pathname === "/og" && id) {
      const n = await getNews(id);
      const m = n && /^data:(image\/[\w+.-]+);base64,(.+)$/.exec(n.img || "");
      if (m) {
        const bin = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
        return new Response(bin, { headers: { "content-type": m[1], "cache-control": "public, max-age=3600" } });
      }
      if (n && /^https?:/.test(n.img || "")) return Response.redirect(n.img, 302);
      return new Response("", { status: 404 });
    }

    // Xəbər linki: əsas səhifəni qaytar, <head>-ə önizləmə teqləri əlavə et
    if (url.pathname === "/news" && id) {
      const page = await env.ASSETS.fetch(new Request(new URL("/", url), request));
      const n = await getNews(id);
      if (!n) return new Response(page.body, { status: 200, headers: page.headers });
      const clip = (s, l) => String(s || "").replace(/\s+/g, " ").trim().slice(0, l);
      const title = `DQPlatform - ${clip(n.title, 120)}`;
      const desc = clip(n.sum || n.body, 200);
      const img = `${url.origin}/og?id=${encodeURIComponent(id)}`;
      const tag = (p, v) => `<meta property="${p}" content="${v.replace(/"/g, "&quot;")}">`;
      return new HTMLRewriter()
        .on('meta[property="og:title"]', { element: e => e.remove() })
        .on('meta[property="og:description"]', { element: e => e.remove() })
        .on('meta[property="og:type"]', { element: e => e.remove() })
        .on("title", { element: e => e.setInnerContent(title) })
        .on("head", { element: e => e.append(
          tag("og:title", title) + tag("og:description", desc) + tag("og:type", "article") +
          tag("og:url", url.href) + tag("og:image", img) + tag("og:image:width", "720") + tag("og:image:height", "900") +
          '<meta name="twitter:card" content="summary_large_image">', { html: true }) })
        .transform(new Response(page.body, { status: 200, headers: page.headers }));
    }

    return env.ASSETS.fetch(request);
  }
};
