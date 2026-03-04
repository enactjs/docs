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

	return members;
}

/**
 *
 * @param members
 */
const getMemberData = (members) => {
	const filteredData = members.filter((member) => !(member.kind === 'typedef'));

	return filteredData.map((member) => {
		const isClass = member.kind?.toLowerCase() === 'class' && member.constructorComment;
		const isComponent = member.tags.find((tag) => tag.title === 'ui');
		const isFunction = member.kind?.toLowerCase() === 'function';
		const isHoC = member.tags.find((tag) => tag.title === 'hoc');
		const isConstant = member.kind === 'constant';

		const badgeType =
			isClass ? 'Class' :
				isComponent ? 'Component' :
					isFunction ? 'Function' :
						isHoC ? 'Higher-Order Component' :
							isConstant ? member.type.name : 'Component';
		const badgeColor = getPropertyTypeColor(badgeType);

		return {
			badgeColor,
			badgeType,
			description: member.description,
			isClass,
			isComponent,
			isConstant,
			isFunction,
			isHoC,
			memberOf: member.memberof,
			name: member.name,
			params: member.params,
			properties: member.members.instance || [],
			returns: member.returns,
			staticProperties: member.members.static[0]?.members.static || [],
			tags: member.tags
		}
	}) || [];
}

/**
 *
 * @param members
 * @returns {*}
 */
const getTypeDefinitionsData = (members) => {
	const filteredData = members.filter((member) => member.kind === 'typedef');

	return filteredData.map((member) => {
		const badgeType = member.type?.name || 'Object';
		const badgeColor = getPropertyTypeColor(badgeType);

		const typeDefProperties = member.properties || [];
		const typeDefFunctionParams = member.params || [];
		const typeDefFunctionReturns = member.returns || [];

		return {
			badgeColor,
			badgeType,
			description: member.description,
			name: member.name,
			params: typeDefFunctionParams,
			returns: typeDefFunctionReturns,
			typeDefProperties
		}
	}) || [];
}

export {getJSONData, getMembers, getMemberData, getTypeDefinitionsData};