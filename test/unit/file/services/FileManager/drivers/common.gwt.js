//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../../common.gwt');

const fs        = require('fs');
const path      = require('path');
const container = require('../../../../container');

const readingPath = path.join(__dirname, '..', '..', '..', 'stubs', 'files');
const writingPath = path.join(__dirname, '..', '..', '..', 'stubs', 'write');

let driver;
let result;
let filePath;
let readContent;
let writeContent;
let expectedContent;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.driver = (Driver) => {
	driver = container.make(Driver);
};

given.fileWithExtension = (extension) => {
	filePath = path.join(readingPath, `file.${extension}`);
};

given.writeFileWithExtension = (extension) => {
	filePath = path.join(writingPath, `file.${extension}`);
};

given.readContent = (value) => {
	readContent = value;
};

given.writeContent = (value) => {
	writeContent = value;
};

given.parsedContent = (value) => {
	expectedContent = value;
};

//-- When
//--------------------------------------------------------

when.loadingFile = () => {
	when.attempting(() => {
		result = driver.load(filePath);
	});
};

when.loadingFileAsynchronously = async () => {
	await when.attemptingAsync(async () => {
		result = await driver.loadAsync(filePath);
	});
};

when.writingFile = () => {
	when.attempting(() => {
		driver.write(filePath, writeContent);
	});
};

when.writingFileAsynchronously = async () => {
	await when.attemptingAsync(async () => {
		await driver.writeAsync(filePath, writeContent);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.deleteWrittenFile = () => {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
};

then.fileShouldHaveBeenLoaded = () => {
	then.resultShouldEqual(expectedContent);
};

then.fileShouldHaveBeenWritten = () => {
	then.shouldNotHaveThrown();
	expect(fs.readFileSync(filePath, { encoding: 'utf8' })).toBe(readContent);
};



module.exports = build({ given, when, then });
