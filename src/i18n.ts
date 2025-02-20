import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend, { HttpBackendOptions } from 'i18next-http-backend'

void i18n
	.use(Backend)
	.use(initReactI18next)
	.init<HttpBackendOptions>({
		lng: 'en',
		fallbackLng: 'en',
		ns: ['common']
	})
