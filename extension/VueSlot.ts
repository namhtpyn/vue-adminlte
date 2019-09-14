//import Vue, { VNode, VNodeComponentOptions, VNodeData } from 'vue'
import _ from 'lodash'
import Vue, { VNode } from 'vue'
export class VueNode {
  tag: string
  isComponent: boolean
  componentInstance: Vue
  attrs: object
  children: VueNode[]
  text: string
}
export default class VueSlot {
  constructor(slot: VNode[]) {
    this.slot = slot
    this.parse()
  }
  private slot: VNode[]
  data: VueNode[] = []
  private parse(data: VueNode[] = this.data, nodes: VNode[] = this.slot) {
    if (_.isEmpty(nodes)) return
    nodes.forEach(node => {
      const myNode = new VueNode()
      myNode.tag = node.tag || ''
      myNode.isComponent = !_.isEmpty(node.componentInstance)
      myNode.componentInstance = node.componentInstance
      myNode.attrs = this.toProps((node.data || {}).attrs || {})
      myNode.text = node.text || ''
      myNode.children = []
      if (!_.isEmpty(node.children)) this.parse(myNode.children, node.children)
      data.push(myNode)
    })
  }
  find(fn: Function = (node: VueNode) => false, nodes: VueNode[] = this.data) {
    const myNodes: VueNode[] = []
    nodes.forEach(node => {
      if (fn(node)) myNodes.push(node)
      if (!_.isEmpty(node.children)) myNodes.concat(this.find(fn, node.children))
    })
    return myNodes
  }
  private toProps(obj: Object) {
    return Object.fromEntries(
      Object.entries(obj).map(e => {
        e[0] = _.camelCase(e[0])
        e[1] = _.isEmpty(e[1]) ? true : e[1]
        return e
      })
    )
  }
}
