import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/command-line/prism-command-line.css';

export const onRouteUpdate = ({location}) => {
	if (location.hash) {
		setTimeout(() => {
			let node;
			if (location.hash.includes('.')) {
				// To select the element using `querySelector()` we escape the period in the ID with two backslashes
				const parsedHashLocation = location.hash.replace(/\./g, '\\.');
				node = document.querySelector(parsedHashLocation);
			} else {
				node = document.querySelector(`${location.hash}`);
			}

			if (node) {
				node.scrollIntoView();
			} else {
				console.log(`Invalid location: ${location.hash}`);	// eslint-disable-line no-console
			}
		}, 5);
	}
};
