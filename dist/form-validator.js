(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("formValidator", [], factory);
	else if(typeof exports === 'object')
		exports["formValidator"] = factory();
	else
		root["formValidator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _formValidator = __webpack_require__(1);

	var _formValidator2 = _interopRequireDefault(_formValidator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _formValidator2.default; /**
	                                           * Created by ridel1e on 21/09/16.
	                                           */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(2);

	exports.default = function () {

	  var _validatorTemplates = {
	    required: function required() {
	      return function (value) {
	        return !_isEmpty(value);
	      };
	    },
	    minLength: _createValidatorFunction(function (value, minLength) {
	      return value.length >= minLength;
	    }),
	    maxLength: _createFieldValidators(function (value, maxLength) {
	      return value.length <= maxLength;
	    })
	  };

	  return {
	    addValidator: addValidator,
	    setFormValidation: setFormValidation
	  };

	  /**
	   * add custom validator to service
	   * @param name
	   * @param callback
	   */
	  function addValidator(name, callback) {
	    if (!_validatorTemplates[name]) {
	      _validatorTemplates[name] = _createValidatorFunction(callback);
	    }
	  }

	  function addAsyncValidator(name, callback) {
	    if (!_validatorTemplates[name]) {
	      _validatorTemplates[name] = _createValidatorFunction(callback, true);
	    }
	  }

	  /**
	   * set validation to form from scheme object
	   * @param formName
	   * @param scheme
	   */
	  function setFormValidation(formName, scheme) {
	    var form = document.forms[formName];

	    scheme.forEach(function (fieldScheme) {
	      return _setFieldRules(form[fieldScheme.name], fieldScheme.rules, form);
	    });
	  }

	  /**
	   * set validation on each field
	   * @param field
	   * @param rules
	   * @param form
	   * @private
	   */
	  function _setFieldRules(field, rules, form) {
	    var fieldValidators = _createFieldValidators(rules, form);

	    /* need to avoid repeated bounded fields */
	    var allUniqueBoundedFields = _getCommonUniqueBoundedFields(fieldValidators);
	    var runFieldValidation = function runFieldValidation() {
	      var errorMessage = _getFieldErrorMessage(field, fieldValidators);
	      field.setCustomValidity(errorMessage);
	      console.dir(field.validationMessage);
	    };

	    _setFieldListener(field, runFieldValidation);
	    allUniqueBoundedFields.forEach(function (boundedField) {
	      return _setFieldListener(boundedField, runFieldValidation);
	    });

	    /* run validation after listener creation */
	    field.dispatchEvent(new Event('input'));
	  }

	  /**
	   * Returns field validators collection
	   * @param rules
	   * @param form
	   * @returns {Array}
	   * @private
	   */
	  function _createFieldValidators(rules, form) {
	    return rules.map(function (rule) {
	      var boundedFields = _getBoundedFields(rule.bindWith, form);
	      var fieldValidator = _validatorTemplates[rule.name](rule.data, boundedFields);

	      return {
	        message: rule.message,
	        validatorFunction: fieldValidator,
	        boundedFields: boundedFields
	      };
	    });
	  }

	  /**
	   * Returns flat array with unique bounded fields only
	   * @param fieldValidators
	   * @returns {Array}
	   * @private
	   */
	  function _getCommonUniqueBoundedFields(fieldValidators) {
	    return fieldValidators.map(function (validator) {
	      return validator.boundedFields;
	    }).filter(function (boundedFieldsList) {
	      return boundedFieldsList.length > 0;
	    }).concatAll().distinct();
	  }

	  /**
	   * Set listener to field
	   * @param field
	   * @param callback
	   * @private
	   */
	  function _setFieldListener(field, callback) {
	    field.addEventListener('input', callback);
	  }

	  /**
	   * Returns array with bounded to rule fields
	   * @param boundedFieldsNames
	   * @param currentForm
	   * @returns {Array}
	   * @private
	   */
	  function _getBoundedFields() {
	    var boundedFieldsNames = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	    var currentForm = arguments[1];

	    return boundedFieldsNames.map(function (name) {
	      return currentForm[name];
	    });
	  }

	  function _isEmpty(value) {
	    return value === null || value === undefined || value === '' || value !== value;
	  }

	  /**
	   * Returns error message. If field is valid method returns empty string
	   * @param field
	   * @param validators
	   * @returns {string}
	   * @private
	   */
	  function _getFieldErrorMessage(field, validators) {

	    for (var i = 0; i < validators.length; i++) {
	      if (!validators[i].validatorFunction(field.value)) {
	        return validators[i].message;
	      }
	    }

	    return '';
	  }

	  /**
	   * Returns validator function created with validator template
	   * @param callback
	   * @param async
	   * @returns {function(): function()}
	   * @private
	   */
	  function _createValidatorFunction(callback, async) {
	    return function (data, boundedFields) {
	      return function (value) {
	        var boundedFieldsValues = _getBoundedFieldsValues(boundedFields);
	        var args = Array.prototype.concat(value, data, boundedFieldsValues);

	        if (async) {
	          return _isEmpty(value) ? Promise.resolve() : callback.apply(null, args);
	        } else {
	          return _isEmpty(value) || callback.apply(null, args);
	        }
	      };
	    };
	  }

	  /**
	   * Returns bounded fields values
	   * @param fields
	   * @returns {Array}
	   * @private
	   */
	  function _getBoundedFieldsValues() {
	    var fields = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    return fields.map(function (field) {
	      return field.value;
	    });
	  }
	}(); /**
	      * Created by ridel1e on 23/09/16.
	      */

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by ridel1e on 23/09/16.
	 */

	Object.assign(Array.prototype, {
	  concatAll: concatAll,
	  distinct: distinct
	});

	/**
	 * Returns a flatten array
	 * @returns {Array}
	 */
	function concatAll() {
	  return Array.prototype.concat.apply([], this);
	}

	/**
	 * Returns array with unique elements
	 * @returns {Array}
	 */
	function distinct() {
	  return this.filter(function (value, index, self) {
	    return self.indexOf(value) === index;
	  });
		}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS12YWxpZGF0b3IuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4MjdlMGIxYWJiMzg3NGExMDNjYSIsIndlYnBhY2s6Ly8vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL3NyYy9mb3JtLXZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly8vIiwid2VicGFjazovLy9zcmMvaGVscGVycy9hcnJheS1wb2x5ZmlsbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcImZvcm1WYWxpZGF0b3JcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZm9ybVZhbGlkYXRvclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJmb3JtVmFsaWRhdG9yXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4MjdlMGIxYWJiMzg3NGExMDNjYVxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSByaWRlbDFlIG9uIDIxLzA5LzE2LlxuICovXG5cbmltcG9ydCBmb3JtVmFsaWRhdG9yIGZyb20gJy4vc3JjL2Zvcm0tdmFsaWRhdG9yJztcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtVmFsaWRhdG9yO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBpbmRleC5qc1xuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSByaWRlbDFlIG9uIDIzLzA5LzE2LlxuICovXG5cbmltcG9ydCAnLi9oZWxwZXJzL2FycmF5LXBvbHlmaWxsJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICBjb25zdCBfdmFsaWRhdG9yVGVtcGxhdGVzID0ge1xuICAgIHJlcXVpcmVkOiAoKSA9PiB2YWx1ZSA9PiAhX2lzRW1wdHkodmFsdWUpLFxuICAgIG1pbkxlbmd0aDogX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKCh2YWx1ZSwgbWluTGVuZ3RoKSA9PlxuICAgICAgdmFsdWUubGVuZ3RoID49IG1pbkxlbmd0aCksXG4gICAgbWF4TGVuZ3RoOiBfY3JlYXRlRmllbGRWYWxpZGF0b3JzKCh2YWx1ZSwgbWF4TGVuZ3RoKSA9PlxuICAgICAgdmFsdWUubGVuZ3RoIDw9IG1heExlbmd0aClcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZFZhbGlkYXRvcjogYWRkVmFsaWRhdG9yLFxuICAgIHNldEZvcm1WYWxpZGF0aW9uOiBzZXRGb3JtVmFsaWRhdGlvblxuICB9O1xuXG4gIC8qKlxuICAgKiBhZGQgY3VzdG9tIHZhbGlkYXRvciB0byBzZXJ2aWNlXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gYWRkVmFsaWRhdG9yKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYoIV92YWxpZGF0b3JUZW1wbGF0ZXNbbmFtZV0pIHtcbiAgICAgIF92YWxpZGF0b3JUZW1wbGF0ZXNbbmFtZV0gPSBfY3JlYXRlVmFsaWRhdG9yRnVuY3Rpb24oY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkQXN5bmNWYWxpZGF0b3IobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZighX3ZhbGlkYXRvclRlbXBsYXRlc1tuYW1lXSkge1xuICAgICAgX3ZhbGlkYXRvclRlbXBsYXRlc1tuYW1lXSA9IF9jcmVhdGVWYWxpZGF0b3JGdW5jdGlvbihjYWxsYmFjaywgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc2V0IHZhbGlkYXRpb24gdG8gZm9ybSBmcm9tIHNjaGVtZSBvYmplY3RcbiAgICogQHBhcmFtIGZvcm1OYW1lXG4gICAqIEBwYXJhbSBzY2hlbWVcbiAgICovXG4gIGZ1bmN0aW9uIHNldEZvcm1WYWxpZGF0aW9uKGZvcm1OYW1lLCBzY2hlbWUpIHtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZm9ybXNbZm9ybU5hbWVdO1xuXG4gICAgc2NoZW1lLmZvckVhY2goKGZpZWxkU2NoZW1lKSA9PlxuICAgICAgX3NldEZpZWxkUnVsZXMoZm9ybVtmaWVsZFNjaGVtZS5uYW1lXSwgZmllbGRTY2hlbWUucnVsZXMsIGZvcm0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdmFsaWRhdGlvbiBvbiBlYWNoIGZpZWxkXG4gICAqIEBwYXJhbSBmaWVsZFxuICAgKiBAcGFyYW0gcnVsZXNcbiAgICogQHBhcmFtIGZvcm1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9zZXRGaWVsZFJ1bGVzKGZpZWxkLCBydWxlcywgZm9ybSkge1xuICAgIGNvbnN0IGZpZWxkVmFsaWRhdG9ycyA9IF9jcmVhdGVGaWVsZFZhbGlkYXRvcnMocnVsZXMsIGZvcm0pO1xuXG4gICAgLyogbmVlZCB0byBhdm9pZCByZXBlYXRlZCBib3VuZGVkIGZpZWxkcyAqL1xuICAgIGNvbnN0IGFsbFVuaXF1ZUJvdW5kZWRGaWVsZHMgPSBfZ2V0Q29tbW9uVW5pcXVlQm91bmRlZEZpZWxkcyhmaWVsZFZhbGlkYXRvcnMpO1xuICAgIGNvbnN0IHJ1bkZpZWxkVmFsaWRhdGlvbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IF9nZXRGaWVsZEVycm9yTWVzc2FnZShmaWVsZCwgZmllbGRWYWxpZGF0b3JzKTtcbiAgICAgIGZpZWxkLnNldEN1c3RvbVZhbGlkaXR5KGVycm9yTWVzc2FnZSk7XG4gICAgICBjb25zb2xlLmRpcihmaWVsZC52YWxpZGF0aW9uTWVzc2FnZSk7XG4gICAgfTtcblxuICAgIF9zZXRGaWVsZExpc3RlbmVyKGZpZWxkLCBydW5GaWVsZFZhbGlkYXRpb24pO1xuICAgIGFsbFVuaXF1ZUJvdW5kZWRGaWVsZHNcbiAgICAgIC5mb3JFYWNoKGJvdW5kZWRGaWVsZCA9PlxuICAgICAgICBfc2V0RmllbGRMaXN0ZW5lcihib3VuZGVkRmllbGQsIHJ1bkZpZWxkVmFsaWRhdGlvbikpO1xuXG5cbiAgICAvKiBydW4gdmFsaWRhdGlvbiBhZnRlciBsaXN0ZW5lciBjcmVhdGlvbiAqL1xuICAgIGZpZWxkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGZpZWxkIHZhbGlkYXRvcnMgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gcnVsZXNcbiAgICogQHBhcmFtIGZvcm1cbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2NyZWF0ZUZpZWxkVmFsaWRhdG9ycyhydWxlcywgZm9ybSkge1xuICAgIHJldHVybiBydWxlcy5tYXAoKHJ1bGUpID0+IHtcbiAgICAgIGNvbnN0IGJvdW5kZWRGaWVsZHMgPSBfZ2V0Qm91bmRlZEZpZWxkcyhydWxlLmJpbmRXaXRoLCBmb3JtKTtcbiAgICAgIGNvbnN0IGZpZWxkVmFsaWRhdG9yID0gX3ZhbGlkYXRvclRlbXBsYXRlc1tydWxlLm5hbWVdKHJ1bGUuZGF0YSwgYm91bmRlZEZpZWxkcyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1lc3NhZ2U6IHJ1bGUubWVzc2FnZSxcbiAgICAgICAgdmFsaWRhdG9yRnVuY3Rpb246IGZpZWxkVmFsaWRhdG9yLFxuICAgICAgICBib3VuZGVkRmllbGRzOiBib3VuZGVkRmllbGRzLFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgZmxhdCBhcnJheSB3aXRoIHVuaXF1ZSBib3VuZGVkIGZpZWxkcyBvbmx5XG4gICAqIEBwYXJhbSBmaWVsZFZhbGlkYXRvcnNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldENvbW1vblVuaXF1ZUJvdW5kZWRGaWVsZHMoZmllbGRWYWxpZGF0b3JzKSB7XG4gICAgcmV0dXJuIGZpZWxkVmFsaWRhdG9yc1xuICAgICAgLm1hcCgodmFsaWRhdG9yKSA9PiB2YWxpZGF0b3IuYm91bmRlZEZpZWxkcylcbiAgICAgIC5maWx0ZXIoKGJvdW5kZWRGaWVsZHNMaXN0KSA9PiBib3VuZGVkRmllbGRzTGlzdC5sZW5ndGggPiAwKVxuICAgICAgLmNvbmNhdEFsbCgpXG4gICAgICAuZGlzdGluY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgbGlzdGVuZXIgdG8gZmllbGRcbiAgICogQHBhcmFtIGZpZWxkXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX3NldEZpZWxkTGlzdGVuZXIoZmllbGQsIGNhbGxiYWNrKSB7XG4gICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhcnJheSB3aXRoIGJvdW5kZWQgdG8gcnVsZSBmaWVsZHNcbiAgICogQHBhcmFtIGJvdW5kZWRGaWVsZHNOYW1lc1xuICAgKiBAcGFyYW0gY3VycmVudEZvcm1cbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldEJvdW5kZWRGaWVsZHMoYm91bmRlZEZpZWxkc05hbWVzID0gW10sIGN1cnJlbnRGb3JtKSB7XG4gICAgcmV0dXJuIGJvdW5kZWRGaWVsZHNOYW1lcy5tYXAobmFtZSA9PiBjdXJyZW50Rm9ybVtuYW1lXSk7XG4gIH1cblxuICBmdW5jdGlvbiBfaXNFbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSAhPT0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBlcnJvciBtZXNzYWdlLiBJZiBmaWVsZCBpcyB2YWxpZCBtZXRob2QgcmV0dXJucyBlbXB0eSBzdHJpbmdcbiAgICogQHBhcmFtIGZpZWxkXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfZ2V0RmllbGRFcnJvck1lc3NhZ2UoZmllbGQsIHZhbGlkYXRvcnMpIHtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB2YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZighdmFsaWRhdG9yc1tpXS52YWxpZGF0b3JGdW5jdGlvbihmaWVsZC52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRvcnNbaV0ubWVzc2FnZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHZhbGlkYXRvciBmdW5jdGlvbiBjcmVhdGVkIHdpdGggdmFsaWRhdG9yIHRlbXBsYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKiBAcGFyYW0gYXN5bmNcbiAgICogQHJldHVybnMge2Z1bmN0aW9uKCk6IGZ1bmN0aW9uKCl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfY3JlYXRlVmFsaWRhdG9yRnVuY3Rpb24oY2FsbGJhY2ssIGFzeW5jKSB7XG4gICAgcmV0dXJuIChkYXRhLCBib3VuZGVkRmllbGRzKSA9PiAodmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IGJvdW5kZWRGaWVsZHNWYWx1ZXMgPSBfZ2V0Qm91bmRlZEZpZWxkc1ZhbHVlcyhib3VuZGVkRmllbGRzKTtcbiAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0KHZhbHVlLCBkYXRhLCBib3VuZGVkRmllbGRzVmFsdWVzKTtcblxuICAgICAgaWYoYXN5bmMpIHtcbiAgICAgICAgcmV0dXJuIF9pc0VtcHR5KHZhbHVlKSA/IFByb21pc2UucmVzb2x2ZSgpIDogY2FsbGJhY2suYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9pc0VtcHR5KHZhbHVlKSB8fCBjYWxsYmFjay5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBib3VuZGVkIGZpZWxkcyB2YWx1ZXNcbiAgICogQHBhcmFtIGZpZWxkc1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfZ2V0Qm91bmRlZEZpZWxkc1ZhbHVlcyhmaWVsZHMgPSBbXSkge1xuICAgIHJldHVybiBmaWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQudmFsdWUpXG4gIH1cblxufSkoKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBzcmMvZm9ybS12YWxpZGF0b3IuanNcbiAqKi8iLCJ1bmRlZmluZWRcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBcbiAqKi8iLCIvKipcbiAqIENyZWF0ZWQgYnkgcmlkZWwxZSBvbiAyMy8wOS8xNi5cbiAqL1xuXG5PYmplY3QuYXNzaWduKEFycmF5LnByb3RvdHlwZSwge1xuICBjb25jYXRBbGwsXG4gIGRpc3RpbmN0XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZmxhdHRlbiBhcnJheVxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBjb25jYXRBbGwoKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB0aGlzKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFycmF5IHdpdGggdW5pcXVlIGVsZW1lbnRzXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGRpc3RpbmN0KCkge1xuICByZXR1cm4gdGhpcy5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cbiAgc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBzcmMvaGVscGVycy9hcnJheS1wb2x5ZmlsbC5qc1xuICoqLyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbENBO0FBQ0E7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFKQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFWQTtBQVdBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTs7Ozs7Ozs7OztBQzFMQTs7OztBQUlBO0FEQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQUE7QUFBQTtBQUVBOzs7OzsiLCJzb3VyY2VSb290IjoiIn0=