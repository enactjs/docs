import {on, off} from '@enact/core/dispatcher';
import { Component } from 'react';
import MainPanel from '../../../shared/MainPanel';

import components, {ThemeDecorator} from '../EnactImporter';


class App extends Component {
	static displayName = 'App';

	constructor () {
		let code = window.editorCode || '';

		super();
		this.state = {
			code
		};
	}

	componentDidMount () {
		on('message', this.codeReceived, window);
		window.editorIsReady = true;
	}

	componentDidCatch () {
		// Display fallback UI
		this.setState({hasError: true});
	}

	componentWillUnmount () {
		off('message', this.codeReceived, window);
	}

	codeReceived = (ev) => {
		// eslint-disable-next-line no-console
		console.log(ev);
		if (ev.data && ev.data.source === 'enact-docs') {
			this.setState({code: ev.data.code});
		}
	};

	render () {
		return (
			<div {...this.props} style={{padding: 0}}>
				<MainPanel code={this.state.code} components={components} />
			</div>
		);
	}
}

export default ThemeDecorator({ri: false, skin: 'light', textSize: false, disableFullscreen: true}, App);
