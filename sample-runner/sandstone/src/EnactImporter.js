// Core
import kind from '@enact/core/kind';

// Sandstone
import ActionGuide from '@enact/sandstone/ActionGuide';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Checkbox from '@enact/sandstone/Checkbox';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import ContextualMenuDecorator from '@enact/sandstone/ContextualMenuDecorator';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import DatePicker, {dateToLocaleString} from '@enact/sandstone/DatePicker';
import DayPicker, {getSelectedDayString} from '@enact/sandstone/DayPicker';
import Dropdown from '@enact/sandstone/Dropdown';
import FormCheckboxItem from '@enact/sandstone/FormCheckboxItem';
import Heading from '@enact/sandstone/Heading';
import Icon from '@enact/sandstone/Icon';
import Image from '@enact/sandstone/Image';
import ImageItem from '@enact/sandstone/ImageItem';
import Input, {InputField} from '@enact/sandstone/Input';
import Item from '@enact/sandstone/Item';
import KeyGuide from '@enact/sandstone/KeyGuide';
import Marquee from '@enact/sandstone/Marquee';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import Panels, {Header} from '@enact/sandstone/Panels';
import Picker from '@enact/sandstone/Picker';
import Popup from '@enact/sandstone/Popup';
import ProgressBar from '@enact/sandstone/ProgressBar';
import RadioItem from '@enact/sandstone/RadioItem';
import RangePicker from '@enact/sandstone/RangePicker';
import Region from '@enact/sandstone/Region';
import Scroller from '@enact/sandstone/Scroller';
import Slider from '@enact/sandstone/Slider';
import Spinner from '@enact/sandstone/Spinner';
import Steps from '@enact/sandstone/Steps';
import Switch from '@enact/sandstone/Switch';
import SwitchItem from '@enact/sandstone/SwitchItem';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import TimePicker, {timeToLocaleString} from '@enact/sandstone/TimePicker';
import TooltipDecorator from '@enact/sandstone/TooltipDecorator';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import VirtualList from '@enact/sandstone/VirtualList';
import {WizardPanel} from '@enact/sandstone/Panels';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import Changeable from '@enact/ui/Changeable';
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Toggleable from '@enact/ui/Toggleable';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};

const sandstoneExports = {
	ActionGuide,
	BodyText,
	Button,
	Checkbox,
	CheckboxItem,
	ContextualMenuDecorator,
	ContextualPopupDecorator,
	DatePicker,
	dateToLocaleString,
	DayPicker,
	Dropdown,
	getSelectedDayString,
	FormCheckboxItem,
	Header,
	Heading,
	Icon,
	Image,
	ImageItem,
	Input,
	InputField,
	Item,
	KeyGuide,
	Marquee,
	MediaOverlay,
	Panels,
	Picker,
	Popup,
	ProgressBar,
	RadioItem,
	RangePicker,
	Region,
	Scroller,
	Slider,
	Spinner,
	Steps,
	Switch,
	SwitchItem,
	ThemeDecorator,
	TimePicker,
	timeToLocaleString,
	TooltipDecorator,
	VideoPlayer,
	VirtualList,
	WizardPanel
};

const spotlightExports = {
	Spotlight
};

const uiExports = {
	Changeable,
	Layout,
	Cell,
	Row,
	Toggleable,
	Transition
};

const exports = {
	...enactExports,
	...sandstoneExports,
	...spotlightExports,
	...uiExports
};

export default exports;
export {ThemeDecorator};
