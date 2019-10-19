//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import PubSubJsDriver from '../../../../../../dist/node/events/services/Dispatcher/drivers/PubSubJsDriver';


//-- Given
//--------------------------------------------------------

given.PubSubJsDriver = () => {
	given.driver(PubSubJsDriver);
	given.engineDispatchingMethod('publishSync');
	given.cleanCallback((driver) => {
		driver.engine.clearAllSubscriptions();
	});
};


export default build({ given, when, then });
