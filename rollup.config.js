import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import multiInput from 'rollup-plugin-multi-input'
import fs from 'fs'
import path from 'path'

const componentPath = 'components'
const components = fs
  .readdirSync(componentPath)
  .map(f => componentPath + '/' + f)
  .map(p => {
    return {
      name: path.parse(p).name,
      path: p + (fs.lstatSync(p).isDirectory() ? '/index.vue' : '')
    }
  })
  .filter(o => fs.existsSync(o.path))
//.filter(f => f.toLowerCase().endsWith('.vue'))

// const fileArg = process.argv.slice(4, process.argv.length).map(f => f + '.vue')
// if (fileArg.length > 0) components = components.filter(c => fileArg.includes(c))l

const xxx = components.map(o => {
  return {
    input: o.path,
    output: {
      format: 'umd',
      name: o.name,
      dir: './dist/',
      entryFileNames: o.name + '.js'
    },
    external: ['vue', 'lodash', 'axios'],
    plugins: [
      multiInput(),
      typescript(),
      commonjs(),
      resolve(),
      vue(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  }
})
console.log(xxx)
export default xxx
