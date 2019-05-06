//--------------------------------------------------------
//-- Tests - Unit - Container
//--------------------------------------------------------
'use strict';

const container = require('./../common');


describe('Node IoC - Container', () => {


	describe('Bindings', () => {

		test('can add callback binding', () => {
			const object = { pass: true };
			container.bind('test', () => {
				return object;
			});

			expect(container.make('test')).toBe(object);
		});

		test('can add constructor binding', () => {
			class Test {
			}

			container.bind('test', Test);

			const binding = container.make('test');
			expect(binding).toBeInstanceOf(Test);
			expect(container.make('test')).not.toBe(binding);
		});

		test('can add concrete binding', () => {
			const object = { pass: true };
			container.bind('test', object);

			expect(container.make('test')).toBe(object);
		});

		test('can get binding from proxy', () => {
			const object = { pass: true };
			container.bind('test', () => {
				return object;
			});

			expect(container.test).toBe(object);
		});

	});


	describe('Singletons', () => {

		test('can add callback singleton', () => {
			const object = { pass: true };
			container.singleton('test', () => {
				return object;
			});

			const singleton = container.make('test');
			singleton.foo = 'foo';

			expect(singleton).toBe(object);
			expect(container.make('test')).toBe(singleton);
		});

		test('can add constructor singleton', () => {
			class Test {
			}

			container.singleton('test', Test);

			const singleton = container.make('test');
			singleton.foo = 'foo';

			expect(singleton).toBeInstanceOf(Test);
			expect(container.make('test')).toBe(singleton);
		});

	});


	describe('Contextual', () => {

		test('can add contextual binding', () => {
			const MyObject = function(pass = null) {
				this.pass = pass;
			};
			container.bind('test', (app, { pass }) => {
				return new MyObject(pass);
			});

			const resolvedObject = container.make('test', { pass: true });
			expect(resolvedObject).toBeInstanceOf(MyObject);
			expect(resolvedObject).toHaveProperty('pass');
			expect(resolvedObject.pass).toBe(true);

			const otherResolvedObject = container.make('test', { pass: false });
			expect(otherResolvedObject).toBeInstanceOf(MyObject);
			expect(otherResolvedObject).toHaveProperty('pass');
			expect(otherResolvedObject.pass).toBe(false);

			expect(otherResolvedObject).not.toBe(resolvedObject);
		});

	});


	describe('Tags', () => {

		test('can use tags', () => {
			const test = { foo: 'foo' };
			const test2 = { foo: 'bar' };
			container.bind('test', test);
			container.bind('test2', test2);
			container.tag('test', 'my-tag');
			container.tag('test2', 'my-tag');

			expect(container.make('my-tag')).toStrictEqual({ test, test2 });
		});

		test('can use tags on multiple bindings at once', () => {
			const test = { foo: 'foo' };
			const test2 = { foo: 'bar' };
			container.bind('test', test);
			container.bind('test2', test2);
			container.tag(['test', 'test2'], 'my-tag');

			expect(container.make('my-tag')).toStrictEqual({ test, test2 });
		});

	});


	describe('Auto-wiring', () => {

		test('can auto-wire any class', () => {
			class AnyTest {

				static get dependencies() {
					return ['test', 'test2', 'test3'];
				}

				constructor(t, t2, t3) {
					this.test = t;
					this.test2 = t2;
					this.test3 = t3;
				}

			}

			const test = { foo: 'foo' };
			const test2 = { foo: 'bar' };
			const test3 = { foo: 'myCustomBar' };

			container.bind('test', test);
			container.bind('test2', test2);

			const instance = container.make(AnyTest, { test3 });

			expect(instance).toBeInstanceOf(AnyTest);
			expect(instance).toHaveProperty('test');
			expect(instance.test).toBe(test);
			expect(instance).toHaveProperty('test2');
			expect(instance.test2).toBe(test2);
			expect(instance).toHaveProperty('test3');
			expect(instance.test3).toBe(test3);
		});

	});


	describe('Decorators', () => {

		test('can modify instance before returning it', () => {
			const test = { foo: 'foo' };
			container.bind('test', test);
			container.decorate('test', (inst) => {
				inst.foo = 'bar';

				return inst;
			});

			const instance = container.make('test');
			expect(instance).toHaveProperty('foo');
			expect(instance.foo).toBe('bar');
		});

		test('can decorate instance before returning it', () => {
			const test = { foo: 'foo' };
			container.bind('test', test);
			container.decorate('test', (inst) => {
				return {
					getFoo() {
						return this.getInstance().foo;
					},

					getInstance() {
						return inst;
					}
				};
			});

			const instance = container.make('test');
			expect(instance).not.toHaveProperty('foo');
			expect(instance.getFoo()).toBe('foo');
			expect(instance.getInstance()).toBe(test);
		});

	});


	describe('Dynamic accessor', () => {

		test('Dependency is automatically assign as read-only property', () => {
			class AnyTest {

				static get dependencies() {
					return ['foo'];
				}

			}

			const foo = { foo: 'foo' };
			container.bind('foo', foo);
			container.bind('foo.factory', () => {
				return foo;
			});

			const instance = container.make(AnyTest);
			expect(instance.foo).toBe(foo);
			expect(typeof instance.bar).toBe('undefined');
			expect(() => {
				instance.foo = 'bar';
			}).toThrow();
		});

		test('Dependency property name is dotted-syntax compliant', () => {
			class AnyTest {

				static get dependencies() {
					return ['foo.factory'];
				}

			}

			const foo = { foo: 'foo' };
			container.bind('foo', foo);
			container.bind('foo.factory', () => {
				return foo;
			});

			const instance = container.make(AnyTest);
			expect(instance.fooFactory).toBe(foo);
			expect(typeof instance['foo.factory']).toBe('undefined');
		});

	});

});
