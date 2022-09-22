import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import {Component} from 'react';
import {withPrefix} from 'gatsby-link';

import {Row} from '@enact/ui/Layout';
import GridItem from '../../../components/GridItem';
import Page from '../../../components/DocsPage';
import SiteSection from '../../../components/SiteSection';
import SiteTitle from '../../../components/SiteTitle';

import libraryDescriptions from '../../../data/libraryDescription.json';

import css from '../../../css/main.module.less';
import componentCss from './index.module.less';

// images
import modules from '../images/modules.svg';
// package images
import core from '../images/package-core.svg';
import i18n from '../images/package-i18n.svg';
import moonstone from '../images/package-moonstone.svg';
import spotlight from '../images/package-spotlight.svg';
import ui from '../images/package-ui.svg';
import webos from '../images/package-webos.svg';

const packageImages = {
	core,
	i18n,
	moonstone,
	spotlight,
	ui,
	webos
};

export const frontmatter = {
	title: 'API Libraries',
	description: 'Enact API Documentation'
};

const Doc = class ReduxDocList extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	render () {
		const {data} = this.props;
		// TODO: pre-filter
		const componentDocs = data.modulesList.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;

		return (
			<Page {...this.props}>
				<SiteTitle {...this.props} title={frontmatter.title}>
					<SiteSection className={css.libraryList + ' covertLinks'}>
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<h1 className={css.withCaption}><img alt="Building blocks" src={modules} />{frontmatter.title}</h1>
						<div className={css.caption}>
							<p>Select a library to explore the Enact API</p>
						</div>
						<Row wrap style={{margin: '0 3em'}}>
							{componentDocs.map((section, index) => {
								const linkText = section.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
								const library = linkText.split('/')[0];
								if (library && libraryDescriptions[library] && library !== lastLibrary) {
									lastLibrary = library;
									const image = libraryDescriptions[library].icon ?
										withPrefix(libraryDescriptions[library].icon) :
										packageImages[library];
									return (
										<GridItem
											className={componentCss.gridItem}
											key={index}
											to={section.node.fields.slug}
											description={libraryDescriptions[library].description}
											style={{marginBottom: '1em'}}
											version={libraryDescriptions[library].version}
										>
											<img className={componentCss.image} alt="" src={image} />
											<strong>{library}</strong> Library
										</GridItem>
									);
								}
							})}
						</Row>
					</SiteSection>
				</SiteTitle>
			</Page>
		);
	}
};

export const jsonQuery = graphql`
	query modulesDoc {
		modulesList: allJsonDoc(
			sort: {fields: [fields___slug], order: ASC}
		) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
	}
`;
export default Doc;
