//--------------------------------------------------------
//-- IoC - Foundation - Mixins
//--------------------------------------------------------
'use strict';

/* istanbul ignore next */

const factory = require('./concerns/mixinFactory');

const checksTypes  = require('./checksTypes');
const forwardCalls = require('./forwardCalls');
const hasDriver    = require('./hasDriver');


module.exports = {
	factory,
	checksTypes,
	forwardCalls,
	hasDriver
};
