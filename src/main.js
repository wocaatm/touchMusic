// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './assets/css/reset.css'
import './assets/css/common.css'
import router from './router'
import store from './vuex/index'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    store
}).$mount('#app')