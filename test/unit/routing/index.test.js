//--------------------------------------------------------
//-- Tests - Unit - HTTP
//--------------------------------------------------------
'use strict';

const {
	IncomingMessage,
	ServerResponse
}                            = require('http');
const container              = require('./../common');
const ConfigServiceProvider  = require('./../../../lib/config/providers/ConfigServiceProvider');
const FileServiceProvider    = require('./../../../lib/file/providers/FileServiceProvider');
const HttpServiceProvider    = require('./../../../lib/http/providers/HttpServiceProvider');
const RoutingServiceProvider = require('./../../../lib/routing/providers/RoutingServiceProvider');


describe('Node IoC - Routing', () => {


	beforeEach(() => {
		container.register(FileServiceProvider);
		container.register(ConfigServiceProvider);
		container.register(HttpServiceProvider);
		container.register(RoutingServiceProvider);
		container.bootIfNotBooted();
	});

	test('Services are resolvables', () => {
		expect(container.isBound('router')).toBe(true);
		expect(container.isBound('router.route')).toBe(true);
		expect(container.isBound('router.controller')).toBe(true);
		expect(container.make('router')).toBeTruthy();
		expect(container.make('router.route')).toBeTruthy();
		expect(container.make('router.controller')).toBeTruthy();
	});


	describe('Router', () => {

		let router;
		let routeRepository;

		beforeEach(() => {
			router          = container.make('router');
			routeRepository = container.make('router.route');
		});


		test('Can register route', () => {
			router.get('/test', (request, response) => {
				response.send('test');
			});
			expect(routeRepository.all().length).toBe(1);
			expect(routeRepository.all()[0].path).toBe('/test');
		});

		test('Can register multiple routes', () => {
			router.get('/foo', (request, response) => {
				response.send('foo');
			});
			router.get('/bar', (request, response) => {
				response.send('bar');
			});

			expect(routeRepository.all().length).toBe(2);
			expect(routeRepository.all()[0].path).toBe('/foo');
			expect(routeRepository.all()[1].path).toBe('/bar');
		});

		test(`Empty group doesn't register route`, () => {
			router.group({ as: 'test.' }, () => {}); // eslint-disable-line no-empty-function
			expect(routeRepository.all().length).toBe(0);
		});

		test('Group properly assign attributes to underlying routes', () => {
			router.group({ prefix: '/test' }, () => {
				router.get('/foo', (request, response) => {
					response.send('foo');
				});
			});
			expect(routeRepository.all().length).toBe(1);
			expect(routeRepository.all()[0].path).toBe('/test/foo');
		});

		test('Group "prefix" properly format path', () => {
			router.group({ prefix: '/test/' }, () => {
				router.get('/foo', (request, response) => {
					response.send('foo');
				});
			});

			router.group({ prefix: 'test' }, () => {
				router.get('bar', (request, response) => {
					response.send('foo');
				});
			});
			expect(routeRepository.all().length).toBe(2);
			expect(routeRepository.all()[0].path).toBe('/test/foo');
			expect(routeRepository.all()[1].path).toBe('/test/bar');
		});

		test('Group "as" properly prefix name if given', () => {
			router.group({ as: 'test.' }, () => {
				router.get('/foo', (request, response) => {
					response.send('foo');
				});
				router.get('/bar', (request, response) => {
					response.send('bar');
				}).name('bar');
			});

			expect(routeRepository.all()[0].getAttributes().as).toBeFalsy();
			expect(routeRepository.all()[1].getAttributes().as).toBe('test.bar');
		});

		test('Group "namespace" properly prefix named controller', () => {
			router.group({ namespace: 'Test' }, () => {
				router.get('/foo', 'TestController@foo');
			});

			expect(routeRepository.all()[0].getAttribute('action')).toBe('Test.TestController@foo');
		});

		test('Can nest groups', () => {
			router.group({ namespace: 'Test', prefix: '/test' }, () => {
				router.group({ as: 'test.', namespace: 'SubTest' }, () => {
					router.get('/foo', 'TestController@foo').name('foo');
					router.group({ prefix: 'sub' }, () => {
						router.get('/bar', 'TestController@bar').name('bar');
					});
				});
			});

			expect(routeRepository.all().length).toBe(2);
			expect(routeRepository.all()[0].getAttributes()).toMatchObject({
				path: '/test/foo',
				as: 'test.foo',
				action: 'Test.SubTest.TestController@foo',
				method: 'get'
			});
			expect(routeRepository.all()[1].getAttributes()).toMatchObject({
				path: '/test/sub/bar',
				as: 'test.bar',
				action: 'Test.SubTest.TestController@bar',
				method: 'get'
			});
		});

	});


	describe('Route Repository', () => {

		let router;
		let routeRepository;

		beforeEach(() => {
			router          = container.make('router');
			routeRepository = container.make('router.route');
		});


		test('Can retrieve all routes', () => {
			router.get('/foo', 'TestController@foo');
			expect(routeRepository.all().length).toBe(1);
		});

		test('Can retrieve a route by name', () => {
			router.get('/foo', 'TestController@foo').name('foo');
			router.get('/bar', 'TestController@bar').name('bar');

			expect(routeRepository.findByName('foo')).toBeTruthy();
			expect(routeRepository.findByName('foo').getAttributes()).toMatchObject({
				path: '/foo',
				action: 'TestController@foo',
				as: 'foo',
				method: 'get'
			});

			expect(routeRepository.findByName('bar')).toBeTruthy();
			expect(routeRepository.findByName('bar').getAttributes()).toMatchObject({
				path: '/bar',
				action: 'TestController@bar',
				as: 'bar',
				method: 'get'
			});

			expect(routeRepository.findByName('baz')).toBeFalsy();
		});

		test('Can retrieve routes by path', () => {
			router.get('/foo', 'TestController@foo').name('foo');
			router.post('/foo', 'TestController@store').name('foo.store');
			router.get('/bar', 'TestController@bar').name('bar');

			const fooRoutes = routeRepository.findByPath('/foo');
			expect(fooRoutes).toBeTruthy();
			expect(Array.isArray(fooRoutes)).toBe(true);
			expect(fooRoutes.length).toBe(2);

			const barRoutes = routeRepository.findByPath('/bar');
			expect(barRoutes).toBeTruthy();
			expect(Array.isArray(barRoutes)).toBe(true);
			expect(barRoutes.length).toBe(1);

			const bazRoutes = routeRepository.findByPath('/baz');
			expect(bazRoutes).toBeTruthy();
			expect(Array.isArray(bazRoutes)).toBe(true);
			expect(bazRoutes.length).toBe(0);
		});

		test('Can retrieve route by path and method', () => {
			router.get('/foo', 'TestController@foo').name('foo');
			router.post('/foo', 'TestController@store').name('foo.store');
			router.get('/bar', 'TestController@bar').name('bar');

			const fooRoute = routeRepository.findByPathForMethod('/foo', 'get');
			expect(fooRoute).toBeTruthy();
			expect(fooRoute.getAttribute('path')).toBe('/foo');
			expect(fooRoute.getAttribute('method')).toBe('get');

			const fooPostRoute = routeRepository.findByPathForMethod('/foo', 'post');
			expect(fooPostRoute).toBeTruthy();
			expect(fooPostRoute.getAttribute('path')).toBe('/foo');
			expect(fooPostRoute.getAttribute('method')).toBe('post');

			const barRoute = routeRepository.findByPathForMethod('/bar', 'get');
			expect(barRoute).toBeTruthy();
			expect(barRoute.getAttribute('path')).toBe('/bar');
			expect(barRoute.getAttribute('method')).toBe('get');

			const bazRoute = routeRepository.findByPathForMethod('/baz', 'get');
			expect(bazRoute).toBeFalsy();
		});

		test('Can retrieve route with parameter by path', () => {
			router.get('/foo/:param', 'TestController@foo');

			const fooRoute = routeRepository.findByPathForMethod('/foo/bar', 'get');
			expect(fooRoute).toBeTruthy();
			expect(fooRoute.getAttribute('path')).toBe('/foo/:param');
			expect(fooRoute.getAttribute('compiledPath')).toBe('/foo/bar');
			expect(fooRoute.getAttribute('method')).toBe('get');
		});

		test('Can add route parameter constraint', () => {
			router.get('/foo/:param', 'TestController@foo').name('foo.digit').where('param', '[0-9]+');
			router.get('/foo/:param', 'TestController@foo').name('foo.alpha').where('param', '[a-z]+');
			router.get('/foo/:param', 'TestController@foo').name('foo.default');

			const digitRoute = routeRepository.findByPathForMethod('/foo/123', 'get');
			expect(digitRoute).toBeTruthy();
			expect(digitRoute.getAttribute('as')).toBe('foo.digit');

			const alphaRoute = routeRepository.findByPathForMethod('/foo/bar', 'get');
			expect(alphaRoute).toBeTruthy();
			expect(alphaRoute.getAttribute('as')).toBe('foo.alpha');

			const defaultRoute = routeRepository.findByPathForMethod('/foo/bar-baz', 'get');
			expect(defaultRoute).toBeTruthy();
			expect(defaultRoute.getAttribute('as')).toBe('foo.default');
		});

		test('Can call a route handler by name', () => {
			const controller = jest.fn();
			router.get('/foo', controller).name('foo');

			expect(() => {
				router.callByName('foo');
			}).not.toThrow();

			expect(controller).toHaveBeenCalledTimes(1);
			expect(controller.mock.calls[0][0]).toBeInstanceOf(IncomingMessage);
			expect(controller.mock.calls[0][1]).toBeInstanceOf(ServerResponse);
		});

		test('Can call a route handler by path', () => {
			const controller = jest.fn();
			router.get('/foo', controller);

			expect(() => {
				router.call('/foo');
			}).not.toThrow();

			expect(controller).toHaveBeenCalledTimes(1);
			expect(controller.mock.calls[0][0]).toBeInstanceOf(IncomingMessage);
			expect(controller.mock.calls[0][1]).toBeInstanceOf(ServerResponse);
		});

		test('Can call a configurable route handler by path', () => {
			const controller = jest.fn();
			router.get('/foo/:param', controller);

			expect(() => {
				router.call('/foo/bar');
			}).not.toThrow();

			expect(controller).toHaveBeenCalledTimes(1);
			expect(controller.mock.calls[0][0]).toBeInstanceOf(IncomingMessage);
			expect(controller.mock.calls[0][1]).toBeInstanceOf(ServerResponse);
		});

	});

	describe('Controller repository', () => {

		let controllerRepository;
		let FooController;

		beforeEach(() => {
			controllerRepository = container.make('router.controller');
			FooController = class {};
		});


		test('Can register controller', () => {
			controllerRepository.add('foo', FooController);
			expect(controllerRepository.has('foo')).toBe(true);
		});

		test('Can get controller instance', () => {
			controllerRepository.add('foo', FooController);
			expect(controllerRepository.get('foo')).toBeInstanceOf(FooController);
		});

	});

	describe('Express router binding', () => {

		let router;

		beforeEach(() => {
			router = container.make('router');
		});


		test('Router can bootstrap express router', () => {
			const controller = jest.fn();
			router.get('/foo', controller);
			const express = router.generate();

			expect(express).toBeInstanceOf(Function);
			const expressRoute = express._router.stack.find(({ route }) => {
				return route && route.path === '/foo' && route.methods.get;
			});
			expect(expressRoute).toBeTruthy();

			expressRoute.handle({ method: 'get' });
			expect(controller).toHaveBeenCalledTimes(1);
		});

	});

});
