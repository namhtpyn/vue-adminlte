import XLSX from 'xlsx'
import { TableItem } from '../../types/Table'
import { VNode } from 'vue'
import _ from 'lodash'
export function stringToElement(str: string, tag: string = 'div') {
  var el = document.createElement(tag)
  el.innerHTML = str
  return el
}
export function vnodeToElement(nodes: VNode[], tag: string = 'div') {
  const strs: string[] = nodes.map(node => getFullTag(node))
  return stringToElement(strs.join(''), tag)
}
const unaryTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

function renderStartTag(VNode) {
  let html = `<${VNode.tag}`

  if (VNode.data) {
    if (VNode.data.attrs) {
      let attr = VNode.data.attrs
      for (let name in attr) {
        if (attr[name] === '') {
          html += ` ${name}`
        } else {
          html += ` ${name}="${attr[name]}"`
        }
      }
    }
  }

  return html + '>'
}

function isUnaryTag(VNode) {
  return unaryTags.indexOf(VNode.tag) > -1
}

function getFullTag(VNode) {
  if (!VNode.tag) return VNode.text

  let html = renderStartTag(VNode)

  if (VNode.children) {
    html += getChildren(VNode)
  }
  if (!isUnaryTag(VNode)) {
    html += `</${VNode.tag}>`
  }
  return html
}

function getChildren(VNode) {
  let html = ''
  for (let i in VNode.children) {
    let child = VNode.children[i]
    html += getFullTag(child)
  }
  return html
}
