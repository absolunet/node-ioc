//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - String Helper - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container    from '../../container';
import StringHelper from '../../../../dist/node/support/helpers/StringHelper';

let stringHelper;
let string;
let result;


//-- Given
//--------------------------------------------------------

given.stringHelper = () => {
	stringHelper = container.make(StringHelper);
};

given.emptyResult = () => {
	result = undefined;
};

given.string = (value) => {
	string = value;
};


//-- When
//--------------------------------------------------------

when.convertingTo = (method) => {
	when.attempting(() => {
		result = stringHelper[method](string);
	});
};

when.convertingToCamelCase = () => {
	when.convertingTo('camel');
};

when.convertingToConstantCase = () => {
	when.convertingTo('constant');
};

when.convertingToDotCase = () => {
	when.convertingTo('dot');
};

when.convertingToPascalCase = () => {
	when.convertingTo('pascal');
};

when.convertingToSentence = () => {
	when.convertingTo('sentence');
};

when.convertingToSlugCase = () => {
	when.convertingTo('slug');
};

when.convertingToSnakeCase = () => {
	when.convertingTo('snake');
};

when.convertingToTitleCase = () => {
	when.convertingTo('title');
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};


export default build({ given, when, then });
