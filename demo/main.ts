import Vue from 'vue'
import App from './App.vue'
if (process.env.NODE_ENV === 'development') {
  // Inject base component
  const baseComponent = require.context('../components/', true, /\.vue$/) // extract js files inside modules folder
  baseComponent.keys().forEach(filePath => {
    const pp = filePath.split('/')
    const fileName = pp[pp.length - 1].replace(/(\.\/|\.vue)/g, '')
    //if (fileName === 'index') fileName = pp[pp.length - 2]
    //const moduleName = _.kebabCase(fileName) //
    Vue.component(fileName, baseComponent(filePath).default)
  })
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}
