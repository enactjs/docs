import React from 'react';
import ModulesList from '../../../components/ModulesList.js';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';

export default class DocList extends React.Component {

	static metadata () {
		return {
			title: 'Modules'
		};
	}

	render () {
		return (
			<DocumentTitle title={`${DocList.metadata().title} | ${config.siteTitle}`}>
				<article className="libraryList">
					<h1>Modules by Library</h1>
					<ModulesList route={this.props.route} useFullModulePath />
				</article>
			</DocumentTitle>
		);
	}
}

// For reasons that I can't explain, using a const with this value and sharing with above does not work!
exports.data = {
	title: 'Modules'
};
