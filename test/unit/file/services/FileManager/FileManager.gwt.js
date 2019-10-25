//--------------------------------------------------------
//-- Tests - Unit - File - Services - File Manager - GWT
//--------------------------------------------------------

import gwt from '../../common.gwt';
const { given, when, then, build } = gwt;

import container   from '../../../container';
import FileManager from '../../../../../dist/node/file/services/FileManager';

let fakeFiles;
let result;
let fileManager;
let filePath;
let fileCollection;
let folderPath;
let content;
let type;


//-- Mocks
//--------------------------------------------------------

const fakeFileEngine = {
	scandir: jest.fn((path) => {
		return fakeFiles[path] || [];
	}),
	exists:  jest.fn((path) => {
		return Boolean(fakeFiles[path]);
	})
};

const driverFactory = () => {
	return {
		load:       jest.fn((path) => { return fakeFiles[path]; }),
		loadAsync:  jest.fn((path) => { return Promise.resolve(fakeFiles[path]); }),
		write:      jest.fn(),
		writeAsync: jest.fn()
	};
};
const fakeJavaScriptDriver = driverFactory();
const fakeJsonDriver = driverFactory();
const fakeYamlDriver = driverFactory();
const fakeTextDriver = driverFactory();


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.fakeFileEngine = () => {
	container.singleton('file.engine', fakeFileEngine);
	fakeFiles = {
		'/path/to': ['jsFile.js', 'jsonFile.json', 'logFile.log', 'txtFile.txt', 'yamlFile.yaml', 'ymlFile.yml'],
		'/path/to/jsFile.js': { type: 'js' },
		'/path/to/jsonFile.json': { type: 'json' },
		'/path/to/logFile.log': 'Type log',
		'/path/to/txtFile.txt': 'Type txt',
		'/path/to/yamlFile.yaml': { type: 'yaml' },
		'/path/to/ymlFile.yml': { type: 'yml' }
	};
};

given.fileManager = () => {
	fileManager = container.make(FileManager);
};

given.fakeJavaScriptDriver = () => {
	fileManager.addDriver('js', fakeJavaScriptDriver);
};

given.fakeJsonDriver = () => {
	fileManager.addDriver('json', fakeJsonDriver);
};

given.fakeYamlDriver = () => {
	fileManager.addDriver('yaml', fakeYamlDriver);
};

given.fakeTextDriver = () => {
	fileManager.addDriver('text', fakeTextDriver);
};

given.textFilePath = () => {
	filePath = '/path/to/txtFile.txt';
};

given.javaScriptFilePath = () => {
	filePath = '/path/to/jsFile.js';
};

given.jsonFilePath = () => {
	filePath = '/path/to/jsonFile.json';
};

given.yamlFilePath = () => {
	filePath = '/path/to/yamlFile.yaml';
};

given.ymlFilePath = () => {
	filePath = '/path/to/ymlFile.yml';
};

given.logFilePath = () => {
	filePath = '/path/to/logFile.log';
};

given.textFilePathCollection = () => {
	fileCollection = ['/path/to/unexisting/file.txt', '/path/to/txtFile.txt', '/path/to/other/unexisting/file.txt'];
};

given.unexistingFilePathCollection = () => {
	fileCollection = ['/path/to/unexisting/file.txt', '/path/to/other/unexisting/file.txt', '/path/to/last/unexisting/file.txt'];
};

given.folder = () => {
	folderPath = '/path/to';
};

given.writeJsonFilePath = () => {
	filePath = '/path/to/new/file.json';
};

given.jsonContent = () => {
	content = { foo: 'bar', baz: 'qux' };
};

given.fileType = () => {
	type = 'file';
};

given.folderType = () => {
	type = 'folder';
};


//-- When
//--------------------------------------------------------

when.loadingFile = () => {
	when.attempting(() => {
		result = fileManager.load(filePath);
	});
};

when.loadingFileAsynchronously = async () => {
	await when.attemptingAsync(async () => {
		result = await fileManager.loadAsync(filePath);
	});
};

when.checkingIfExists = () => {
	when.attempting(() => {
		result = fileManager.exists(filePath);
	});
};

when.gettingFirstFoundPath = () => {
	when.attempting(() => {
		result = fileManager.findFirst(fileCollection);
	});
};

when.loadingFirstFoundPath = () => {
	when.attempting(() => {
		result = fileManager.loadFirst(fileCollection);
	});
};

when.loadingFolder = () => {
	when.attempting(() => {
		result = fileManager.loadInFolder(folderPath);
	});
};

when.loadingFolderRecursively = () => {
	when.attempting(() => {
		result = fileManager.loadRecursivelyInFolder(folderPath);
	});
};

when.scanningDirectory = () => {
	when.attempting(() => {
		result = fileManager.scandir(folderPath, type);
	});
};

when.writing = () => {
	when.attempting(() => {
		result = fileManager.write(filePath, content);
	});
};

when.writingAsynchronously = async () => {
	await when.attemptingAsync(async () => {
		result = await fileManager.writeAsync(filePath, content);
	});
};


//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toStrictEqual(expected);
};

then.fileShouldHaveBeenLoadedThroughDriver = (driver) => {
	then.shouldNotHaveThrown();
	expect(driver.load).toHaveBeenCalledWith(filePath);
};

