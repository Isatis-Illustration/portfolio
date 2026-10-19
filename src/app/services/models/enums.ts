export enum StorageKey{
    FILTER = 'filter',
    LANGUAGE = 'lang',
    DETAIL_ID = 'detail-id'
}

export enum Type{
    ILLUSTRATION = 'illustration',
    CHARACTER = 'character',
    SLAP_IT = 'slap-it',
    NAVARRA = 'navarra',
}

export const TYPE_ALIASES: Record<string, Type> = {
    'i': Type.ILLUSTRATION,
    'illustration': Type.ILLUSTRATION,
    'illustrations': Type.ILLUSTRATION,
    'c': Type.CHARACTER,
    'character': Type.CHARACTER,
    'character-design': Type.CHARACTER,
    'characters': Type.CHARACTER,
    'slap-it': Type.SLAP_IT,
    'slapit': Type.SLAP_IT,
    'navarra': Type.NAVARRA,
};

export function normalizeContentType(raw?: string | null): string {
    if (!raw) return Type.ILLUSTRATION;
    const clean = raw.toLowerCase().trim();
    return TYPE_ALIASES[clean] || clean;
}

export enum Language{
    IT = 'it',
    EN = 'en',
}