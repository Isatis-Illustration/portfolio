/**
 * Layout del ventaglio di foto che sbucano dalla bustina delle collaborazioni (Home).
 * Le foto si dispongono simmetriche attorno al centro: con N foto la i-esima ha
 * offset (i - (N-1)/2), quindi ogni nuova foto va a destra e il gruppo resta centrato.
 * Più foto ci sono, più si stringono, così a riposo restano dentro la tasca.
 *
 * Restituisce le variabili CSS lette da `.pouch .card` in home.component.css
 * (--x/--y/--r0 a riposo, --hx/--hy/--hr in hover, --s scala, --z, --delay).
 * Copiata in cloudinary-uploader/src/app/services/pouch-fan.ts: tenerle allineate.
 */
export const MAX_FAN_IMAGES = 6;

/* Valori tarati sul layout originale a 4 foto (outer: ±64px / ±96px in hover) */
const REST_STEP = 42.67;   // distanza orizzontale tra due foto a riposo
const REST_SPREAD = 128;   // larghezza massima del ventaglio a riposo (da foto esterna a foto esterna)
const HOVER_STEP = 64;
const HOVER_SPREAD = 280;
const REST_TILT = 18;      // gradi tra la prima e l'ultima foto a riposo
const HOVER_TILT = 32;
const SHRINK_FROM = 4;     // oltre questo numero di foto le card si rimpiccioliscono
const SHRINK_STEP = 0.09;  // riduzione di scala per ogni foto in più

export function fanLayout(count: number): Record<string, string>[] {
  const n = Math.max(0, Math.min(count, MAX_FAN_IMAGES));
  const maxOffset = (n - 1) / 2;
  const restStep = n > 1 ? Math.min(REST_STEP, REST_SPREAD / (n - 1)) : 0;
  const hoverStep = n > 1 ? Math.min(HOVER_STEP, HOVER_SPREAD / (n - 1)) : 0;
  const restTilt = n > 1 ? REST_TILT / (n - 1) : 0;
  const hoverTilt = n > 1 ? HOVER_TILT / (n - 1) : 0;
  const scale = 1 - Math.max(0, n - SHRINK_FROM) * SHRINK_STEP;

  return Array.from({ length: n }, (_, i) => {
    const offset = i - maxOffset;
    // 0 al centro, 1 sulle foto esterne: le esterne stanno più in basso e sotto le centrali
    const edge = maxOffset > 0 ? Math.abs(offset) / maxOffset : 0;

    return {
      '--x': `${(offset * restStep).toFixed(1)}px`,
      '--y': `${(-26 + 14 * edge).toFixed(1)}px`,
      '--r0': `${(offset * restTilt).toFixed(2)}deg`,
      '--hx': `${(offset * hoverStep).toFixed(1)}px`,
      '--hy': `${(-120 + 28 * edge).toFixed(1)}px`,
      '--hr': `${(offset * hoverTilt).toFixed(2)}deg`,
      '--s': scale.toFixed(2),
      '--z': String(2 + Math.round((1 - edge) * 2)),
      '--delay': `${(0.04 * (i + 1)).toFixed(2)}s`,
    };
  });
}
