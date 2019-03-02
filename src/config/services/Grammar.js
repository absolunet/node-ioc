//--------------------------------------------------------
//-- Spark IoC - Config - Config Grammar
//--------------------------------------------------------
'use strict';

const __ = require('@absolunet/private-registry');
const slash = require('slash');


class Grammar {

	static get dependencies() {
		return ['app'];
	}

	constructor(app) {
		__(this).set('app', app);
	}

	formatPath(filePath) {
		return slash(filePath
			.replace(/@/u, __(this).get('app').make('path.base')));
	}

}

module.exports = Grammar;
