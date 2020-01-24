//--------------------------------------------------------
//-- Tests - Unit - Cache - Commands - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container              from '../../container';
import ConsoleServiceProvider from '../../../../dist/node/console/ConsoleServiceProvider';

let runner;
let command;
let argv;


//-- Mocks
//--------------------------------------------------------

const fakeCacheManagerDriver = {
	'flush':  jest.fn(() => { return Promise.resolve(); }),
	'delete': jest.fn(() => { return Promise.resolve(); })
};
const fakeCacheManager = { resolve: jest.fn(() => { return fakeCacheManagerDriver; }) };
const fakeTerminal     = { println: jest.fn() };


//-- Given
//--------------------------------------------------------

const { providersAndDependencies } = given;

given.providersAndDependencies = () => {
	providersAndDependencies();
	container.register(ConsoleServiceProvider);
};
given.runner = () => {
	runner = container.make('command.runner');
};

given.command = (Command, dependencies = {}) => {
	command = container.make(Command, {
		app:      container,
		terminal: fakeTerminal,
		...dependencies
	});
	given.argument('_', command.name.split(' '));
};

given.fakeCacheConfig = () =>  {
	given.config('cache', {
		'default': 'test',
		'stores': {
			test: {
				driver: 'test'
			},
			foo: {
				driver: 'bar'
			}
		}
	});
};

given.fakeCacheManager = () => {
	container.singleton('cache', fakeCacheManager);
};

given.emptyArgv = () => {
	argv = {};
};

given.argument = (name, value) => {
	argv[name] = value;
};

given.parameter = (name, value) => {
	given.argument(name, value);
};

given.option = (name, value) => {
	given.argument(name, value);
};

given.flag = (name) => {
	given.option(name, true);
};

given.alternateStoreAsParameter = () => {
	given.parameter('store', 'foo');
};


//-- When
//--------------------------------------------------------

when.runningCommand = async () => {
	await when.attemptingAsync(async () => {
		await runner.run(command, argv);
	});
};

when.preprocessingCommand = async () => {
	await when.attemptingAsync(async () => {
		await runner.runPreprocess(command, argv);
	});
};


//-- Then
//--------------------------------------------------------

then.shouldHaveCalledResolveOnCacheManagerWith = (store) => {
	then.shouldNotHaveThrown();
	expect(fakeCacheManager.resolve).toHaveBeenCalledTimes(1);
	expect(fakeCacheManager.resolve).toHaveBeenCalledWith(store);
};

then.shouldHaveCalledFlush = () => {
	then.shouldNotHaveThrown();
	expect(fakeCacheManagerDriver.flush).toHaveBeenCalledTimes(1);
};

then.storeShouldHaveDeletedKey = (key) => {
	then.shouldNotHaveThrown();
	expect(fakeCacheManagerDriver.delete).toHaveBeenCalledTimes(1);
	expect(fakeCacheManagerDriver.delete).toHaveBeenCalledWith(key);
};

then.parameterIsRequired = (parameter) => {
	const parameterModel = command.args.parameters.find(({ name }) => { return name === parameter; });
	expect(parameterModel).toBeTruthy();
	expect(parameterModel.required).toBe(true);
};


export default build({ given, when, then });
