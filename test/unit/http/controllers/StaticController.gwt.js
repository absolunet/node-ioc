//--------------------------------------------------------
//-- Tests - Unit - HTTP - Controllers - Static Controller - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container = require('../../container');
const StaticController = require('../../../../lib/http/controllers/StaticController');

let staticController;
let folderPath;
let filePath;


//-- Mocks
//--------------------------------------------------------

const fakeRequest  = {
	get params() {
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
	then.shouldNotHaveThrown();
	expect(fakeResponse.status).toHaveBeenCalledWith(status);
};


module.exports = build({ given, when, then });
