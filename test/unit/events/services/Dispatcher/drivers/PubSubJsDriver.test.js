//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver
//--------------------------------------------------------

import gwt from './PubSubJsDriver.gwt';
const { given, when, then } = gwt;
import common                from './common';


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.PubSubJsDriver();
});


describe('PubSub.js Driver', () => {
	common({ given, when, then });
});
