//--------------------------------------------------------
//-- Node IoC - Test - Abstract - Base Test Case
//--------------------------------------------------------
'use strict';


const hasEngine = require('../../support/mixins/hasEngine');
const asserts   = require('../mixins/core/asserts');
const expects   = require('../mixins/core/expects');
const setsUp    = require('../mixins/core/setsUp');


class BaseTestCase extends setsUp(expects(asserts(hasEngine()))) {

}

module.exports = BaseTestCase;
