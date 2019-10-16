//--------------------------------------------------------
//-- Node IoC - Test - Test Case
//--------------------------------------------------------

import __        from '@absolunet/private-registry';
import hasEngine from '../support/mixins/hasEngine';
import asserts   from './mixins/core/asserts';
import expects   from './mixins/core/expects';
import setsUp    from './mixins/core/setsUp';


/**
 * Base test case class for the test system.
 *
 * @memberof test
 * @augments test.mixins.core.SetsUp
 * @augments test.mixins.core.Expects
 * @augments test.mixins.core.Asserts
 * @augments support.mixins.HasEngine
 * @hideconstructor
 */
class TestCase extends setsUp(expects(asserts(hasEngine()))) {

	/**
	 * Call make method from the current application.
	 *
	 * @param {*} abstract - An abstract that was bound to the container, or a class, closure or instance that can be built by the container.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
	 * @returns {*} - The instantiated or the singleton concrete.
	 */
	make(abstract, parameters = {}) {
		return this.app.make(abstract, parameters);
	}

	/**
	 * Expect given abstract to be bound in the application.
	 *
	 * @param {string} abstract - The abstract to check.
	 */
	expectBound(abstract) {
		this.expect(this.app.isBound(abstract)).toBe(true);
	}

	/**
	 * Set current application.
	 *
	 * @param {Application} app - The application instance.
	 * @returns {TestCase} - The current test case.
	 */
	setApp(app) {
		__(this).set('app', app);

		return this;
	}

	/**
	 * Current application accessor.
	 *
	 * @type {Application}
	 */
	get app() {
		return __(this).get('app');
	}

}


export default TestCase;
