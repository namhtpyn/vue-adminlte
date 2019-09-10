import Vue, { VNode, VNodeComponentOptions, VNodeData } from 'vue'
import _ from 'lodash'
import './Object.js'
export default class VueNode implements VNode {
  tag?: string
  data?: VNodeData
  children?: VueNode[]
  text?: string
  elm?: Node
  ns?: string
  context?: Vue
  key?: string | number
  componentOptions?: VNodeComponentOptions
  componentInstance?: Vue
  parent?: VNode
  raw?: boolean
  isStatic?: boolean
  isRootInsert: boolean
  isComment: boolean
  findComponent(componentName: string) {
    return ((this || <VueNode>{}).children || []).find(child => {
      if (_.isEmpty(child.children))
        return ((child.componentInstance || <Vue>{}).$options || {}).name === _.snakeCase(componentName)
      else return child.findComponent(componentName)
    })
  }
  getAttrs() {
    return (((this || <VueNode>{}).data || {}).attrs || {}).toCamelKey()
  }
}
