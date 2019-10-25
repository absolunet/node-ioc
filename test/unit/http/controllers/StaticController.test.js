//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Static Controller
//--------------------------------------------------------

import gwt from './StaticController.gwt';
const { given, when, then } = gwt;


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeFileManager();
	given.staticController();
});


test('Sends file response based on given folder and received file from request parameters', () => {
	given.existingFolder();
	given.existingFileInRequest();
	when.handling();
	then.shouldHaveSentFileResponse();
});

test('Send a not found response if file does not exists', () => {
	given.existingFolder();
	given.unexistingFileInRequest();
	when.handling();
	then.shouldHaveThrownNotFoundHttpError();
});
