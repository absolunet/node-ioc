//--------------------------------------------------------
//-- Tests - Unit - Validation - Services - Validator - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import joi       from '@hapi/joi';
import container from '../../container';
import Validator from '../../../../dist/node/validation/services/Validator';

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


export default build({ given, when, then });
