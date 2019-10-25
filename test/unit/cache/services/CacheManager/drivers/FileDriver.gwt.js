//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - File Driver - GWT
//--------------------------------------------------------

import gwt from './common.gwt';
const { given, when, then, build } = gwt;

import * as fs    from 'fs';
import * as path  from 'path';
import FileDriver from '../../../../../../dist/node/cache/services/CacheManager/drivers/FileDriver';

const fileDriverCacheFolderPath = path.join(__dirname, '..', '..', '..', 'stubs', 'data');
const fileDriverCacheFilePath   = path.join(fileDriverCacheFolderPath, 'test.json');


//-- Given
//--------------------------------------------------------

given.fileDriver = (parameters) => {
	given.driver(FileDriver, {
		file: fileDriverCacheFilePath,
		...parameters
	});
};

given.existingCacheDirectory = () => {
	if (!fs.existsSync(fileDriverCacheFolderPath)) {
		fs.mkdirSync(fileDriverCacheFolderPath);
	}
};


//-- Then
//--------------------------------------------------------

then.removeCacheFile = () => {
	if (fs.existsSync(fileDriverCacheFilePath)) {
		fs.unlinkSync(fileDriverCacheFilePath);
	}
};

then.removeCacheDirectory = () => {
	if (fs.existsSync(fileDriverCacheFolderPath)) {
		fs.rmdirSync(fileDriverCacheFolderPath);
	}
};


export default build({ given, when, then });
