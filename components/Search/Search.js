import elasticlunr from 'elasticlunr';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';
import React from 'react';
import PropTypes from 'prop-types';

import docIndex from '../../docIndex.json';

const index = elasticlunr.Index.load(docIndex);

const searchConfig = {
	fields: {
		title: {boost: 3},
		members: {boost: 2},
		description: {boost: 1},
		memberDescriptions: {boost: 1}
	},
	expand: true
};

export default class Search extends React.Component {
	static propTypes = {
		location: PropTypes.string
	}

	constructor (props) {
		super(props);
		this.state = {
			value: '',
			results: false
		};
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.location.pathname !== nextProps.location.pathname) {
			this.setState({value: '', results: false});
		}
	}

	handleChange = (ev) => {
		const value = ev.target.value;
		let results = false;
		if (value.length > 2) {
			results = index.search(value, searchConfig);
		}
		this.setState({value, results});
	}

	handleKeyDown = (ev) => {
		if (ev.keyCode === 27) {
			this.setState({value: '', results: false});
		}
	}

	render = () => {
		return <div>
			Search:
			<input value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
			{this.state.results ? <div style={{}}>
				{this.state.results.length ?
					this.state.results.map((result, i) =>
						<Link to={prefixLink(`/docs/modules/${result.ref}/`)} key={i}>{result.ref}</Link>
					) :
				'No matches found'}
			</div> : null}
		</div>;
	}
}

