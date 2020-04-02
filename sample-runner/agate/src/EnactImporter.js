// Core
import kind from '@enact/core/kind';

// Agate
import Button from '@enact/agate/Button';
import DateTimePicker from '@enact/agate/DateTimePicker';
import Heading from '@enact/agate/Heading';
import IncrementSlider from '@enact/agate/IncrementSlider';
import Input from '@enact/agate/Input';
import Icon from '@enact/agate/Icon';
import Item from '@enact/agate/Item';
import LabeledIcon from '@enact/agate/LabeledIcon';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import LabeledItem from '@enact/agate/LabeledItem';
import ProgressBar from '@enact/agate/ProgressBar';
import Popup from '@enact/agate/Popup';
import Picker from '@enact/agate/Picker';
import RadioItem from '@enact/agate/RadioItem';
import Slider from '@enact/agate/Slider';
import SwitchItem from '@enact/agate/SwitchItem';
import AgateDecorator from '@enact/agate/AgateDecorator'
import ToggleButton from '@enact/agate/ToggleButton';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};

const agateExports = {
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
	AgateDecorator,
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
export {AgateDecorator as ThemeDecorator};
