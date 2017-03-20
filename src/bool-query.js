const CONDITIONS_MAP = {
  must: 'must',
  should: 'should',
  must_not: 'must_not',
  mustNot: 'must_not',
  and: 'must',
  or: 'should',
  not: 'must_not'
}

/**
 * Construct a Boolean query.
 *
 * @private
 * @memberof Queries
 *
 * @param  {String} condition Boolean condition: must, must_not, should.
 * @param  {Object} query     Fully-formed query.
 * @return {Object}           Boolean query.
 */
export default function boolQuery(condition, query) {
  let cond = CONDITIONS_MAP[condition]
  let result = {bool: {}}
  result.bool[cond] = query.constructor === Array ? query : [query]
  return result
}
