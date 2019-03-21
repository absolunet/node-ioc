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
					const nullProxy = container.make(NullDriverProxy);
					expect(nullProxy.foo).toBeTruthy();
					expect(nullProxy.bar()).toBeTruthy();
					expect(new nullProxy()).toBeTruthy();
					expect(nullProxy[0]).toBeTruthy();
					delete nullProxy.baz;
					expect(nullProxy.prototype).toBeTruthy();
					expect(Object.keys(nullProxy)).toBeTruthy();
					expect(Object.getPrototypeOf(nullProxy)).toBeTruthy();
					nullProxy.newProperty = true;
				}).not.toThrow();
			});

		});

	});


	describe('Mixins', () => {


	});

});
