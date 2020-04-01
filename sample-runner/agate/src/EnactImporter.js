// Core
import kind from '@enact/core/kind';

// Sandstone
import Button from '../../../Button';
import DateTimePicker from '../../../DateTimePicker';
import Heading from '../../../Heading';
import IncrementSlider from '../../../IncrementSlider';
import Input from '../../../Input';
import Icon from '../../../Icon';
import Item from '../../../Item';
import LabeledIcon from '../../../LabeledIcon';
import LabeledIconButton from '../../../LabeledIconButton';
import LabeledItem from '../../../LabeledItem';
import ProgressBar from '../../../ProgressBar';
import Popup from '../../../Popup';
import Picker from '../../../Picker';
import RadioItem from '../../../RadioItem';
import Slider from '../../../Slider';
import SwitchItem from '../../../SwitchItem';
import ToggleButton from '../../../ToggleButton';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};

const AgateExports = {
	Button,
	DateTimePicker,
	Heading,
	IncrementSlider,
	Input,
	Icon,
	Item,
	LabeledIcon,
	LabeledIconButton,
	LabeledItem,
	ProgressBar,
	Popup,
	Picker,
	RadioItem,
	Slider,
	SwitchItem,
	ToggleButton
};

const spotlightExports = {
	Spotlight
};

const uiExports = {
	Layout,
	Cell,
	Row,
	Transition
};

const exports = {
	...enactExports,
	...agateExports,
	...spotlightExports,
	...uiExports
};

export default exports;
export {ThemeDecorator};
