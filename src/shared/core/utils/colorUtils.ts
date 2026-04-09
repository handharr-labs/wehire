/** HSP perceived brightness — more accurate than WCAG luminance for choosing text color */
export function perceivedBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
}
