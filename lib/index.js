//--------------------------------------------------------
//-- Node IoC
//--------------------------------------------------------
'use strict';


/* eslint-disable global-require */
module.exports = {
	get app() {              return require('./app'); },
	get Application() {      return require('./foundation/Application'); },
	get BaseProxy() {        return require('./support/proxy/BaseProxy'); },
	get Controller() {       return require('./http/controllers/Controller'); },
	get Command() {          return require('./console/Command'); },
	get ForwardProxy() {     return require('./support/proxy/ForwardProxy'); },
	get GeneratorCommand() { return require('./console/GeneratorCommand'); },
	get Kernel() {           return require('./foundation/Kernel'); },
	get Migration() {        return require('./database/Migration'); },
	get Model() {            return require('./database/Model'); },
	get ModelFactory() {     return require('./database/Factory'); },
	get NullDriverProxy() {  return require('./support/drivers/NullDriverProxy'); },
	get Seeder() {           return require('./database/Seeder'); },
	get ServiceProvider() {  return require('./foundation/ServiceProvider'); },
	get TestCase() {         return require('./test/TestCase'); },
	get Tester() {           return require('./test/services/Tester'); },
	get mixins() {           return require('./support/mixins'); }
};
/* eslint-enable global-require */
