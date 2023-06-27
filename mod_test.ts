import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.192.0/async/delay.ts";
import { ensureBeforeUnload } from "./util.ts";
import { Cache } from "./mod.ts";

Deno.test("Cache", async (t) => {
  const cache = new Cache<string, string>(100);

  await t.step("size returns 0", () => {
    assertEquals(cache.size(), 0);
  });

  await t.step("has returns false if key does not exist", () => {
    assertEquals(cache.has("key"), false);
  });

  await t.step("get returns undefined if key does not exist", () => {
    assertEquals(cache.get("key"), undefined);
  });

  await t.step("delete returns false if key does not exist", () => {
    assertEquals(cache.delete("key"), false);
  });

  await t.step(
    "set returns the instance itself",
    ensureBeforeUnload(() => {
      assertEquals(cache.set("key", "value1"), cache);
    }),
  );

  await t.step("size returns 1", () => {
    assertEquals(cache.size(), 1);
  });

  await t.step("has returns true if key exists", () => {
    assertEquals(cache.has("key"), true);
  });

  await t.step(
    "get returns the value if key exists",
    ensureBeforeUnload(() => {
      assertEquals(cache.get("key"), "value1");
    }),
  );

  await t.step(
    "set overwrites existing key",
    ensureBeforeUnload(() => {
      cache.set("key", "value2");
      assertEquals(cache.get("key"), "value2");
    }),
  );

  await t.step("delete returns true if key exists", () => {
    assertEquals(cache.delete("key"), true);
    assertEquals(cache.size(), 0);
  });

  await t.step(
    "clear delete all keys",
    ensureBeforeUnload(() => {
      cache
        .set("key1", "value")
        .set("key2", "value")
        .set("key3", "value");
      assertEquals(cache.size(), 3);
      cache.clear();
      assertEquals(cache.size(), 0);
    }),
  );

  await t.step(
    "the value is automatically removed when expired",
    async () => {
      cache.clear();
      cache.set("key", "value");
      assertEquals(cache.size(), 1);
      await delay(200);
      assertEquals(cache.size(), 0);
    },
  );

  await t.step(
    "the value is automatically removed when expired (custom)",
    async () => {
      cache.clear();
      cache.set("key", "value", { ttl: 300 });
      assertEquals(cache.size(), 1);
      await delay(200);
      assertEquals(cache.size(), 1);
      await delay(200);
      assertEquals(cache.size(), 0);
    },
  );
});
