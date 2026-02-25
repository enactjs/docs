import css from "./Code.module.css";

const Code = ({children}) => {
	return (
		<pre className={css.code}>
			<code>{children}</code>
		</pre>
	)
}

export default Code;