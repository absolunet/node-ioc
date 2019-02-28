//--------------------------------------------------------
//-- Spark IoC - Console - Option
//--------------------------------------------------------
'use strict';

class Option {

	constructor(name, defaultValue = null, description = '') {
		this.name = name;
		this.defaulValue = defaultValue;
		this.description = description;
	}

}

module.exports = Option;
