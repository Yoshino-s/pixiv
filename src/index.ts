import { auth } from './auth';
import { handleRequest } from './handler';

addEventListener("fetch", async e => {
  e.respondWith(handleRequest(e.request));
});
