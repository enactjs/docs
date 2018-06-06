/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import React from 'react';

import Page from '../components/Page';

import css from '../css/main.less';

class MarkdownPage extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	render () {
		const post = this.props.data.markdownRemark;

		return (
			<Page>
				<div className={css.markdown}>
					<h1>{post.frontmatter.title}</h1>
					<div dangerouslySetInnerHTML={{__html: post.html}} />
				</div>
			</Page>
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
