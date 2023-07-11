import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import 'default-passive-events'
import '@/assets/icons' // icon

import '@/assets/css/global.css'
import SvgIcon from '@/components/SvgIcon/index.vue'

createApp(App)
    .use(store)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .component('svg-icon',SvgIcon)
    .mount('#app')
