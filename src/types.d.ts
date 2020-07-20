import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  const myKVNamespace: KVNamespace;
  const account: string;
  const password: string;
  interface CacheStorage {
    default: {
      put(key: string, value: Response): Promise<void>;
      match(key: string): Promise<Response|undefined>;
    }
  }
}
