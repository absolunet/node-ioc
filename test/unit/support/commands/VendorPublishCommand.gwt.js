//--------------------------------------------------------
//-- Tests - Unit - Support - Commands - Vendor Publish - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import __                   from '@absolunet/private-registry';
import * as path            from 'path';
import slash                from 'slash';
import container            from '../../container';
import ServiceProvider      from '../../../../dist/node/foundation/ServiceProvider';
import VendorPublishCommand from '../../../../dist/node/support/commands/VendorPublishCommand';
import CommandRunner        from '../../../../dist/node/console/services/CommandRunner';

let command;
let commandArgv;
let commandRunner;
let questions;
let fakeFiles;
let extensionServiceProvider;
let otherServiceProvider;


//-- Mocks
//--------------------------------------------------------

const ExtensionServiceProvider = class ExtensionServiceProvider extends ServiceProvider {

	get name() {
		return 'Extension';
	}

};

const OtherServiceProvider = class OtherServiceProvider extends ServiceProvider {

	get name() {
		return 'Other';
	}

};

const deferQuestion = () => {
	const handler = {};
	const deferred = new Promise((resolve, reject) => {
		handler.resolve = resolve;
		handler.reject  = reject;
	});
	questions.push(handler);

	return deferred;
};

const fakeTerminal = {
	choice:  jest.fn(deferQuestion),
	confirm: jest.fn(deferQuestion),
	success: jest.fn(),
	print:   jest.fn(),
	spacer:  jest.fn()
};

const fakeTranslator = {
	translate: jest.fn((key, replace = {}) => {
		return `${key} ${JSON.stringify(replace)}`;
	})
};

const fakeFileSystemAsync = {
	stat: jest.fn((value) => {
		return Promise.resolve({
			isDirectory: jest.fn(() => {
				return !(/\.\w+$/u).test(value);
			})
		});
	}),
	scandir: jest.fn((folder) => {
		return Promise.resolve(Object.keys(fakeFiles).filter((fakeFile) => {
			return fakeFile.startsWith(folder);
		}));
	}),
	ensureDir:  jest.fn(() => { return Promise.resolve(); }), // eslint-disable-line unicorn/prevent-abbreviations
	copyFile:   jest.fn(() => { return Promise.resolve(); }),
	pathExists: jest.fn((folder) => {
		const paths = Object.keys(fakeFiles).filter((fakeFile) => {
			return fakeFile.startsWith(folder);
		});

		return Promise.resolve(paths.length > 0);
	})
};


//-- Given
//--------------------------------------------------------

given.vendorPublishCommand = () => {
	command = container.make(VendorPublishCommand, {
		app:      container,
		terminal: container.make('terminal')
	});
	questions = [];
};

given.noPublishedFiles = () => {
	__(ServiceProvider).get('publishable').clear();
};

given.extensionServiceProvider = () => {
	extensionServiceProvider = container.make(ExtensionServiceProvider, { app: container });
};

given.otherServiceProvider = () => {
	otherServiceProvider = container.make(OtherServiceProvider, { app: container });
};

given.emptyArgv = () => {
	commandArgv = {};
};

given.commandRunner = () => {
	commandRunner = container.make(CommandRunner);
};

given.fakeTerminal = () => {
	container.singleton('terminal', fakeTerminal);
};

given.fakeTranslator = () => {
	container.singleton('translator', fakeTranslator);
};

given.fakeFileSystemAsync = () => {
	container.singleton('file.system.async', fakeFileSystemAsync);
	fakeFiles = {};
};

given.argv = (key, value) => {
	commandArgv[key] = value;
};

given.option = (key, value) => {
	given.argv(key, value);
};

given.flag = (key, value = true) => {
	given.argv(key, Boolean(value));
};

given.providerOption = (value) => {
	given.option('provider', value);
};

given.tagOption = (value) => {
	given.option('tag', value);
};

given.allFlag = () => {
	given.flag('all');
};

given.overwriteFlag = () => {
	given.flag('overwrite');
};

given.safeFlag = () => {
	given.flag('safe');
};

