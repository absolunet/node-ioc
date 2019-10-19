//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - Runtime Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import RuntimeDriver from '../../../../../../dist/node/cache/services/CacheManager/drivers/RuntimeDriver';


//-- Given
//--------------------------------------------------------

given.runtimeDriver = (parameters) => {
	given.driver(RuntimeDriver, parameters);
};


export default build({ given, when, then });
