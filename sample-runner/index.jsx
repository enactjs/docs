import { Suspense, lazy } from 'react';

const loadComponent = (name) => {
	const components = {
		Button: lazy(() => import('').then(m => ({ default: m.Button }))),
		Picker: lazy(() => import('@enact/agate').then(m => ({ default: m.Picker })))
	};
	return components[name];
};

export default function AgateComponent({ component, ...props }) {
	const Component = loadComponent(component);
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Component {...props} />
		</Suspense>
	);
}