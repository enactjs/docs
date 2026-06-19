import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';

import 'highlight.js/styles/vs2015.css';
import css from './Code.module.css';

const Code = ({children}) => {
	if (typeof children === 'string') {
		hljs.registerLanguage('xml', xml);
		const highlight = hljs.highlight(children, {language: 'xml', ignoreIllegals: true});

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