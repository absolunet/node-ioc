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
	expect((exception || {}).stack).toBeFalsy();
};

then.exceptionShould = (exceptionTest) => {
	exceptionTest(exception);
};

then.exceptionShouldBe = (expected) => {
	expect(exception.message).toBe(expected);
};

then.exceptionShouldMatch = (expected) => {
	expect(exception.message).toMatch(expected);
};

then.exceptionShouldBeInstanceOf = (expected) => {
	expect(exception).toBeInstanceOf(expected);
};

then.exceptionShouldHaveName = (expected) => {
	expect(exception.name).toBe(expected);
};


export default build({ given: {}, when: {}, then: {} });
