import * as React from 'react';
import Spotlight from '@enact/spotlight';

import {
	LiveProvider,
	LiveEditor,
	LiveError,
	LivePreview
} from 'react-live';

import css from './EnactLiveEdit.module.less';

const App = ({code, components, extraScope}) => {
	return (
		<LiveProvider code={code} scope={{React, ...components, ...extraScope}}>
			<LiveEditor className={css.prismCode} onFocus={Spotlight.pause} onBlur={Spotlight.resume} tabIndex={-1} />
			<LiveError className={css.error} />
			<div className={css.sandbox}>
				<LivePreview className={css.reactLivePreview} />
			</div>
		</LiveProvider>
	)
}

export default App;