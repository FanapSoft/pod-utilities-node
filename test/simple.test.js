// External Modules
const expect = require('chai').expect;

const util = require('../lib/main');
const keys = require('./keys');

describe('clone', function () {
  it('correct', function (done) {
    let myObj = { a: 100 };
    let myClonedObj = util.clone(myObj);
    myObj.b = 100;
    expect(myClonedObj).to.deep.equal({ a: 100 });
    done();
  });
});

describe('createSign', function () {
  it('correct', function (done) {
    let myString = 'This is the phrase for creating the signature';
    let privateKey = keys.privateKey;
    let algorithm = 'RSA-SHA256';
    let encoding = 'base64';
    let signature = util.createSign(myString, privateKey, algorithm, encoding);
    expect(signature).to.equal('cUdMaY0ufDJKDbHMYNjMNJpM4SvIhZTBaEPWyfQW4//uxdYPs0PiFIrXdyNKki57iyt+hett2Hjqa0NGTo28nDnYkFkXWHCFzjXvtN/9ZqmeYnQN1VGClvuElcVyJd5v7ZwBTf6rN4xd0dI79luiCfEis1fNnh1eXucsaHo5n+8=');
    done();
  });
});

describe('verifySign', function () {
  it('correct', function (done) {
    let myString = 'This is the phrase for creating the signature';
    let privateKey = keys.privateKey;
    let publicKey = keys.publicKey;
    let algorithm = 'RSA-SHA256';
    let encoding = 'base64';
    let signature = util.createSign(myString, privateKey, algorithm, encoding);
    let isVerified = util.verifySign(myString, publicKey, signature, algorithm, encoding);
    expect(isVerified).to.equal(true);
    done();
  });
});

describe('uniqueId', function () {
  it('correct', function (done) {
    let randomString = util.uniqueId();
    expect(randomString).to.be.a('string');
    done();
  });
});

describe('validate', function () {
  it('correct', function (done) {
    let schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      },
      required: ['test'],
      additionalProperties: false
    };
    let data = { test: 'test' };
    let validation = util.validate(schema, data);
    expect(validation).to.be.a('object');
    expect(validation.status).to.equal(true);
    done();
  });
  it('wrong', function (done) {
    let schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string'
        }
      },
      required: ['test'],
      additionalProperties: false
    };
    let data = { test: 125 };
    let validation = util.validate(schema, data);
    expect(validation).to.be.a('object');
    expect(validation.status).to.equal(false);
    done();
  });
});

describe('extractKeysFromObject', function () {
  it('correct', function (done) {
    let obj = { a: 10, b: 100, c: 1000 };
    let fields = ['a', 'b'];
    let resultObj = util.extractKeysFromObject(obj, fields);
    expect(resultObj).to.deep.equal({ a: 10, b: 100 });
    done();
  });
});

describe('invalidConfigParam', function () {
  it('correct', function (done) {
    let result = util.invalidConfigParam('Module');
    expect(result).to.be.a('string');
    done();
  });
});

describe('toShamsiDateString', function () {
  it('correct', function (done) {
    let result = util.toShamsiDateString(new Date());
    console.log(result);
    done();
  });
});

describe('toShamsiDateTimeString', function () {
  it('correct', function (done) {
    let result = util.toShamsiDateTimeString(new Date());
    console.log(result);
    done();
  });
});

describe('trimObject', function () {
  it('correct', function (done) {
    let result = util.trimObject({
      a: '   a  ',
      b: 'hello!!',
      c: { a: ' 10 ', g: { a: 'ddd   ', f: '10', e: 20 }, r: ['   j', '    ', '10', 10], query: '   jhjhj   ' },
      d: new Date(),
      r: ['   j', '    ', '10', 10],
      query: '    uuu    '
    });
    expect(result.a).to.equal('a');
    console.log(result);
    done();
  });
});

describe('trimNestedObject', function () {
  it('correct', function (done) {
    let result = util.trimNestedObject({
      a: '   a  ',
      b: 'hello!!',
      c: { a: ' 10 ', g: { a: 'ddd   ', f: '10', e: 20 }, r: ['   j', '    ', '10', 10], query: '   jhjhj   ' },
      d: new Date(),
      r: ['   j', '    ', '10', 10],
      query: '    uuu    '
    });
    console.log(result);
    expect(result.a).to.equal('a');
    expect(result.c.a).to.equal('10');
    done();
  });
});

describe('dateToStringToMin', function () {
  it('correct', function (done) {
    let result = util.dateToStringToMin(new Date());
    console.log(result);
    done();
  });
});

describe('dateToStringToMinUtc', function () {
  it('correct', function (done) {
    let result = util.dateToStringToMinUtc(new Date());
    console.log(result);
    done();
  });
});

describe('dateToString', function () {
  it('correct', function (done) {
    let result = util.dateToString(new Date());
    console.log(result);
    done();
  });
});

describe('dateToStringUtc', function () {
  it('correct', function (done) {
    let result = util.dateToStringUtc(new Date());
    console.log(result);
    done();
  });
});

describe.only('shamsiToMiladiStringToMin', function () {
  it('correct', function (done) {
    let result = util.shamsiToMiladiStringToMin('1398/05/22 17:54');
    console.log(result);
    done();
  });
});
