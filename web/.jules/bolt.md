## 2026-06-24 - GROQ Query Projection Optimization
**Learning:** In Sanity GROQ queries, you can still use fields inside `order()` even if you don't return them in the projection block `{ ... }`. Returning unused reference expansions (like `subCluster->` and `adjacentClusters[]->`) dramatically increases the JSON payload size and memory consumption during Astro's SSG build process.
**Action:** Always audit the projection block `{ ... }` of `groq` queries to make sure only fields actively consumed by the frontend components are fetched, especially for wide queries fetching all documents.
