//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - Event Emitter Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import EventEmitterDriver from '../../../../../../dist/node/events/services/Dispatcher/drivers/EventEmitterDriver';


//-- Given
//--------------------------------------------------------

given.emitterDriver = () => {
	given.driver(EventEmitterDriver);
	given.engineDispatchingMethod('emit');
};


export default build({ given, when, then });
