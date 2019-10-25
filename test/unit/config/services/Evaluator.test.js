//--------------------------------------------------------
//-- Tests - Unit - Config - Services - Evaluator
//--------------------------------------------------------

import gwt from './Evaluator.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.evaluator();
});


test('Evaluates true as true', () => {
	when.evaluating(true);
	then.resultShouldBe(true);
});

test('Evaluates false as false', () => {
	when.evaluating(false);
	then.resultShouldBe(false);
});

test('Evaluates "true" as true', () => {
	when.evaluating('true');
	then.resultShouldBe(true);
});

test('Evaluates "TRUE" as "TRUE', () => {
	when.evaluating('TRUE');
	then.resultShouldBe('TRUE');
});

test('Evaluates "false" as false', () => {
	when.evaluating('false');
	then.resultShouldBe(false);
});

test('Evaluates "FALSE" as "FALSE"', () => {
	when.evaluating('FALSE');
	then.resultShouldBe('FALSE');
});

test('Evaluates null as null', () => {
	when.evaluating(null);
	then.resultShouldBe(null);
});

test('Evaluates "null" as null', () => {
	when.evaluating('null');
	then.resultShouldBe(null);
});

test('Evaluates undefined as null', () => {
	when.evaluating(undefined);
	then.resultShouldBe(null);
});

test('Evaluates "undefined" as null', () => {
	when.evaluating('undefined');
	then.resultShouldBe(null);
});

test('Evaluates empty string as empty string', () => {
	when.evaluating('');
	then.resultShouldBe('');
});

test('Evaluates 1 as 1', () => {
	when.evaluating(1);
	then.resultShouldBe(1);
});

test('Evaluates "1" as 1', () => {
	when.evaluating('1');
	then.resultShouldBe(1);
});

test('Evaluates -1 as -1', () => {
	when.evaluating(-1);
	then.resultShouldBe(-1);
});

test('Evaluates "-1" as -1', () => {
	when.evaluating('-1');
	then.resultShouldBe(-1);
});

test('Evaluates 1.234 as 1.234', () => {
	when.evaluating(1.234);
	then.resultShouldBe(1.234);
});

test('Evaluates "1.234" as 1.234', () => {
	when.evaluating('1.234');
	then.resultShouldBe(1.234);
});

test('Evaluates NaN as NaN', () => {
	when.evaluating(NaN);
	then.resultShouldBeNaN();
});

test('Evaluates "NaN" as NaN', () => {
	when.evaluating('NaN');
	then.resultShouldBeNaN();
});

test('Evaluates plain string as string', () => {
	when.evaluating('some string');
	then.resultShouldBe('some string');
});

test('Does not evaluate array', () => {
	when.evaluating([]);
	then.resultShouldNotHaveBeenEvaluated();
});

test('Does not evaluate object', () => {
	when.evaluating({});
	then.resultShouldNotHaveBeenEvaluated();
});

test('Does not evaluate function', () => {
	when.evaluating(() => {}); // eslint-disable-line no-empty-function
	then.resultShouldNotHaveBeenEvaluated();
});
