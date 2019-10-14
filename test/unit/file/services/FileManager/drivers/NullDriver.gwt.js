//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - Null Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const NullDriver = require('../../../../../../src/file/services/FileManager/drivers/NullDriver');


//-- Given
//--------------------------------------------------------

given.currentDriver = () => {
	given.driver(NullDriver);
};

given.file = () => {
	given.fileWithExtension('null');
};

given.writeFile = () => {
	given.writeFileWithExtension('js');
};

given.currentDriverContent = () => {
	given.readContent(null);
	given.writeContent(null);
	given.parsedContent(null);
};

then.fileShouldHaveBeenWritten = () => {}; // eslint-disable-line no-empty-function


module.exports = build({ given, when, then });
