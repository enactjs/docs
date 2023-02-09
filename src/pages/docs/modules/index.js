import {graphql, useStaticQuery} from 'gatsby';
import {withPrefix} from 'gatsby-link';
import {StaticImage as Image, GatsbyImage, getImage} from "gatsby-plugin-image";
import PropTypes from 'prop-types';
import {Component} from 'react';
import {Helmet} from 'react-helmet';

import {Row} from '@enact/ui/Layout';
import GridItem from '../../../components/GridItem';
import Page from '../../../components/DocsPage';
import SiteSection from '../../../components/SiteSection';
import SiteTitle from '../../../components/SiteTitle';

import libraryDescriptions from '../../../data/libraryDescription.json';

import css from '../../../css/main.module.less';
import componentCss from './index.module.less';

// package images
// import core from '../images/package-core.svg';
// import i18n from '../images/package-i18n.svg';
// import moonstone from '../images/package-moonstone.svg';
// import spotlight from '../images/package-spotlight.svg';
// import ui from '../images/package-ui.svg';
// import webos from '../images/package-webos.svg';

// const packageImages = {
// 	core,
// 	i18n,
// 	moonstone,
// 	spotlight,
// 	ui,
// 	webos
// };

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
		console.log(this.props);
		// TODO: pre-filter
		const componentDocs = data.modulesList.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;
		// console.log('componentDocs', componentDocs);
		const imgArray = this.props.data.image.edges;
		let imagesArray = [];
		let renderImage;
		imgArray.forEach((item) => {
			const lastName = item.node.publicURL.split('/')[3];
			console.log('lastName', lastName);
			if (item.node.publicURL.includes(lastName)) {
				imagesArray.push(item.node.publicURL);
			}
		})
		console.log('imagesArray', imagesArray);
		const packageImages = {
			core: imagesArray[0],
			i18n: imagesArray[1],
			moonstone: imagesArray[2],
			spotlight: imagesArray[3],
			ui: imagesArray[4],
			webos: imagesArray[5]
		};

		return (
			<Page {...this.props}>
				<SiteTitle {...this.props} title={frontmatter.title}>
					<SiteSection className={css.libraryList + ' covertLinks'}>
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<h1 className={css.withCaption}><Image className={css.image} alt="Building blocks" loading="eager" placeholder="none" src="../images/modules.svg" />{frontmatter.title}</h1>
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
											<img className={componentCss.image} alt="image" src={image} />
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
		image: allFile(
    filter: {extension: {in: "svg"}, relativeDirectory: {eq: "docs/images"}, name: {regex: "/package/"}, publicURL: {}}
  ) {
    edges {
      node {
        publicURL
      }
    }
  }
	}
`;

// export const pageQuery = graphql`
// 	query {
// 		packageImages: allFile(
//     		filter: {extension: {regex: "/svg/"}, relativeDirectory: {eq: "docs/images"}, name: {regex: "/package/"}}
//   		) {
//     		edges {
//       			node {
//         			id
//         			base
//       			}
//     		}
//   		}
// 	}
// `;
export default Doc;
