//--------------------------------------------------------
//-- Tests - Unit - Support - Helpers - Path Helper - GWT
//--------------------------------------------------------

import gwt from '../common.gwt';
const { given, when, then, build } = gwt;

import container  from '../../container';
import PathHelper from '../../../../dist/node/support/helpers/PathHelper';

let result;
let pathHelper;


//-- Given
//--------------------------------------------------------

given.emptyResult = () => {
	result = undefined;
};

given.pathHelper = () => {
	pathHelper = container.make(PathHelper);
};


//-- When
//--------------------------------------------------------

when.gettingForward = () => {
	when.attempting(() => {
		result = pathHelper.getForward();
	});
};

when.gettingBaseName = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.basename(...parameters);
	});
};

when.gettingDirectoryName = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.dirname(...parameters);
	});
};

when.gettingExtensionName = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.extname(...parameters);
	});
};

when.formatting = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.format(...parameters);
	});
};

when.checkingIfPathIsAbsolute = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.isAbsolute(...parameters);
	});
};

when.checkingIfPathIsRelative = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.isRelative(...parameters);
	});
};

when.checkingIfPathIsRelative = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.isRelative(...parameters);
	});
};

when.joiningPathSegments = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.join(...parameters);
	});
};

when.normalizing = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.normalize(...parameters);
	});
};

when.parsing = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.parse(...parameters);
	});
};

when.gettingRelativePath = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.relative(...parameters);
	});
};

when.resolvingPath = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.resolve(...parameters);
	});
};

when.replacingSlashes = (...parameters) => {
	when.attempting(() => {
		result = pathHelper.slash(...parameters);
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
	expect({ ...result }).toStrictEqual({ ...expected });
};


export default build({ given, when, then });
