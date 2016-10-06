/******/ (function(modules) { // webpackBootstrap
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

	__webpack_require__(1);

	window.formValidator = function () {

	  /**
	   * Object with validator functions templates
	   * @type {{required: (function(): function(): boolean), minLength: (function(): function()), maxLength: (function(): function()), min: (function(): function()), max: (function(): function()), email: (function(): function())}}
	   * @private
	   */
	  var _validatorTemplates = {
	    required: function required() {
	      return function (value) {
	        return !_isEmpty(value);
	      };
	    },
	    minLength: _createValidatorFunction(function (value, minLength) {
	      return value.length >= minLength;
	    }),
	    maxLength: _createValidatorFunction(function (value, maxLength) {
	      return value.length <= maxLength;
	    }),
	    min: _createValidatorFunction(function (value, minValue) {
	      return value >= minValue;
	    }),
	    max: _createValidatorFunction(function (value, maxValue) {
	      return value <= maxValue;
	    }),
	    email: _createValidatorFunction(function (value) {
	      var EMAIL_REGEXP = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

	      return EMAIL_REGEXP.test(value);
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
	    };

	    _setFieldListener(field, runFieldValidation);
	    allUniqueBoundedFields.forEach(function (boundedField) {
	      return _setFieldListener(boundedField, runFieldValidation);
	    });

	    /* run validation after listener creation */
	    // field.dispatchEvent(new Event('input'));
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

		/* importing concateAll and distinct array methods */

/***/ },
/* 1 */
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
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS12YWxpZGF0b3IuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjUwZTg3OTY5OTJmZjJjMzQyNzIiLCJ3ZWJwYWNrOi8vL3NyYy9mb3JtLXZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly8vIiwid2VicGFjazovLy9zcmMvaGVscGVycy9hcnJheS1wb2x5ZmlsbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDY1MGU4Nzk2OTkyZmYyYzM0MjcyXG4gKiovIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHJpZGVsMWUgb24gMjMvMDkvMTYuXG4gKi9cblxuLyogaW1wb3J0aW5nIGNvbmNhdGVBbGwgYW5kIGRpc3RpbmN0IGFycmF5IG1ldGhvZHMgKi9cbmltcG9ydCAnLi9oZWxwZXJzL2FycmF5LXBvbHlmaWxsJztcblxud2luZG93LmZvcm1WYWxpZGF0b3IgPSAoKCkgPT4ge1xuXG4gIC8qKlxuICAgKiBPYmplY3Qgd2l0aCB2YWxpZGF0b3IgZnVuY3Rpb25zIHRlbXBsYXRlc1xuICAgKiBAdHlwZSB7e3JlcXVpcmVkOiAoZnVuY3Rpb24oKTogZnVuY3Rpb24oKTogYm9vbGVhbiksIG1pbkxlbmd0aDogKGZ1bmN0aW9uKCk6IGZ1bmN0aW9uKCkpLCBtYXhMZW5ndGg6IChmdW5jdGlvbigpOiBmdW5jdGlvbigpKSwgbWluOiAoZnVuY3Rpb24oKTogZnVuY3Rpb24oKSksIG1heDogKGZ1bmN0aW9uKCk6IGZ1bmN0aW9uKCkpLCBlbWFpbDogKGZ1bmN0aW9uKCk6IGZ1bmN0aW9uKCkpfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN0IF92YWxpZGF0b3JUZW1wbGF0ZXMgPSB7XG4gICAgcmVxdWlyZWQ6ICgpID0+IHZhbHVlID0+ICFfaXNFbXB0eSh2YWx1ZSksXG4gICAgbWluTGVuZ3RoOiBfY3JlYXRlVmFsaWRhdG9yRnVuY3Rpb24oKHZhbHVlLCBtaW5MZW5ndGgpID0+XG4gICAgICB2YWx1ZS5sZW5ndGggPj0gbWluTGVuZ3RoKSxcbiAgICBtYXhMZW5ndGg6IF9jcmVhdGVWYWxpZGF0b3JGdW5jdGlvbigodmFsdWUsIG1heExlbmd0aCkgPT5cbiAgICAgIHZhbHVlLmxlbmd0aCA8PSBtYXhMZW5ndGgpLFxuICAgIG1pbjogX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKCh2YWx1ZSwgbWluVmFsdWUpID0+XG4gICAgICB2YWx1ZSA+PSBtaW5WYWx1ZSksXG4gICAgbWF4OiBfY3JlYXRlVmFsaWRhdG9yRnVuY3Rpb24oKHZhbHVlLCBtYXhWYWx1ZSkgPT5cbiAgICAgIHZhbHVlIDw9IG1heFZhbHVlKSxcbiAgICBlbWFpbDogX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKCh2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgRU1BSUxfUkVHRVhQID0gL14oKFwiW1xcdy1cXHNdK1wiKXwoW1xcdy1dKyg/OlxcLltcXHctXSspKil8KFwiW1xcdy1cXHNdK1wiKShbXFx3LV0rKD86XFwuW1xcdy1dKykqKSkoQCgoPzpbXFx3LV0rXFwuKSpcXHdbXFx3LV17MCw2Nn0pXFwuKFthLXpdezIsNn0oPzpcXC5bYS16XXsyfSk/KSQpfChAXFxbPygoMjVbMC01XVxcLnwyWzAtNF1bMC05XVxcLnwxWzAtOV17Mn1cXC58WzAtOV17MSwyfVxcLikpKCgyNVswLTVdfDJbMC00XVswLTldfDFbMC05XXsyfXxbMC05XXsxLDJ9KVxcLil7Mn0oMjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV17Mn18WzAtOV17MSwyfSlcXF0/JCkvaTtcblxuICAgICAgcmV0dXJuIEVNQUlMX1JFR0VYUC50ZXN0KHZhbHVlKTtcbiAgICB9KVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYWRkVmFsaWRhdG9yOiBhZGRWYWxpZGF0b3IsXG4gICAgc2V0Rm9ybVZhbGlkYXRpb246IHNldEZvcm1WYWxpZGF0aW9uXG4gIH07XG5cbiAgLyoqXG4gICAqIGFkZCBjdXN0b20gdmFsaWRhdG9yIHRvIHNlcnZpY2VcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqL1xuICBmdW5jdGlvbiBhZGRWYWxpZGF0b3IobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZighX3ZhbGlkYXRvclRlbXBsYXRlc1tuYW1lXSkge1xuICAgICAgX3ZhbGlkYXRvclRlbXBsYXRlc1tuYW1lXSA9IF9jcmVhdGVWYWxpZGF0b3JGdW5jdGlvbihjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRBc3luY1ZhbGlkYXRvcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmKCFfdmFsaWRhdG9yVGVtcGxhdGVzW25hbWVdKSB7XG4gICAgICBfdmFsaWRhdG9yVGVtcGxhdGVzW25hbWVdID0gX2NyZWF0ZVZhbGlkYXRvckZ1bmN0aW9uKGNhbGxiYWNrLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgdmFsaWRhdGlvbiB0byBmb3JtIGZyb20gc2NoZW1lIG9iamVjdFxuICAgKiBAcGFyYW0gZm9ybU5hbWVcbiAgICogQHBhcmFtIHNjaGVtZVxuICAgKi9cbiAgZnVuY3Rpb24gc2V0Rm9ybVZhbGlkYXRpb24oZm9ybU5hbWUsIHNjaGVtZSkge1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5mb3Jtc1tmb3JtTmFtZV07XG5cbiAgICBzY2hlbWUuZm9yRWFjaCgoZmllbGRTY2hlbWUpID0+XG4gICAgICBfc2V0RmllbGRSdWxlcyhmb3JtW2ZpZWxkU2NoZW1lLm5hbWVdLCBmaWVsZFNjaGVtZS5ydWxlcywgZm9ybSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldCB2YWxpZGF0aW9uIG9uIGVhY2ggZmllbGRcbiAgICogQHBhcmFtIGZpZWxkXG4gICAqIEBwYXJhbSBydWxlc1xuICAgKiBAcGFyYW0gZm9ybVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX3NldEZpZWxkUnVsZXMoZmllbGQsIHJ1bGVzLCBmb3JtKSB7XG4gICAgY29uc3QgZmllbGRWYWxpZGF0b3JzID0gX2NyZWF0ZUZpZWxkVmFsaWRhdG9ycyhydWxlcywgZm9ybSk7XG5cbiAgICAvKiBuZWVkIHRvIGF2b2lkIHJlcGVhdGVkIGJvdW5kZWQgZmllbGRzICovXG4gICAgY29uc3QgYWxsVW5pcXVlQm91bmRlZEZpZWxkcyA9IF9nZXRDb21tb25VbmlxdWVCb3VuZGVkRmllbGRzKGZpZWxkVmFsaWRhdG9ycyk7XG4gICAgY29uc3QgcnVuRmllbGRWYWxpZGF0aW9uID0gKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gX2dldEZpZWxkRXJyb3JNZXNzYWdlKGZpZWxkLCBmaWVsZFZhbGlkYXRvcnMpO1xuICAgICAgZmllbGQuc2V0Q3VzdG9tVmFsaWRpdHkoZXJyb3JNZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgX3NldEZpZWxkTGlzdGVuZXIoZmllbGQsIHJ1bkZpZWxkVmFsaWRhdGlvbik7XG4gICAgYWxsVW5pcXVlQm91bmRlZEZpZWxkc1xuICAgICAgLmZvckVhY2goYm91bmRlZEZpZWxkID0+XG4gICAgICAgIF9zZXRGaWVsZExpc3RlbmVyKGJvdW5kZWRGaWVsZCwgcnVuRmllbGRWYWxpZGF0aW9uKSk7XG5cblxuICAgIC8qIHJ1biB2YWxpZGF0aW9uIGFmdGVyIGxpc3RlbmVyIGNyZWF0aW9uICovXG4gICAgLy8gZmllbGQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgZmllbGQgdmFsaWRhdG9ycyBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBydWxlc1xuICAgKiBAcGFyYW0gZm9ybVxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfY3JlYXRlRmllbGRWYWxpZGF0b3JzKHJ1bGVzLCBmb3JtKSB7XG4gICAgcmV0dXJuIHJ1bGVzLm1hcCgocnVsZSkgPT4ge1xuICAgICAgY29uc3QgYm91bmRlZEZpZWxkcyA9IF9nZXRCb3VuZGVkRmllbGRzKHJ1bGUuYmluZFdpdGgsIGZvcm0pO1xuICAgICAgY29uc3QgZmllbGRWYWxpZGF0b3IgPSBfdmFsaWRhdG9yVGVtcGxhdGVzW3J1bGUubmFtZV0ocnVsZS5kYXRhLCBib3VuZGVkRmllbGRzKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWVzc2FnZTogcnVsZS5tZXNzYWdlLFxuICAgICAgICB2YWxpZGF0b3JGdW5jdGlvbjogZmllbGRWYWxpZGF0b3IsXG4gICAgICAgIGJvdW5kZWRGaWVsZHM6IGJvdW5kZWRGaWVsZHMsXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBmbGF0IGFycmF5IHdpdGggdW5pcXVlIGJvdW5kZWQgZmllbGRzIG9ubHlcbiAgICogQHBhcmFtIGZpZWxkVmFsaWRhdG9yc1xuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfZ2V0Q29tbW9uVW5pcXVlQm91bmRlZEZpZWxkcyhmaWVsZFZhbGlkYXRvcnMpIHtcbiAgICByZXR1cm4gZmllbGRWYWxpZGF0b3JzXG4gICAgICAubWFwKCh2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5ib3VuZGVkRmllbGRzKVxuICAgICAgLmZpbHRlcigoYm91bmRlZEZpZWxkc0xpc3QpID0+IGJvdW5kZWRGaWVsZHNMaXN0Lmxlbmd0aCA+IDApXG4gICAgICAuY29uY2F0QWxsKClcbiAgICAgIC5kaXN0aW5jdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBsaXN0ZW5lciB0byBmaWVsZFxuICAgKiBAcGFyYW0gZmllbGRcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfc2V0RmllbGRMaXN0ZW5lcihmaWVsZCwgY2FsbGJhY2spIHtcbiAgICBmaWVsZC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFycmF5IHdpdGggYm91bmRlZCB0byBydWxlIGZpZWxkc1xuICAgKiBAcGFyYW0gYm91bmRlZEZpZWxkc05hbWVzXG4gICAqIEBwYXJhbSBjdXJyZW50Rm9ybVxuICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfZ2V0Qm91bmRlZEZpZWxkcyhib3VuZGVkRmllbGRzTmFtZXMgPSBbXSwgY3VycmVudEZvcm0pIHtcbiAgICByZXR1cm4gYm91bmRlZEZpZWxkc05hbWVzLm1hcChuYW1lID0+IGN1cnJlbnRGb3JtW25hbWVdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pc0VtcHR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnIHx8IHZhbHVlICE9PSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGVycm9yIG1lc3NhZ2UuIElmIGZpZWxkIGlzIHZhbGlkIG1ldGhvZCByZXR1cm5zIGVtcHR5IHN0cmluZ1xuICAgKiBAcGFyYW0gZmllbGRcbiAgICogQHBhcmFtIHZhbGlkYXRvcnNcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRGaWVsZEVycm9yTWVzc2FnZShmaWVsZCwgdmFsaWRhdG9ycykge1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKCF2YWxpZGF0b3JzW2ldLnZhbGlkYXRvckZ1bmN0aW9uKGZpZWxkLnZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdG9yc1tpXS5tZXNzYWdlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdmFsaWRhdG9yIGZ1bmN0aW9uIGNyZWF0ZWQgd2l0aCB2YWxpZGF0b3IgdGVtcGxhdGVcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqIEBwYXJhbSBhc3luY1xuICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24oKTogZnVuY3Rpb24oKX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9jcmVhdGVWYWxpZGF0b3JGdW5jdGlvbihjYWxsYmFjaywgYXN5bmMpIHtcbiAgICByZXR1cm4gKGRhdGEsIGJvdW5kZWRGaWVsZHMpID0+ICh2YWx1ZSkgPT4ge1xuICAgICAgY29uc3QgYm91bmRlZEZpZWxkc1ZhbHVlcyA9IF9nZXRCb3VuZGVkRmllbGRzVmFsdWVzKGJvdW5kZWRGaWVsZHMpO1xuICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQodmFsdWUsIGRhdGEsIGJvdW5kZWRGaWVsZHNWYWx1ZXMpO1xuXG4gICAgICBpZihhc3luYykge1xuICAgICAgICByZXR1cm4gX2lzRW1wdHkodmFsdWUpID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBjYWxsYmFjay5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gX2lzRW1wdHkodmFsdWUpIHx8IGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGJvdW5kZWQgZmllbGRzIHZhbHVlc1xuICAgKiBAcGFyYW0gZmllbGRzXG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRCb3VuZGVkRmllbGRzVmFsdWVzKGZpZWxkcyA9IFtdKSB7XG4gICAgcmV0dXJuIGZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC52YWx1ZSlcbiAgfVxuXG59KSgpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHNyYy9mb3JtLXZhbGlkYXRvci5qc1xuICoqLyIsInVuZGVmaW5lZFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIFxuICoqLyIsIi8qKlxuICogQ3JlYXRlZCBieSByaWRlbDFlIG9uIDIzLzA5LzE2LlxuICovXG5cbk9iamVjdC5hc3NpZ24oQXJyYXkucHJvdG90eXBlLCB7XG4gIGNvbmNhdEFsbCxcbiAgZGlzdGluY3Rcbn0pO1xuXG4vKipcbiAqIFJldHVybnMgYSBmbGF0dGVuIGFycmF5XG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIGNvbmNhdEFsbCgpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIHRoaXMpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYXJyYXkgd2l0aCB1bmlxdWUgZWxlbWVudHNcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gZGlzdGluY3QoKSB7XG4gIHJldHVybiB0aGlzLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxuICBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleClcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHNyYy9oZWxwZXJzL2FycmF5LXBvbHlmaWxsLmpzXG4gKiovIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUNDQTs7Ozs7QUFLQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZEE7QUFDQTtBQWdCQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFWQTtBQVdBO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTs7OztBQXBNQTs7Ozs7Ozs7QUNKQTs7OztBQUlBO0FEQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQUE7QUFBQTtBQUVBOzs7Iiwic291cmNlUm9vdCI6IiJ9