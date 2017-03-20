'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

exports.default = filterBuilder;

var _utils = require('./utils');

var _queryBuilder = require('./query-builder');

var _queryBuilder2 = _interopRequireDefault(_queryBuilder);

var _aggregationBuilder = require('./aggregation-builder');

var _aggregationBuilder2 = _interopRequireDefault(_aggregationBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function filterBuilder() {
  var filter = {};
  var nestedBool = [];

  function makeNestedBool(filterType) {
    (0, _each2.default)(filterType, function (n) {
      if ((0, _isFunction2.default)(n)) {
        var nestedResult = n(Object.assign({}, filterBuilder(), (0, _queryBuilder2.default)()));
        if (nestedResult.hasFilter()) {
          nestedBool.push(nestedResult.getFilter());
        } else if (nestedResult.hasQuery()) {
          nestedBool.push(nestedResult.getQuery());
        }
      }
    });
  }

  function makeFilter(boolType, filterType) {
    var nested = {};

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if ((0, _isFunction2.default)((0, _last2.default)(args))) {
      var nestedCallback = args.pop();
      var nestedResult = nestedCallback(Object.assign({}, (0, _queryBuilder2.default)(), filterBuilder(), (0, _aggregationBuilder2.default)()));
      if (nestedResult.hasQuery()) {
        nested.query = nestedResult.getQuery();
      }
      if (nestedResult.hasFilter()) {
        nested.query = nestedResult.getFilter();
      }
      if (nestedResult.hasAggregations()) {
        nested.aggs = nestedResult.getAggregations();
      }
    }

    if (filterType.constructor === Array) {
      makeNestedBool(filterType);
      filter = (0, _utils.boolMerge)(nestedBool, filter, boolType);
    } else {
      var obj = Object.assign(_utils.buildClause.apply(undefined, args), nested);
      filter = (0, _utils.boolMerge)(_defineProperty({}, filterType, obj), filter, boolType);
    }
  }

  return {
    /**
     * Add a filter clause to the query body.
     *
     * @param  {string}        type    Filter type.
     * @param  {string|Object} field   Field to filter or complete filter
     *                                 clause.
     * @param  {string|Object} value   Filter term or inner clause.
     * @param  {Object}        options (optional) Additional options for the
     *                                 filter clause.
     * @param  {Function}      [nest]  (optional) A function used to define
     *                                 sub-filters as children. This _must_ be
     *                                 the last argument.
     *
     * @return {bodybuilder} Builder.
     *
     * @example
     * bodybuilder()
     *   .filter('term', 'user', 'kimchy')
     *   .build()
     */
    filter: function filter() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      makeFilter.apply(undefined, ['and'].concat(args));
      return this;
    },


    /**
     * Alias for `filter`.
     *
     * @return {bodybuilder} Builder.
     */
    andFilter: function andFilter() {
      return this.filter.apply(this, arguments);
    },


    /**
     * Alias for `filter`.
     *
     * @return {bodybuilder} Builder.
     */
    addFilter: function addFilter() {
      return this.filter.apply(this, arguments);
    },


    /**
     * Add a "should" filter to the query body.
     *
     * Same arguments as `filter`.
     *
     * @return {bodybuilder} Builder.
     */
    orFilter: function orFilter() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      makeFilter.apply(undefined, ['or'].concat(args));
      return this;
    },


    /**
     * Add a "must_not" filter to the query body.
     *
     * Same arguments as `filter`.
     *
     * @return {bodybuilder} Builder.
     */
    notFilter: function notFilter() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      makeFilter.apply(undefined, ['not'].concat(args));
      return this;
    },
    getFilter: function getFilter() {
      return filter;
    },
    hasFilter: function hasFilter() {
      return !!(0, _size2.default)(filter);
    }
  };
}