import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';

import MainPanel from '../views/MainPanel';

import css from './App.less';

class App extends React.Component {
	static displayName = 'App';

	constructor () {
		let code = window.editorCode || "";

		super();
		this.state = {
			code
		};
	}

	componentDidMount () {
		on('message', this.codeReceived, window);
		window.editorIsReady = true;
	}

	componentDidCatch() {
		// Display fallback UI
		this.setState({hasError: true});
	}

	componentWillUnmount () {
		off('message', this.codeReceived, window);
	}

	codeReceived = (ev) => {
		console.log(ev);
		if (ev.data && ev.data.source === 'enact-docs') {
			this.setState({code: ev.data.code});
		}
	}

	render = (props) => (
		<div {...props} className={css.app} skin="light">
			<MainPanel code={this.state.code} />
		</div>
	)
};

export default MoonstoneDecorator({ri: false, textSize: false}, App);