given.file = (name, content) => {
	fakeFiles[name] = content;
};

given.appConfigFile = (name) => {
	given.file(`${container.configPath(name)}`, { key: name });
};

given.appTranslationsFile = (name) => {
	given.file(`${container.langPath(name)}`, { key: { en: name } });
};

given.moduleFile = (moduleName, folder, name, content) => {
	given.file(`${container.basePath(['node_modules', moduleName, 'dist', 'node', folder, name])}`, content);
};

given.extensionFile = (folder, name, content) => {
	given.moduleFile('extension', folder, name, content);
};

given.otherFile = (folder, name, content) => {
	given.moduleFile('other', folder, name, content);
};

given.extensionConfigFile = (name) => {
	given.extensionFile('config', name, { key: name });
};

given.extensionTranslationsFile = (name) => {
	given.extensionFile('resources/lang', name, { key: { en: name } });
};

given.otherConfigFile = (name) => {
	given.otherFile('config', name, { key: name });
};

given.otherTranslationsFile = (name) => {
	given.otherFile('resources/lang', name, { key: { en: name } });
};

given.publishedExtensionConfigFolder = () => {
	extensionServiceProvider.publishConfig(container.basePath(['node_modules', 'extension', 'dist', 'node', 'config']));
};

given.publishedExtensionFile = (from, to) => {
	extensionServiceProvider.publish({
		[container.basePath(['node_modules', 'extension', 'dist', from])]: container.basePath(to)
	});
};

given.publishedExtensionTranslationsFolder = () => {
	extensionServiceProvider.publishTranslations(container.basePath(['node_modules', 'extension', 'dist', 'node', 'resources', 'lang']));
};

given.publishedOtherConfigFolder = () => {
	otherServiceProvider.publishConfig(container.basePath(['node_modules', 'other', 'dist', 'node', 'config']));
};

given.publishedOtherTranslationsFolder = () => {
	otherServiceProvider.publishTranslations(container.basePath(['node_modules', 'other', 'dist', 'node', 'resources', 'lang']));
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		const argv = Object.fromEntries([
			...command.parameters.map(([name,, defaultValue]) => {
				return [name, defaultValue];
			}),
			...command.options.map(([name, defaultValue]) => {
				return [name, defaultValue];
			})
		]);
		await commandRunner.unsafeRun(command, { ...argv, ...commandArgv });
	});
};

when.answering = async (value) => {
	await new Promise(setTimeout);
	questions[questions.length - 1].resolve(value);
};


//-- Then
//--------------------------------------------------------

then.shouldNotHavePublishedAnything = () => {
	expect(fakeFileSystemAsync.ensureDir).not.toHaveBeenCalled();
	expect(fakeFileSystemAsync.copyFile).not.toHaveBeenCalled();
};

then.shouldHavePrintedThatNothingWasPublished = () => {
	then.shouldNotHaveThrown();
	expect(fakeTranslator.translate).toHaveBeenCalledWith('commands.vendor-publish.messages.empty');
	expect(fakeTerminal.print).toHaveBeenCalledWith('commands.vendor-publish.messages.empty {}');
};

then.shouldHavePublished = ({ from, to }) => {
	then.shouldNotHaveThrown();
	expect(fakeTranslator.translate).not.toHaveBeenCalledWith('commands.vendor-publish.messages.empty');
	expect(fakeTerminal.print).not.toHaveBeenCalledWith('commands.vendor-publish.messages.empty {}');

	const destinationFolder = slash(path.dirname(to));
	const relativeFrom      = path.relative(container.basePath(), from);
	const relativeTo        = path.relative(container.basePath(), to);

	const hasCalledEnsureDirectory = fakeFileSystemAsync.ensureDir.mock.calls.some(([folder]) => {
		return folder === destinationFolder;
	});
	expect(hasCalledEnsureDirectory).toBe(true);

	const hasCalledCopyFile = fakeFileSystemAsync.copyFile.mock.calls.some(([copyFrom, copyTo]) => {
		return copyFrom === from && copyTo === to;
	});
	expect(hasCalledCopyFile).toBe(true);

	const hasPrintedSuccessfulCopy = fakeTerminal.success.mock.calls.some(([value]) => {
		return value === `commands.vendor-publish.messages.success {"from":"${relativeFrom}","to":"${relativeTo}"}`;
	});
	expect(hasPrintedSuccessfulCopy).toBe(true);
};

