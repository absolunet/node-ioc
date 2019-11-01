//--------------------------------------------------------
//-- Tests - Unit - Test - Repositories - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container from '../../container';

const basePath   = '/base/test/path';
const customPath = '/custom/test/path';

let result;
let testRepository;
let testCaseInstance;
let fakeFiles;
let filePath;
let methodName;


//-- Mocks
//--------------------------------------------------------

const fakeFileManager = {
	scandir: jest.fn((path) => {
		return Object.keys(fakeFiles).filter((fakeFilePath) => {
			return fakeFilePath.startsWith(path);
		});
	})
};


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.emptyTestCaseInstance = () => {
	testCaseInstance = undefined;
};

given.emptyFilePath = () => {
	filePath = undefined;
};

given.fakeFileManager = () => {
	container.singleton('file', fakeFileManager);
	fakeFiles = {};
};

given.repository = (Repository) => {
	testRepository = container.make(Repository);
	testRepository.reset();
};

given.fakeTestPath = () => {
	container.configurePaths({ test: basePath });
};

given.customBasePath = () => {
	testRepository.setBasePath(customPath);
};

given.customFilePattern = (pattern) => {
	testRepository.setPattern(pattern);
};

given.fileInFakeTestPath = (file) => {
	const fullName = `${basePath}/${file}`;
	const concrete = {};
	container.bind(fullName, concrete);
	fakeFiles[fullName] = concrete;
};

given.fileFromTestPath = (file) => {
	filePath = `/base/test/path/${file}`;
};

given.testCaseInstance = () => {
	testCaseInstance = {
		testFooBar: jest.fn(),
		testBazQux: jest.fn(),
		givenFoo: jest.fn(),
		givenTest: jest.fn(),
		givenTestBar: jest.fn()
	};
};

given.methodName = (name) => {
	methodName = name;
};


//-- When
//--------------------------------------------------------

when.gettingFiles = () => {
	when.attempting(() => {
		result = testRepository.getFiles();
	});
};

when.gettingAll = () => {
	when.attempting(() => {
		result = testRepository.all();
	});
};

when.gettingFromNamespace = (namespace) => {
	when.attempting(() => {
		result = testRepository.fromNamespace(namespace);
	});
};

when.gettingNamespaceFromFile = () => {
	when.attempting(() => {
		result = testRepository.getNamespaceFromFile(filePath);
	});
};

when.gettingFormattedNamespaceFromFile = () => {
	when.attempting(() => {
		result = testRepository.getFormattedNamespaceFromFile(filePath);
	});
};

when.gettingFormattedNameFromFile = () => {
	when.attempting(() => {
		result = testRepository.getFormattedNameFromFile(filePath);
	});
};

when.gettingAllTestMethods = () => {
	when.attempting(() => {
		result = testRepository.getTestMethods(testCaseInstance);
	});
};

when.gettingAllMethods = () => {
	when.attempting(() => {
		result = testRepository.getMethods(testCaseInstance);
	});
};

when.gettingFormattedDescription = () => {
	when.attempting(() => {
		result = testRepository.getFormattedDescription(methodName);
	});
};

when.gettingScope = () => {
	when.attempting(() => {
		result = testRepository.scope;
	});
};

//-- Then
//--------------------------------------------------------

then.resultShouldBe = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toBe(expected);
};

then.resultShouldMatchObject = (expected) => {
	then.shouldNotHaveThrown();
	expect(result).toMatchObject(expected);
};

then.shouldHaveSearchedInPath = (path) => {
	then.shouldNotHaveThrown();
	expect(fakeFileManager.scandir).toHaveBeenCalledWith(path, 'file', { fullPath: true, recursive: true });
};

then.shouldHaveSearchedInFakeTestPath = () => {
	then.shouldHaveSearchedInPath(basePath);
};

then.shouldHaveSearchedInCustomBasePath = () => {
	then.shouldHaveSearchedInPath(customPath);
};

then.shouldHaveReceivedFilesNamed = (files) => {
	then.shouldNotHaveThrown();
	expect(result).toHaveLength(files.length);
	const hasReceivedEveryFiles = files.every((file) => {
		return result.find((fileInResult) => {
			return fileInResult.endsWith(file);
		});
	});
	expect(hasReceivedEveryFiles).toBe(true);
};

then.shouldHaveReceivedFileObjectsNamed = (files) => {
	then.shouldNotHaveThrown();
	expect(result).toHaveLength(files.length);
	const hasReceivedEveryFiles = files.every((file) => {
		return result.find(({ file: fileInResult }) => {
			return fileInResult.endsWith(file);
		});
	});
	expect(hasReceivedEveryFiles).toBe(true);
};

then.shouldHaveReceivedTestCaseInstanceTestMethodNamesOnly = () => {
	then.resultShouldMatchObject(['testBazQux', 'testFooBar']);
};

then.shouldHaveReceivedTestCaseInstanceMethodNames = () => {
	then.resultShouldMatchObject(['givenFoo', 'givenTest', 'givenTestBar', 'testBazQux', 'testFooBar']);
};


export default build({ given, when, then });
