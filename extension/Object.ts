import _ from 'lodash'
declare global {
  interface Object {
    toCamelKey(): Object
    fromEntries(o: any): Object
  }
}
Object.prototype.toCamelKey = function() {
  return Object.fromEntries(
    Object.entries(this).map(e => {
      e[0] = _.camelCase(e[0])
      return e
    })
  )
}
