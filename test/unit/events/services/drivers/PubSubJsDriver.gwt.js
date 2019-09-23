//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const PubSubJsDriver = require('../../../../../lib/events/services/Dispatcher/drivers/PubSubJsDriver');


//-- Given
//--------------------------------------------------------

given.PubSubJsDriver = () => {
	given.driver(PubSubJsDriver);
	given.engineDispatchingMethod('publishSync');
	given.cleanCallback((driver) => {
		driver.engine.clearAllSubscriptions();
	});
};


module.exports = build({ given, when, then });
