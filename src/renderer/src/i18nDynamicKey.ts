import type { TFunction } from 'i18next'

// react-i18next's t() is typed against en.ts's literal key union (see i18next.d.ts) so a
// typo'd key written directly in source is a compile error. That same strictness rejects
// a key read from a data array (e.g. a NAV_ITEMS[].labelKey), since its type is just
// `string`. Use this only for that case - every key written directly as a t('...') call
// keeps the full literal-key checking.
export function tKey(t: TFunction, key: string, params?: Record<string, unknown>): string {
  return params ? t(key as never, params) : t(key as never)
}
