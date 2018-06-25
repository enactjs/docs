/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import React from 'react';
import SiteTitle from '../components/SiteTitle';

import css from '../css/main.less';

class MarkdownPage extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	render () {
		const post = this.props.data.markdownRemark;

		return (
			<SiteTitle {...this.props}>
				<div className={css.markdown}>
					<h1>{post.frontmatter.title}</h1>
					<div dangerouslySetInnerHTML={{__html: post.html}} />
				</div>
			</SiteTitle>
		);
	}
}

export default MarkdownPage;

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				title
			}
		}
	}
`;
