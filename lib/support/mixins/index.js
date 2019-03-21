//--------------------------------------------------------
//-- IoC - Foundation - Mixins
//--------------------------------------------------------
'use strict';


const factory = require('./concerns/mixinFactory');

const checksTypes = require('./checksTypes');
const hasDriver = require('./hasDriver');


module.exports = {
	factory,
	checksTypes,
	hasDriver
};
