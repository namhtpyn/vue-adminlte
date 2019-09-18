import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import multiInput from 'rollup-plugin-multi-input'
import strip from 'rollup-plugin-strip'
import { terser } from 'rollup-plugin-terser'
import fs from 'fs'
import path from 'path'

const componentPath = './components'
let components = fs
  .readdirSync(componentPath)
  .map(f => componentPath + '/' + f)
  .map(p => {
    return {
      name: path.parse(p).name,
      path: p + (fs.lstatSync(p).isDirectory() ? '/' + path.parse(p).name + '.vue' : '')
    }
  })
  .filter(o => fs.existsSync(o.path))
  .filter(o => o.path.endsWith('.vue'))

const imports = components.map(c => `import ${c.name} from '${c.path.replace('components', '.')}'`)
imports.unshift("import Vue from 'vue'")
const VueComponents = components.map(c => `Vue.component('${c.name}', ${c.name})`)
VueComponents.push('')
fs.writeFileSync(componentPath + '/index.ts', imports.concat(VueComponents).join('\n'))

components = [{ name: 'VueAdminLTE', path: componentPath + '/index.ts' }]

const xxx = components.map(o => {
  return {
    input: o.path,
    output: {
      format: 'umd',
      name: o.name,
      dir: './dist/',
      entryFileNames: o.name + '.js'
    },
    external: ['vue', 'lodash', 'axios', 'moment', 'chart.js', 'numeral', 'xlsx'],
    plugins: [
      multiInput(),
      typescript(),
      commonjs(),
      resolve(),
      vue(),
      strip({
        debugger: true
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser()
    ]
  }
})
export default xxx
