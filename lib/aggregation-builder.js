'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

exports.default = aggregationBuilder;

var _utils = require('./utils');

var _filterBuilder = require('./filter-builder');

var _filterBuilder2 = _interopRequireDefault(_filterBuilder);

var _nestedBuilder = require('./nested-builder');

var _nestedBuilder2 = _interopRequireDefault(_nestedBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function aggregationBuilder() {
  var aggregations = {};

  function makeAggregation(type, field) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var aggName = (0, _find2.default)(args, _isString2.default) || 'agg_' + type + '_' + field;
    var opts = (0, _find2.default)(args, _isPlainObject2.default);
    var nested = (0, _find2.default)(args, _isFunction2.default);
    var nestedClause = {};

    if ((0, _isFunction2.default)(nested)) {
      var nestedResult = nested(Object.assign({}, aggregationBuilder(), (0, _filterBuilder2.default)()));
      if (nestedResult.hasFilter()) {
        nestedClause.filter = nestedResult.getFilter();
      }
      if (nestedResult.hasAggregations()) {
        nestedClause.aggs = nestedResult.getAggregations();
      }
    }

    var innerClause = Object.assign({}, _defineProperty({}, type, (0, _utils.buildClause)(field, null, opts)), nestedClause);

    Object.assign(aggregations, _defineProperty({}, aggName, innerClause));
  }

  return {
    /**
     * Add an aggregation clause to the query body.
     *
     * @param  {string|Object} type      Name of the aggregation type, such as
     *                                   `'sum'` or `'terms'`.
     * @param  {string}        field     Name of the field to aggregate over.
     * @param  {Object}        [options] (optional) Additional options to
     *                                   include in the aggregation.
     * @param  {string}        [name]    (optional) A custom name for the
     *                                   aggregation, defaults to
     *                                   `agg_<type>_<field>`.
     * @param  {Function}      [nest]    (optional) A function used to define
     *                                   sub-aggregations as children. This
     *                                   _must_ be the last argument.
     *
     * @return {bodybuilder} Builder.
     *
     * @example
     * bodybuilder()
     *   .aggregation('max', 'price')
     *   .build()
     *
     * bodybuilder()
     *   .aggregation('percentiles', 'load_time', {
     *     percents: [95, 99, 99.9]
     *   })
     *   .build()
     *
     * bodybuilder()
     *   .aggregation('date_range', 'date', {
     *     format: 'MM-yyy',
     *     ranges: [{ to: 'now-10M/M' }, { from: 'now-10M/M' }]
     *   })
     *   .build()
     *
     * bodybuilder()
     *   .aggregation('diversified_sampler', 'user.id', { shard_size: 200 }, (a) => {
     *     return a.aggregation('significant_terms', 'text', 'keywords')
     *   })
     *   .build()
     */
    aggregation: function aggregation() {
      makeAggregation.apply(undefined, arguments);
      return this;
    },


    /**
     * Alias for `aggregation`.
     *
     * @return {bodybuilder} Builder.
     */
    agg: function agg() {
      return this.aggregation.apply(this, arguments);
    },
    getAggregations: function getAggregations() {
      return aggregations;
    },
    hasAggregations: function hasAggregations() {
      return !!(0, _size2.default)(aggregations);
    }
  };
}