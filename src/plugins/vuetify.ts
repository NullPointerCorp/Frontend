import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          background: '#FFFFFF',
          surface: '#F5F5F5',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
    },
  },
})
