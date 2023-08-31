// Code
//
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import hljs from 'highlight.js';

const Code = kind({
	name: 'Code',

	propTypes: {
		children: PropTypes.string,
		type: PropTypes.string
	},

	defaultProps: {
		type: 'JavaScript'
	},

	render: ({children, type, ...rest}) => {
		const highlight = hljs.highlight(type, children, true);
		return (
			<pre {...rest} >
				<code
					className="code block"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{__html: highlight.value}}
				/>
			</pre>
		);
	}
});

export default Code;
