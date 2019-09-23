//--------------------------------------------------------
//-- Tests - Unit - Log - Services - Logger
//--------------------------------------------------------
'use strict';

const { given, when, then } = require('./Logger.gwt');


beforeEach(() => {
	given.providersAndDependencies();
	given.bootedContainer();
	given.fakeConfigRepository();
	given.logger();
	given.emptyLevel();
	given.emptyMessage();
	given.emptyContext();
});


describe('Methods', () => {

	beforeEach(() => {
		given.fakeChannelAsDefault();
		given.fakeDriver();
		given.otherFakeChannelAsFallback();
		given.otherFakeDriver();
	});


	['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'].forEach((method, index) => {

		test(`Can call "${method}" with message and delegate handling to the driver`, async () => {
			given.level(index);
			given.message();
			await when.calling(method);
			then.shouldHaveCalledLogOnFakeDriverWithLevelAndMessage(index, 'A message');
			then.shouldNotHaveCalledLogOnOtherFakeDriver();
		});

		test(`Can call "${method}" with message and context and delegate handling to the driver`, async () => {
			given.level(index);
			given.message();
			given.context();
			await when.calling(method);
			then.shouldHaveCalledLogOnFakeDriverWithLevelMessageAndContext();
			then.shouldNotHaveCalledLogOnOtherFakeDriver();
		});

	});

	test('Can call "log" with level and message and delegate handling to the driver', async () => {
		given.level(3);
		given.message();
		await when.callingLog();
		then.shouldHaveCalledLogOnFakeDriverWithLevelAndMessage();
	});

	test('Can call "log" with level, message and context and delegate handling to the driver', async () => {
		given.level(3);
		given.message();
		given.context();
		await when.callingLog();
		then.shouldHaveCalledLogOnFakeDriverWithLevelMessageAndContext();
	});

});

test('Can log with a specified channel', async () => {
	given.fakeChannelAsDefault();
	given.fakeDriver();
	given.otherFakeChannel();
	given.otherFakeDriver();
	given.level(3);
	given.message();
	await when.callingLogWithChannel('other_fake');
	then.shouldHaveCalledLogOnOtherDriverWithLevelAndMessage();
});

test('Fallbacks to a safe channel if an error occurs', async () => {
	given.fakeChannelAsFallback();
	given.fakeDriver();
	given.brokenChannelAsDefault();
	given.brokenDriver();
	given.level(3);
	given.message();
	await when.callingLogWithChannel('broken');
	then.shouldHaveCalledLogOnFakeDriverForError();
	then.shouldHaveCalledLogOnFakeDriverWithLevelAndMessage();
});

test('Does not throws if the channel does not exists', async () => {
	await when.callingLogWithChannel('unexisting');
	then.shouldNotHaveThrown();
});

test('Does not throws if the channel does not have a valid driver', async () => {
	given.channel('unexisting');
	await when.callingLogWithChannel('unexisting');
	then.shouldNotHaveThrown();
});

test('Does not throws if both the channel and the fallback channel throw', async () => {
	given.brokenChannelAsFallback();
	given.brokenChannelAsDefault();
	given.brokenDriver();
	given.level(3);
	given.message();
	await when.callingLog();
	then.shouldNotHaveThrown();
});

test('Does not log if the level is under the configured channel threshold', async () => {
	given.fakeChannelAsDefault();
	given.fakeDriver();
	given.thresholdForDefaultChannel(4);
	given.level(3);
	given.message();
	await when.callingLog();
	then.shouldNotHaveCalledLogOnFakeDriver();
});

test('Logs if the level is above the configured channel threshold', async () => {
	given.fakeChannelAsDefault();
	given.fakeDriver();
	given.thresholdForDefaultChannel(2);
	given.level(3);
	given.message();
	await when.callingLog();
	then.shouldHaveCalledLogOnFakeDriverWithLevelAndMessage();
});
