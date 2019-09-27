// paths.js
// ---
// utils for determining a page's path on the site
//

/* global __PATH_PREFIX__ */
let pathPrefix = '';
if (typeof __PATH_PREFIX__ !== 'undefined') {
	pathPrefix = __PATH_PREFIX__;
}

const sitePrefixMatchRegexp = new RegExp(`^${pathPrefix}`);

// Remove the site prefix, if present.
const canonicalPath = (link) => {
	return link.replace(sitePrefixMatchRegexp, '');
};

// The first argument is an exact match for the second argument
const linkIsLocation = (link, loc) => {
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc === fullLink);
};

// The first argument supplied is the same as the second argument or is the parent of
const linkIsBaseOf = (link, loc) => {
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc.search(fullLink) === 0);
};

// The first argument is explicitly the parent of the second argument
const linkIsParentOf = (link, loc) => {
	console.log(link, loc, pathPrefix)
	const fullLink = link.replace(sitePrefixMatchRegexp, '');
	const fullLoc = loc.replace(sitePrefixMatchRegexp, '');
	return (fullLoc.search(fullLink) === 0 && (fullLoc !== fullLink));
};

export {
	canonicalPath,
	linkIsLocation,
	linkIsBaseOf,
	linkIsParentOf,
	// rootPath
	sitePrefixMatchRegexp
};
