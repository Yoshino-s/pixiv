import { auth } from "./auth";
import { get, set } from "./utils";

const rankingURL = "https://app-api.pixiv.net/v1/illust/ranking";

async function random() {
  const a = await auth();
  console.log(a);
  const d = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const y = Number(await get("day")) || 0;
  let ranking: any[] = [];
  if (d !== y) {
    const url = new URL(rankingURL);
    url.searchParams.set("mode", "day");
    const resp = await fetch(url.toString(), {
      headers: {
        Referer: "http://spapi.pixiv.net/",
        "User-Agent": 'PixivIOSApp/7.6.2 (iOS 12.2; iPhone9,1)',
        'App-Version': "7.6.2",
        'App-OS-Version': "12.2",
        'App-OS': 'ios',
        "Authorization": `Bearer ${a}`
      }
    });
    await caches.default.put(rankingURL, resp.clone());
    ranking = (await resp.json()).illusts;
  } else {
    const resp = await caches.default.match(rankingURL);
    if (resp)
      ranking = (await resp.json()).illusts;
  }
  ranking = ranking.filter(v => v.meta_single_page && v.meta_single_page.original_image_url);
  const r = ranking[Math.floor(Math.random() * ranking.length)];
  if (!r)
    return new Response("Not found", {
      status: 404
    })
  const img = fetch(r.meta_single_page.original_image_url, {
    headers: {
      referer: "https://app-api.pixiv.net/"
    }
  })
  return img;
}
export async function handleRequest(request: Request): Promise<Response> {
  const u = new URL(request.url);
  if (u.pathname === "/random") {
    return random();
  }
  return new Response("", { status: 404 });
}
