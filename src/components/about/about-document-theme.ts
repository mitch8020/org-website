export const ABOUT_NOISE_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' seed='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")"

export const ABOUT_VIGNETTE_BACKGROUND =
  'radial-gradient(60% 50% at 50% 30%, rgba(212,162,74,0.08), transparent 60%), radial-gradient(90% 80% at 50% 50%, rgba(236,226,196,0.035), transparent 70%)'

export function octagonPoints(cx: number, cy: number, radius: number) {
  const points: Array<string> = []
  for (let index = 0; index < 8; index++) {
    const angle = (Math.PI / 4) * index - Math.PI / 8
    points.push(
      `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`,
    )
  }
  return points.join(' ')
}

export const ABOUT_DOCUMENT_STYLES = `
html { scroll-behavior: smooth; }
@keyframes ab-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.ab-rise { opacity: 0; animation: ab-rise 720ms cubic-bezier(0.2,0.7,0.2,1) forwards; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .ab-rise { animation: none; opacity: 1; transform: none; }
}
`
