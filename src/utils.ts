function k2url(k: string) {
  return `https://www.yoshino-s.online/${k}`
}

export async function get(k: string) {
  const resp = await caches.default.match(k2url(k));
  if (!resp)
    return undefined;
  else
    return resp.json();
}

export async function  set(k: string, v: any) {
  return await caches.default.put(k2url(k), new Response(JSON.stringify(v)));
}