import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import multiInput from 'rollup-plugin-multi-input'
import fs from 'fs'
import path from 'path'

let components = fs.readdirSync(path.join('component')).filter(f => f.toLowerCase().endsWith('.vue'))
export default components.map(c => {
  return {
    input: './component/' + c,
    output: {
      format: 'iife',
      name: path.parse(c).name,
      dir: './dist/',
      entryFileNames: path.parse(c).name + '.js'
    },
    external: ['Vue'],
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
