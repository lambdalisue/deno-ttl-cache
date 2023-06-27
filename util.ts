/**
 * Ensures that the `beforeunload` event is dispatched after the function is invoked
 *
 * This function is used as a workaround for the following issue
 * https://github.com/denoland/deno/issues/15176
 */
export function ensureBeforeUnload<
  A extends unknown[],
  R,
>(
  fn: (...args: A) => R,
): (...args: A) => Promise<R> {
  return async (...args: A): Promise<R> => {
    return await ensurePromise(fn(...args)).finally(() => {
      globalThis.dispatchEvent(new Event("beforeunload"));
    });
  };
}

function ensurePromise<T>(v: T | PromiseLike<T>): Promise<T> {
  return v instanceof Promise ? v : Promise.resolve(v);
}
