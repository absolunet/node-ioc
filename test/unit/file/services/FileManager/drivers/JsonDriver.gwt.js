//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - JSON Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import JsonDriver from '../../../../../../dist/node/file/services/FileManager/drivers/JsonDriver';


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


export default build({ given, when, then });