then.shouldNotHavePublished = ({ from, to }) => {
	then.shouldNotHaveThrown();

	const relativeFrom = path.relative(container.basePath(), from);
	const relativeTo   = path.relative(container.basePath(), to);

	const hasCalledCopyFile = fakeFileSystemAsync.copyFile.mock.calls.some(([copyFrom, copyTo]) => {
		return copyFrom === from && copyTo === to;
	});
	expect(hasCalledCopyFile).toBe(false);

	const hasPrintedSuccessfulCopy = fakeTerminal.success.mock.calls.some(([value]) => {
		return value === `'commands.vendor-publish.messages.success {"from":"${relativeFrom}","to":"${relativeTo}"}`;
	});
	expect(hasPrintedSuccessfulCopy).toBe(false);
};

then.shouldHavePublishedExtensionConfigFile = (name) => {
	then.shouldHavePublished({
		from: container.basePath(['node_modules', 'extension', 'dist', 'node', 'config', name]),
		to:   container.configPath(name)
	});
};

then.shouldNotHavePublishedExtensionConfigFile = (name) => {
	then.shouldNotHavePublished({
		from: container.basePath(['node_modules', 'extension', 'dist', 'node', 'config', name]),
		to:   container.configPath(name)
	});
};

then.shouldHavePublishedExtensionTranslationsFile = (name) => {
	then.shouldHavePublished({
		from: container.basePath(['node_modules', 'extension', 'dist', 'node', 'resources', 'lang', name]),
		to:   container.langPath(name)
	});
};

then.shouldNotHavePublishedExtensionTranslationsFile = (name) => {
	then.shouldNotHavePublished({
		from: container.basePath(['node_modules', 'extension', 'dist', 'node', 'resources', 'lang', name]),
		to:   container.langPath(name)
	});
};

then.shouldHavePublishedOtherConfigFile = (name) => {
	then.shouldHavePublished({
		from: container.basePath(['node_modules', 'other', 'dist', 'node', 'config', name]),
		to:   container.configPath(name)
	});
};

then.shouldNotHavePublishedOtherConfigFile = (name) => {
	then.shouldNotHavePublished({
		from: container.basePath(['node_modules', 'other', 'dist', 'node', 'config', name]),
		to:   container.configPath(name)
	});
};

then.shouldHavePublishedOtherTranslationsFile = (name) => {
	then.shouldHavePublished({
		from: container.basePath(['node_modules', 'other', 'dist', 'node', 'resources', 'lang', name]),
		to:   container.configPath(name)
	});
};

then.shouldNotHavePublishedOtherTranslationsFile = (name) => {
	then.shouldNotHavePublished({
		from: container.basePath(['node_modules', 'other', 'dist', 'node', 'resources', 'lang', name]),
		to:   container.configPath(name)
	});
};

then.shouldNotHaveAskedConfirmation = () => {
	then.shouldNotHaveThrown();
	expect(fakeTerminal.confirm).not.toHaveBeenCalled();
};

then.shouldHaveAskedForConfigOverwrite = (name) => {
	then.shouldNotHaveThrown();
	const hasTranslatedConfigOverwriteMessage = fakeTranslator.translate.mock.calls.some(([key, replace]) => {
		return key === 'commands.vendor-publish.messages.confirm-overwrite' && replace.file === `config/${name}`;
	});
	expect(hasTranslatedConfigOverwriteMessage).toBe(true);

	const askedConfigOverwrite = fakeTerminal.confirm.mock.calls.some(([question]) => {
		return question === `commands.vendor-publish.messages.confirm-overwrite {"file":"config/${name}"}`;
	});
	expect(askedConfigOverwrite).toBe(true);
};


export default build({ given, when, then });
