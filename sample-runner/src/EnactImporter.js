// Core
import kind from '@enact/core/kind';

/*
// Moonstone
import BodyText from '@enact/moonstone/BodyText';
import Button from '@enact/moonstone/Button';
import Checkbox from '@enact/moonstone/Checkbox';
import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator';
import DatePicker from '@enact/moonstone/DatePicker';
import DayPicker from '@enact/moonstone/DayPicker';
import DaySelector from '@enact/moonstone/DaySelector';
import Dialog from '@enact/moonstone/Dialog';
import Dropdown from '@enact/moonstone/Dropdown';
import EditableIntegerPicker from '@enact/moonstone/EditableIntegerPicker';
import ExpandableInput from '@enact/moonstone/ExpandableInput';
import ExpandableItem from '@enact/moonstone/ExpandableItem';
import ExpandableList from '@enact/moonstone/ExpandableList';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import FormCheckbox from '@enact/moonstone/FormCheckbox';
import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import Heading from '@enact/moonstone/Heading';
import Icon from '@enact/moonstone/Icon';
import IconButton from '@enact/moonstone/IconButton';
import Image from '@enact/moonstone/Image';
import IncrementSlider from '@enact/moonstone/IncrementSlider';
import Input from '@enact/moonstone/Input';
import Item from '@enact/moonstone/Item';
import LabeledIcon from '@enact/moonstone/LabeledIcon';
import LabeledIconButton from '@enact/moonstone/LabeledIconButton';
import LabeledItem from '@enact/moonstone/LabeledItem';
import Marquee from '@enact/moonstone/Marquee';
import MediaOverlay from '@enact/moonstone/MediaOverlay';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import Notification from '@enact/moonstone/Notification';
import Panels from '@enact/moonstone/Panels';
import Picker from '@enact/moonstone/Picker';
import Popup from '@enact/moonstone/Popup';
import ProgressBar from '@enact/moonstone/ProgressBar';
import RadioItem from '@enact/moonstone/RadioItem';
import RangePicker from '@enact/moonstone/RangePicker';
import Region from '@enact/moonstone/Region';
import Scroller from '@enact/moonstone/Scroller';
import SelectableItem from '@enact/moonstone/SelectableItem';
import Slider from '@enact/moonstone/Slider';
import SlotItem from '@enact/moonstone/SlotItem';
import Spinner from '@enact/moonstone/Spinner';
import Switch from '@enact/moonstone/Switch';
import SwitchItem from '@enact/moonstone/SwitchItem';
import TimePicker from '@enact/moonstone/TimePicker';
import ToggleButton from '@enact/moonstone/ToggleButton';
import ToggleIcon from '@enact/moonstone/ToggleIcon';
import ToggleItem from '@enact/moonstone/ToggleItem';
import TooltipDecorator from '@enact/moonstone/TooltipDecorator';
import VideoPlayer from '@enact/moonstone/VideoPlayer';
import VirtualList from '@enact/moonstone/VirtualList';
*/

// Sandstone
import ActionGuide from '@enact/sandstone/ActionGuide';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Checkbox from '@enact/sandstone/Checkbox';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import ContextualMenuDecorator from '@enact/sandstone/ContextualMenuDecorator';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import DatePicker from '@enact/sandstone/DatePicker';
import Dropdown from '@enact/sandstone/Dropdown';
import FormCheckbox from '@enact/sandstone/FormCheckbox';
import FormCheckboxItem from '@enact/sandstone/FormCheckboxItem';
import Heading from '@enact/sandstone/Heading';
import Icon from '@enact/sandstone/Icon';
import IconButton from '@enact/sandstone/IconButton';
import Image from '@enact/sandstone/Image';
import ImageItem from '@enact/sandstone/ImageItem';
import Input, {InputField} from '@enact/sandstone/Input';
import Item from '@enact/sandstone/Item';
import KeyGuide from '@enact/sandstone/KeyGuide';
import LabeledIcon from '@enact/sandstone/LabeledIcon';
import LabeledIconButton from '@enact/sandstone/LabeledIconButton';
import Marquee from '@enact/sandstone/Marquee';
import MediaOverlay from '@enact/sandstone/MediaOverlay';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
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
import TimePicker from '@enact/sandstone/TimePicker';
import TooltipDecorator from '@enact/sandstone/TooltipDecorator';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import VirtualList from '@enact/sandstone/VirtualList';
import {WizardPanel} from '@enact/sandstone/Panels';

