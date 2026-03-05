import {getPropertyTypeColor} from '../utils';

/**
 *
 * @param docsPath
 * @returns {Promise<*>}
 */
const getJSONData = async (docsPath) => {
	let data;
	const allJsonFiles = import.meta.glob('@moduleData/**/**/index.json');
	if (allJsonFiles[docsPath]) {
		const module = await allJsonFiles[docsPath]();
		data = module.default[0];
	}

	return data;
}

/**
 *
 * @param data
 */
const getMembers = (data) => {
	const members = data.members.static.map((member) => member);
	const memberName = data.members.static[0].memberof.split('/').pop();
	members.sort((a, b) => {
		if (a.name === memberName) {
			return -1;
		} else if (b.name === memberName) {
			return 1;
		} else {
			return a.name < b.name ? -1 : 1;
		}
	});

	return [getMemberData(members), getTypeDefinitionsData(members)];
}

/**
 * Extract data for Members
 *
 * @param members
 */
const getMemberData = (members) => {
	const filteredData = members.filter((member) => !(member.kind === 'typedef'));

	return filteredData.map((member) => {
		const isClass = member.kind?.toLowerCase() === 'class' && member.constructorComment;
		const isComponent = member.tags.find((tag) => tag.title === 'ui');
		const isHoC = member.tags.find((tag) => tag.title === 'hoc');
		const isConstant = member.kind === 'constant' && !(member.type?.name === 'Object') && !isHoC;
		const isFunction = member.kind?.toLowerCase() === 'function';
		const isObject = member.kind === 'constant' && member.type?.name === 'Object';

		const badgeType =
			isClass ? 'Class' :
				isComponent ? 'Component' :
					isFunction ? 'Function' :
						isHoC ? 'Higher-Order Component' :
							isObject ? 'Object' :
								isConstant ? member.type.name : '';
		const badgeColor = getPropertyTypeColor(badgeType);

		return {
			// Member Types
			isClass,
			isComponent,
			isConstant,
			isFunction,
			isHoC,
			isObject,

			// Member Details
			badgeColor,
			badgeType,
			description: member.description,
			name: member.name,

			// Class Details
			classConstructor: member.constructorComment,

			// Member Import
			memberOf: member.memberof,

			// Members Properties
			properties: isObject ? member.properties : member.members.instance,

			// Function Details
			params: member.params,
			returns: member.returns,

			// Higher-Order Component Configuration
			staticProperties: member.members.static[0]?.members.static || [],

			// Module Schema
			tags: member.tags
		}
	}) || [];
}

/**
 * Extract data for Type Definitions
 *
 * @param members
 * @returns {*}
 */
const getTypeDefinitionsData = (members) => {
	const filteredData = members.filter((member) => member.kind === 'typedef');

	return filteredData.map((member) => {
		const badgeType = member.type?.name || 'Object';
		const badgeColor = getPropertyTypeColor(badgeType);

		return {
			badgeColor,
			badgeType,
			description: member.description,
			name: member.name,
			params: member.params,
			returns: member.returns,
			properties: member.properties,
		}
	}) || [];
}

export {getJSONData, getMembers, getMemberData, getTypeDefinitionsData};