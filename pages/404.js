import React from 'react';
import DocumentTitle from 'react-document-title';
import kind from '@enact/core/kind';

import Page from '../components/Page';

import {config} from 'config';

const metadata = {
	title: 'Whoopsie Doodle'
};

const FourOhFourBase = kind({
	name: '404',
	render (props) {
		return (<DocumentTitle title={`${metadata.title} | ${config.siteTitle}`}>
			<Page {...props}>
				<div style={{maxWidth: '60ex', margin: '4em auto', textAlign: 'justify'}}>
					<p><img alt="Laptop exploded" src="images/boom.svg" style={{paddingRight: '6%'}} /></p>
					<p>There shall, in that time, be rumours of things going astray, and there shall be a great confusion as to where things really are, and nobody will really know where lieth those little things possessed by their developers that their developers put there only just the night before, about eight o&apos;clock.</p>
					<p style={{fontSize: '70%', textAlign: 'center'}}>(404, Page not found)</p>
				</div>
			</Page>
		</DocumentTitle>
		);
	}
});

FourOhFourBase.data = {
	title: '404'
};

export default FourOhFourBase;
