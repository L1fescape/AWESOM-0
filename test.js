var assert  = require('assert');

var settings = {
  commands: ["ackbara", "bitcoin", "eval", "hi", "imageme", "karma", "tell", "pugme", "question", "quotes", "rps", "rules", "uptime", "urban", "youtube"],
  debug: true,
  debugREPL: true,
  redis: false,
  botname: "AWESOM0"
};

describe('AWESOM0', function () {
  var awesom0;

  it('can be imported without blowing up', function () {
    awesom0 = require('./awesom0');
    assert(awesom0 !== undefined);
  });

  it('can import scripts without blowing up', function () {
    awesom0.init(settings);
  });

  it('can say hi back', function () {
    awesom0.testMsg('AWESOM0 hi!');
  });
});
