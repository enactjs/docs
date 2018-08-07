import React from 'react';
import {withPrefix} from 'gatsby-link';

import css from './EnactLiveEdit.less';

export default class EnactLiveEdit extends React.Component {

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

	setFrame = (frame) => {
		const setCode = frame && !this.frame;

		this.frame = frame;
		if (setCode) {
			this.setCode(this.props.code);
		}
	}

	setCode = (code) => {
		if (this.frame) {
			// TODO: This is a hack, need a better way to allow for iframe to load and be ready.
			// Likely this won't be enough time for loading remotely or for slow connections. Also,
			// a longer time would show an error on the runner longer.  Need to suppress error from
			// empty code sample.
			window.setTimeout(() => {
				this.frame.contentWindow.postMessage({source: 'enact-docs', code}, '*');
			}, 200);
		}
	}

	render () {
		if (this.state.ready) {
			return (
				<iframe className={css.frame} ref={this.setFrame} src={withPrefix('/sample-runner/index.html')} />
			);
		} else {
			return null;
		}
	}
}
