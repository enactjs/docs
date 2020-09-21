// Core
import kind from '@enact/core/kind';

// Agate
import BodyText from '@enact/agate/BodyText';
import Button from '@enact/agate/Button';
import Checkbox from '@enact/agate/Checkbox';
import CheckboxItem from '@enact/agate/CheckboxItem';
import ColorPicker from '@enact/agate/ColorPicker';
import DatePicker from '@enact/agate/DatePicker';
import DateTimePicker from '@enact/agate/DateTimePicker';
import Drawer from '@enact/agate/Drawer';
import Dropdown from '@enact/agate/Dropdown';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import GridListImageItem from '@enact/agate/GridListImageItem';
import Header from '@enact/agate/Header';
import Heading from '@enact/agate/Heading';
import Icon from '@enact/agate/Icon';
import Image from '@enact/agate/Image';
import ImageItem from '@enact/agate/ImageItem';
import IncrementSlider from '@enact/agate/IncrementSlider';
import Input from '@enact/agate/Input';
import Item from '@enact/agate/Item';
import Keypad from '@enact/agate/Keypad';
import LabeledIcon from '@enact/agate/LabeledIcon';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import LabeledItem from '@enact/agate/LabeledItem';
import MediaPlayer from '@enact/agate/MediaPlayer';
import Panels from '@enact/agate/Panels';
import Picker from '@enact/agate/Picker';
import Popup from '@enact/agate/Popup';
import PopupMenu from '@enact/agate/PopupMenu';
import ProgressBar from '@enact/agate/ProgressBar';
import RadioItem from '@enact/agate/RadioItem';
import RangePicker from '@enact/agate/RangePicker';
import Scroller from '@enact/agate/Scroller';
import Slider from '@enact/agate/Slider';
import SliderButton from '@enact/agate/SliderButton';
import Spinner from '@enact/agate/Spinner';
import Switch from '@enact/agate/Switch';
import SwitchItem from '@enact/agate/SwitchItem';
import TabGroup from '@enact/agate/TabGroup';
import ThemeDecorator from '@enact/agate/ThemeDecorator';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import TimePicker from '@enact/agate/TimePicker';
import ToggleButton from '@enact/agate/ToggleButton';
import VirtualList from '@enact/agate/VirtualList';

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

const agateExports = {
	BodyText,
	Button,
	Checkbox,
	CheckboxItem,
	ColorPicker,
	DatePicker,
	DateTimePicker,
	Drawer,
	Dropdown,
	FullscreenPopup,
	GridListImageItem,
	Header,
	Heading,
	Icon,
	Image,
	ImageItem,
	IncrementSlider,
	Input,
	Item,
	Keypad,
	LabeledIcon,
	LabeledIconButton,
	LabeledItem,
	MediaPlayer,
	Panels,
	Picker,
	Popup,
	PopupMenu,
	ProgressBar,
	RadioItem,
	RangePicker,
	Scroller,
	Slider,
	SliderButton,
	Spinner,
	Switch,
	SwitchItem,
	TabGroup,
	ThumbnailItem,
	TimePicker,
	ToggleButton,
	VirtualList
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

export default {
	...enactExports,
	...agateExports,
	...spotlightExports,
	...uiExports
};

export {ThemeDecorator};
