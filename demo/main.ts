import Vue from 'vue'
import App from './App.vue'
import kebabCase from 'lodash/kebabCase'
import path from 'path'
if (process.env.NODE_ENV === 'development') {
  // Inject base component
  const baseComponent = require.context('../components/', true, /\.vue$/) // extract js files inside modules folder
  baseComponent.keys().forEach(filePath => {
    const pp = filePath.split('/')
    let fileName = pp[pp.length - 1].replace(/(\.\/|\.vue)/g, '')
    if (fileName === 'index') fileName = pp[pp.length - 2]
    const moduleName = kebabCase(fileName) //
    Vue.component(moduleName, baseComponent(filePath).default)
  })
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}
