import React from 'react';
import PropTypes from 'prop-types';

export default class BlankLayout extends React.Component {
	static propTypes = {
		children: PropTypes.func
	}

	render () {
		const {children} = this.props;
		return (
			children()
		);
	}
}

