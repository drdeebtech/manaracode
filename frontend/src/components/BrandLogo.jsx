// The navbar brand chip — static render of the ManaraCode 3D chevron mark.
// Decorative (alt=""): the adjacent "manaracode" wordmark in Navbar carries the
// accessible name. Replaces the old WebGL "</>" chip, so `three` no longer
// loads for the navbar at all.
export default function BrandLogo() {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      className="w-8 h-8 flex-shrink-0 object-contain"
    />
  )
}
