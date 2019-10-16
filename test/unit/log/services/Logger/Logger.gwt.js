//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger - GWT
//--------------------------------------------------------
'use strict';

const { given, when, then, build } = require('../../common.gwt');

const container = require('../../../container');
const Logger    = require('../../../../../dist/node/log/services/Logger');

let logger;
let level;
let message;
let context;
let fakeConfig;


//-- Mocks
//--------------------------------------------------------

const fakeConfigRepository = {
	get: jest.fn((key, defaultValue) => {
		return fakeConfig[key] || defaultValue;
	})
};

const fakeDriver      = { setConfig: jest.fn(), log: jest.fn() };
const otherFakeDriver = { setConfig: jest.fn(), log: jest.fn() };
const brokenDriver    = { setConfig: jest.fn(), log: jest.fn(() => { throw new TypeError('An error occurred...'); }) };


//-- Given
//--------------------------------------------------------

given.logger = () => {
	logger = container.make(Logger);
};

given.emptyLevel = () => {
	level = undefined;
};

given.emptyMessage = () => {
	message = undefined;
};

given.emptyContext = () => {
	context = undefined;
};

given.fakeConfigRepository = () => {
	container.singleton('config', fakeConfigRepository);
	fakeConfig = {};
};

given.driver = (name, driver) => {
	logger.addDriver(name, driver);
};

given.fakeDriver = () => {
	given.driver('fake', fakeDriver);
};

given.otherFakeDriver = () => {
	given.driver('other_fake', otherFakeDriver);
};

given.brokenDriver = () => {
	given.driver('broken', brokenDriver);
};

given.channel = (name) => {
	fakeConfig[`logging.channels.${name}`] = {
		driver: name
	};
};

given.defaultChannel = (name) => {
	fakeConfig['logging.default'] = name;
};

given.fallbackChannel = (name) => {
	logger.setFallbackChannel(name);
};

given.fakeChannel = () => {
	given.channel('fake');
};

given.fakeChannelAsDefault = () => {
	given.fakeChannel();
	given.defaultChannel('fake');
};

given.fakeChannelAsFallback = () => {
	given.fakeChannel();
	given.fallbackChannel('fake');
};

given.otherFakeChannel = () => {
	given.channel('other_fake');
};

given.otherFakeChannelAsFallback = () => {
	given.otherFakeChannel();
	given.fallbackChannel('other_fake');
};

given.brokenChannel = () => {
	given.channel('broken');
};

given.brokenChannelAsDefault = () => {
	given.brokenChannel();
	given.defaultChannel('broken');
};

given.brokenChannelAsFallback = () => {
	given.brokenChannel();
	given.fallbackChannel('broken');
};

given.level = (value) => {
	level = value;
};

given.message = () => {
	message = 'This is a message';
};

given.context = () => {
	context = { foo: 'bar' };
};

given.thresholdForDefaultChannel = (value) => {
	const defaultChannel = fakeConfig['logging.default'];
	fakeConfig[`logging.channels.${defaultChannel}`].level = value;
};


//-- When
//--------------------------------------------------------

when.callingWithArguments = async (method, parameters) => {
	await when.attemptingAsync(async () => {
		await logger[method](...parameters);
	});
};

when.calling = async (method) => {
	await when.callingWithArguments(method, [message, context]);
};

when.callingLog = async () => {
	await when.callingWithArguments('log', [level, message, context]);
};

when.callingLogWithChannel = async (channel) => {
	await when.callingWithArguments('logWithChannel', [channel, level, message, context]);
};


//-- Then
//--------------------------------------------------------

then.shouldNotHaveCalledLogOnDriver = (driver) => {
	then.shouldNotHaveThrown();
	expect(driver.log).not.toHaveBeenCalled();
};

then.shouldHaveCalledLogOnDriverWith = (driver, parameters) => {
	then.shouldNotHaveThrown();
	expect(driver.log).toHaveBeenCalled();
	expect(driver.log).toHaveBeenCalledWith(...parameters);
};

then.shouldNotHaveCalledLogOnFakeDriver = () => {
	then.shouldNotHaveCalledLogOnDriver(fakeDriver);
};

then.shouldHaveCalledLogOnFakeDriverWith = (...parameters) => {
	then.shouldHaveCalledLogOnDriverWith(fakeDriver, parameters);
};

then.shouldHaveCalledLogOnFakeDriverWithLevelAndMessage = () => {
	then.shouldHaveCalledLogOnFakeDriverWith(level, message, undefined);
};

then.shouldHaveCalledLogOnFakeDriverWithLevelMessageAndContext = () => {
	then.shouldHaveCalledLogOnFakeDriverWith(level, message, context);
};

then.shouldHaveCalledLogOnFakeDriverForError = () => {
	const { calls } = fakeDriver.log.mock;
	const errorMessage = `Error thrown while logging: "An error occurred...". Switching to [fake] channel.`;
	then.shouldNotHaveThrown();
	expect(calls.length).toBeGreaterThanOrEqual(2);
	expect(calls[calls.length - 2]).toMatchObject([4, errorMessage, undefined]);
};

then.shouldNotHaveCalledLogOnOtherFakeDriver = () => {
	then.shouldNotHaveCalledLogOnDriver(otherFakeDriver);
};

then.shouldHaveCalledLogOnOtherFakeDriverWith = (...parameters) => {
	then.shouldHaveCalledLogOnDriverWith(otherFakeDriver, parameters);
};

then.shouldHaveCalledLogOnOtherDriverWithLevelAndMessage = () => {
	then.shouldHaveCalledLogOnOtherFakeDriverWith(level, message, undefined);
};


module.exports = build({ given, when, then });
