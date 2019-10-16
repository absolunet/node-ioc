//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Runtime Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const RuntimeDriver = require('../../../../../../dist/node/cache/services/CacheManager/drivers/RuntimeDriver');


//-- Given
//--------------------------------------------------------

given.runtimeDriver = (parameters) => {
	given.driver(RuntimeDriver, parameters);
};


module.exports = build({ given, when, then });
