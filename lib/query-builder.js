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

exports.default = queryBuilder;

var _utils = require('./utils');

var _filterBuilder = require('./filter-builder');

var _filterBuilder2 = _interopRequireDefault(_filterBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function queryBuilder() {
  var query = {};
  var nestedBool = [];

  function makeNestedBool(queryType) {
    (0, _each2.default)(queryType, function (n) {
      if ((0, _isFunction2.default)(n)) {
        var nestedResult = n(Object.assign({}, (0, _filterBuilder2.default)(), queryBuilder()));
        if (nestedResult.hasFilter()) {
          nestedBool.push(nestedResult.getFilter());
        } else if (nestedResult.hasQuery()) {
          nestedBool.push(nestedResult.getQuery());
        }
      }
    });
  }

  function makeQuery(boolType, queryType) {
    var nested = {};

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if ((0, _isFunction2.default)((0, _last2.default)(args))) {
      var nestedCallback = args.pop();
      var nestedResult = nestedCallback(Object.assign({}, queryBuilder(), (0, _filterBuilder2.default)()));
      if (nestedResult.hasQuery()) {
        nested.query = nestedResult.getQuery();
      }
      if (nestedResult.hasFilter()) {
        nested.filter = nestedResult.getFilter();
      }
    }

    if (queryType.constructor === Array) {
      makeNestedBool(queryType);
      query = (0, _utils.boolMerge)(nestedBool, query, boolType);
    } else {
      query = (0, _utils.boolMerge)(_defineProperty({}, queryType, Object.assign(_utils.buildClause.apply(undefined, args), nested)), query, boolType);
    }
  }

  return {
    /**
     * Add a query clause to the query body.
     *
     * @param  {string}        type    Query type.
     * @param  {string|Object} field   Field to query or complete query clause.
     * @param  {string|Object} value   Query term or inner clause.
     * @param  {Object}        options (optional) Additional options for the
     *                                 query clause.
     * @param  {Function}      [nest]  (optional) A function used to define
     *                                 sub-filters as children. This _must_ be
     *                                 the last argument.
     *
     * @return {bodybuilder} Builder.
     *
     * @example
     * bodybuilder()
     *   .query('match_all')
     *   .build()
     *
     * bodybuilder()
     *   .query('match_all', { boost: 1.2 })
     *   .build()
     *
     * bodybuilder()
     *   .query('match', 'message', 'this is a test')
     *   .build()
     *
     * bodybuilder()
     *   .query('terms', 'user', ['kimchy', 'elastic'])
     *   .build()
     *
     * bodybuilder()
     *   .query('nested', { path: 'obj1', score_mode: 'avg' }, (q) => {
     *     return q
     *       .query('match', 'obj1.name', 'blue')
     *       .query('range', 'obj1.count', {gt: 5})
     *   })
     *   .build()
     */
    query: function query() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      makeQuery.apply(undefined, ['and'].concat(args));
      return this;
    },


    /**
     * Alias for `query`.
     *
     * @return {bodybuilder} Builder.
     */
    andQuery: function andQuery() {
      return this.query.apply(this, arguments);
    },


    /**
     * Alias for `query`.
     *
     * @return {bodybuilder} Builder.
     */
    addQuery: function addQuery() {
      return this.query.apply(this, arguments);
    },


    /**
     * Add a "should" query to the query body.
     *
     * Same arguments as `query`.
     *
     * @return {bodybuilder} Builder.
     */
    orQuery: function orQuery() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      makeQuery.apply(undefined, ['or'].concat(args));
      return this;
    },


    /**
     * Add a "must_not" query to the query body.
     *
     * Same arguments as `query`.
     *
     * @return {bodybuilder} Builder.
     */
    notQuery: function notQuery() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      makeQuery.apply(undefined, ['not'].concat(args));
      return this;
    },
    getQuery: function getQuery() {
      return query;
    },
    hasQuery: function hasQuery() {
      return !!(0, _size2.default)(query);
    }
  };
}