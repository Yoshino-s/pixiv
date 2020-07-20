const digestHash = "28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c";
const client_id = "MOBrBDS8blbauoSck0ZfDbtuzpyT";
const client_secret = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj";
const tokenURL = "https://oauth.secure.pixiv.net/auth/token";

async function md5(s: string) {
  const encoder = new TextEncoder();
  const res = Array.from(new Uint8Array(await crypto.subtle.digest("md5", encoder.encode(s))));
  const hashHex = res.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function auth() {
  const cache = await caches.default.match(tokenURL);
  if (cache) {
    const token = (await cache.json()).response.access_token;
    if (token)
      return token;
  }
  const d = new Date().toISOString().replace(/\.\d{3}Z/, "+00:00");
  const headers = {
    'User-Agent': 'PixivAndroidApp/5.0.64 (Android 6.0)',
    'X-Client-Time': d,
    'X-Client-Hash': await md5(d + digestHash),    
  }
  const data = new URLSearchParams({
    'get_secure_url': "1",
    'client_id': client_id,
    'client_secret': client_secret,
    'grant_type': "password",
    "username": account,
    "password": password
  });
  const resp = await fetch(tokenURL, {
    method: "POST",
    headers,
    body: data
  });
  await caches.default.put(tokenURL, resp.clone());
  return (await resp.json()).response.access_token;
}