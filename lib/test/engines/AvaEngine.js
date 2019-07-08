//--------------------------------------------------------
//-- Node IoC - Test - Engines - AVA
//--------------------------------------------------------
'use strict';


const Engine = require('./Engine');


class AvaEngine extends Engine {

	/**
	 * {@inheritdoc}
	 */
	get engine() {
		return require('ava'); // eslint-disable-line global-require
	}

	/**
	 * {@inheritdoc}
	 */
	get path() {
		return require.resolve('ava');
	}

	/**
	 * {@inheritdoc}
	 */
	getPathArgument(repositoryName) {
		return `test/${repositoryName.split('.').pop()}`;
	}

}

module.exports = AvaEngine;
