// Core
import kind from '@enact/core/kind';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import {Button} from '@enact/ui/Button';
import Changeable from '@enact/ui/Changeable';
import {Heading} from '@enact/ui/Heading';
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Scroller from '@enact/ui/Scroller';
import Toggleable from '@enact/ui/Toggleable';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};


const spotlightExports = {
	Spotlight
};

const uiExports = {
	Button,
	Changeable,
	Heading,
	Layout,
	Cell,
	Row,
	Scroller,
	Toggleable,
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
