// Lazy GSAP access. gsap + ScrollTrigger are dynamically imported so they ride
// in the same lazy chunk as the engine, never the initial bundle. GSAP drives
// timeline/scroll choreography on three.js objects only (framer-motion owns the
// DOM); keeping the boundary clean avoids double-ownership jank.

let gsapMod = null

/**
 * @returns {Promise<{ gsap: import('gsap').GSAP, ScrollTrigger: any }>}
 */
export async function getGsap() {
  if (gsapMod) return gsapMod
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)
  gsapMod = { gsap, ScrollTrigger }
  return gsapMod
}
