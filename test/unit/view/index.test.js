//--------------------------------------------------------
//-- Tests - Unit - View
//--------------------------------------------------------
'use strict';

const path                  = require('path');
const container             = require('./../common');
const ConfigServiceProvider = require('./../../../lib/config/providers/ConfigServiceProvider');
const FileServiceProvider   = require('./../../../lib/file/providers/FileServiceProvider');
const ViewServiceProvider   = require('./../../../lib/view/providers/ViewServiceProvider');


describe('Node IoC - View', () => {

	beforeEach(() => {
		container.register(FileServiceProvider);
		container.register(ConfigServiceProvider);
		container.register(ViewServiceProvider);
		container.bootIfNotBooted();
	});

	describe('Engine', () => {

		describe('Binding', () => {

			test('Can resolve engine', () => {
				expect(container.isBound('view.engine')).toBe(true);
				expect(container.make('view.engine')).toBeTruthy();
			});

		});


		describe('Template', () => {

			test('Can make template instance', () => {
				const engine = container.make('view.engine');
				engine.setDefaultDriver('null');
				expect(() => { engine.make('foo'); }).not.toThrow();
				expect(engine.make('foo')).toBe(null);
			});

			test('Can render template instance', () => {
				const engine = container.make('view.engine');
				engine.setDefaultDriver('null');
				expect(() => { engine.render('foo'); }).not.toThrow();
				expect(typeof engine.render('foo')).toBe('string');
			});

		});

	});

	describe('JSRender driver', () => {

		let jsrenderDriver;

		beforeEach(() => {
			jsrenderDriver = container.make('view.engine').driver('jsrender');
		});


		test('Is default driver', () => {
			const engine = container.make('view.engine');
			expect(engine.driver()).toBe(jsrenderDriver);
		});

		test('Can make template instance', () => {
			const template = jsrenderDriver.make('<p>Foo</p>');

			expect(template).toBeTruthy();
			expect(['function', 'object'].includes(typeof template)).toBe(true);
		});

		test('Can render template', () => {
			const template = '<p>Test</p>';
			const result = jsrenderDriver.render(template);

			expect(result).toBe(template);
		});

		test('Can render template with parameters', () => {
			const template = '<p>{{:text}}</p>';
			const result = jsrenderDriver.render(template, { text: 'Test' });

			expect(result).toBe('<p>Test</p>');
		});

		test('Can render template without parameters even if parameters are given', () => {
			const template = '<p>Test</p>';
			const result = jsrenderDriver.render(template, { text: 'Bar' });

			expect(result).toBe(template);
		});

	});

	describe('Resolver', () => {

		describe('Binding', () => {

			test('Can resolve view resolver', () => {
				expect(container.isBound('view.resolver')).toBe(true);
				expect(container.make('view.resolver')).toBeTruthy();
			});

		});


		describe('Resolving', () => {

			const viewsPath = path.join(__dirname, 'stubs', 'views');
			let resolver;

			beforeEach(() => {
				container.configurePaths({ view: viewsPath });
				resolver = container.make('view.resolver');
			});


			test('Uses application path to resolve views', () => {
				expect(resolver.path).toBe(viewsPath);
			});

			test('Can resolve file', () => {
				expect(resolver.find('test')).toBe(`<p>Test</p>\n`);
			});

			test('Fails when trying to resolve unexisting file', () => {
				expect(() => {
					resolver.find('unexisting');
				}).toThrow();
			});

			test('Can register namespace', () => {
				expect(() => {
					resolver.find('namespace::test');
				}).toThrow();

				resolver.namespace('namespace', path.join(viewsPath, 'namespace'));
				expect(resolver.find('namespace::test')).toBe(`<p>Namespace</p>\n`);
			});

		});

	});

	describe('Factory', () => {

		describe('Binding', () => {

			test('Can resolve view factory', () => {
				expect(container.isBound('view')).toBe(true);
				expect(container.make('view')).toBeTruthy();
			});

		});

		describe('Compile', () => {

			const viewsPath = path.join(__dirname, 'stubs', 'views');
			let factory;

			beforeEach(() => {
				container.configurePaths({ view: viewsPath });
				factory = container.make('view');
			});


			test('Can compile view from name', () => {
				expect(factory.make('test')).toBe(`<p>Test</p>\n`);
			});

			test('Can compile view from name and data', () => {
				expect(factory.make('components.with-slot', { slot: 'Test' })).toBe(`<p>Test</p>\n`);
			});

			test('Can compile view including other view', () => {
				expect(factory.make('components.including-empty'))
					.toBe(`<div>\n\t<p>Including empty</p>\n\t<p>Empty component</p>\n\n</div>\n`);
			});

			test('Can compile view including other view with content in slot', () => {
				expect(factory.make('components.including-slot'))
					.toBe(`<div>\n\t<p>Including slot</p>\n\t<p>\n\t\tContent\n\t</p>\n\n</div>\n`);
			});

		});

	});

});
