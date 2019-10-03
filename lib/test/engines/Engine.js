//--------------------------------------------------------
//-- Node IoC - Test - Engines - Engine
//--------------------------------------------------------
'use strict';

const NotImplementedError = require('../../foundation/exceptions/NotImplementedError');


class Engine {

	/**
	 * Engine accessor.
	 *
	 * @type {*}
	 * @abstract
	 */
	get engine() {
		throw new NotImplementedError(this, 'engine', 'engine', 'accessor');
	}

	/**
	 * Engine CLI path accessor.
	 *
	 * @type {string}
	 * @abstract
	 */
	get path() {
		throw new NotImplementedError(this, 'path', 'string', 'accessor');
	}

	/**
	 * Extra argument to send to the CLI from the tested folder type.
	 *
	 * @param {string} [repositoryName]
	 * @returns {string}
	 */
	getPathArgument() {
		return '';
	}

	/**
	 * Get describe method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get describe() {
		throw new NotImplementedError(this, 'describe', 'function', 'accessor');
	}

	/**
	 * Get test method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get test() {
		throw new NotImplementedError(this, 'test', 'function', 'accessor');
	}

	/**
	 * Get beforeAll method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get beforeAll() {
		throw new NotImplementedError(this, 'beforeAll', 'function', 'accessor');
	}

	/**
	 * Get beforeEach method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get beforeEach() {
		throw new NotImplementedError(this, 'beforeEach', 'function', 'accessor');
	}

	/**
	 * Get afterEach method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get afterEach() {
		throw new NotImplementedError(this, 'afterEach', 'function', 'accessor');
	}

	/**
	 * Get afterAll method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get afterAll() {
		throw new NotImplementedError(this, 'afterAll', 'function', 'accessor');
	}

	/**
	 * Get expect method.
	 *
	 * @type {Function}
	 * @abstract
	 */
	get expect() {
		throw new NotImplementedError(this, 'expect', 'function', 'accessor');
	}

	/**
	 * Get assert object.
	 *
	 * @type {*}
	 * @abstract
	 */
	get assert() {
		throw new NotImplementedError(this, 'asserts', 'object', 'accessor');
	}

}


module.exports = Engine;
