import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/default.css'
import ZkTable from 'vue-table-with-tree-grid'
//引入编辑框
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(ZkTable)
//时间处理函数
Vue.filter('dateFormat',function (originVal) {
const dt=new Date(originVal)
  //年月日
  const y=dt.getFullYear()
  const m=(dt.getMonth() + 1 + '').padStart(2,'0')
  const d=(dt.getDate() + '').padStart(2,'0')
//  时分秒
  const hh=(dt.getHours() + '').padStart(2,'0')
  const mm=(dt.getMinutes() + '').padStart(2,'0')
  const ss=(dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