// Deprecated Sandstone
import DayPicker from '@enact/sandstone/DayPicker';
import DaySelector from '@enact/sandstone/DaySelector';
import EditableIntegerPicker from '@enact/sandstone/EditableIntegerPicker';
import ExpandableInput from '@enact/sandstone/ExpandableInput';
import ExpandableItem from '@enact/sandstone/ExpandableItem';
import ExpandableList from '@enact/sandstone/ExpandableList';
import ExpandablePicker from '@enact/sandstone/ExpandablePicker';
import GridListImageItem from '@enact/sandstone/GridListImageItem';
import IncrementSlider from '@enact/sandstone/IncrementSlider';
import LabeledItem from '@enact/sandstone/LabeledItem';
import SelectableItem from '@enact/sandstone/SelectableItem';
import SlotItem from '@enact/sandstone/SlotItem';
import ToggleButton from '@enact/sandstone/ToggleButton';
import ToggleIcon from '@enact/sandstone/ToggleIcon';
import ToggleItem from '@enact/sandstone/ToggleItem';

// Spotlight
import Spotlight from '@enact/spotlight';

// Ui
import {Layout, Cell, Row} from '@enact/ui/Layout';
import Transition from '@enact/ui/Transition';

const enactExports = {
	kind
};

/*
const moonstoneExports = {
	BodyText,
	Button,
	Checkbox,
	CheckboxItem,
	ContextualPopupDecorator,
	DatePicker,
	DayPicker,
	DaySelector,
	Dialog,
	Dropdown,
	EditableIntegerPicker,
	ExpandableInput,
	ExpandableItem,
	ExpandableList,
	ExpandablePicker,
	FormCheckbox,
	FormCheckboxItem,
	GridListImageItem,
	Heading,
	Icon,
	IconButton,
	Image,
	IncrementSlider,
	Input,
	Item,
	LabeledItem,
	LabeledIcon,
	LabeledIconButton,
	Marquee,
	MediaOverlay,
	MoonstoneDecorator,
	Notification,
	Panels,
	Picker,
	Popup,
	ProgressBar,
	RadioItem,
	RangePicker,
	Region,
	Scroller,
	SelectableItem,
	Slider,
	SlotItem,
	Spinner,
	Switch,
	SwitchItem,
	TimePicker,
	ToggleButton,
	ToggleIcon,
	ToggleItem,
	TooltipDecorator,
	VideoPlayer,
	VirtualList
};
*/

const sandstoneExports = {
	ActionGuide,
	BodyText,
	Button,
	Checkbox,
	CheckboxItem,
	ContextualMenuDecorator,
	ContextualPopupDecorator,
	DatePicker,
	Dropdown,
	FormCheckbox,
	FormCheckboxItem,
	Header,
	Heading,
	Icon,
	IconButton,
	Image,
	ImageItem,
	Input,
	InputField,
	Item,
	KeyGuide,
	LabeledIcon,
	LabeledIconButton,
	Marquee,
	MediaOverlay,
	ThemeDecorator,
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
	TimePicker,
	TooltipDecorator,
	VideoPlayer,
	VirtualList,
	WizardPanel
};

const deprecatedSandstoneImports = {
	DayPicker,
	DaySelector,
	EditableIntegerPicker,
	ExpandableInput,
	ExpandableItem,
	ExpandableList,
	ExpandablePicker,
	GridListImageItem,
	IncrementSlider,
	LabeledItem,
	SelectableItem,
	SlotItem,
	ToggleButton,
	ToggleIcon,
	ToggleItem
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
	...sandstoneExports,
	...deprecatedSandstoneImports,
/*
	...moonstoneExports,
*/
	...spotlightExports,
	...uiExports
};

export default exports;