then.fileShouldHaveBeenLoadedThroughTextDriver = () => {
	then.fileShouldHaveBeenLoadedThroughDriver(fakeTextDriver);
};

then.fileShouldHaveBeenLoadedThroughJavaScriptDriver = () => {
	then.fileShouldHaveBeenLoadedThroughDriver(fakeJavaScriptDriver);
};

then.fileShouldHaveBeenLoadedThroughJsonDriver = () => {
	then.fileShouldHaveBeenLoadedThroughDriver(fakeJsonDriver);
};

then.fileShouldHaveBeenLoadedThroughYamlDriver = () => {
	then.fileShouldHaveBeenLoadedThroughDriver(fakeYamlDriver);
};

then.shouldHaveLoadedFileAsynchronouslyThroughTextDriver = () => {
	then.shouldNotHaveThrown();
	expect(fakeTextDriver.loadAsync).toHaveBeenCalledWith(filePath);
};

then.shouldHaveCheckedIfExistsThroughFileEngine = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.exists).toHaveBeenCalledWith(filePath);
};

then.shouldHaveCheckedIfAllFilesExistThroughFileEngineUntilOneFound = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.exists).toHaveBeenCalledTimes(2);
	expect(fakeFileEngine.exists).toHaveBeenNthCalledWith(1, fileCollection[0]);
	expect(fakeFileEngine.exists).toHaveBeenNthCalledWith(2, fileCollection[1]);
};

then.shouldHaveCheckedIfAllFilesExistThroughFileEngine = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.exists).toHaveBeenCalledTimes(3);
	expect(fakeFileEngine.exists).toHaveBeenNthCalledWith(1, fileCollection[0]);
	expect(fakeFileEngine.exists).toHaveBeenNthCalledWith(2, fileCollection[1]);
	expect(fakeFileEngine.exists).toHaveBeenNthCalledWith(3, fileCollection[2]);
};

then.shouldHaveReceivedFirstFoundPathInCollection = () => {
	then.resultShouldBe('/path/to/txtFile.txt');
};

then.shouldHaveReceivedFirstFoundPathContentInCollection = () => {
	then.resultShouldEqual(fakeFiles['/path/to/txtFile.txt']);
};

then.firstFoundPathShouldHaveBeenLoadedThroughTextDriver = () => {
	then.shouldNotHaveThrown();
	expect(fakeTextDriver.load).toHaveBeenCalledWith('/path/to/txtFile.txt');
};

then.allFilesInFolderShouldHaveBeenLoadedThroughAppropriateDrivers = () => {
	then.shouldNotHaveThrown();
	expect(fakeTextDriver.load).toHaveBeenCalledTimes(2);
	expect(fakeTextDriver.load).toHaveBeenNthCalledWith(1, '/path/to/logFile.log');
	expect(fakeTextDriver.load).toHaveBeenNthCalledWith(2, '/path/to/txtFile.txt');
	expect(fakeJavaScriptDriver.load).toHaveBeenCalledTimes(1);
	expect(fakeJavaScriptDriver.load).toHaveBeenCalledWith('/path/to/jsFile.js');
	expect(fakeJsonDriver.load).toHaveBeenCalledTimes(1);
	expect(fakeJsonDriver.load).toHaveBeenCalledWith('/path/to/jsonFile.json');
	expect(fakeYamlDriver.load).toHaveBeenCalledTimes(2);
	expect(fakeYamlDriver.load).toHaveBeenNthCalledWith(1, '/path/to/yamlFile.yaml');
	expect(fakeYamlDriver.load).toHaveBeenNthCalledWith(2, '/path/to/ymlFile.yml');
};

then.shouldHaveReceivedDictionaryAssociatingFileNameWithLoadedContent = () => {
	then.resultShouldEqual({
		txtFile:  'Type txt',
		logFile:  'Type log',
		jsFile:   { type: 'js' },
		jsonFile: { type: 'json' },
		ymlFile:  { type: 'yml' },
		yamlFile: { type: 'yaml' }
	});
};

then.shouldHaveScandirThroughFileEngineWithRecursiveOption = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.scandir).toHaveBeenCalled();
	expect(fakeFileEngine.scandir.mock.calls[0][2]).toMatchObject({ recursive: true });
};

then.shouldHaveReturnedScandirThroughFileEngine = () => {
	then.resultShouldEqual(fakeFileEngine.scandir.mock.results[0].value);
};

then.shouldHaveReturnedScandirThroughFileEngineWithTypeFile = () => {
	then.shouldHaveReturnedScandirThroughFileEngine();
	expect(fakeFileEngine.scandir.mock.calls[0][1]).toBe('file');
};

then.shouldHaveReturnedScandirThroughFileEngineWithTypeFolder = () => {
	then.shouldHaveReturnedScandirThroughFileEngine();
	expect(fakeFileEngine.scandir.mock.calls[0][1]).toBe('folder');
};

then.shouldHaveWrittenFileThroughJsonDriver = () => {
	then.shouldNotHaveThrown();
	expect(fakeJsonDriver.write).toHaveBeenCalledWith(filePath, content);
};

then.shouldHaveWrittenAsynchronouslyFileThroughJsonDriver = () => {
	then.shouldNotHaveThrown();
	expect(fakeJsonDriver.writeAsync).toHaveBeenCalledWith(filePath, content);
};


export default build({ given, when, then });
