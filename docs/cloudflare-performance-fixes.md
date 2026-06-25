# Web Performance Fixes (Cloudflare / External)

## Clarity Delayed Loading via Zaraz

**Problem:** Zaraz injects Clarity immediately on page load, creating a
6-request chain (including 2 cross-domain 302 redirects via c.bing.com)
that keeps the network waterfall open until ~6,200ms, even though the
page is visually complete at 2,600ms.

**Fix in Cloudflare Zaraz Dashboard:**
1. Go to Cloudflare Dashboard → Websites → [your domain] → Zaraz
2. Find the "Microsoft Clarity" tool
3. Click on it → go to "Loading Rules" or "Triggers"
4. Change the trigger from "Pageview" to one of:
   - "After 3 seconds delay" (recommended)
   - "On first user interaction" (scroll, click, mousemove)
5. Save and deploy

**Expected impact:** fullyLoaded drops from ~6,200ms to ~3,500ms.
LCP and FCP are unaffected (Clarity is non-blocking), but lab scores
like Speed Index and Time to Interactive will improve.

---

## Layout CPU Time (Future Investigation)

**Observation:** `cpuTimes.Layout = 281ms` which is abnormally high
compared to `EvaluateScript = 64ms`. This suggests complex CSS
recalculation during initial render, likely in the recipe list or
hero section.

**Recommended next step (requires DevTools):**
- Open Chrome DevTools → Performance tab
- Record with CPU 4x slowdown + Fast 3G throttling
- Look for "Recalculate Style" and "Layout" events in the flame chart
- Identify which component triggers the longest layout block

Do not apply `content-visibility: auto` until element heights
are explicitly set (width + height or aspect-ratio) on all
affected containers to prevent CLS regression.
