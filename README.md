# ttl-cache

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/ttl_cache)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/ttl_cache/mod.ts)
[![Test](https://github.com/lambdalisue/deno-ttl-cache/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-ttl-cache/actions?query=workflow%3ATest)

Simple TTL cache library for [deno][deno].

[deno]: https://deno.land/

## Usage

```ts
import { Cache } from "./mod.ts";

// Create a cache instance that has 1000 ms TTL (default)
const cache = new Cache<string, string>(1000);

// Set
// key1 will be removed after 1000 ms
// key2 will be removed after 5000 ms
cache
  .set("key1", "value")
  .set("key2", "value", { ttl: 5000 });

// Size
cache.size(); // => 2

// Get
cache.get("key1"); // => "value"

// Has
cache.has("key1"); // => true

// Delete
cache.delete("key1"); // => true

// Clear
cache.clear();
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
