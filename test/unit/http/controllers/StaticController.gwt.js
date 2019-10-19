//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Static Controller - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container         from '../../container';
import StaticController  from '../../../../dist/node/http/controllers/StaticController';

let staticController;
let folderPath;
let filePath;


//-- Mocks
//--------------------------------------------------------

const fakeRequest  = {
	get params() { // eslint-disable-line unicorn/prevent-abbreviations
		return {
			file: filePath
		};
	}
};

const fakeResponse = {
	sendFile: jest.fn(() => { return fakeResponse; }),
	status:   jest.fn(() => { return fakeResponse; })
};

const fakeFileManager = {
	exists: jest.fn((fullPath) =>  {
		return !(/unexisting/u).test(fullPath);
	})
};


//-- Given
//--------------------------------------------------------

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
};

given.staticController = () => {
	staticController = container.make(StaticController);
	staticController.prepareHandling(container, fakeRequest, fakeResponse);
	filePath  = undefined;
	folderPath = undefined;
};

given.existingFolder = () => {
	folderPath = '/path/to/folder';
};

given.existingFileInRequest = () => {
	filePath = 'file.txt';
};

given.unexistingFileInRequest = () => {
	filePath = 'unexistingFile.txt';
};


//-- When
//--------------------------------------------------------

when.handling = () => {
	when.attempting(() => {
		staticController.handle({ folder: folderPath });
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveSentFileResponse = () => {
	then.shouldNotHaveThrown();
	expect(fakeResponse.sendFile).toHaveBeenCalledWith(container.formatPath(folderPath, filePath));
};

then.shouldHaveReceivedStatus = (status) => {
	expect(fakeResponse.status).toHaveBeenCalledWith(status);
};

then.shouldHaveThrownNotFoundHttpError = () => {
	then.shouldHaveThrown();
	then.exceptionShouldHaveName('NotFoundHttpError');
	then.shouldHaveReceivedStatus(404);
};


export default build({ given, when, then });
