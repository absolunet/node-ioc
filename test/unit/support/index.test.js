//--------------------------------------------------------
//-- Tests - Unit - Support
//--------------------------------------------------------
'use strict';

const container              = require('./../common');
const SupportServiceProvider = require('./../../../lib/support/providers/SupportServiceProvider');
const NullDriverProxy        = require('./../../../lib/support/drivers/NullDriverProxy');


describe('Node IoC - Support', () => {

	beforeEach(() => {
		container.register(SupportServiceProvider);
		container.bootIfNotBooted();
	});

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


	describe('Helpers', () => {

		describe('String', () => {

			let string;

			beforeEach(() => {
				string = container.make('helper.string');
			});


			test('Can convert to camel case', () => {
				expect(string.camel('foo_bar')).toBe('fooBar');
			});

			test('Can convert to constant case', () => {
				expect(string.constant('foo_bar')).toBe('FOO_BAR');
			});

			test('Can convert to dot case', () => {
				expect(string.dot('foo_bar')).toBe('foo.bar');
			});

			test('Can convert to pascal case', () => {
				expect(string.pascal('foo_bar')).toBe('FooBar');
			});

			test('Can convert to sentence', () => {
				expect(string.sentence('foo_bar')).toBe('Foo bar');
			});

			test('Can convert to slug case', () => {
				expect(string.slug('foo_bar')).toBe('foo-bar');
			});

			test('Can convert to snake case', () => {
				expect(string.snake('FooBar')).toBe('foo_bar');
			});

			test('Can convert to title case', () => {
				expect(string.title('foo_bar')).toBe('Foo Bar');
			});

		});

	});

});
