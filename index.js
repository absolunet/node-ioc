//--------------------------------------------------------
//-- IoC
//--------------------------------------------------------
'use strict';


/* eslint-disable global-require */
module.exports = {
	get app() { return require('./lib/app'); },
	get classes() {
		return {
			get Application() {      return require('./lib'); },
			get BaseProxy() {        return require('./lib/support/proxy/BaseProxy'); },
			get Controller() {       return require('./lib/http/controllers/Controller'); },
			get Command() {          return require('./lib/console/Command'); },
			get ForwardProxy() {     return require('./lib/support/proxy/ForwardProxy'); },
			get GeneratorCommand() { return require('./lib/console/GeneratorCommand'); },
			get Kernel() {           return require('./lib/foundation/Kernel'); },
			get Migration() {        return require('./lib/database/Migration'); },
			get Model() {            return require('./lib/database/Model'); },
			get ModelFactory() {     return require('./lib/database/Factory'); },
			get NullDriverProxy() {  return require('./lib/support/drivers/NullDriverProxy'); },
			get Seeder() {           return require('./lib/database/Seeder'); },
			get ServiceProvider() {  return require('./lib/foundation/ServiceProvider'); },
			get TestCase() {         return require('./lib/test/TestCase'); },
			get Tester() {           return require('./lib/test/services/Tester'); }
		};
	},
	get mixins() { return require('./lib/support/mixins'); }
};
/* eslint-enable global-require */
