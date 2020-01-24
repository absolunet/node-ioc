//--------------------------------------------------------
//-- Node IoC - Support - Command - Vendor Publish
//--------------------------------------------------------

import __              from '@absolunet/private-registry';
import Command         from '../../console/Command';
import ServiceProvider from '../../foundation/ServiceProvider';


/**
 * Command that publishes extensions publishable files.
 *
 * @memberof support.commands
 * @augments console.Command
 * @hideconstructor
 */
class VendorPublishCommand extends Command {

	/**
	 * Class dependencies: <code>['file.system.async', 'helper.path']</code>.
	 *
	 * @type {Array<string>}
	 */
	static get dependencies() {
		return ['file.system.async', 'helper.path'];
	}

	/**
	 * @inheritdoc
	 */
	get policies() {
		return ['env:local'];
	}

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'vendor:publish';
	}

	/**
	 * @inheritdoc
	 */
	get description() {
		return this.t('commands.vendor-publish.description');
	}

	/**
	 * @inheritdoc
	 */
	get options() {
		return [
			['provider', null, this.t('commands.vendor-publish.options.provider')],
			['tag',      null, this.t('commands.vendor-publish.options.tag')]
		];
	}

	/**
	 * @inheritdoc
	 */
	get flags() {
		return [
			['all',       this.t('commands.vendor-publish.flags.all')],
			['overwrite', this.t('commands.vendor-publish.flags.overwrite')],
			['safe',      this.t('commands.vendor-publish.flags.safe')]
		];
	}

	/**
	 * @inheritdoc
	 */
	async handle() {
		const published = [];
		__(this).set('published',    published);
		__(this).set('confirmQueue', []);

		const publishable = await this.getPublishable();

		await Promise.all(Object.entries(publishable).map(async ([from, to]) => {
			await this.publish(from, to);
		}));

		this.terminal.spacer();

		if (published.length === 0) {
			this.info(this.t('commands.vendor-publish.messages.empty'));
		}

		published.forEach(({ from, to }) => {
			const relativeFrom = this.pathHelper.relative(this.app.basePath(), from);
			const relativeTo   = this.pathHelper.relative(this.app.basePath(), to);

			this.success(this.t('commands.vendor-publish.messages.success', {
				from: relativeFrom,
				to:   relativeTo
			}));
		});
	}

	/**
	 * Publish absolute source path to absolute destination path.
	 *
	 * @param {string} from - The absolute source path.
	 * @param {string} to - The absolute destination path.
	 * @returns {Promise} The async process promise.
	 */
	async publish(from, to) {
		const stat = await this.fs.stat(from);
		if (stat.isDirectory()) {
			await this.publishDirectory(from, to);
		} else {
			await this.publishFile(from, to);
		}
	}

	/**
	 * Publish absolute source directory path to absolute destination directory path.
	 *
	 * @param {string} from - The absolute source directory path.
	 * @param {string} to - The absolute destination directory path.
	 * @returns {Promise} The async process promise.
	 */
	async publishDirectory(from, to) {
		const files = await this.fs.scandir(from, 'file', { recursive: true, fullPath: true });

		await Promise.all(files.map(async (file) => {
			const relativePath = this.pathHelper.relative(from, file);

			await this.publishFile(file, this.app.formatPath(to, relativePath));
		}));
	}

	/**
	 * Publish absolute source file path to absolute destination file path.
	 *
	 * @param {string} from - The absolute source file path.
	 * @param {string} to - The absolute destination file path.
	 * @returns {Promise} The async process promise.
	 */
	async publishFile(from, to) {
		const canPublishFile = await this.ensureCanPublishFile(from, to);

		if (!canPublishFile) {
			return;
		}

		await this.fs.ensureDir(this.pathHelper.dirname(to));
		await this.fs.copyFile(from, to);
		__(this).get('published').push({ from, to });
	}

	/**
	 * Ensure that a file can be published.
	 *
	 * @param {string} from - The absolute source file path.
	 * @param {string} to - The absolute destination file path.
	 * @returns {Promise<boolean>} Indicates that the file can be published.
	 * @throws {TypeError} Indicates that the source file does not exist.
	 */
	async ensureCanPublishFile(from, to) {
		const sourceExists = await this.fs.pathExists(from);

		if (!sourceExists) {
			throw new TypeError(`Attempting to publish unexisting file [${from}]`);
		}

		const destinationExists = await this.fs.pathExists(to);

		if (destinationExists && !this.flag('overwrite')) {
			if (this.flag('safe')) {
				return false;
			}

			const canOverwrite = await this.enqueueOverwriteConfirm(this.pathHelper.relative(this.app.basePath(), to));

			if (!canOverwrite) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get publishable files and folders based by the given "provider" and/or "tag" options, or the "all" flag.
	 * If none if these options/flag were given, prompt the user to get the provider/tag to get publishable from.
	 *
	 * @returns {Promise<object<string, string>>} The publishable collection.
	 */
	async getPublishable() {
		let publishable = null;

		// If the user asked by CLI flag to have all publishable, no need to go through the whole process.
		if (this.flag('all')) {
			return ServiceProvider.getAllPublishable();
		}

		const publishableProviders = this.getPublishableProviders();
		const publishableTags      = this.getPublishableTags();

		const providersOptions = Object.keys(publishableProviders);
		const tagsOptions      = Object.keys(publishableTags);

		if (providersOptions.length === 0 && tagsOptions.length === 0) {
			return {};
		}

		let provider = this.option('provider');
		let tag      = this.option('tag');

		// If no provider or tag were received, prompt the user to resolve the publisher to get publishable from.
		if (!provider && !tag) {
			const options = {
				...[
					this.t('commands.vendor-publish.messages.publish-all'),
					...providersOptions.map((name) => {
						return this.t('commands.vendor-publish.messages.publish-provider', { name });
					}),
					...tagsOptions.map((name) => {
						return this.t('commands.vendor-publish.messages.publish-tag', { name });
					})
				]
			};

			const choice = await this.choice(this.t('commands.vendor-publish.messages.choose'), options, 0);

			const index = Number(choice) - 1;

			// If the user answered to have all publishable, no need to go through the final process.
			if (index === -1) {
				return ServiceProvider.getAllPublishable();
			}

			if (index < providersOptions.length) {
				provider = providersOptions[index];
			} else {
				tag = tagsOptions[index - providersOptions.length];
			}
		}

		// At this point, the user either was prompted or has given a provider or a tag.
		// Either a provider, a tag, or both, were given as options.
		if (provider) {
			const providerInstance = publishableProviders[provider];

			if (!providerInstance) {
				throw new TypeError(`Provider [${provider}] does not exists or has not publish anything`);
			}

			publishable = ServiceProvider.getPublishableByProvider(publishableProviders[provider]);
		}

		// If only provider was given, return all provider's publishable.
		if (!tag) {
			return publishable;
		}

		if (!publishableTags[tag]) {
			throw new TypeError(`Tag [${tag}] does not exists`);
		}

		const tagged = ServiceProvider.getPublishableByTag(tag);

		// If a publishable and a tag were given, filter all provider's publishable
		// to get only those tagged with the given tag.
		if (publishable) {
			return Object.fromEntries(Object.entries(publishable).filter(([from, to]) => {
				return tagged[from] === to;
			}));
		}

		// Otherwise, return all the tagged publishable.
		return tagged;
	}

	/**
	 * Enqueue confirmation prompt to the user to prevent concurrent confirmation prompts.
	 *
	 * @param {string} to - The absolute destination file path.
	 * @returns {Promise<boolean>} Indicates that the user has accepted overwriting the file.
	 */
	async enqueueOverwriteConfirm(to) {
		const queue = __(this).get('confirmQueue');

		let answer;

		queue.push((async () => {
			await Promise.all([...queue]);

			answer = await this.confirm(this.t('commands.vendor-publish.messages.confirm-overwrite', { file: to }));
		})());

		await Promise.all([...queue]);

		return answer;
	}

	/**
	 * Get all publishable providers, associated with their resolved name.
	 *
	 * @returns {object<string, foundation.ServiceProvider>} The publishable providers.
	 */
	getPublishableProviders() {
		return Object.fromEntries(ServiceProvider.publishableProviders().map((value) => {
			return [this.resolveProviderName(value), value];
		}).sort(([a], [b]) => {
			return a.localeCompare(b);
		}));
	}

	/**
	 * Get all publishable tags.
	 *
	 * @returns {object<string, string>} The publishable tags.
	 */
	getPublishableTags() {
		return Object.fromEntries(ServiceProvider.publishableTags().map((value) => {
			return [value, value];
		}).sort(([a], [b]) => {
			return a.localeCompare(b);
		}));
	}

	/**
	 * Resolve service provider name.
	 *
	 * @param {foundation.ServiceProvider} provider - The service provider instance.
	 * @returns {string} The service provider instance name.
	 */
	resolveProviderName(provider) {
		return provider.name || provider.constructor.name || provider.toString();
	}

	/**
	 * File system.
	 *
	 * @type {file.systems.Async}
	 */
	get fs() {
		return this.fileSystemAsync;
	}

	/**
	 * Path helper.
	 *
	 * @type {support.helpers.PathHelper}
	 */
	get pathHelper() {
		return this.helperPath;
	}

}


export default VendorPublishCommand;
