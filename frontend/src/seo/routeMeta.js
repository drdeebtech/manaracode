// Single source of truth for per-route <head> metadata.
//
// Consumed in two places that MUST stay in sync:
//   1. Client-side — <PageMeta path="…"> reads this on route change to update
//      the document title, description, canonical, and OG/Twitter tags.
//   2. Build-time — scripts/prerender.js bakes these into static per-route HTML
//      (dist/<route>/index.html) so non-JS crawlers (Google snippets, Twitter,
//      Slack, LinkedIn, WhatsApp, Facebook) get correct titles + social cards.
//
// Keep titles ≲60 chars and descriptions ≲160 chars for clean SERP/social
// rendering. The catch-all 404 route is intentionally absent (it is dynamic).

export const SITE_URL = 'https://manaracode.com'

export const routeMeta = Object.freeze({
  '/': {
    title: 'manaracode — software studio for web, mobile & cloud',
    description:
      'manaracode is a software studio building production web, mobile, and cloud platforms — founded and led by a practising physician, with deep experience in healthcare software.',
  },
  '/about': {
    title: 'About — a physician-founded software studio · manaracode',
    description:
      'manaracode is a generalist software studio building production web, mobile, and cloud platforms. Founded and led by a practising physician, healthcare is our sharpest edge.',
  },
  '/work': {
    title: 'Work — products & clinical platforms · manaracode',
    description:
      'Selected work from manaracode: public products you can open today, and confidential healthcare platforms described by capability, not by client.',
  },
  '/privacy': {
    title: 'Privacy Policy · manaracode',
    description:
      'How manaracode collects, uses, and protects the personal data you share through manaracode.com.',
  },
  '/terms': {
    title: 'Terms of Use · manaracode',
    description: 'The terms that govern your use of the manaracode.com website.',
  },
})
