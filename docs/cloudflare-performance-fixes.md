# Cloudflare Performance Fixes

## Microsoft Clarity Deferral (Zaraz)
To reduce Total Blocking Time (TBT) caused by the Microsoft Clarity script without losing analytics, it should be deferred rather than loaded on initial pageview. The script currently contributes ~66ms main-thread blocking time during load.

### Cloudflare Dashboard Steps
1. Open Cloudflare and select the `nremi.com` domain.
2. Navigate to **Zaraz** -> **Tools** -> **Microsoft Clarity**.
3. Change the load trigger from **Pageview / immediate load** to one of the following:
   - **Scroll depth 25%**
   - **First click / interaction**

### Notes
- **Do not** add Microsoft Clarity snippets into the Astro repository. It must remain exclusively in Zaraz to avoid duplicate execution.
- **Do not** enable Rocket Loader as a "fix" for TBT, as it can cause unexpected script execution behavior.
- This PR **does not** include a Sanity image proxy via Cloudflare Workers. It strictly addresses TBT and Cloudflare Edge/Browser caching (`_headers`).

## Post-Deploy Verification

After this PR is merged and deployed, verify the new `_headers` cache rules are active by running the following commands in a terminal:

```bash
# Check the homepage (Expect max-age=3600, s-maxage=86400)
curl -sI "https://nremi.com/" | egrep -i 'cache-control|cf-cache-status'

# Check a recipe page (Expect max-age=86400, s-maxage=604800)
curl -sI "https://nremi.com/recipe/<any-live-slug>/" | egrep -i 'cache-control|cf-cache-status'

# Check an Astro asset (Expect max-age=31536000, immutable)
curl -sI "https://nremi.com/_astro/<any-hashed-asset.css>" | egrep -i 'cache-control|cf-cache-status'
```

On consecutive requests to the same URL, `cf-cache-status` should eventually trend towards `HIT`.
