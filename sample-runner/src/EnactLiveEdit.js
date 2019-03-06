import React from 'react';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';

import {
	LiveProvider,
	LiveEditor,
	LiveError,
	LivePreview
} from 'react-live';

import enactComponents from './EnactImporter';

import css from './EnactLiveEdit.less';

class App extends React.Component {

	static displayName = 'App';

	static propTypes = {
		code: PropTypes.string,
		extraScope: PropTypes.array
	}

	constructor () {
		super();
		this.state = {
			ready: false
		};
	}

	componentDidMount = () => {
		this.setState({ready: true});
	}

	render = () => {
		if (this.state.ready) {
			const {code, extraScope = {}} = this.props;

			return (
				<LiveProvider code={code} scope={{React, ...enactComponents, ...extraScope}}>
					<LiveEditor onFocus={Spotlight.pause} onBlur={Spotlight.resume} tabIndex={-1} />
					<LiveError className={css.error} />
					<div className={css.sandbox}>
						<LivePreview />
					</div>
				</LiveProvider>
			);
		} else {
			return null;
		}
	}
}

export default App;
