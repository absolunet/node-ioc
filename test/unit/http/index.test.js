//--------------------------------------------------------
//-- Tests - Unit - HTTP
//--------------------------------------------------------
'use strict';

const axios = require('axios');

const container              = require('../common');
const HttpServiceProvider    = require('../../../lib/http/providers/HttpServiceProvider');
const RoutingServiceProvider = require('../../../lib/routing/providers/RoutingServiceProvider');


describe('Node IoC - HTTP', () => {

	beforeEach(() => {
		container.register(RoutingServiceProvider);
		container.register(HttpServiceProvider);
		container.bootIfNotBooted();
	});


	test('HTTP service is resolvable', () => {
		expect(container.isBound('http')).toBe(true);
		expect(container.make('http')).toBeTruthy();
	});

	test('HTTP service is a singleton', () => {
		const http = container.make('http');
		expect(http).toBe(container.make('http'));
	});

	test('HTTP service contains the same methods as Axios', () => {
		expect(Object.keys(container.make('http'))).toStrictEqual(Object.keys(axios.create()));
	});

});
