import i18n from 'i18next'
import Backend from 'i18next-fs-backend'

i18n
  .use(Backend)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/translation.json'
    },
    supportedLngs: ['en', 'zh', 'ja', 'ko']
  })

export default i18n