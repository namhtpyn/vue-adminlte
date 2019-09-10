import Vue from 'vue'
import App from './App.vue'
import kebabCase from 'lodash/kebabCase'
if (process.env.NODE_ENV === 'development') {
  // Inject base component
  const baseComponent = require.context('../components/', true, /\.vue$/) // extract js files inside modules folder
  baseComponent.keys().forEach(fileName => {
    const moduleName = kebabCase(fileName.replace(/(\.\/|\.vue)/g, '')) //
    Vue.component(moduleName, baseComponent(fileName).default)
  })
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}
