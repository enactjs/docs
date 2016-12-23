import Button from '@enact/moonstone/Button';
import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import React from 'react';

const app = kind({
	name: 'Sample',

	render: () => (
		<Button>Hello</Button>
	)
});

export default MoonstoneDecorator({i18n: false}, app);
