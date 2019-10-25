//--------------------------------------------------------
//-- Tests - Unit - Events - Services - Dispatcher - Drivers - Common tests
//--------------------------------------------------------


export default ({ given, when, then }) => {

	beforeEach(() => {
		given.emptyPayload();
		given.cleanedEvents();
	});

	test('Can add event listener', () => {
		given.firstListener('test');
		given.secondListener('test');
		when.dispatchingFromEngine('test');
		when.dispatchingFromEngine('test');
		then.firstListenerShouldHaveBeenCalledTwice();
		then.secondListenerShouldHaveBeenCalledTwice();
	});

	test('Listeners are only executed for their assigned events', () => {
		given.firstListener('a');
		given.secondListener('b');
		when.dispatchingFromEngine('a');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.secondListenerShouldNotHaveBeenCalled();
	});

	test('Listeners receive given payload when event dispatched from engine', () => {
		given.firstListener('test');
		given.payload();
		when.dispatchingFromEngine('test');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.firstListenerShouldHaveReceivedPayload();
	});

	test('Can remove event listener', () => {
		given.firstListener('test');
		given.secondListener('test');
		when.dispatchingFromEngine('test');
		when.removingFirstListener('test');
		when.dispatchingFromEngine('test');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.secondListenerShouldHaveBeenCalledTwice();
	});

	test('Can add event listener for a single execution', () => {
		given.firstListener('test');
		given.secondListenerOnce('test');
		when.dispatchingFromEngine('test');
		when.dispatchingFromEngine('test');
		then.firstListenerShouldHaveBeenCalledTwice();
		then.secondListenerShouldHaveBeenCalledOnce();
	});

	test('Can add event listener for a single execution with payload', () => {
		given.firstListener('test');
		given.payload();
		when.dispatchingFromEngine('test');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.firstListenerShouldHaveReceivedPayload();
	});

	test('Can emit event', () => {
		given.firstListener('test');
		given.secondListener('test');
		when.dispatching('test');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.secondListenerShouldHaveBeenCalledOnce();
	});

	test('Can emit event with payload', () => {
		given.firstListener('test');
		given.payload();
		when.dispatching('test');
		then.firstListenerShouldHaveBeenCalledOnce();
		then.firstListenerShouldHaveReceivedPayload();
	});

	test('Can remove all listener for a given event', () => {
		given.firstListener('a');
		given.secondListener('b');
		when.removingListeners('a');
		when.dispatching('a');
		when.dispatching('b');
		then.firstListenerShouldNotHaveBeenCalled();
		then.secondListenerShouldHaveBeenCalledOnce();
	});

	test('Can remove all listener for all events', () => {
		given.firstListener('a');
		given.secondListener('b');
		when.removingAllListeners();
		when.dispatching('a');
		when.dispatching('b');
		then.firstListenerShouldNotHaveBeenCalled();
		then.secondListenerShouldNotHaveBeenCalled();
	});

};
