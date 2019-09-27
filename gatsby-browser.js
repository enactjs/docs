const ReactDOM = require('react-dom');

export const onRouteUpdate = (location) => {
	if (location.hash) {
		setTimeout(() => {
			const node = document.querySelector(`${location.hash}`);
			if (node) {
				node.scrollIntoView();
			} else {
				console.log(`Invalid location: ${location.hash}`);	// eslint-disable-line no-console
			}
		}, 0);
	}
};

export function replaceHydrateFunction () {
	return (element, container, callback) => {
		ReactDOM.render(element, container, callback);
	};
}
