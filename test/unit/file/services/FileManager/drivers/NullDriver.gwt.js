//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - Null Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import NullDriver from '../../../../../../dist/node/file/services/FileManager/drivers/NullDriver';


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


export default build({ given, when, then });
