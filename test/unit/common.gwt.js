'use strict';

const given = {};
const when  = {};
const then  = {};

const build = (gwt) => {
	return {
		get build() { return build; },
		get given() { return { ...given, ...gwt.given || {} }; },
		get when()  { return { ...when,  ...gwt.when  || {} }; },
		get then()  { return { ...then,  ...gwt.then  || {} }; }
	};
};


let exception;

beforeEach(() => {
	jest.clearAllMocks();
	given.noError();
});


//-- Given
//--------------------------------------------------------

given.error = (error) => {
	exception = error;
};

given.noError = () => {
	given.error(null);
};


//-- When
//--------------------------------------------------------

when.attempting = (closure) => {
	try {
		closure();
	} catch (error) {
		exception = error;
	}
};

when.attemptingAsync = async (closure) => {
	try {
		await closure();
	} catch (error) {
		exception = error;
	}
};

when.waiting = async (milliseconds) => {
	await new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
};

when.waitingForNextTick = async () => {
	await when.waiting(0);
};


//-- Then
//--------------------------------------------------------

then.shouldHaveThrown = () => {
	expect(exception).toBeTruthy();
};

then.shouldNotHaveThrown = () => {
	expect(exception).toBeFalsy();
};

then.exceptionShouldBe = (expected) => {
	expect(exception).toBe(expected);
};


module.exports = build({ given: {}, when: {}, then: {} });
