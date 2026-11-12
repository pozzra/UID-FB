// In-memory Cache (TTL: 1 hour)
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

export function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

export function setCached(key, data) {
  if (cache.size > 2000) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { timestamp: Date.now(), data });
}

// Clean tracking parameters from URL
export function cleanTrackingTokens(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const trackingKeys = ['fbclid', 'mibextid', 'ref', 'rdid', 'locale', 'hc_ref', '__tn__', '__cft__[0]'];
    trackingKeys.forEach(k => parsed.searchParams.delete(k));
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

// Extract direct numeric IDs or specific post/group IDs
export function extractDirectUid(inputUrl) {
  const clean = inputUrl.trim();

  // 1. If pure number entered
  if (/^\d{4,20}$/.test(clean)) {
    return {
      uid: clean,
      type: 'Direct User ID / Numeric ID',
      method: 'instant_regex'
    };
  }

  // 2. Modern Facebook /p/Name-UID format (resulting from /share/ redirects)
  const pMatch = clean.match(/\/p\/[^\/]+-(\d{6,25})/i);
  if (pMatch) {
    return {
      uid: pMatch[1],
      type: 'Facebook Profile / Page',
      method: 'instant_regex'
    };
  }

  // 3. URL query parameter ?id=... or &id=...
  const queryMatch = clean.match(/[?&]id=(\d{4,20})/i);
  if (queryMatch) {
    return {
      uid: queryMatch[1],
      type: 'Profile Parameter',
      method: 'instant_regex'
    };
  }

  // 4. Group URL: /groups/123456789/
  const groupMatch = clean.match(/\/groups\/(\d{4,20})/i);
  if (groupMatch) {
    return {
      uid: groupMatch[1],
      type: 'Facebook Group ID',
      method: 'instant_regex'
    };
  }

  // 5. Reels: /reel/123456789/
  const reelMatch = clean.match(/\/reel\/(\d{4,20})/i);
  if (reelMatch) {
    return {
      uid: reelMatch[1],
      type: 'Facebook Reel ID',
      method: 'instant_regex'
    };
  }

  // 6. Videos / Watch: /watch/?v=123456789 or /videos/123456789
  const videoMatch = clean.match(/[?&]v=(\d{4,20})/i) || clean.match(/\/videos\/(\d{4,20})/i);
  if (videoMatch) {
    return {
      uid: videoMatch[1],
      type: 'Facebook Video ID',
      method: 'instant_regex'
    };
  }

  // 7. Posts: /posts/123456789
  const postMatch = clean.match(/\/posts\/(\d{4,20})/i);
  if (postMatch) {
    return {
      uid: postMatch[1],
      type: 'Facebook Post ID',
      method: 'instant_regex'
    };
  }

  // 8. Photo URL: /photo/?fbid=123456789 or /photos/123456789
  const photoMatch = clean.match(/[?&]fbid=(\d{4,20})/i) || clean.match(/\/photos\/(?:[a-zA-Z0-9.-]+\/)?(\d{4,20})/i);
  if (photoMatch) {
    return {
      uid: photoMatch[1],
      type: 'Facebook Photo/Media ID',
      method: 'instant_regex'
    };
  }

  // 9. Story / Permalink: story_fbid=...
  const storyMatch = clean.match(/[?&]story_fbid=(\d{4,20})/i);
  if (storyMatch) {
    return {
      uid: storyMatch[1],
      type: 'Facebook Story/Post ID',
      method: 'instant_regex'
    };
  }

  // 10. URL pattern: /people/.../1000000000/
  const peopleMatch = clean.match(/\/people\/[^/]+\/(\d{4,20})/i);
  if (peopleMatch) {
    return {
      uid: peopleMatch[1],
      type: 'People Profile ID',
      method: 'instant_regex'
    };
  }

  // 11. Direct numeric path /1000123456789/
  const directPathMatch = clean.match(/facebook\.com\/(\d{4,20})(?:[/?#]|$)/i);
  if (directPathMatch) {
    return {
      uid: directPathMatch[1],
      type: 'Profile Path ID',
      method: 'instant_regex'
    };
  }

  return null;
}

// Normalize incoming URL
export function normalizeFacebookUrl(input) {
  let url = input.trim();
  url = cleanTrackingTokens(url);

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('facebook.com') || url.includes('fb.me') || url.includes('fb.com')) {
      url = 'https://' + url;
    } else if (/^[a-zA-Z0-9._-]+$/.test(url)) {
      url = `https://www.facebook.com/${url}`;
    } else {
      url = 'https://' + url;
    }
  }
  return url;
}

// Core crawler lookup function
export async function resolveFacebookUid(targetUrl) {
  const normalized = normalizeFacebookUrl(targetUrl);

  // Check cache first
  const cached = getCached(normalized);
  if (cached) {
    return { ...cached, cached: true };
  }

  // 1. Try instant regex
  const direct = extractDirectUid(normalized);
  if (direct && direct.type !== 'Direct User ID / Numeric ID') {
    const result = {
      success: true,
      uid: direct.uid,
      name: direct.type,
      type: direct.type,
      avatar: `https://graph.facebook.com/${direct.uid}/picture?type=large`,
      profileUrl: `https://www.facebook.com/${direct.uid}`,
      deepLink: `fb://profile/${direct.uid}`,
      messengerLink: `https://m.me/${direct.uid}`,
      method: direct.method
    };
    setCached(normalized, result);
    return result;
  }

  // Target for crawling
  const fetchTarget = (direct && direct.type === 'Direct User ID / Numeric ID') 
    ? `https://www.facebook.com/${direct.uid}` 
    : normalized;

  // 14-second timeout for multi-step redirects
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);

  try {
    const response = await fetch(fetchTarget, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,km;q=0.8,vi;q=0.7',
        'Cache-Control': 'no-cache'
      },
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const finalUrl = response.url || fetchTarget;
    // Check if redirect target URL has direct UID (such as /p/Name-UID/)
    const redirectedDirect = extractDirectUid(finalUrl);

    const html = await response.text();

    // Regex matchers for metadata
    const patterns = [
      /property="al:android:url"\s+content="fb:\/\/(?:profile|page|group|user)\/(\d+)"/i,
      /property="al:ios:url"\s+content="fb:\/\/(?:profile|page|group|user)\/(\d+)"/i,
      /"userID":"(\d+)"/,
      /"entity_id":"(\d+)"/,
      /fb:\/\/profile\/(\d+)/i,
      /\/p\/[^\/]+-(\d{6,25})/i,
      /"owning_profile":\{"id":"(\d+)"/i,
      /content="fb:\/\/(?:page|group)\/(\d+)"/i,
      /lookaside\.fbsbx\.com\/lookaside\/crawler\/media\/\?media_id=(\d+)/i,
      /data-referrerid="(\d+)"/i,
      /"delegate_page_id":\s*"?(\d+)"?/i,
      /"profile_id":\s*"?(\d+)"?/i
    ];

    let foundUid = (direct && direct.uid) ? direct.uid : null;
    if (!foundUid) {
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1] && match[1] !== '0') {
          foundUid = match[1];
          break;
        }
      }
    }

    if (!foundUid && redirectedDirect) {
      foundUid = redirectedDirect.uid;
    }

    // Extract Title / Name
    const titleMatch = html.match(/property="og:title"\s+content="([^"]+)"/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace(/ \| Facebook$/i, '').trim() : 'Facebook Account';

    // Extract Avatar
    const imgMatch = html.match(/property="og:image"\s+content="([^"]+)"/i);
    let avatar = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : `https://graph.facebook.com/${foundUid || ''}/picture?type=large`;

    // Extract Description / Bio
    const descMatch = html.match(/property="og:description"\s+content="([^"]+)"/i);
    let description = descMatch ? descMatch[1].replace(/&amp;/g, '&') : '';

    if (!foundUid) {
      return {
        success: false,
        error: 'រកមិនឃើញ UID សម្រាប់តំណភ្ជាប់នេះទេ។ សូមប្រាកដថាគណនី ឬទំព័រនេះជាសាធារណៈ។',
        rawUrl: targetUrl
      };
    }

    const result = {
      success: true,
      uid: foundUid,
      name: title,
      avatar: avatar,
      description: description,
      profileUrl: `https://www.facebook.com/${foundUid}`,
      deepLink: `fb://profile/${foundUid}`,
      messengerLink: `https://m.me/${foundUid}`,
      vanityUrl: normalized,
      method: (direct || redirectedDirect) ? 'instant_regex_enhanced' : 'graph_crawler'
    };

    setCached(normalized, result);
    return result;

  } catch (err) {
    clearTimeout(timeoutId);

    // If fetch failed but we have a direct numeric UID, return fallback
    if (direct) {
      return {
        success: true,
        uid: direct.uid,
        name: direct.type,
        avatar: `https://graph.facebook.com/${direct.uid}/picture?type=large`,
        profileUrl: `https://www.facebook.com/${direct.uid}`,
        deepLink: `fb://profile/${direct.uid}`,
        messengerLink: `https://m.me/${direct.uid}`,
        method: direct.method
      };
    }

    return {
      success: false,
      error: err.name === 'AbortError' ? 'ការតភ្ជាប់លើសពេលកំណត់ (Timeout)។ សូមព្យាយាមម្តងទៀត។' : `កំហុសក្នុងការស្វែងរក: ${err.message}`,
      rawUrl: targetUrl
    };
  }
}

