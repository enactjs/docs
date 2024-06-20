// Type
//
import kind from '@enact/core/kind';

import css from './See.module.less';

const See = kind({
	name: 'See',

	styles: {
		css,
		className: 'see'
	},

	render: ({children, ...rest}) => {
		return <div {...rest}>
			See: {children}
		</div>;
	}
});

export default See;
export {See};
