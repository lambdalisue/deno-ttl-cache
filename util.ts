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
): (...args: A) => R {
  return (...args: A): R => {
    const teardown = () => globalThis.dispatchEvent(new Event("beforeunload"));
    try {
      const ret = fn(...args);
      if (ret instanceof Promise) {
        return ret.finally(teardown) as R;
      }
      teardown();
      return ret;
    } catch (err) {
      teardown();
      throw err;
    }
  };
}
