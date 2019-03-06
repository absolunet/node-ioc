//--------------------------------------------------------
//-- Tests - Unit - Application
//--------------------------------------------------------
'use strict';

const container = require('./../../../src/app');


describe('Node IoC - App', () => {

	test('App boots correctly', () => {
		container.onBooted(() => {
			expect(container.booted).toBe(true);
		});
	});

	test('App contains core services', () => {
		expect(container.isBound('config')).toBe(false);
		container.onBooted(() => {
			expect(container.isBound('config')).toBe(true);
		});
	});

});
