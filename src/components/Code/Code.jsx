import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

import css from './Code.module.css';
import './github.css';

const Code = ({children}) => {
	if (typeof children === 'string') {
		hljs.registerLanguage('javascript', javascript);
		const highlight = hljs.highlight(children, {language: 'javascript', ignoreIllegals: true});

		return (
			<pre className={css.code}>
				<code className="hljs" dangerouslySetInnerHTML={{__html: highlight.value}} />
			</pre>
		);
	}

	return (
		<pre className={css.code}>
			<code className="hljs">{children}</code>
		</pre>
	);
}

export default Code;