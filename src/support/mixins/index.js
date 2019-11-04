//--------------------------------------------------------
//-- IoC - Foundation - Mixins
//--------------------------------------------------------

/* istanbul ignore next */
import factory       from './concerns/mixinFactory';
import checksTypes   from './checksTypes';
import forwardsCalls from './forwardsCalls';
import getsMethods   from './getsMethods';
import hasDriver     from './hasDriver';
import hasEngine     from './hasEngine';


const mixins = {
	factory,
	checksTypes,
	forwardsCalls,
	getsMethods,
	hasDriver,
	hasEngine,
	add: (name, callback) => {
		mixins[name] = factory(callback);
	}
};


export default mixins;
