//--------------------------------------------------------
//-- Tests - Unit - Test
//--------------------------------------------------------
'use strict';


const container       		 = require('./../common');
const path					 = require('path');
const ConsoleServiceProvider = require('./../../../lib/console/providers/ConsoleServiceProvider');
const TestServiceProvider 	 = require('./../../../lib/test/providers/TestServiceProvider');
const TestCase 				 = require('./../../../lib/test/TestCase');


describe('Node IoC - Test', () => {


	beforeEach(() => {
		container.register(ConsoleServiceProvider);
		container.register(TestServiceProvider);
		container.bootIfNotBooted();
	});

	describe('Base', () => {

		test('Test path is bound', () => {
			expect(container.isBound('path.test')).toBe(true);
		});

		test('Unit Test repository is bound', () => {
			expect(container.isBound('test.unit')).toBe(true);
		});

		test('Feature Test repository is bound', () => {
			expect(container.isBound('test.feature')).toBe(true);
		});

		test('Test runner service is bound', () => {
			expect(container.isBound('test.runner')).toBe(true);
		});

		test('Test repositories are tagged', () => {
			expect(() => {
				container.make('tests');
			}).not.toThrow();

			const baseRepository = container.make('test');
			const repositories = container.make('tests');
			expect(typeof repositories).toBe(typeof {});

			const repositoryList = Object.values(repositories);
			expect(repositoryList.length).toBe(4);

			repositoryList.forEach((repository) => {
				expect(repository).toBeInstanceOf(baseRepository.constructor);
			});
		});

		test('Tests path can be configured in repository', () => {
			const repository = container.make('test');

			const newPath = `/foo`;

			expect(() => {
				repository.setBasePath(newPath);
			}).not.toThrow();

			const { basePath: newBasePath } = repository;

			expect(newBasePath).toBe(newPath);
		});

		test('Test class pattern can be configured in repository', () => {
			const repository = container.make('test');
			const pattern = '.+Test.js';

			expect(() => {
				repository.setPattern(pattern);
			}).not.toThrow();

			const { pattern: newPattern } = repository;

			expect(newPattern).toBe(pattern);
		});

	});


	describe('Repositories', () => {


		beforeEach(() => {
			container.make('test').setBasePath(path.join(__dirname, 'stubs', 'test'));
		});


		test('Can retrieve tests', () => {
			const repository = container.make('test');

			return Promise.resolve(repository.all())
				.then((testList) => {
					expect(typeof testList).toBe(typeof []);

					testList.forEach(({ file, instance, name, namespace, tests }) => {
						expect(instance).toBeInstanceOf(TestCase);
						expect(typeof namespace).toBe('string');
						expect(typeof tests).toBe(typeof []);
						expect(file.endsWith(`${name}.js`)).toBe(true);

						tests.forEach(({ method, description }) => {
							expect(typeof method).toBe('string');
							expect(typeof instance[method]).toBe('function');
							expect(typeof description).toBe('string');
							expect(description).toMatch(/^[A-Z][a-z\s]+$/u);
						});
					});
				});
		});

		test('Can retrieve unit tests', () => {
			const repository = container.make('test');
			const unitRepository = container.make('test.unit');
			const featureRepository = container.make('test.feature');

			expect(repository).not.toBe(unitRepository);

			return Promise.all([repository.all(), unitRepository.all(), featureRepository.all()])
				.then(([allTestList, unitTestList, featureTestList]) => {
					expect(allTestList.length).not.toBe(unitTestList.length);
					expect(allTestList.length).not.toBe(featureTestList.length);

					const filterFn = (list) => {
						return ({ instance }) => {
							return list.some(({ instance: otherInstance }) => {
								return instance instanceof otherInstance.constructor;
							});
						};
					};

					const subUnitTestList = allTestList.filter(filterFn(unitTestList));
					const subFeatureTestList = allTestList.filter(filterFn(featureTestList));

					expect(subUnitTestList.length).toBe(unitTestList.length);
					expect(subFeatureTestList.length).toBe(featureTestList.length);
				});
		});

	});


	describe('Runner', () => {

		const setupMethods = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];
		const testMethods = ['test', 'describe', ...setupMethods];
		let testRunner;

		beforeEach(() => {
			container.make('test').setBasePath(path.join(__dirname, 'stubs', 'test'));
			testRunner = container.make('test.runner');
			testRunner.setEngine(jest);

			testMethods.forEach((method) => {
				testRunner[method] = jest.fn((...parameters) => {
					parameters.forEach((parameter) => {
						if (typeof parameter === 'function') {
							parameter();
						}
					});
				});
			});
		});

		test('Worker can run a single test', () => {
			const testRepository = container.make('test');

			const [singleItem] = testRepository.all();

			const { instance: originalInstance } = singleItem;
			const emptyFunctions = ['constructor', 'setEngine', 'setApp'];

			singleItem.instance = Object.assign(...testRepository.getAllInstanceMethods(originalInstance)
				.map((name) => {
					return {
						[name]: emptyFunctions.includes(name) ? function() { return this; } : jest.fn()
					};
				}));

			testRunner.runTest(singleItem);

			setupMethods.forEach((method) => {
				expect(testRunner[method]).toHaveBeenCalledTimes(1);
			});

			expect(testRunner.describe).toHaveBeenCalledTimes(2);
			expect(testRunner.test).toHaveBeenCalledTimes(singleItem.tests.length);

			[...setupMethods, ...singleItem.tests.map(({ method }) => { return method; })]
				.forEach((method) => {
					expect(singleItem.instance[method]).toHaveBeenCalledTimes(1);
				});
		});

		test('Worker can run all tests', () => {
			const testRepository = container.make('test');

			const testList = testRepository.all();

			testRunner.run(testList);

			setupMethods.forEach((method) => {
				expect(testRunner[method]).toHaveBeenCalledTimes(testList.length);
			});

			expect(testRunner.describe).toHaveBeenCalledTimes(testList.length * 2);
		});

	});
});
