//--------------------------------------------------------
//-- Node IoC - Test - Test Case
//--------------------------------------------------------

import __        from '@absolunet/private-registry';
import hasEngine from '../support/mixins/hasEngine';
import asserts   from './mixins/core/asserts';
import expects   from './mixins/core/expects';
import setsUp    from './mixins/core/setsUp';
import bindings  from './mixins/expectations/bindings';


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
class TestCase extends bindings(setsUp(expects(asserts(hasEngine())))) {

	/**
	 * Call make method from the current application.
	 *
	 * @param {*} abstract - An abstract that was bound to the container, or a class, closure or instance that can be built by the container.
	 * @param {object<string, *>} [parameters={}] - Additional arguments to inject into the concrete when instantiating.
	 * @returns {*} The instantiated or the singleton concrete.
	 */
	make(abstract, parameters = {}) {
		return this.app.make(abstract, parameters);
	}

	/**
	 * Set current application.
	 *
	 * @param {foundation.Application} app - The application instance.
	 * @returns {test.TestCase} The current test case.
	 */
	setApp(app) {
		__(this).set('app', app);

		return this;
	}

	/**
	 * Current application accessor.
	 *
	 * @type {foundation.Application}
	 */
	get app() {
		return __(this).get('app');
	}

}


export default TestCase;
