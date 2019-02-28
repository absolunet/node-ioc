//--------------------------------------------------------
//-- Spark IoC - Bootstrapped application
//--------------------------------------------------------
'use strict';

const app = require('./..');

const ConfigServiceProvider = require('./../config/providers/ConfigServiceProvider');
const ConsoleServiceProvider = require('./../console/providers/ConsoleServiceProvider');

const coreServiceProviders = [
	ConfigServiceProvider,
	ConsoleServiceProvider
];

coreServiceProviders.forEach((provider) => {
	app.register(provider);
});

setTimeout(() => {
	app.bootIfNotBooted();
});

module.exports = app;
