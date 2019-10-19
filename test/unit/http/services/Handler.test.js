//--------------------------------------------------------
//-- Tests - Unit - HTTP - Services - Handler
//--------------------------------------------------------

import gwt from './Handler.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeConfigRepository();
	given.fakeControllerRepository();
	given.fakeExceptionHandler();
	given.handler();
});


test('Can handle request with route action as closure', async () => {
	given.closureAction();
	await when.handlingRequest();
	then.closureShouldHaveBeenCalled();
	then.shouldHaveReceivedResponse(200);
});

test('Can handle request with route action as controller action', async () => {
	given.controllerAction();
	await when.handlingRequest();
	then.controllerActionShouldHaveBeenCalled();
	then.shouldHaveReceivedResponse(200);
});

test('Can handle exception with broken route action as closure', async () => {
	given.brokenClosureAction();
	await when.handlingRequest();
	then.brokenClosureShouldHaveBeenCalled();
	then.exceptionShouldHaveBeenHandled();
});

test('Can handle exception with broken route action as controller action', async () => {
	given.brokenControllerAction();
	await when.handlingRequest();
	then.brokenControllerActionShouldHaveBeenCalled();
	then.exceptionShouldHaveBeenHandled();
});

test('Exception is handled if request times out within closure', async () => {
	given.timeoutConfiguration(0.001);
	given.longClosureAction();
	await when.handlingRequest();
	then.longClosureActionShouldHaveBeenCalled();
	then.exceptionShouldHaveBeenHandled();
});

test('Exception is handled if request times out within controller action', async () => {
	given.timeoutConfiguration(0.001);
	given.longControllerAction();
	await when.handlingRequest();
	then.longControllerActionShouldHaveBeenCalled();
	then.exceptionShouldHaveBeenHandled();
});

test('Exception is handled if unexisting controller action is given', async () => {
	given.unexistingControllerAction();
	await when.handlingRequest();
	then.exceptionShouldHaveBeenHandled();
	then.controllerShouldNotHaveBeenPrepared();
});
