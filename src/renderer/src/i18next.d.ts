import type { en } from '@shared/i18n/locales/en'

// Gives t() and <Trans i18nKey="..."> full autocomplete/type-checking against en.ts's
// key shape, so a typo'd or removed key is a compile error instead of a silent no-op.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
