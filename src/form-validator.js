/**
 * Created by ridel1e on 23/09/16.
 */

/* importing concateAll and distinct array methods */
import './helpers/array-polyfill';

window.formValidator = (() => {

  /**
   * Object with validator functions templates
   * @type {{required: (function(): function(): boolean), minLength: (function(): function()), maxLength: (function(): function()), min: (function(): function()), max: (function(): function()), email: (function(): function())}}
   * @private
   */
  const _validatorTemplates = {
    required: () => value => !_isEmpty(value),
    minLength: _createValidatorFunction((value, minLength) =>
      value.length >= minLength),
    maxLength: _createValidatorFunction((value, maxLength) =>
      value.length <= maxLength),
    min: _createValidatorFunction((value, minValue) =>
      value >= minValue),
    max: _createValidatorFunction((value, maxValue) =>
      value <= maxValue),
    email: _createValidatorFunction((value) => {
      const EMAIL_REGEXP = /qwe/;

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
    if(!_validatorTemplates[name]) {
      _validatorTemplates[name] = _createValidatorFunction(callback)
    }
  }

  function addAsyncValidator(name, callback) {
    if(!_validatorTemplates[name]) {
      _validatorTemplates[name] = _createValidatorFunction(callback, true)
    }
  }

  /**
   * set validation to form from scheme object
   * @param formName
   * @param scheme
   */
  function setFormValidation(formName, scheme) {
    const form = document.forms[formName];

    scheme.forEach((fieldScheme) =>
      _setFieldRules(form[fieldScheme.name], fieldScheme.rules, form));
  }

  /**
   * set validation on each field
   * @param field
   * @param rules
   * @param form
   * @private
   */
  function _setFieldRules(field, rules, form) {
    const fieldValidators = _createFieldValidators(rules, form);

    /* need to avoid repeated bounded fields */
    const allUniqueBoundedFields = _getCommonUniqueBoundedFields(fieldValidators);
    const runFieldValidation = () => {
      const errorMessage = _getFieldErrorMessage(field, fieldValidators);
      field.setCustomValidity(errorMessage);
      console.dir(field.validationMessage);
    };

    _setFieldListener(field, runFieldValidation);
    allUniqueBoundedFields
      .forEach(boundedField =>
        _setFieldListener(boundedField, runFieldValidation));


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
    return rules.map((rule) => {
      const boundedFields = _getBoundedFields(rule.bindWith, form);
      const fieldValidator = _validatorTemplates[rule.name](rule.data, boundedFields);

      return {
        message: rule.message,
        validatorFunction: fieldValidator,
        boundedFields: boundedFields,
      }
    });
  }

  /**
   * Returns flat array with unique bounded fields only
   * @param fieldValidators
   * @returns {Array}
   * @private
   */
  function _getCommonUniqueBoundedFields(fieldValidators) {
    return fieldValidators
      .map((validator) => validator.boundedFields)
      .filter((boundedFieldsList) => boundedFieldsList.length > 0)
      .concatAll()
      .distinct();
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
  function _getBoundedFields(boundedFieldsNames = [], currentForm) {
    return boundedFieldsNames.map(name => currentForm[name]);
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

    for(var i = 0; i < validators.length; i++) {
      if(!validators[i].validatorFunction(field.value)) {
        return validators[i].message
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
    return (data, boundedFields) => (value) => {
      const boundedFieldsValues = _getBoundedFieldsValues(boundedFields);
      const args = Array.prototype.concat(value, data, boundedFieldsValues);

      if(async) {
        return _isEmpty(value) ? Promise.resolve() : callback.apply(null, args);
      }
      else {
        return _isEmpty(value) || callback.apply(null, args);
      }
    }
  }

  /**
   * Returns bounded fields values
   * @param fields
   * @returns {Array}
   * @private
   */
  function _getBoundedFieldsValues(fields = []) {
    return fields.map((field) => field.value)
  }

})();