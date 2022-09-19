import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {testFn} from '@advance/build'
testFn()

createApp(App).mount('#app')
