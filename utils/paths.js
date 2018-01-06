// paths.js
// ---
// utils for determining a page's path on the site
//

// import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';

// const rootPath = config.linkPrefix;

// The first argument is an exact match for the second argument
const linkIsLocation = (link, loc) => {
	const fullLink = prefixLink(link);
	return (loc === fullLink);
};

// The first argument supplied is the same as the second argumment or is the parent of
const linkIsBaseOf = (link, loc) => {
	const fullLink = prefixLink(link);
	return (loc.search(fullLink) === 0);
};

// The first argument is explicitly the parent of the second argument
const linkIsParentOf = (link, loc) => {
	const fullLink = prefixLink(link);
	return (loc.search(fullLink) === 0 && (loc !== fullLink));
};

export {
	linkIsLocation,
	linkIsBaseOf,
	linkIsParentOf
	// rootPath
};
