//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - JavaScript Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import JavaScriptDriver from '../../../../../../dist/node/file/services/FileManager/drivers/JavaScriptDriver';


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
	given.readContent(`'use strict';\n\nexport default { foo: 'bar' }\n`);
	given.writeContent(`'use strict';\n\nexport default { foo: 'bar' }\n`);
	given.parsedContent({ 'default': { foo: 'bar' } });
};


export default build({ given, when, then });
