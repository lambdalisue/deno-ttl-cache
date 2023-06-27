import { delay } from "https://deno.land/std@0.192.0/async/delay.ts";

export type CacheSetOptions = {
  ttl?: number;
};

/**
 * A simple TTL cache implementation
 * @param ttl The time to live in milliseconds
 *
 * ```ts
 * import { Cache } from "./mod.ts";
 *
 * const cache = new Cache<string, string>(100);
 * cache.set("key", "value");
 * cache.get("key");
 * ```
 */
export class Cache<K, V> {
  #map: Map<K, V> = new Map();
  #ttl: number;
  #controller: AbortController = new AbortController();

  /**
   * Create a new TTL cache instance
   * @param ttl The time to live in milliseconds
   */
  constructor(ttl: number) {
    this.#ttl = ttl;
    // Abort all pending promises when the page is about to unload.
    // Note that this doesn't help 'Leaking async ops' error for now.
    // https://github.com/denoland/deno/issues/15176
    globalThis.addEventListener("beforeunload", () => {
      this.#controller.abort();
      this.#controller = new AbortController();
    });
  }

  /**
   * Check if the cache has the key
   * @param key The key to check
   */
  has(key: K): boolean {
    return this.#map.has(key);
  }

  /**
   * Get the value from the cache
   * @param key The key to get
   * @returns The value if the key exists, otherwise undefined
   */
  get(key: K): V | undefined {
    return this.#map.get(key);
  }

  /**
   * Set the value to the cache
   * @param key The key to set
   * @param value The value to set
   * @param options The options to set
   * @returns the cache instance
   */
  set(key: K, value: V, { ttl }: CacheSetOptions = {}): Cache<K, V> {
    this.#map.set(key, value);
    this.#deleteOnExpire(key, ttl ?? this.#ttl);
    return this;
  }

  /**
   * Delete the value from the cache
   * @param key The key to delete
   * @returns true if the key exists, otherwise false
   */
  delete(key: K): boolean {
    return this.#map.delete(key);
  }

  /**
   * Get the size of the cache
   * @returns The size of the cache
   */
  size(): number {
    return this.#map.size;
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.#map.clear();
    this.#controller.abort();
    this.#controller = new AbortController();
  }

  #deleteOnExpire(key: K, ttl: number): void {
    delay(ttl, { signal: this.#controller.signal })
      .then(() => {
        this.#map.delete(key);
      })
      .catch(() => {
        // Do NOTHING
      });
  }
}
