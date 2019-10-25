//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - Text Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import TextDriver from '../../../../../../dist/node/file/services/FileManager/drivers/TextDriver';


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


export default build({ given, when, then });
