import kind from '@enact/core/kind';
import React from 'react';
import EnactLiveEdit from './EnactLiveEdit';

const MainPanel = kind({
	name: 'Main',

	render: (props) => (
		<EnactLiveEdit {...props} />
	)
});

export default MainPanel;
