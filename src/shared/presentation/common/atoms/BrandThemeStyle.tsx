import { perceivedBrightness } from '@/shared/core/utils/colorUtils';

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const DEFAULT_PRIMARY = '#18181b';
const DEFAULT_SECONDARY = '#3f3f46';

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
