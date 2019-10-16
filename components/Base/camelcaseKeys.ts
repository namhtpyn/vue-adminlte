import _ from 'lodash'
export default (obj: object | undefined) => {
  if (_.isEmpty(obj)) return {}
  return _.fromPairs(
    _.toPairs(obj).map(e => {
      e[0] = _.camelCase(e[0])
      e[1] = e[1] === '' ? true : e[1]
      return e
    })
  )
}
