//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - PubSub.js Driver
//--------------------------------------------------------

import gwt from './EventEmitterDriver.gwt';
const { given, when, then } = gwt;
import common                from './common';


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.emitterDriver();
});


describe('Event Emitter Driver', () => {
	common({ given, when, then });
});
