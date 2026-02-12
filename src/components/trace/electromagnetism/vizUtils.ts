/**
 * Math helpers for TRACE electromagnetism visualizations.
 */

// Physical constants
export const h = 6.626e-34;        // Planck's constant (J·s)
export const k_B = 1.381e-23;      // Boltzmann constant (J/K)
export const c = 2.998e8;          // Speed of light (m/s)
export const sigma = 5.670e-8;     // Stefan-Boltzmann constant (W/m²·K⁴)
export const e_charge = 1.602e-19; // Elementary charge (C)

/**
 * Planck spectral radiance B(λ, T) in W/(m²·sr·m)
 * @param lambda Wavelength in meters
 * @param T Temperature in Kelvin
 */
export function planckRadiance(lambda: number, T: number): number {
  const a = (2 * h * c * c) / (lambda ** 5);
  const exponent = (h * c) / (lambda * k_B * T);
  // Clamp exponent to prevent Infinity
  if (exponent > 500) return 0;
  return a / (Math.exp(exponent) - 1);
}

/**
 * Rayleigh-Jeans approximation (classical) B_RJ(λ, T)
 * Valid only for long wavelengths; diverges at short wavelengths.
 */
export function rayleighJeans(lambda: number, T: number): number {
  return (2 * c * k_B * T) / (lambda ** 4);
}

/**
 * Wien's displacement law: λ_max = b / T
 * Returns peak wavelength in meters.
 */
export function wienPeak(T: number): number {
  const b = 2.898e-3; // Wien displacement constant (m·K)
  return b / T;
}

/**
 * Convert wavelength (nm) to approximate visible-spectrum RGB.
 * Returns [r, g, b] in 0-255.
 */
export function wavelengthToRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;

  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380);
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    g = (nm - 440) / (490 - 440);
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    g = 1;
    b = -(nm - 510) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / (645 - 580);
  } else if (nm >= 645 && nm <= 780) {
    r = 1;
  }

  // Intensity fall-off at edges of visible range
  let factor: number;
  if (nm >= 380 && nm < 420) {
    factor = 0.3 + 0.7 * (nm - 380) / (420 - 380);
  } else if (nm >= 420 && nm <= 700) {
    factor = 1;
  } else if (nm > 700 && nm <= 780) {
    factor = 0.3 + 0.7 * (780 - nm) / (780 - 700);
  } else {
    factor = 0;
  }

  return [
    Math.round(r * factor * 255),
    Math.round(g * factor * 255),
    Math.round(b * factor * 255),
  ];
}

/**
 * Map temperature to a familiar object for display.
 */
export function temperatureLabel(T: number): string {
  if (T < 500) return 'Room / body heat';
  if (T < 1000) return 'Candle flame';
  if (T < 2000) return 'Embers / campfire';
  if (T < 3000) return 'Incandescent bulb';
  if (T < 4500) return 'Sunset light';
  if (T < 6000) return 'Sun surface (~5,778 K)';
  if (T < 8000) return 'Hot white star';
  return 'Blue-white star';
}

/**
 * Format a number in scientific notation: "1.23 × 10⁴"
 */
export function sciNotation(n: number, digits = 2): string {
  if (n === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mantissa = n / 10 ** exp;
  const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const supMinus = '⁻';
  const expStr = (exp < 0 ? supMinus : '') +
    Math.abs(exp).toString().split('').map(d => superscripts[parseInt(d)]!).join('');
  return `${mantissa.toFixed(digits)} × 10${expStr}`;
}

/**
 * Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Clamp value between min and max.
 */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
