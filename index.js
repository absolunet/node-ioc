//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


/* eslint-disable global-require */
module.exports = {
	get app() { return require('./lib/app'); },
	get classes() {
		return {
			Application:            require('./lib'),
			BaseProxy:              require('./lib/support/proxy/BaseProxy'),
			Controller:             require('./lib/http/controllers/Controller'),
			Command:                require('./lib/console/Command'),
			ForwardProxy:           require('./lib/support/proxy/ForwardProxy'),
			GeneratorCommand:       require('./lib/console/GeneratorCommand'),
			Kernel:                 require('./lib/foundation/Kernel'),
			Migration:              require('./lib/database/Migration'),
			Model:                  require('./lib/database/Model'),
			ModelFactory:           require('./lib/database/Factory'),
			NullDriverProxy:        require('./lib/support/drivers/NullDriverProxy'),
			Seeder:                 require('./lib/database/Seeder'),
			ServiceProvider:        require('./lib/foundation/ServiceProvider'),
			TestCase:               require('./lib/test/TestCase'),
			Tester:                 require('./lib/test/services/Tester')
		};
	},
	get mixins() { return require('./lib/support/mixins'); }
};
/* eslint-enable global-require */
