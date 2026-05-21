export interface HSV {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function hsvToRgb(h: number, s: number, v: number, a = 1): RGB {
  const c = v * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) {
    r = c;
    g = x;
    b = 0;
  } else if (hp < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (hp < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (hp < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (hp < 5) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const m = v - c;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

export function rgbToHsv(r: number, g: number, b: number, a = 1): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
  }
  h = (h * 60 + 360) % 360;
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a };
}

export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const hex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  const base = `#${hex(r)}${hex(g)}${hex(b)}`;
  if (a == null || a >= 1) return base;
  return `${base}${hex(a * 255)}`;
}

export function hexToRgb(input: string): RGB | null {
  const v = input.trim().replace(/^#/, "");
  if (![3, 4, 6, 8].includes(v.length)) return null;
  if (!/^[0-9a-fA-F]+$/.test(v)) return null;
  const expand = (s: string) => parseInt(s.length === 1 ? s + s : s, 16);
  if (v.length === 3 || v.length === 4) {
    const r = expand(v[0]);
    const g = expand(v[1]);
    const b = expand(v[2]);
    const a = v.length === 4 ? expand(v[3]) / 255 : 1;
    return { r, g, b, a };
  }
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  const a = v.length === 8 ? parseInt(v.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function hsvToHex(hsv: HSV, withAlpha = false): string {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v, hsv.a);
  return rgbToHex(rgb.r, rgb.g, rgb.b, withAlpha ? rgb.a : 1);
}

export function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsv(rgb.r, rgb.g, rgb.b, rgb.a);
}

export function hsvToCssString(hsv: HSV): string {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v, hsv.a);
  if (hsv.a < 1) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hsv.a.toFixed(2)})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
