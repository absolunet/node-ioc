//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - JSON Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const JsonDriver = require('../../../../../../src/file/services/FileManager/drivers/JsonDriver');


//-- Given
//--------------------------------------------------------

given.currentDriver = () => {
	given.driver(JsonDriver);
};

given.file = () => {
	given.fileWithExtension('json');
};

given.writeFile = () => {
	given.writeFileWithExtension('json');
};

given.currentDriverContent = () => {
	given.readContent(`{"foo":"bar"}\n`);
	given.writeContent({ foo: 'bar' });
	given.parsedContent({ foo: 'bar' });
};


module.exports = build({ given, when, then });
