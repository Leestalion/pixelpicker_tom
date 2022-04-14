import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app.use(createPinia(), axios);

app.mount('#app')
