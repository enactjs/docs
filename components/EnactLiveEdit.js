import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import React from 'react';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';

import enactComponents from './helpers/EnactImporter';

const MoonstonePreview = MoonstoneDecorator({ri: false, textSize: false}, LivePreview);

const app = ({code, extraScope = {}}) => (<LiveProvider code={code} scope={{React, ...enactComponents, ...extraScope}}>
	<LiveEditor onFocus={Spotlight.pause} onBlur={Spotlight.resume} tabIndex={-1} />
	<LiveError />
	<div style={{position: 'relative', minHeight: '200px', width: '100%'}}>
		<MoonstonePreview skin="light" />
	</div>
</LiveProvider>);

app.propTypes = {
	code: PropTypes.string,
	extraScope: PropTypes.array
};

export default app;

