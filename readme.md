Js Form Validation - Package for simplify form validation
=========================================================

## What is it ?

Js Form Validation is a simple package to validate your forms. This package works with standard js form API, 
so you can use any error message customisation library (or write own realization) with it.

## Installation

npm
```
    npm install js-form-validation --save
```

## Including package in your project

There are two ways to include js-form-validator in your project:

- You can include js-form-validator in your page. After this you get access to "formValidator" variable:
```HTML
    <script src="node_modules/js-form-validator/dist/form-validator.min.js"></script>
```

- You can include js-form-validator like module in your project:
```javascript
    import formValidator from 'js-form-validator';
```
or
```javascript
    var formValidator = require('js-form-validator');
```
if you use es5 syntax
## API

Js Form Validation has 2 methods only:

### setFormValidation(formName, rules)
 
 set your validation rules to your form
 
####Parameters
 
 __formName__
 Type: __String__
 your html form name.
 
 __rules__
 Type: __Object__
 An object with validation rules. (See Config Object section)
 
 ```javascript
     formValidator.setFormValidation('userRegistrationForm', registrationFormRules);
  ```
 
### addValidator(validatorName, callback)

 add custom form validator
 
####Parameters:
 
 __validatorName__
 Type: __String__
 name of your validator (example: 'passwordConfirmation').
 
 __callback__
 Type: __Function__
 your validator function.
  
 __Notice:__
  
 your validator function should has the following structure:
 
 ```javascript
    function validator(fieldValue, data, firstBindedFoueldValue, secondBoundedFieldValue, ....) {
      // your check. Must return true or false
    }
 ```
 
 where:
 
 - __fieldValue__ - current validated field value
 - __data__ - additional data provided by config object
 - __firstBoundedFieldValue__, __secondBoundedFieldValue__ - values of bounded field (example: password field in password confirmation check)
 
 __if you didn't specify 'data' in config object, you still must provide data parameter in your function!__ 
 
 __Example:__
 
 our favorite password confirmation validator :)
```javascript
     formValidator
       .addValidator('confirmPassword', function (passwordConfirmation, data, originalPassword) {
         return passwordConfirmation === originalPassword
       });
 ```
 
## Config object
    
 Config object has the following structure:
    
 ```
 [{
   name: 'firstFieldName',
     rules: [{
       name: 'ruleName',
       message: 'error message',
       data: 'additional data',
       bindWith: ['secondFieldName']
     }, {
       ...
     }]
 }, {
   name: 'secondFieldName',
   rules: [...]
 }];
 ```

 where each field is an object in list. it has 2 properties:
  - __name__ - html field name
  - __rules array__ - rules array is an array of all rules belong to this field.
 
  Each rule in rules array has:
   - __name__
   - __message__
   
  Also rule can two additional properties:
  - __data__ - additional data to check rule validity (example min length value to min length check)
  - __bindWith__ -  field values that you want to use in Validator function (example password confirmation :))
   
   NOTICE: each field in config object must have named like in your html file
   
  Example:
  ```javascript
    // simple registration form rules scheme
    
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
  ```
  
  this config object represents following web form
  ```HTML
    <form name="userRegistrationForm" action="" id="userRegistrationForm" class="col-md-5 offset-md-5">
      <input name="userLogin" id="userLogin" type="text" class="form-control" placeholder="login">
      <input name="userPassword" id="userPassword" type="password" class="form-control" placeholder="password">
      <input name="userPasswordConfirmation" id="userPasswordConfirmation" type="password" class="form-control" placeholder="password confirmation">
      <button class="btn bg-primary submit-btn">Submit</button>
    </form>
  ```
  
  __Notice: default js form validator has following validators:__
  
  - __required__ - field required check. 
  - __minLength__ - field value min length check (has data additional parameter).
  - __maxLength__ - field value max length check (has data additional parameter).
  - __min__ - field value greater than min value check (has data additional parameter). __NOTICE: html input type must be number__
  - __max__ - field value greater than max value check (has data additional parameter). __NOTICE: html input type must be number__
  - __email__ - field value on email pattern check.
   
## Example

 You can find example of usage js-form-validator in 'example' folder.
 you must execute the following commands to run example:
 
  ```
    npm install
    npm start
  ```
    
  Now example will be available on [http://localhost:4000/](http://localhost:4000/)