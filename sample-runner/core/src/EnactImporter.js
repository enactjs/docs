// Core
import kind from '@enact/core/kind';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import {Button} from '@enact/ui/Button';
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};


const spotlightExports = {
	Spotlight
};

const uiExports = {
	Button,
	Layout,
	Cell,
	Row,
	Transition
};

const exports = {
	...enactExports,
	...spotlightExports,
	...uiExports
};

// TODO: Add Spotlight?
const ThemeDecorator = (_, Wrapped) => Wrapped;

export default exports;
export {ThemeDecorator};
