//--------------------------------------------------------
//-- Node IoC - Test - Engines - Jest
//--------------------------------------------------------
'use strict';


const Engine = require('./Engine');


class JestEngine extends Engine {

	/**
	 * {@inheritdoc}
	 */
	get engine() {
		return jest; // eslint-disable-line no-undef
	}

	/**
	 * {@inheritdoc}
	 */
	get path() {
		return 'node_modules/jest/bin/jest';
	}

	/**
	 * {@inheritdoc}
	 */
	getPathArgument() {
		return '';
	}

}

module.exports = JestEngine;
