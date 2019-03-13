//--------------------------------------------------------
//-- Tests - Unit - File
//--------------------------------------------------------
'use strict';


const container = require('./../common');
const FileServiceProvider = require('./../../../lib/file/providers/FileServiceProvider');
const path = require('path');


describe('Node IoC - File', () => {


	beforeEach(() => {
		container.register(FileServiceProvider);
		container.bootIfNotBooted();
	});


	describe('Loader', () => {

		let loader;

		const getFileName = (ext) => {
			return `${path.join(__dirname, 'stubs', 'files', 'file')}.${ext}`;
		};

		beforeEach(() => {
			loader = container.make('file');
		});


		describe('Drivers - Sync', () => {

			test('Text driver is working', () => {
				expect(loader.load(getFileName('txt'))).toStrictEqual(`test:\n    foo: bar\n`);
			});

			test('JavaScript driver is working', () => {
				expect(loader.load(getFileName('js'))).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('JSON driver is working', () => {
				expect(loader.load(getFileName('json'))).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('YAML driver is working', () => {
				expect(loader.load(getFileName('yaml'))).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('YML driver is working', () => {
				expect(loader.load(getFileName('yml'))).toStrictEqual({ test:{ foo:'bar' } });
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
				expect(data).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('JSON driver is working', async () => {
				const data = await loader.loadAsync(getFileName('json'));
				expect(data).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('YAML driver is working', async () => {
				const data = await loader.loadAsync(getFileName('yaml'));
				expect(data).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('YML driver is working', async () => {
				const data = await loader.loadAsync(getFileName('yml'));
				expect(data).toStrictEqual({ test:{ foo:'bar' } });
			});

			test('Null driver is working', async () => {
				const data = await loader.loadAsync(null);
				expect(data).toBe(null);
			});

		});

	});
});
