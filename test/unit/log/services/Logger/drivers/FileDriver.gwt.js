//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - Drivers - File Driver - GWT
//--------------------------------------------------------

import gwt from '../../../common.gwt';
const { given, when, then, build } = gwt;

import container  from '../../../../container';
import FileDriver from '../../../../../../dist/node/log/services/Logger/drivers/FileDriver';

const filePath      = '/log/file/path.log';
const otherFilePath = '/log/other/file/path.log';

let driver;
let files;
let level;
let message;
let config;


//-- Mocks
//--------------------------------------------------------

const fakeFileEngine = {
	async: {
		ensureFile: jest.fn((file) => {
			files[file] = files[file] || '';

			return Promise.resolve();
		}),
		appendFile: jest.fn((file, content) => {
			files[file] += content;

			return Promise.resolve();
		}),
		readFile: jest.fn((file) => {
			return Promise.resolve(files[file]);
		}),
		writeFile: jest.fn((file, content) => {
			files[file] = content;

			return Promise.resolve();
		}),
		stat: jest.fn((file) => {
			return Promise.resolve({
				size: files[file].length
			});
		})
	}
};


//-- Given
//--------------------------------------------------------

given.driver = (Driver) => {
	driver      = container.make(Driver);
	({ config } = driver);
};

given.fileDriver = () => {
	given.driver(FileDriver);
};

given.config = (key, value) => {
	config[key] = value;
	driver.setConfig(config);
};

given.fakeFileEngine = () => {
	container.singleton('file.engine', fakeFileEngine);
	files = {};
};

given.fileInConfig = () => {
	given.config('path', filePath);
};

given.message = () => {
	message = 'A message to log';
};

given.level = (value) => {
	level = value;
};

given.limit = (value) => {
	given.config('limit', value);
};

given.fileOfSize = (size) => {
	files[filePath] = 'Lorem sit\n\n'.repeat(Math.ceil(size / 10));
};


//-- When
//--------------------------------------------------------

when.loggingWithLevel = async (value) => {
	await when.attemptingAsync(async () => {
		await driver.log(value, message);
	});
};

when.logging = async () => {
	await when.loggingWithLevel(level);
};

when.changingForOtherFileInConfig = () => {
	config.path = otherFilePath;
	driver.setConfig(config);
};


//-- Then
//--------------------------------------------------------

then.shouldHaveLoggedInFile = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.async.appendFile).toHaveBeenCalled();
	const call = fakeFileEngine.async.appendFile.mock.calls.find(([parameter]) => {
		return parameter === filePath;
	});
	expect(call).toBeTruthy();
};

then.shouldHaveLoggedWithLevelInFile = (value, file) => {
	then.shouldHaveLoggedInFile();
	const call = fakeFileEngine.async.appendFile.mock.calls.find(([parameter]) => {
		return parameter === file;
	});
	expect(call[0]).toBe(file);
	expect(call[1]).toMatch(new RegExp(`^${value}\\s+\\[\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\] \\[Version \\d+\\.\\d+\\.\\d+(?:-(?:alpha|beta|rc)(?:\\.\\d+))?\\]\\n\\s+${message}`, 'u'));
};

then.shouldHaveLoggedInFileWithLevel = (value) => {
	then.shouldHaveLoggedWithLevelInFile(value, filePath);
};

then.shouldHaveLoggedInOtherFileWithLevel = (value) => {
	then.shouldHaveLoggedWithLevelInFile(value, otherFilePath);
};

then.shouldNotHaveReducedFile = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.async.writeFile).not.toHaveBeenCalled();
};

then.shouldHaveReducedFileSizeUnderSize = (size) => {
	then.shouldNotHaveThrown();
	expect(fakeFileEngine.async.writeFile).toHaveBeenCalled();
	expect(files[filePath].length).toBeLessThanOrEqual(size);
};

then.fileShouldEndWithLastLog = () => {
	expect(files[filePath].endsWith(`${message}\n\n`));
};

then.shouldNotHaveCalledFileEngine = () => {
	expect(fakeFileEngine.async.appendFile).not.toHaveBeenCalled();
	expect(fakeFileEngine.async.ensureFile).not.toHaveBeenCalled();
	expect(fakeFileEngine.async.readFile).not.toHaveBeenCalled();
	expect(fakeFileEngine.async.stat).not.toHaveBeenCalled();
	expect(fakeFileEngine.async.writeFile).not.toHaveBeenCalled();
};


export default build({ given, when, then });
