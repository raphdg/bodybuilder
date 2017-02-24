import _ from 'lodash'
import { buildClause } from './utils'
import filterBuilder from './filter-builder'
import boolQuery from './bool-query'

export default function nestedBoolBuilder () {

  let nestedBool = {}

  function makeNestedBool (...args) {
    const boolType = _.find(args, _.isString)
    const nested = _.filter(args, _.isFunction)
    const nestedClauses = []

    _.each(nested, function (n) {
      if (_.isFunction(n)) {
        const nestedResult = n(Object.assign(
          {},
          nestedBoolBuilder(),
          filterBuilder()
        ))
        if (nestedResult.hasFilter()) {
          nestedClauses.push(nestedResult.getFilter())
        }
      }
    })

    Object.assign(nestedBool, boolQuery(boolType, nestedClauses))

  }

  return {
    nestedBool (...args) {
      makeNestedBool(...args)
      return this
    },

    getNestedBool () {
      return nestedBool
    },

    hasNestedBool () {
      return !!_.size(nestedBool)
    }
  }
}

