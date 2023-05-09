import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/command-line/prism-command-line.css';

export const onRouteUpdate = ({location}) => {
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

export const onInitialClientRender = () => {
	if (window.location.hash) {
		setTimeout(() => {
			const node = document.querySelector(`${window.location.hash}`);
			if (node) {
				node.scrollIntoView();
			} else if (window.location.hash.includes('.')) {
				// To select the element using `querySelector()` we escape the period in the ID with two backslashes
				const parsedHashLocation = window.location.hash.replace(/\./g, '\\.');
				const node = document.querySelector(parsedHashLocation);
				if (node) {
					node.scrollIntoView();
				}
			} else {
				console.log(`Invalid location: ${window.location.hash}`); // eslint-disable-line no-console
			}
		}, 0);
	}
};
