import { useCache } from '@/hooks/web/useCache'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const { wsCache } = useCache()

export const elLocaleMap = {
  'zh-CN': zhCn,
  en: en,
  jp: en
}
export interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const localeModules: LocaleState = {
  currentLocale: {
    lang: wsCache.get('lang') || 'jp',
    elLocale: elLocaleMap[wsCache.get('lang') || 'jp']
  },
  // 多语言
  localeMap: [
    {
      lang: 'jp',
      name: '日本語'
    },
    {
      lang: 'en',
      name: 'English'
    },
    {
      lang: 'zh-CN',
      name: '简体中文'
    },
  ]
}
