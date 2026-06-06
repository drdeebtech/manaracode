import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// GLTF loading infrastructure for Blender-authored, Draco-compressed models.
// The Draco decoder ships as static files under public/draco/ (NOT bundled),
// and models live under public/models/*.glb (lazy-fetched on demand). Until a
// real model is provided the hero uses procedural geometry; this loader is
// ready to swap in `await loadModel('/models/packaging.glb')`.

let loader = null
const cache = new Map() // url -> Promise<GLTF>

function getLoader() {
  if (loader) return loader
  const draco = new DRACOLoader()
  draco.setDecoderPath('/draco/') // copy three/examples/jsm/libs/draco/ here
  loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  return loader
}

/**
 * Load (and cache) a GLTF/GLB model.
 * @param {string} url
 * @returns {Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF>}
 */
export function loadModel(url) {
  if (cache.has(url)) return cache.get(url)
  const promise = new Promise((resolve, reject) => {
    getLoader().load(url, resolve, undefined, reject)
  })
  cache.set(url, promise)
  return promise
}
