## 2026-06-24 - GROQ Query Projection Optimization
**Learning:** In Sanity GROQ queries, you can still use fields inside `order()` even if you don't return them in the projection block `{ ... }`. Returning unused reference expansions (like `subCluster->` and `adjacentClusters[]->`) dramatically increases the JSON payload size and memory consumption during Astro's SSG build process.
**Action:** Always audit the projection block `{ ... }` of `groq` queries to make sure only fields actively consumed by the frontend components are fetched, especially for wide queries fetching all documents.
## 2026-06-24 - GROQ Query Over-fetching and Architecture Separation
**Learning:** Returning heavy fields (like `coverImage` or `description`) in global queries (like `ALL_CLUSTERS_QUERY`) forces those heavy fields to be fetched everywhere the query is used (Sitemaps, global footers, search filters), wasting bandwidth and memory.
**Action:** Separate routing/global lists from page-specific details. Use trimmed `ALL_*_QUERY` for `getStaticPaths` and global layouts, and a precise `*_BY_SLUG_QUERY` for fetching full details exactly where the page needs it.
