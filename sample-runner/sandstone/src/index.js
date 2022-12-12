import {createRoot} from 'react-dom/client';

import App from './App';

// TODO: Set up skin appropriately for different themes!
// const appElement = (<App skin="light" />);
const appElement = (<App />);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const container = document.getElementById('root');

	createRoot(container).render(appElement);
}

export default appElement;
