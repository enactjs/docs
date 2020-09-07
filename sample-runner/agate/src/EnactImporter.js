// Core
import kind from '@enact/core/kind';

// Agate
import Button from '@enact/agate/Button';
import Checkbox from '@enact/agate/Checkbox';
import CheckboxItem from '@enact/agate/CheckboxItem';
import ColorPicker from '@enact/agate/ColorPicker';
import DateTimePicker from '@enact/agate/DateTimePicker';
import Drawer from '@enact/agate/Drawer';
import Dropdown from '@enact/agate/Dropdown';
import GridListImageItem from '@enact/agate/GridListImageItem';
import Heading from '@enact/agate/Heading';
import Header from '@enact/agate/Header';
import Image from '@enact/agate/Image';
import IncrementSlider from '@enact/agate/IncrementSlider';
import Input from '@enact/agate/Input';
import Icon from '@enact/agate/Icon';
import Item from '@enact/agate/Item';
import LabeledIcon from '@enact/agate/LabeledIcon';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import LabeledItem from '@enact/agate/LabeledItem';
import ProgressBar from '@enact/agate/ProgressBar';
import Popup from '@enact/agate/Popup';
import PopupMenu from '@enact/agate/PopupMenu';
import Picker from '@enact/agate/Picker';
import RadioItem from '@enact/agate/RadioItem';
import Scroller from '@enact/agate/Scroller';
import Slider from '@enact/agate/Slider';
import SliderButton from '@enact/agate/SliderButton';
import Spinner from '@enact/agate/Spinner';
import Switch from '@enact/agate/Switch';
import SwitchItem from '@enact/agate/SwitchItem';
import ThemeDecorator from '@enact/agate/ThemeDecorator';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import ToggleButton from '@enact/agate/ToggleButton';
import VirtualList, {VirtualGridList} from '@enact/agate/VirtualList';

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
	Button,
	Checkbox,
	CheckboxItem,
	ColorPicker,
	DateTimePicker,
	Drawer,
	Dropdown,
	GridListImageItem,
	Heading,
	Header,
	Image,
	IncrementSlider,
	Input,
	Icon,
	Item,
	LabeledIcon,
	LabeledIconButton,
	LabeledItem,
	ProgressBar,
	Popup,
	PopupMenu,
	Picker,
	RadioItem,
	Scroller,
	Slider,
	SliderButton,
	Spinner,
	Switch,
	SwitchItem,
	ThemeDecorator,
	ThumbnailItem,
	ToggleButton,
	VirtualList,
	VirtualGridList
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
