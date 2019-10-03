//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - YAML Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const YamlDriver = require('../../../../../../lib/file/services/FileManager/drivers/YamlDriver');


//-- Given
//--------------------------------------------------------

given.currentDriver = () => {
	given.driver(YamlDriver);
};

given.file = () => {
	given.fileWithExtension('yaml');
};
given.writeFile = () => {
	given.writeFileWithExtension('yaml');
};

given.currentDriverContent = () => {
	given.readContent(`foo: bar\n`);
	given.writeContent({ foo: 'bar' });
	given.parsedContent({ foo: 'bar' });
};


module.exports = build({ given, when, then });
