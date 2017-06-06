// Type
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';

import css from './See.less';

const See = kind({
	name: 'See',

	propTypes: {
		tag: PropTypes.object.isRequired
	},

	styles: {
		css,
		className: 'see'
	},

	computed: {
		parts: ({tag}) => {
			// Parsing this will be difficult. http://usejsdoc.org/tags-see.html
			let title = tag.description;

			// Matching "{@link linkref|linkdesc} Extra text after"
			const linkRegex = /{@link ([^| }]+)\|*([^}]*)}(.*)/;

			// Matches non-link style module reference.  "moonstone/Module.Component.property Extra text"
			// Currently doesn't require a '/' in the module name because of Spotlight but would be
			// helpful, perhaps to require 'spotlight' or a slash
			const moduleRegex = /([^.~ ]*)[.~]?(\S*)?(.*)/;
			let linkText, link, res, extraText;

			res = title.match(linkRegex);
			if (res) {
				title = link = res[1];
				linkText = res[2] || title;
				extraText = res[3];
			} else {
				linkText = link = title;
			}

			// If the link isn't an http link, treat it as local and parse the hell out of it.
			if (link.indexOf('http:') === -1) {
				res = title.match(moduleRegex);
				if (res) {	// Match is very permissive so this is safe bet
					link = '/docs/modules/' + res[1] + '/';
					if (res[2]) {
						link += '#' + res[2];
						link = prefixLink(link);
						title = res[1];
					}
					if (linkText === title) {
						title = null;	// Don't have hover text if same as link text
					}
					extraText = extraText ? (extraText + res[3]) : res[3];
				} else {	// Somehow, didn't match, just use text and no link?
					link = null;
					extraText = extraText ? (title + extraText) : title;
				}
			}
			return {title, link, linkText, extraText};
		}
	},

	render: ({parts, ...rest}) => {
		const {title, link, linkText, extraText} = parts;
		let anchor;
		delete rest.tag;

		if (link.indexOf('http:') > -1) {
			anchor = <a href={link}>{linkText}</a>;
		} else if (link) {
			anchor = <Link to={link} data-tooltip={title}>{linkText}</Link>;
		}

		return (
			<div {...rest}>
				See: {anchor}
				{extraText}
			</div>
		);
	}
});

export default See;
export {See};
