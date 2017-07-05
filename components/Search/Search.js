import elasticlunr from 'elasticlunr';
import React from 'react';
import PropTypes from 'prop-types';

import docIndex from '../../docIndex.json';

import Results from './Results';
import css from './Search.less';

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
		location: PropTypes.object
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
			this.removeWatchForExternalClick();
			this.setState({value: '', results: false, focused: false});
		}
	}

	componentWillUnmount = () => {
		this.removeWatchForExternalClick();
	}

	hideResults = () => {
		this.removeWatchForExternalClick();
		this.setState({focused: false});
	}

	watchForExternalClick = (ev) => {
		if (!this.search.contains(ev.target)) {
			this.hideResults();
		}
	}

	addWatchForExternalClick = () => {
		document.addEventListener('click', this.watchForExternalClick);
	}

	removeWatchForExternalClick = () => {
		document.removeEventListener('click', this.watchForExternalClick);
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

	handleFocus = () => {
		this.setState({focused: true});
		this.addWatchForExternalClick();
	}

	handleBlur = (ev) => {
		// This catches tabing to the next targetable element by restricting to relatedTarget
		// The document click event catches clicks
		if (ev.relatedTarget && !this.search.contains(ev.relatedTarget)) {
			this.hideResults();
		}
	}

	getSearchRef = (ref) => {
		this.search = ref;
	}

	render = () => {
		const {className, ...rest} = this.props;
		delete rest.location;
		return <form {...rest} className={[className, css.search, (this.state.focused ? css.focus : ''), (this.state.results && this.state.focused) ? css.showResults : ''].join(' ')} ref={this.getSearchRef}>
			<label htmlFor="enactSearch" className={css.searchTitle}>Search:</label>
			<input
				id="enactSearch"
				type="search"
				autoComplete="off"
				className={css.input}
				value={this.state.value}
				onChange={this.handleChange}
				onKeyDown={this.handleKeyDown}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
			/>
			{this.state.results ? <Results className={css.results} onClick={this.handleFocus} onFocus={this.handleFocus}>{this.state.results}</Results> : null}
		</form>;
	}
}

