//--------------------------------------------------------
//-- Tests - Unit - Config - Services - Evaluator - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';
import Evaluator from '../../../../dist/node/config/services/Evaluator';

let evaluator;
let result;
let original;


//-- Given
//--------------------------------------------------------

given.evaluator = () => {
	evaluator = container.make(Evaluator);
};

given.emptyResult = () => {
	result = undefined;
	original = undefined;
};


//-- When
//--------------------------------------------------------

when.evaluating = (value) => {
	when.attempting(() => {
		original = value;
		result = evaluator.evaluate(value);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldBeNaN = () => {
	then.shouldNotHaveThrown();
	expect(Number.isNaN(result)).toBe(true);
};

then.resultShouldNotHaveBeenEvaluated = () => {
	then.resultShouldBe(original);
};


export default build({ given, when, then });
