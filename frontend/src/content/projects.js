import { BookOpen, Smartphone, Cpu } from 'lucide-react'

/**
 * @typedef {object} PublicProject
 * @property {React.ComponentType<{ className?: string }>} Icon Lucide SVG icon
 * @property {string} title
 * @property {string[]} tags
 * @property {string} body
 * @property {string} href external destination (live product or source)
 * @property {string} linkLabel standalone, meaningful link text
 */

// Public, shipped projects — sourced from public repo metadata only (no private
// code, clients, or invented features). Every claim is truthful and verifiable
// from the linked destination. Shared by the /work page and the homepage teaser
// so the two never drift; keep it accurate.
/** @type {PublicProject[]} */
export const publicProjects = [
  {
    Icon: BookOpen,
    title: 'Furqan',
    tags: ['Web', 'TypeScript'],
    body: 'A production web platform for an online Quran academy, live and serving users.',
    href: 'https://furqan.today',
    linkLabel: 'Visit furqan.today',
  },
  {
    Icon: Smartphone,
    title: 'Hesn',
    tags: ['Mobile', 'Flutter'],
    body: 'A mobile app for daily azkar, Islamic remembrances and supplications.',
    href: 'https://github.com/drdeebtech/Hesn',
    linkLabel: 'View source',
  },
  {
    Icon: Cpu,
    title: 'RAM-Watch',
    tags: ['Web', 'Cross-platform'],
    body: 'A lightweight web app for monitoring and managing system memory across platforms.',
    href: 'https://github.com/drdeebtech/RAM-Watch',
    linkLabel: 'View source',
  },
]
