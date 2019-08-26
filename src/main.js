// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'
import fastclick from 'fastclick'
import '../static/iconfont/iconfont.css'
import Vant from './assets/js/vant.config'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueJsonp from 'vue-jsonp'
import clamp from './assets/js/clamp'
import { Lazyload } from 'vant'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false

import './assets/css/reset.sass'
fastclick.attach(document.body)
Vue.use(Lazyload, {
  loading: require('./assets/img/default.png')
})
Vue.use(Vant)
Vue.use(VueJsonp)
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // clamp,
  components: { App },
  template: '<App/>'
})
