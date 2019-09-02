import {Icon, Search, NavBar, Popup, Loading, Dialog, Collapse, CollapseItem} from 'vant'

const components = [Icon, Search, NavBar, Popup, Loading, Dialog, Collapse, CollapseItem]

export default {
  // Vue.use会触发一个 名叫install触发并接受Vue对象作为第一个参数
  install(Vue) {
    components.forEach(c => Vue.use(c))
  }
}
