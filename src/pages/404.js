import React from 'react';
import kind from '@enact/core/kind';

import SiteTitle from '../components/SiteTitle';

// images
import boom from './images/boom.svg';

export const frontmatter = {
	title: 'Whoopsie Doodle'
};

// TODO: Figure out how to prefix link to src image below!!!!
const FourOhFourBase = kind({
	name: '404',
	render (props) {
		return (<SiteTitle title={frontmatter.title} {...props}>
			<div style={{maxWidth: '60ex', margin: '4em auto', textAlign: 'justify'}}>
				<p><img alt="Laptop exploded" src={boom} style={{paddingRight: '6%'}} /></p>
				<p>There shall, in that time, be rumours of things going astray, and there shall be a great confusion as to where things really are, and nobody will really know where lieth those little things possessed by their developers that their developers put there only just the night before, about eight o&rsquo;clock.</p>
				<p style={{fontSize: '70%', textAlign: 'center'}}>(BTW, 404, Page not found)</p>
			</div>
		</SiteTitle>
		);
	}
});

export default FourOhFourBase;
