//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Client - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const axios     = require('axios');
const container = require('../../container');
const Client    = require('../../../../src/http/services/Client');

let result;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};


//-- When
//--------------------------------------------------------

when.creatingHttpClient = () => {
	when.attempting(() => {
		result = container.make(Client);
	});
};


//-- Then
//--------------------------------------------------------

then.clientHasSamePropertiesAndMethodAsAxios = () => {
	then.shouldNotHaveThrown();
	expect(result).toBeTruthy();
	expect(Object.keys(result)).toStrictEqual(Object.keys(axios.create()));
};


module.exports = build({ given, when, then });
