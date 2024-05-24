import PropTypes from 'prop-types';
import {Component} from 'react';
import {withPrefix} from 'gatsby-link';

import * as css from './EnactLiveEdit.module.less';

const core = ['core', 'i18n', 'spotlight', 'ui', 'webos'];

function getThemeName (name) {
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

export default class EnactLiveEdit extends Component {

	static propTypes = {
		code: PropTypes.string,
		name: PropTypes.string
	};

	constructor () {
		super();
		this.state = {
			ready: false
		};
	}

	componentDidMount ()  {
		this.setState({ready: true});
	}

	shouldComponentUpdate (nextProps, nextState) {
		const shouldUpdate = nextState.ready && !this.state.ready;

		if (shouldUpdate || (nextProps.code !== this.props.code)) {
			this.setCode(nextProps.code);
		}
		return shouldUpdate;
	}

	componentDidUpdate (prevProps, prevState) {
		if (!prevState.ready && this.state.ready) {
			this.setCode(this.props.code);
		}
	}

	setFrame = (frame) => {
		const setCode = frame && !this.frame;

		this.frame = frame;
		if (setCode) {
			this.setCode(this.props.code);
		}
	};

	setCode = (code) => {
		if (this.frame) {
			if (this.frame.contentWindow.editorIsReady) {
				this.frame.contentWindow.postMessage({source: 'enact-docs', code}, '*');
			} else {
				this.frame.contentWindow.editorCode = code;
			}
		}
	};

	render () {
		if (this.state.ready) {
			const theme = getThemeName(this.props.name);
			const dropdownClass = theme === 'agate' ? css.dropdownAgate : css.dropdownSandstoneMoonstone;
			const dropdown = this.props.code.includes('Dropdown') ? dropdownClass : '';
			return (
				// eslint-disable-next-line jsx-a11y/iframe-has-title
				<iframe
					className={`${css.frame} ${dropdown}`}
					ref={this.setFrame}
					src={withPrefix(`/${theme}-runner/index.html`)}
				/>
			);
		} else {
			return null;
		}
	}
}
