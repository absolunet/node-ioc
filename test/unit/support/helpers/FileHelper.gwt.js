//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - File Helper - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../common.gwt');

const container  = require('../../container');
const FileHelper = require('../../../../src/support/helpers/FileHelper');

let fileHelper;
let size;
let options;
let result;


//-- Given
//--------------------------------------------------------

given.fileHelper = () => {
	fileHelper = container.make(FileHelper);
};

given.emptyResult = () => {
	result = undefined;
};

given.size = (value) => {
	size = value;
};

given.options = (value) => {
	options = value;
};

given.option = (key, value) => {
	options[key] = value;
};


//-- When
//--------------------------------------------------------

when.formattingSize = () => {
	when.attempting(() => {
		result = fileHelper.formatSize(size, options);
	});
};

when.parsingSize = () => {
	when.attempting(() => {
		result = fileHelper.parseSize(size);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};


module.exports = build({ given, when, then });
