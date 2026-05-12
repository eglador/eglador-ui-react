const STYLE_ID = "eglador-skeleton-styles";

const STYLES = `
@keyframes eglador-skeleton-wave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.eglador-skeleton-wave {
  background-color: var(--color-zinc-200, #e4e4e7);
  background-image: linear-gradient(
    90deg,
    var(--color-zinc-200, #e4e4e7) 25%,
    var(--color-zinc-100, #f4f4f5) 50%,
    var(--color-zinc-200, #e4e4e7) 75%
  );
  background-size: 200% 100%;
  animation: eglador-skeleton-wave 1.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .eglador-skeleton-wave {
    animation: none !important;
  }
}
`;

export function ensureSkeletonStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = STYLES;
  document.head.appendChild(el);
}
