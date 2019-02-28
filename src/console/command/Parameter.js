//--------------------------------------------------------
//-- Spark IoC - Console - Parameter
//--------------------------------------------------------
'use strict';

class Parameter {

	constructor(name, required = true, defaultValue = null, description = '') {
		this.name = name;
		this.required = required;
		this.defaulValue = defaultValue;
		this.description = description;
	}

}

module.exports = Parameter;
