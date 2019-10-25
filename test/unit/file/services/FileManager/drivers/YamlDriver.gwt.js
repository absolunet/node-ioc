//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - Drivers - YAML Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import YamlDriver from '../../../../../../dist/node/file/services/FileManager/drivers/YamlDriver';


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


export default build({ given, when, then });
