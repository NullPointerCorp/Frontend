import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { Toaster } from 'vue-sonner'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1565C0',     // el azul de tus botones/menú activo
          background: '#F5F7FA',  // fondo general gris claro
          surface: '#FFFFFF',     // sidebar, header, cards (blanco)
          error: '#D32F2F',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3', 
          background: '#121212',  // negro Material Design
          surface: '#1E1E1E',     // gris muy oscuro para sidebar/header
          success: '#66BB6A',
          error: '#CF6679',
        },
      },
    },
  },
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(createPinia())
  .component('Toaster', Toaster)
  .mount('#app')
