//--------------------------------------------------------
//-- Tests - Unit - Cache - Services - Cache Manager - Drivers - File Driver - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('./common.gwt');

const fs         = require('fs');
const path       = require('path');
const FileDriver = require('../../../../../../dist/node/cache/services/CacheManager/drivers/FileDriver');

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


module.exports = build({ given, when, then });
