// Type
//
import kind from '@enact/core/kind';
import Link from 'gatsby-link';
import {OutboundLink} from 'gatsby-plugin-google-analytics';
import PropTypes from 'prop-types';
import React from 'react';

// Takes either a jsdoc `{@link}` or it takes a module name of the form `package/module.member` as
// well as an optional prefix string before the link.
const SmartLink = kind({
	name: 'SmartLink',

	propTypes: {
		moduleName: PropTypes.string,
		prefix: PropTypes.string,
		tag: PropTypes.object
	},

	computed: {
		parts: ({tag, moduleName}) => {
			let title = moduleName;

			if (tag) {
				// Parsing this will be difficult. http://usejsdoc.org/tags-see.html
				title = tag.description;
			}
			if (!title) {
				return;
			}

			// Matching "{@link linkref|linkdesc} Extra text after"
			const linkRegex = /(?:{@link )?([^| }]+)\|*([^}]*)}(.*)/;

			// Matches non-link style module reference.  "moonstone/Module.Component.property Extra text"
			// Currently doesn't require a '/' in the module name because of Spotlight but would be
			// helpful, perhaps to require 'spotlight' or a slash
			const moduleRegex = /([^.#~ ]*)[#.~]?(\S*)?(.*)/;
			let linkText, link, res, extraText;

			res = title.match(linkRegex);
			if (res) {
				title = link = res[1];
				linkText = res[2] || title;
				extraText = res[3];
			} else {
				linkText = link = title;
			}

			// If the link isn't an http(s) link, treat it as local and parse the hell out of it.
			if (link.indexOf('http') !== 0) {
				res = title.match(moduleRegex);
				if (res) {	// Match is very permissive so this is safe bet
					link = '/docs/modules/' + res[1] + '/';
					if (res[2]) {
						link += '#' + res[2];
						// TODO: Do we need to prefix this?
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

	render: ({parts = {}, prefix, ...rest}) => {
		const {title, link, linkText, extraText} = parts;
		let anchor;
		delete rest.tag;
		delete rest.moduleName;

		if (!link) {
			return;
		}

		if (link.indexOf('http') === 0) {
			anchor = <OutboundLink href={link}>{linkText}</OutboundLink>;
		} else if (link) {
			anchor = <Link to={link} data-tooltip={title}>{linkText}</Link>;
		}

		return (
			<div {...rest}>
				{prefix ? prefix : ''}{anchor}
				{extraText}
			</div>
		);
	}
});

export default SmartLink;
export {SmartLink};

