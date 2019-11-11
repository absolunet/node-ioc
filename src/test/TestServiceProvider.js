//--------------------------------------------------------
//-- Node IoC - Test - Test Service Provider
//--------------------------------------------------------

import ServiceProvider         from '../foundation/ServiceProvider';
import TestRepository          from './repositories/TestRepository';
import UnitTestRepository      from './repositories/UnitTestRepository';
import FeatureTestRepository   from './repositories/FeatureTestRepository';
import EndToEndTestRepository  from './repositories/EndToEndTestRepository';
import IntegrationTestRepository from './repositories/IntegrationTestRepository';
import TestRunner              from './services/TestRunner';
import Tester                  from './services/Tester';
import JestEngine              from './engines/JestEngine';
import Type                    from './enums/Type';
import MakeTestCommand         from './commands/MakeTestCommand';
import TestCommand             from './commands/TestCommand';


// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * The test service provider.
 * It binds the following services:
 * <ul>
 *     <li><a href="test.enums.Type.html">test.type</a></li>
 *     <li><a href="test.services.TestRunner.html">test.runner</a></li>
 *     <li><a href="test.services.Tester.html">tester</a></li>
 *     <li><a href="test.engines.JestEngine.html">test.engine.jest</a></li>
 *     <li><a href="test.repositories.TestRepository.html">test</a></li>
 *     <li><a href="test.repositories.UnitTestRepository.html">test.unit</a></li>
 *     <li><a href="test.repositories.FeatureTestRepository.html">test.feature</a></li>
 *     <li><a href="test.repositories.EndToEndTestRepository.html">test.e2e</a></li>
 * </ul>
 * It also binds these tags:
 * <ul>
 *     <li>tests
 *     		<ul>
 *     		 	<li><a href="test.repositories.UnitTestRepository.html">test.unit</a></li>
 *     		 	<li><a href="test.repositories.FeatureTestRepository.html">test.feature</a></li>
 *     		 	<li><a href="test.repositories.EndToEndTestRepository.html">test.e2e</a></li>
 *     		</ul>
 *     </li>
 * </ul>
 * It also offers these commands:
 * <ul>
 *     <li><a href="test.commands.MakeTestCommand.html">make:test</a></li>
 *     <li><a href="test.commands.TestCommand.html">test</a></li>
 * </ul>
 *
 * @memberof test
 * @augments foundation.ServiceProvider
 * @hideconstructor
 */
class TestServiceProvider extends ServiceProvider {

	/**
	 * @inheritdoc
	 */
	get name() {
		return 'Node IoC - Test';
	}

	/**
	 * Register the service provider.
	 */
	register() {
		this.bindTestRepository();
		this.bindUnitTestRepository();
		this.bindFeatureTestRepository();
		this.bindIntegrationTestRepository();
		this.bindEndToEndRepository();
		this.tagTestRepositories();

		this.bindTestRunner();
		this.bindTester();
		this.bindTestTypeEnum();
		this.bindJestEngine();
	}

	/**
	 * Boot the service provider.
	 */
	boot() {
		this.loadCommands([
			MakeTestCommand,
			TestCommand
		]);
	}

	/**
	 * Bind base test repository.
	 */
	bindTestRepository() {
		this.app.singleton('test',           TestRepository);
	}

	/**
	 * Bind unit test repository.
	 */
	bindUnitTestRepository() {
		this.app.singleton('test.unit',      UnitTestRepository);
	}

	/**
	 * Bind feature test repository.
	 */
	bindFeatureTestRepository() {
		this.app.singleton('test.feature',   FeatureTestRepository);
	}

	/**
	 * Bind integration test repository.
	 */
	bindIntegrationTestRepository() {
		this.app.singleton('test.integration',   IntegrationTestRepository);
	}

	/**
	 * Bind end-to-end test repository.
	 */
	bindEndToEndRepository() {
		this.app.singleton('test.endtoend',  EndToEndTestRepository);
	}

	/**
	 * Tag all scoped test repositories.
	 */
	tagTestRepositories() {
		this.app.tag(['test.unit', 'test.feature', 'test.integration', 'test.endtoend'], 'tests');
	}

	/**
	 * Bind test runner service.
	 */
	bindTestRunner() {
		this.app.singleton('test.runner', TestRunner);
	}

	/**
	 * Bind tester service.
	 */
	bindTester() {
		this.app.singleton('tester',      Tester);
	}

	/**
	 * Bind test type enum.
	 */
	bindTestTypeEnum() {
		this.app.singleton('test.type',   Type);
	}

	/**
	 * Bind Jest test engine.
	 */
	bindJestEngine() {
		this.app.singleton('test.engine.jest', JestEngine);
	}

}


export default TestServiceProvider;
