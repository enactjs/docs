import {mdastToMarkdown, typeToString} from '../utils/utils.js';

const ParametersSection = (params) => {
	const getParams = () => {
		return params.map(param => {
			const paramType = typeToString(param.type);
			const description = param.description ? mdastToMarkdown(param.description) : '';

			return (
				`<dt style={{color: "#9acd32", margin: 0, fontWeight: 500}}>${param?.name || ''}</dt>
					${description && description.trim()}`
			);
		});
	}

	return (
		`<div style={{display: "flex", flexDirection: "column"}}>
			<Badge style={{borderRadius: "6px 6px 0 0", border: "none", backgroundColor: "#9acd32", width: "fit-content"}} text="1 Param" variant="success" />
			<div style={{borderRadius: "0 0 6px 6px", borderTop: "1px solid #9acd32", backgroundColor: "rgba(154, 205, 50, .2)", padding: "12px"}}>
				${getParams()}
			</div>
		</div>`
	)
}

export default ParametersSection;