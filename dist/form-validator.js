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
	    minlength: _createValidatorFunction(function (value, minLength) {
	      return value.length >= minLength;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS12YWxpZGF0b3IuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjMTI2ZTE5NjIzZDEwODZmYjkxNiIsIndlYnBhY2s6Ly8vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL3NyYy9mb3JtLXZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly8vIiwid2VicGFjazovLy9zcmMvaGVscGVycy9hcnJheS1wb2x5ZmlsbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcImZvcm1WYWxpZGF0b3JcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZm9ybVZhbGlkYXRvclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJmb3JtVmFsaWRhdG9yXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBjMTI2ZTE5NjIzZDEwODZmYjkxNlxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSByaWRlbDFlIG9uIDIxLzA5LzE2LlxuICovXG5cbmltcG9ydCBmb3JtVmFsaWRhdG9yIGZyb20gJy4vc3JjL2Zvcm0tdmFsaWRhdG9yJztcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtVmFsaWRhdG9yO1xuXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBpbmRleC5qc1xuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSByaWRlbDFlIG9uIDIzLzA5LzE2LlxuICovXG5cbmltcG9ydCAnLi9oZWxwZXJzL2FycmF5LXBvbHlmaWxsJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuICBjb25zdCBfdmFsaWRhdG9yVGVtcGxhdGVzID0ge1xuICAgIHJlcXVpcmVkOiAoKSA9PiB2YWx1ZSA9PiAhX2lzRW1wdHkodmFsdWUpLFxuICAgIG1pbmxlbmd0aDogX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKCh2YWx1ZSwgbWluTGVuZ3RoKSA9PlxuICAgIHZhbHVlLmxlbmd0aCA+PSBtaW5MZW5ndGgpXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRWYWxpZGF0b3I6IGFkZFZhbGlkYXRvcixcbiAgICBzZXRGb3JtVmFsaWRhdGlvbjogc2V0Rm9ybVZhbGlkYXRpb25cbiAgfTtcblxuICAvKipcbiAgICogYWRkIGN1c3RvbSB2YWxpZGF0b3IgdG8gc2VydmljZVxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIGFkZFZhbGlkYXRvcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmKCFfdmFsaWRhdG9yVGVtcGxhdGVzW25hbWVdKSB7XG4gICAgICBfdmFsaWRhdG9yVGVtcGxhdGVzW25hbWVdID0gX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEFzeW5jVmFsaWRhdG9yKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYoIV92YWxpZGF0b3JUZW1wbGF0ZXNbbmFtZV0pIHtcbiAgICAgIF92YWxpZGF0b3JUZW1wbGF0ZXNbbmFtZV0gPSBfY3JlYXRlVmFsaWRhdG9yRnVuY3Rpb24oY2FsbGJhY2ssIHRydWUpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHNldCB2YWxpZGF0aW9uIHRvIGZvcm0gZnJvbSBzY2hlbWUgb2JqZWN0XG4gICAqIEBwYXJhbSBmb3JtTmFtZVxuICAgKiBAcGFyYW0gc2NoZW1lXG4gICAqL1xuICBmdW5jdGlvbiBzZXRGb3JtVmFsaWRhdGlvbihmb3JtTmFtZSwgc2NoZW1lKSB7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmZvcm1zW2Zvcm1OYW1lXTtcblxuICAgIHNjaGVtZS5mb3JFYWNoKChmaWVsZFNjaGVtZSkgPT5cbiAgICAgIF9zZXRGaWVsZFJ1bGVzKGZvcm1bZmllbGRTY2hlbWUubmFtZV0sIGZpZWxkU2NoZW1lLnJ1bGVzLCBmb3JtKSk7XG4gIH1cblxuICAvKipcbiAgICogc2V0IHZhbGlkYXRpb24gb24gZWFjaCBmaWVsZFxuICAgKiBAcGFyYW0gZmllbGRcbiAgICogQHBhcmFtIHJ1bGVzXG4gICAqIEBwYXJhbSBmb3JtXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfc2V0RmllbGRSdWxlcyhmaWVsZCwgcnVsZXMsIGZvcm0pIHtcbiAgICBjb25zdCBmaWVsZFZhbGlkYXRvcnMgPSBfY3JlYXRlRmllbGRWYWxpZGF0b3JzKHJ1bGVzLCBmb3JtKTtcblxuICAgIC8qIG5lZWQgdG8gYXZvaWQgcmVwZWF0ZWQgYm91bmRlZCBmaWVsZHMgKi9cbiAgICBjb25zdCBhbGxVbmlxdWVCb3VuZGVkRmllbGRzID0gX2dldENvbW1vblVuaXF1ZUJvdW5kZWRGaWVsZHMoZmllbGRWYWxpZGF0b3JzKTtcbiAgICBjb25zdCBydW5GaWVsZFZhbGlkYXRpb24gPSAoKSA9PiB7XG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBfZ2V0RmllbGRFcnJvck1lc3NhZ2UoZmllbGQsIGZpZWxkVmFsaWRhdG9ycyk7XG4gICAgICBmaWVsZC5zZXRDdXN0b21WYWxpZGl0eShlcnJvck1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5kaXIoZmllbGQudmFsaWRhdGlvbk1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBfc2V0RmllbGRMaXN0ZW5lcihmaWVsZCwgcnVuRmllbGRWYWxpZGF0aW9uKTtcbiAgICBhbGxVbmlxdWVCb3VuZGVkRmllbGRzXG4gICAgICAuZm9yRWFjaChib3VuZGVkRmllbGQgPT5cbiAgICAgICAgX3NldEZpZWxkTGlzdGVuZXIoYm91bmRlZEZpZWxkLCBydW5GaWVsZFZhbGlkYXRpb24pKTtcblxuXG4gICAgLyogcnVuIHZhbGlkYXRpb24gYWZ0ZXIgbGlzdGVuZXIgY3JlYXRpb24gKi9cbiAgICBmaWVsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBmaWVsZCB2YWxpZGF0b3JzIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIHJ1bGVzXG4gICAqIEBwYXJhbSBmb3JtXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9jcmVhdGVGaWVsZFZhbGlkYXRvcnMocnVsZXMsIGZvcm0pIHtcbiAgICByZXR1cm4gcnVsZXMubWFwKChydWxlKSA9PiB7XG4gICAgICBjb25zdCBib3VuZGVkRmllbGRzID0gX2dldEJvdW5kZWRGaWVsZHMocnVsZS5iaW5kV2l0aCwgZm9ybSk7XG4gICAgICBjb25zdCBmaWVsZFZhbGlkYXRvciA9IF92YWxpZGF0b3JUZW1wbGF0ZXNbcnVsZS5uYW1lXShydWxlLmRhdGEsIGJvdW5kZWRGaWVsZHMpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtZXNzYWdlOiBydWxlLm1lc3NhZ2UsXG4gICAgICAgIHZhbGlkYXRvckZ1bmN0aW9uOiBmaWVsZFZhbGlkYXRvcixcbiAgICAgICAgYm91bmRlZEZpZWxkczogYm91bmRlZEZpZWxkcyxcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGZsYXQgYXJyYXkgd2l0aCB1bmlxdWUgYm91bmRlZCBmaWVsZHMgb25seVxuICAgKiBAcGFyYW0gZmllbGRWYWxpZGF0b3JzXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRDb21tb25VbmlxdWVCb3VuZGVkRmllbGRzKGZpZWxkVmFsaWRhdG9ycykge1xuICAgIHJldHVybiBmaWVsZFZhbGlkYXRvcnNcbiAgICAgIC5tYXAoKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLmJvdW5kZWRGaWVsZHMpXG4gICAgICAuZmlsdGVyKChib3VuZGVkRmllbGRzTGlzdCkgPT4gYm91bmRlZEZpZWxkc0xpc3QubGVuZ3RoID4gMClcbiAgICAgIC5jb25jYXRBbGwoKVxuICAgICAgLmRpc3RpbmN0KCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGxpc3RlbmVyIHRvIGZpZWxkXG4gICAqIEBwYXJhbSBmaWVsZFxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9zZXRGaWVsZExpc3RlbmVyKGZpZWxkLCBjYWxsYmFjaykge1xuICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYXJyYXkgd2l0aCBib3VuZGVkIHRvIHJ1bGUgZmllbGRzXG4gICAqIEBwYXJhbSBib3VuZGVkRmllbGRzTmFtZXNcbiAgICogQHBhcmFtIGN1cnJlbnRGb3JtXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRCb3VuZGVkRmllbGRzKGJvdW5kZWRGaWVsZHNOYW1lcyA9IFtdLCBjdXJyZW50Rm9ybSkge1xuICAgIHJldHVybiBib3VuZGVkRmllbGRzTmFtZXMubWFwKG5hbWUgPT4gY3VycmVudEZvcm1bbmFtZV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX2lzRW1wdHkodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgIT09IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgZXJyb3IgbWVzc2FnZS4gSWYgZmllbGQgaXMgdmFsaWQgbWV0aG9kIHJldHVybnMgZW1wdHkgc3RyaW5nXG4gICAqIEBwYXJhbSBmaWVsZFxuICAgKiBAcGFyYW0gdmFsaWRhdG9yc1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldEZpZWxkRXJyb3JNZXNzYWdlKGZpZWxkLCB2YWxpZGF0b3JzKSB7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdmFsaWRhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoIXZhbGlkYXRvcnNbaV0udmFsaWRhdG9yRnVuY3Rpb24oZmllbGQudmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0b3JzW2ldLm1lc3NhZ2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB2YWxpZGF0b3IgZnVuY3Rpb24gY3JlYXRlZCB3aXRoIHZhbGlkYXRvciB0ZW1wbGF0ZVxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIGFzeW5jXG4gICAqIEByZXR1cm5zIHtmdW5jdGlvbigpOiBmdW5jdGlvbigpfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKGNhbGxiYWNrLCBhc3luYykge1xuICAgIHJldHVybiAoZGF0YSwgYm91bmRlZEZpZWxkcykgPT4gKHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCBib3VuZGVkRmllbGRzVmFsdWVzID0gX2dldEJvdW5kZWRGaWVsZHNWYWx1ZXMoYm91bmRlZEZpZWxkcyk7XG4gICAgICBjb25zdCBhcmdzID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdCh2YWx1ZSwgZGF0YSwgYm91bmRlZEZpZWxkc1ZhbHVlcyk7XG5cbiAgICAgIGlmKGFzeW5jKSB7XG4gICAgICAgIHJldHVybiBfaXNFbXB0eSh2YWx1ZSkgPyBQcm9taXNlLnJlc29sdmUoKSA6IGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBfaXNFbXB0eSh2YWx1ZSkgfHwgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYm91bmRlZCBmaWVsZHMgdmFsdWVzXG4gICAqIEBwYXJhbSBmaWVsZHNcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldEJvdW5kZWRGaWVsZHNWYWx1ZXMoZmllbGRzID0gW10pIHtcbiAgICByZXR1cm4gZmllbGRzLm1hcCgoZmllbGQpID0+IGZpZWxkLnZhbHVlKVxuICB9XG5cbn0pKCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogc3JjL2Zvcm0tdmFsaWRhdG9yLmpzXG4gKiovIiwidW5kZWZpbmVkXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHJpZGVsMWUgb24gMjMvMDkvMTYuXG4gKi9cblxuT2JqZWN0LmFzc2lnbihBcnJheS5wcm90b3R5cGUsIHtcbiAgY29uY2F0QWxsLFxuICBkaXN0aW5jdFxufSk7XG5cbi8qKlxuICogUmV0dXJucyBhIGZsYXR0ZW4gYXJyYXlcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gY29uY2F0QWxsKCkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgdGhpcyk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhcnJheSB3aXRoIHVuaXF1ZSBlbGVtZW50c1xuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBkaXN0aW5jdCgpIHtcbiAgcmV0dXJuIHRoaXMuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XG4gIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4KVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogc3JjL2hlbHBlcnMvYXJyYXktcG9seWZpbGwuanNcbiAqKi8iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2xDQTtBQUNBOzs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0FBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBRkE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBVkE7QUFXQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7QUN4TEE7Ozs7QUFJQTtBRENBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUFBO0FBQUE7QUFFQTs7Ozs7Iiwic291cmNlUm9vdCI6IiJ9