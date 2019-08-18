//--------------------------------------------------------
//-- Tests - Unit - File
//--------------------------------------------------------
'use strict';


const path = require('path');
const fsp  = require('@absolunet/fsp');
const fss  = require('@absolunet/fss');

const container             = require('./../common');
const ConfigServiceProvider = require('./../../../lib/config/providers/ConfigServiceProvider');
const FileServiceProvider   = require('./../../../lib/file/providers/FileServiceProvider');


describe('Node IoC - File', () => {

	beforeEach(() => {
		container.register(FileServiceProvider);
		container.register(ConfigServiceProvider);
		container.bootIfNotBooted();
	});


	describe('Engine', () => {

		let engine;

		beforeEach(() => {
			engine = container.make('file.engine');
		});

		test('Engine exposes fss', () => {
			Object.getOwnPropertyNames(Object.getPrototypeOf(fss)).forEach((name) => {
				expect(engine.sync).toHaveProperty(name);
			});
		});

		test('Engine exposes fsp', () => {
			Object.getOwnPropertyNames(Object.getPrototypeOf(fsp)).forEach((name) => {
				expect(engine.async).toHaveProperty(name);
			});
		});

		test('Engine exposes sync fs by default', () => {
			const parameters = [__dirname, 'file'];
			const scandir = engine.scandir(...parameters);

			expect(scandir).toStrictEqual(fss.scandir(...parameters));
			expect(scandir).not.toBeInstanceOf(Promise);
		});

	});

	describe('Loader', () => {


		let loader;

		const getFileName = (extension) => {
			return `${path.join(__dirname, 'stubs', 'files', 'file')}.${extension}`;
		};


		beforeEach(() => {
			loader = container.make('file');
		});


		describe('Drivers - Sync', () => {

			test('Text driver is working', () => {
				expect(loader.load(getFileName('txt'))).toStrictEqual(`test:\n    foo: bar\n`);
			});

			test('JavaScript driver is working', () => {
				expect(loader.load(getFileName('js'))).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('JSON driver is working', () => {
				expect(loader.load(getFileName('json'))).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('YAML driver is working', () => {
				expect(loader.load(getFileName('yaml'))).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('YML driver is working', () => {
				expect(loader.load(getFileName('yml'))).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('Null driver is working', () => {
				expect(loader.load(null)).toBe(null);
			});

		});


		describe('Drivers - Async', () => {

			test('Text driver is working', async () => {
				const data = await loader.loadAsync(getFileName('txt'));
				expect(data).toStrictEqual(`test:\n    foo: bar\n`);
			});

			test('JavaScript driver is working', async () => {
				const data = await loader.loadAsync(getFileName('js'));
				expect(data).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('JSON driver is working', async () => {
				const data = await loader.loadAsync(getFileName('json'));
				expect(data).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('YAML driver is working', async () => {
				const data = await loader.loadAsync(getFileName('yaml'));
				expect(data).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('YML driver is working', async () => {
				const data = await loader.loadAsync(getFileName('yml'));
				expect(data).toStrictEqual({ test: { foo: 'bar' } });
			});

			test('Null driver is working', async () => {
				const data = await loader.loadAsync(null);
				expect(data).toBe(null);
			});

		});

	});
});
