import Button from '@enact/moonstone/Button';
import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import React from 'react';

const app = kind({
	name: 'Sample',

	render: (props) => (
		<div {...props}>
			<Button>Hello</Button>
		</div>
	)
});

export default MoonstoneDecorator(app);
