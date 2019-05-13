//--------------------------------------------------------
//-- Tests - Unit - Support
//--------------------------------------------------------
'use strict';

const container = require('./../common');
const NullDriverProxy = require('./../../../lib/support/drivers/NullDriverProxy');


describe('Node IoC - Support', () => {

	describe('Drivers', () => {

		describe('NullDriverProxy', () => {

			test('Proxy always return manipulable object', () => {
				expect(() => {
					const NullProxy = container.make(NullDriverProxy);
					expect(NullProxy.foo).toBeTruthy();
					expect(NullProxy.bar()).toBeTruthy();
					expect(new NullProxy()).toBeTruthy();
					expect(NullProxy[0]).toBeTruthy();
					delete NullProxy.baz;
					expect(NullProxy.prototype).toBeTruthy();
					expect(Object.keys(NullProxy)).toBeTruthy();
					expect(Object.getPrototypeOf(NullProxy)).toBeTruthy();
					NullProxy.newProperty = true;
				}).not.toThrow();
			});

		});

	});


	describe('Mixins', () => {

		//

	});

});
