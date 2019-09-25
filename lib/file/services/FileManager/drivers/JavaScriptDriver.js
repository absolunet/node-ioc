//--------------------------------------------------------
//-- Node IoC - Config - JavaScript Driver
//--------------------------------------------------------
'use strict';

const Driver = require('./Driver');


class JavaScriptDriver extends Driver {

	/**
	 * {@inheritdoc}
	 */
	static get dependencies() {
		return (super.dependencies || []).concat(['app']);
	}

	/**
	 * {@inheritdoc}
	 */
	load(file) {
		return this.app.getContext().require(file);
	}

	/**
	 * {@inheritdoc}
	 */
	loadAsync(file) {
		return Promise.resolve(this.app.getContext().require(file));
	}

}


module.exports = JavaScriptDriver;
