//--------------------------------------------------------
//-- Tests - Unit - Validation - Services - Validator - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const joi       = require('@hapi/joi');
const container = require('../../container');
const Validator = require('../../../../dist/node/validation/services/Validator');

let validator;
let result;


//-- Given
//--------------------------------------------------------

given.validator = () => {
	validator = container.make(Validator);
};


//-- When
//--------------------------------------------------------

when.gettingKeys = () => {
	when.attempting(() => {
		result = Object.keys(validator);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldAtLeastMatchJoiKeys = () => {
	then.shouldNotHaveThrown();
	expect(result).toMatchObject(Object.keys(joi));
};


module.exports = build({ given, when, then });
