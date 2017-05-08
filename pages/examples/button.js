import Button from '@enact/moonstone/Button';
import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import React from 'react';
import Spotlight from '@enact/spotlight';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

const MoonstonePreview = MoonstoneDecorator(LivePreview);

const spotlightPause = () => { Spotlight.pause(); }
const spotlightResume = () => { Spotlight.resume(); }

const app = () => (<LiveProvider code="<Button>Hello</Button>" scope={{React, Button, MoonstoneDecorator}}>
  <LiveEditor onFocus={spotlightPause} onBlur={spotlightResume} tabIndex={-1} />
  <LiveError />
  <div style={{position: 'relative', minHeight: '200px', width: '100%'}}>
	  <MoonstonePreview />
  </div>
</LiveProvider>);

export default app;

//const app = kind({
	//name: 'Sample',

	//render: (props) => (
		//<div {...props}>
			//<Button>Hello</Button>
		//</div>
	//)
//});

//export default MoonstoneDecorator(app);
