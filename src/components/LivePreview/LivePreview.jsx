import {withBase} from '../../utils/utils';
import css from './LivePreview.module.css';

const core = ['core', 'i18n', 'spotlight', 'ui', 'webos'];

const getThemeName = (name) => {
	if (name) {
		const theme = name.split('/')[0] || 'core';
		if (core.includes(theme)) {
			return 'core';
		} else {
			return theme;
		}
	}
	return 'core';
}

const LivePreview = ({code, name}) => {
	const theme = getThemeName(name);
	const dropdownClass = theme === 'agate' ? css.dropdownAgate : css.dropdown;
	const dropdown = code.includes('Dropdown') ? dropdownClass : '';

	const setFrame = (frame) => {
		if (frame) {
			if (frame.contentWindow.editorIsReady) {
				frame.contentWindow.postMessage({source: 'enact-docs', code}, '*');
			} else {
				frame.contentWindow.editorCode = code;
			}
		}
	};

	return (
		<iframe
			ref={setFrame}
			className={`${css.frame} ${dropdown}`}
			src={withBase(`./${theme}-runner/index.html`)}
		/>
	)
}

export default LivePreview;

