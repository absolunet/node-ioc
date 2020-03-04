//--------------------------------------------------------
//-- Tests - Unit - Support - Proxies - Common tests
//--------------------------------------------------------


export default ({ given, when, then }) => {

	beforeEach(() => {
		given.emptyResult();
		given.proxiedInstance();
	});


	test('Can get a primitive', () => {
		when.gettingPrimitiveProperty();
		then.shouldHaveReceivedPrimitiveValue();
	});

	test('Can get an object', () => {
		when.gettingObjectProperty();
		then.shouldHaveReceivedObjectValue();
	});

	test('Can get a function', () => {
		when.gettingFunctionProperty();
		then.shouldHaveReceivedBoundFunction();
		then.shouldBeSameFunctionUnderneath();
	});

	test('Can get null', () => {
		when.gettingNullProperty();
		then.shouldHaveReceivedNullValue();
	});

	test('Can get undefined', () => {
		when.gettingUndefinedProperty();
		then.shouldHaveReceivedUndefined();
	});

	test('Can get unexisting property', () => {
		when.gettingPropertyThatDoesNotExist();
		then.shouldHaveReceivedUndefined();
	});

	test('Can get a prototype-less function', () => {
		when.gettingPrototypeLessFunctionProperty();
		then.shouldHaveReceivedBoundPrototypeLessFunction();
		then.shouldBeSamePrototypeLessFunctionUnderneath();
	});

};
