/**
 * Created by ridel1e on 23/09/16.
 */

'use strict';

console.log(formValidator);

var registrationFormScheme = [{
  name: 'userLogin',
  rules: [{
    name: 'required',
    message: 'field is required'
  }, {
    name: 'minLength',
    message: 'login is too short',
    data: 5
  }, {
    name: 'maxLength',
    message: 'login is too long',
    data: 12
  }]
}, {
  name: 'userPassword',
  rules: [{
    name: 'required',
    message: 'field is required'
  }, {
    name: 'minLength',
    message: 'password is too short',
    data: 5
  }]
}, {
  name: 'userPasswordConfirmation',
  rules: [{
    name: 'required',
    message: 'field is required'
  }, {
    name: 'confirmPassword',
    bindWith: ['userPassword'],
    message: 'please, repeat your password'
  }]
}];

formValidator
  .addValidator('confirmPassword', function (passwordConfirmation, data, originalPassword) {
    return passwordConfirmation === originalPassword
  });

formValidator.setFormValidation('userRegistrationForm', registrationFormScheme);

