import {typeToString} from '../utils/index.js';

const formatProps = (props) => {
	return props.map((prop, index) => {
		const propName = prop.name || `property${index}`;
		const propType = typeToString(prop.type).split('|');

		let see = null;
		let defaultValue = null;
		let required = false;

		if (prop.tags.length) {
			prop.tags.forEach((tag) => {
				if (tag.title === 'default') defaultValue = tag;
				if (tag.title === 'see') see = tag.description;
				if (tag.title === 'required') required = true;
			});
		}

		return {
			defaultValue,
			description: prop.description,
			propName,
			propType,
			required,
			see
		}
	});
}

export const getPropertiesData = (props, staticProps) => {
	return [formatProps(props), formatProps(staticProps)];
}