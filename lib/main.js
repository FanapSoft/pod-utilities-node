/**
 * @namespace PodUtilities
 */

// Native Modules
const crypto = require('crypto');

// External Modules
const clone = require('clone');
const uuid = require('uuid/v4');
const moment = require('moment-jalaali');

// Pod Modules
const podAjv = require('pod-ajv');

// Project Modules
const config = require('./config');

/**
 * @memberof PodUtilities
 * @description This function signs the given string with your private key
 * @param {string} str - string to be signed
 * @param {string} privateKey - your private key
 * @param {string} algorithm - algorithm to use for creating the sign
 * @param {string} encoding - encoding encoding of the signature
 * @returns {string}
 */
function createSign (str, privateKey, algorithm, encoding) {
  let signerObject = crypto.createSign(algorithm);
  signerObject.update(str);
  return signerObject.sign({ key: privateKey }, encoding);
}

/**
 * @memberof PodUtilities
 * @description This function checks the str to be matched with the signature
 * @param {string} str - string to be verified
 * @param {string} publicKey - your public key
 * @param {string} signature - signed string
 * @param {string} algorithm - algorithm to use for creating the sign
 * @param {string} encoding - encoding of the signature
 * @returns {boolean}
 */
function verifySign (str, publicKey, signature, algorithm, encoding) {
  let verifierObject = crypto.createVerify(algorithm);
  verifierObject.update(str);
  return verifierObject.verify({ key: publicKey }, signature, encoding);
}

/**
 * @memberof PodUtilities
 * @description Create a random string
 * @returns {string}
 */
function uniqueId () {
  return uuid();
}

/**
 * @memberof PodUtilities
 * @description This function checks the data against the given schema
 * @param {object} schema - Given schema
 * @param {object} data - Given data
 * @returns {object}
 */
function validate (schema, data) {
  let validateResult = { status: true, errors: null };
  if (!podAjv.validate(schema, data)) {
    validateResult.status = false;
    validateResult.errors = podAjv.errors;
  }
  return validateResult;
}

/**
 * @memberof PodUtilities
 * @description Ectract given properties from an object and returns a new object
 * @param {object} obj - given object to extract its needed properties
 * @param {array} fieldArray - needed properties
 * @returns {object}
 */
function extractKeysFromObject (obj, fieldArray) {
  let newObj = {};
  for (var i = 0; i < fieldArray.length; i++) {
    if (obj.hasOwnProperty(fieldArray[i])) {
      newObj[fieldArray[i]] = obj[fieldArray[i]];
    }
  }
  return newObj;
}

/**
 * @memberof PodUtilities
 * @description creates a message for invalid config params
 * @returns string
 */
function invalidConfigParam (moduleName) {
  return 'Invalid Config Paramethers. Module: ' + moduleName;
}

/**
 * @memberof PodUtilities
 * @description creates a shamsi date representation of a date object
 * @param {Date} date
 * @returns string
 */
function toShamsiDateString (date) {
  return moment(date).format('jYYYY/jMM/jDD');
}

/**
 * @memberof PodUtilities
 * @description creates a shamsi date time representation of a date object
 * @param {Date} date
 * @returns string
 */
function toShamsiDateTimeString (date) {
  return moment(date).format('jYYYY/jMM/jDD HH:mm:SS');
}

/**
 * @memberof PodUtilities
 * @description trim string fields of an object
 * @param {object} obj
 * @returns object
 */
function trimObject (inpObj) {
  let obj = clone(inpObj);
  let fields = Object.keys(obj);
  for (let i = 0; i < fields.length; i++) {
    if (obj.hasOwnProperty(fields[i]) && typeof obj[fields[i]] === 'string' && !config.notTrimFields.hasOwnProperty(fields[i])) {
      obj[fields[i]] = obj[fields[i]].trim();
    }
    else if (obj.hasOwnProperty(fields[i]) && Array.isArray(fields[i]) && !config.notTrimFields.hasOwnProperty(fields[i])) {
      for (let j = 0; j < obj[fields[i]].length; j++) {
        if (typeof obj[fields[i]][j] === 'string') {
          obj[fields[i]][j] = obj[fields[i]][j].trim();
        }
      }
    }
  }
  return obj;
}

/**
 * @memberof PodUtilities
 * @description trim string fields of an object and it's inner objects
 * @param {object} obj
 * @returns object
 */
function trimNestedObject (inpObj) {
  let obj = clone(inpObj);
  let fields = Object.keys(obj);
  for (let i = 0; i < fields.length; i++) {
    if (obj.hasOwnProperty(fields[i]) && typeof obj[fields[i]] === 'string' && !config.notTrimFields.hasOwnProperty(fields[i])) {
      obj[fields[i]] = obj[fields[i]].trim();
    }
    else if (obj.hasOwnProperty(fields[i]) && typeof obj[fields[i]] === 'object' && !config.notTrimFields.hasOwnProperty(fields[i])) {
      obj[fields[i]] = trimNestedObject(obj[fields[i]]);
    }
    else if (obj.hasOwnProperty(fields[i]) && Array.isArray(fields[i]) && !config.notTrimFields.hasOwnProperty(fields[i])) {
      for (let j = 0; j < obj[fields[i]].length; j++) {
        if (typeof obj[fields[i]][j] === 'string') {
          obj[fields[i]][j] = obj[fields[i]][j].trim();
        }
      }
    }
  }
  return obj;
}

/**
 * @memberof PodUtilities
 * @description This is the class for all POD errors
 */
class PodError extends Error {
  /**
   * A PodError.
   * @param {number} code - error code
   * @param {object | string } message - error message
   * @param {object} originalResult - Original error received from server
   * @class
   */
  constructor (code, message, originalResult) {
    super();
    this.code = code;
    this.message = message;
    this.originalResult = originalResult || null;
    // this.name = 'PodError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PodError);
    }
  }
}

module.exports.clone = clone;
module.exports.createSign = createSign;
module.exports.verifySign = verifySign;
module.exports.uniqueId = uniqueId;
module.exports.validate = validate;
module.exports.extractKeysFromObject = extractKeysFromObject;
module.exports.invalidConfigParam = invalidConfigParam;
module.exports.toShamsiDateString = toShamsiDateString;
module.exports.toShamsiDateTimeString = toShamsiDateTimeString;
module.exports.trimObject = trimObject;
module.exports.trimNestedObject = trimNestedObject;
module.exports.PodError = PodError;

toShamsiDateString();
