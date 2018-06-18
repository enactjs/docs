// paths.js
// ---
// utils for determining a page's path on the site
//

import {config} from '../config';

// const rootPath = config.linkPrefix;

const sitePrefixMatchRegexp = new RegExp(`^${config.linkPrefix}`);

// The first argument is an exact match for the second argument
const linkIsLocation = (link, loc) => {
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc === fullLink);
};

// The first argument supplied is the same as the second argumment or is the parent of
const linkIsBaseOf = (link, loc) => {
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc.search(fullLink) === 0);
};

// The first argument is explicitly the parent of the second argument
const linkIsParentOf = (link, loc) => {
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc.search(fullLink) === 0 && (fullLoc !== fullLink));
};

export {
	linkIsLocation,
	linkIsBaseOf,
	linkIsParentOf,
	// rootPath
	sitePrefixMatchRegexp
};
