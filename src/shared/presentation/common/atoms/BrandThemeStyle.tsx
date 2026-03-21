const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const DEFAULT_PRIMARY = '#18181b';
const DEFAULT_SECONDARY = '#3f3f46';

/** HSP perceived brightness — more accurate than WCAG luminance for choosing text color */
function perceivedBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
}

interface Props {
  primaryColor: string;
  secondaryColor: string;
}

export function BrandThemeStyle({ primaryColor, secondaryColor }: Props) {
  const p = HEX_REGEX.test(primaryColor) ? primaryColor : DEFAULT_PRIMARY;
  const s = HEX_REGEX.test(secondaryColor) ? secondaryColor : DEFAULT_SECONDARY;
  const headerText = perceivedBrightness(p) > 128 ? '#18181b' : '#ffffff';

  return (
    <style>{`:root{--brand-primary:${p};--brand-secondary:${s};--brand-header-text:${headerText}}`}</style>
  );
}
