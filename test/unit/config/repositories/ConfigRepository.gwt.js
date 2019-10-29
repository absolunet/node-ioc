//--------------------------------------------------------
//-- Tests - Unit - Config - Repositories - Config Repository - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import * as path        from 'path';
import container        from '../../container';
import ConfigRepository from '../../../../dist/node/config/repositories/ConfigRepository';

let configRepository;
let result;
let folder;
let file;

const folderPath               = path.join('folder', 'app', 'config');
const otherFolderPath          = path.join('folder', 'other', 'config');
const folderInOtherFolderPath  = path.join('folder', 'other', 'config', 'folder');
const unexistingFolerPath      = path.join('folder', 'unexisting', 'folder');
const emptyFolderPath          = path.join('folder', 'empty', 'folder');

const configFilePath           = path.join('file', 'config', 'file.yaml');
const unexistingConfigFilePath = path.join('file', 'unexisting', 'config', 'file.yaml');
const emptyConfigFilePath      = path.join('file', 'empty', 'config', 'file.yaml');


//-- Mocks
//--------------------------------------------------------

const files = {};

const fakeConfigGrammar = {
	format: jest.fn((value) => { return value; })
};

const nullFileManager = {
	scandir: jest.fn(() => {
		return [];
	})
};

const fakeFileManager = {
	scandir: jest.fn((directory) => {
		return Object.keys(files).filter((filePath) => {
			return filePath.startsWith(directory);
		}).map((filePath) => {
			return path.relative(directory, filePath);
		});
	}),
	load: jest.fn((filePath) => {
		return files[filePath];
	}),
	loadFirst: jest.fn((paths) => {
		const firstPath = paths.find((filePath) => {
			return Object.prototype.hasOwnProperty.call(files, filePath);
		});

		return firstPath ? files[firstPath] : null;
	})
};


//-- Given
//--------------------------------------------------------

given.configRepository = () => {
	configRepository = container.make(ConfigRepository);
};

given.emptyConfigRepository = () => {
	configRepository = undefined;
};

given.fakeConfigGrammar = () => {
	container.singleton('config.grammar', fakeConfigGrammar);
};

given.fileManager = (fileManager) => {
	container.singleton('file', fileManager);
};

given.nullFileManager = () => {
	given.fileManager(nullFileManager);
};

given.fakeFileManager = () => {
	given.fileManager(fakeFileManager);
};

given.emptyConfig = () => {
	Object.keys(files).forEach((key) => {
		delete files[key];
	});
};

given.config = (config, configFolderPath = folder) => {
	Object.keys(config).forEach((key) => {
		files[path.join(configFolderPath, `${key}.yaml`)] = config[key];
	});
};

given.folder = (value) => {
	folder = value;
	container.configurePaths({ config: folder });
};

given.mainFolder = () => {
	given.folder(folderPath);
};

given.otherFolder = () => {
	given.folder(otherFolderPath);
};

given.unexistingFolder = () => {
	given.folder(unexistingFolerPath);
};

given.emptyFolder = () => {
	given.folder(emptyFolderPath);
};

given.folderInOtherFolder = () => {
	given.folder(folderInOtherFolderPath);
};

given.configInOtherFolder = (config) => {
	given.config(config, otherFolderPath);
};

given.configInFolderInsideOtherFolder = (config) => {
	Object.keys(config).forEach((key) => {
		given.config({ [`folder/${key}`]: config[key] }, otherFolderPath);
	});
};

given.file = (value) => {
	file = value;
};

given.configFile = () => {
	given.file(configFilePath);
	files[file] = { single: { config: { file: 'value' } } };
};

given.unexistingConfigFile = () => {
	given.file(unexistingConfigFilePath);
	delete files[file];
};

given.emptyConfigFile = () => {
	given.file(emptyConfigFilePath);
	files[file] = undefined;
};


//-- When
//--------------------------------------------------------

when.gettingConfig = (...parameters) => {
	when.attempting(() => {
		given.configRepository();
		result = configRepository.get(...parameters);
	});
};

when.gettingAllConfig = () => {
	when.gettingConfig();
};

when.settingConfig = (...parameters) => {
	when.attempting(() => {
		given.configRepository();
		configRepository.set(...parameters);
	});
};

when.loadingFolder = () => {
	when.attempting(() => {
		given.configRepository();
		configRepository.loadConfigFromFolder(folder);
	});
};

when.loadingFile = () => {
	when.attempting(() => {
		given.configRepository();
		configRepository.setConfigFromFile(file);
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

then.configShouldEqual = (expected) => {
	then.shouldNotHaveThrown();
	expect(configRepository.get()).toStrictEqual(expected);
};

then.shouldHaveEmptyObject = () => {
	then.resultShouldEqual({});
};

then.formatShouldHaveBeenCalledOnGrammar = () => {
	then.shouldNotHaveThrown();
	expect(fakeConfigGrammar.format).toHaveBeenCalled();
};

then.shouldHaveReadFilesInConfigFolder = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.scandir).toHaveBeenCalled();
	const { calls } = fakeFileManager.scandir.mock;
	expect(calls[calls.length - 1][0]).toBe(folder);
	const configFiles = Object.keys(files).filter((filePath) => {
		return filePath.startsWith(folder);
	});
	const allLoaded = configFiles.every((filePath) => {
		return fakeFileManager.load.mock.calls.some(([parameter]) => {
			return parameter === filePath;
		});
	});
	expect(fakeFileManager.load).toHaveBeenCalledTimes(configFiles.length);
	expect(allLoaded).toBe(true);
};

then.configShouldEqualConfigFile = () => {
	then.shouldNotHaveThrown();
	expect(configRepository.get()).toStrictEqual(files[file]);
};

then.shouldHaveLoadedFilesRecursively = () => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.scandir).toHaveBeenCalled();
	const { calls } = fakeFileManager.scandir.mock;
	expect(calls[calls.length - 1][1]).toBe('file');
	expect(calls[calls.length - 1][2]).toMatchObject({ recursive: true });
};


export default build({ given, when, then });
