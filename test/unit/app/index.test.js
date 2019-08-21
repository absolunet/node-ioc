//--------------------------------------------------------
//-- Tests - Unit - Application
//--------------------------------------------------------
'use strict';

const container = require('../../../lib/app');


beforeEach(() => {
	container.flush();
});


describe('Node IoC - App', () => {

	test('App boots correctly', () => {
		expect(container.booted).toBe(false);
		container.bootIfNotBooted();
		expect(container.booted).toBe(true);
	});

	test('App contains core services', () => {
		container.onBooted(() => {
			const coreServices = ['config', 'file'];

			coreServices.forEach((coreService) => {
				expect(container.booted).toBe(true);
				expect(container.isBound(coreService)).toBe(true);
			});
		});
	});

});
