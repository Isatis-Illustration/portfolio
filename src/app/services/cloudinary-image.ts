const UPLOAD_SEGMENT = '/image/upload/';

/**
 * URL Cloudinary ridimensionato lato server: larghezza massima `width` px (c_limit: mai ingrandita,
 * proporzioni intatte), formato e qualità automatici (f_auto, q_auto).
 * Serve per le immagini piccole a schermo: far rimpicciolire al browser un originale di migliaia
 * di pixel, se ritagliato (object-fit: cover) o ruotato, lo fa sgranare, oltre a scaricare MB inutili.
 * Gli URL non Cloudinary (es. asset locali) tornano invariati.
 */
export function cloudinaryResized(url: string, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(UPLOAD_SEGMENT)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}c_limit,w_${width},f_auto,q_auto/`);
}
