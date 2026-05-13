const STYLE_ID = "eglador-progress-styles";

const STYLES = `
@keyframes eglador-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
.eglador-progress-indeterminate {
  animation: eglador-progress-indeterminate 1.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .eglador-progress-indeterminate {
    animation: none !important;
  }
}
`;

export function ensureProgressStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = STYLES;
  document.head.appendChild(el);
}
