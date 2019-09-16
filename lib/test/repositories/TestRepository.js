//--------------------------------------------------------
//-- Node IoC - Test - Repository - Abstract Test repository
//--------------------------------------------------------
'use strict';


const __ 				  = require('@absolunet/private-registry');
const path 				  = require('path');
const { sentence, title } = require('to-case');


class TestRepository {

	/**
	 * {inheritdoc}
	 */
	static get dependencies() {
		return ['path.test', 'app', 'file'];
	}

	/**
	 * Folder scope accessor.
	 * Should be a valid folder in the test directory.
	 *
	 * @returns {string}
	 */
	get scope() {
		return '';
	}

	/**
	 * TestRepository constructor.
	 *
	 * @param {string} testPath
	 */
	constructor(testPath) {
		if (!this.basePath) {
			this.setBasePath(testPath);
		}

		if (!this.pattern) {
			this.setPattern('.+Test.js$');
		}
	}

	/**
	 * Get all the tests from the root namespace.
	 *
	 * @returns {{file: string, instance: TestCase, name: string, namespace: string, tests: { method: string, description: string}[]}[]}
	 */
	all() {
		return this.fromNamespace();
	}

	/**
	 * Get all the tests from the given namespace.
	 *
	 * @param {string} [testNamespace]
	 * @returns {{file: string, instance: TestCase, name: string, namespace: string, tests: { method: string, description: string}[]}[]}
	 */
	fromNamespace(testNamespace = '') {
		return this.getFilesFrom(testNamespace).map((file) => {
			const instance = this.app.make(file);
			const namespace = this.getFormattedNamespaceFromFile(file);
			const name = this.getFormattedNameFromFile(file);
			const tests = this.getTestsFromInstance(instance);

			return { file, instance, name, namespace, tests };
		});
	}

	/**
	 * Get a file list from the given folder that matches the test class pattern.
	 *
	 * @param folder
	 * @returns {string[]}
	 */
	getFilesFrom(folder) {
		const directory = this.app.formatPath(this.basePath, this.scope, folder);
		const options = { recursive: true, fullPath: true };
		const regex = new RegExp(this.pattern, 'u');

		return this.file.scandir(directory, 'file', options)
			.filter(regex.test.bind(regex));
	}

	/**
	 * Get the namespace from full file path.
	 *
	 * @param {string} file
	 * @returns {string}
	 */
	getNamespaceFromFile(file) {
		return path.relative(this.basePath, file).replace(/\/[^/]+.js$/u, '');
	}

	/**
	 * Get human-readable namespace from full file path.
	 *
	 * @param {string} file
	 * @returns {string}
	 */
	getFormattedNamespaceFromFile(file) {
		return title(this.getNamespaceFromFile(file).replace(/\//gu, ' > '));
	}

	/**
	 * Get human-readable name from full file path.
	 *
	 * @param {string} file
	 * @returns {string}
	 */
	getFormattedNameFromFile(file) {
		return file.replace(/^.*[/\\](?<name>[A-z]+).js$/u, '$<name>');
	}

	/**
	 * Get all the test methods and their descriptions of a given TestCase instance.
	 *
	 * @param {TestCase} instance
	 * @returns {{method: string, description: string}[]}
	 */
	getTestsFromInstance(instance) {
		return this.getAllInstanceTestMethods(instance)
			.map((method) => {
				const description = this.getFormattedDescription(method);

				return { method, description };
			});
	}

	/**
	 * Get all instance methods.
	 *
	 * @param {TestCase} instance
	 * @returns {string[]}
	 */
	getAllInstanceMethods(instance) {
		const properties = new Set();
		let currentObject = instance;

		do {
			Object.keys(Object.getOwnPropertyDescriptors(currentObject)).forEach((name) => {
				properties.add(name);
			});
			currentObject = Object.getPrototypeOf(currentObject);
		} while (currentObject);

		return [...properties.keys()];
	}

	/**
	 * Get all instance methods that are actual test cases.
	 *
	 * @param {TestCase} instance
	 * @returns {string[]}
	 */
	getAllInstanceTestMethods(instance) {
		return this.getAllInstanceMethods(instance)
			.filter((name) => {
				return this.testMethodName(name);
			});
	}

	/**
	 * Test method name to verify if its a test case method name.
	 *
	 * @param {string} methodName
	 * @returns {boolean}
	 */
	testMethodName(methodName) {
		return methodName.startsWith('test');
	}

	/**
	 * Get human-readable test case description.
	 *
	 * @param {string} methodName
	 * @returns {string}
	 */
	getFormattedDescription(methodName) {
		return sentence(methodName.replace(/^test/u, ''));
	}

	/**
	 * Set current base path.
	 *
	 * @param {string} basePath
	 * @returns {TestRepository}
	 */
	setBasePath(basePath) {
		__(TestRepository).set('basePath', basePath);

		return this;
	}

	/**
	 * Set current regular expression pattern to test test case classes.
	 *
	 * @param {string|RegExp} pattern
	 * @returns {TestRepository}
	 */
	setPattern(pattern) {
		__(TestRepository).set('pattern', pattern);

		return this;
	}

	/**
	 * Current base path accessor.
	 *
	 * @returns {string}
	 */
	get basePath() {
		return __(TestRepository).get('basePath');
	}

	/**
	 * Current pattern acessor.
	 *
	 * @returns {string|RegExp}
	 */
	get pattern() {
		return __(TestRepository).get('pattern');
	}

}

module.exports = TestRepository;
