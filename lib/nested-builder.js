'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

exports.default = nestedBoolBuilder;

var _filterBuilder = require('./filter-builder');

var _filterBuilder2 = _interopRequireDefault(_filterBuilder);

var _boolQuery = require('./bool-query');

var _boolQuery2 = _interopRequireDefault(_boolQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function nestedBoolBuilder() {

  var nestedBool = {};

  function makeNestedBool() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var boolType = (0, _find2.default)(args, _isString2.default);
    var nested = (0, _filter2.default)(args, _isFunction2.default);
    var nestedClauses = [];

    (0, _each2.default)(nested, function (n) {
      if ((0, _isFunction2.default)(n)) {
        var nestedResult = n(Object.assign({}, nestedBoolBuilder(), (0, _filterBuilder2.default)()));
        if (nestedResult.hasFilter()) {
          nestedClauses.push(nestedResult.getFilter());
        }
      }
    });

    if (nestedBool.hasOwnProperty(boolType)) {
      var _nestedBool$boolType;

      (_nestedBool$boolType = nestedBool[boolType]).push.apply(_nestedBool$boolType, nestedClauses);
    } else {
      Object.assign(nestedBool, _defineProperty({}, boolType, nestedClauses));
    }
  }

  return {
    nestedBool: function nestedBool() {
      makeNestedBool.apply(undefined, arguments);
      return this;
    },
    getNestedBool: function getNestedBool() {
      return nestedBool;
    },
    hasNestedBool: function hasNestedBool() {
      return !!(0, _size2.default)(nestedBool);
    }
  };
}