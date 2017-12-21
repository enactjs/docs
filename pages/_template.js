import React from 'react';
import PropTypes from 'prop-types';
// import {Link} from 'react-router';
import {Container} from 'react-responsive-grid';
// import {prefixLink} from 'gatsby-helpers';
// import includes from 'underscore.string/include';
// import {colors, activeColors} from 'utils/colors';

// import {rhythm} from 'utils/typography';

import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

import css from '../css/main.less';

// Import styles.
import 'css/github.css';

export default class SiteTemplate extends React.Component {
	static propTypes = {
		children: PropTypes.object
	}

	render () {
		return (
			<div>
				<SiteHeader location={this.props.location} />
				<Container
					className={css.article}
				>
					{this.props.children}
				</Container>
				<SiteFooter />
			</div>
		);
	}
}
