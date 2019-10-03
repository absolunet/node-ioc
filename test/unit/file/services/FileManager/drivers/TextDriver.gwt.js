//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - Text Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const TextDriver = require('../../../../../../lib/file/services/FileManager/drivers/TextDriver');


//-- Given
//--------------------------------------------------------

given.currentDriver = () => {
	given.driver(TextDriver);
};

given.file = () => {
	given.fileWithExtension('txt');
};
given.writeFile = () => {
	given.writeFileWithExtension('txt');
};

given.currentDriverContent = () => {
	given.readContent(`foo: bar\n`);
	given.writeContent(`foo: bar\n`);
	given.parsedContent(`foo: bar\n`);
};


module.exports = build({ given, when, then });
