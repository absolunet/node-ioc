//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - JavaScript Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const JavaScriptDriver = require('../../../../../../lib/file/services/FileManager/drivers/JavaScriptDriver');


//-- Given
//--------------------------------------------------------

given.currentDriver = () => {
	given.driver(JavaScriptDriver);
};

given.file = () => {
	given.fileWithExtension('js');
};
given.writeFile = () => {
	given.writeFileWithExtension('js');
};

given.currentDriverContent = () => {
	given.readContent(`'use strict';\n\nmodule.exports = { foo: 'bar' }\n`);
	given.writeContent(`'use strict';\n\nmodule.exports = { foo: 'bar' }\n`);
	given.parsedContent({ foo: 'bar' });
};


module.exports = build({ given, when, then });
