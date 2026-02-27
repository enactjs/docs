import {getPropertyTypeColor} from '../utils/index.js';

const getJSONData = async (docsPath) => {
	let data;
	const allJsonFiles = import.meta.glob('@moduleData/**/**/index.json');
	if (allJsonFiles[docsPath]) {
		const module = await allJsonFiles[docsPath]();
		data = module.default[0];
	}

	return data;
}

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

const getMemberData = (members) => {
	return members.map((member) => {
		const isHoC = member.tags.find((tag) => tag.title === 'hoc') && member?.kind?.toLowerCase() === 'constant';
		const isFunction = member.kind?.toLowerCase() === 'function';
		const isTypeDefObject = member.type?.name.toLowerCase() === 'object' && member.kind?.toLowerCase() === 'typedef';
		const isObject = member.type?.name.toLowerCase() === 'object' && member.kind?.toLowerCase() === 'constant';
		const isComponent = member.kind?.toLowerCase() === 'class';
		const badgeType = isHoC ? 'High-Order Component' : isFunction ? 'Function' : (isTypeDefObject || isObject) ? 'Object' : 'Component';
		const badgeColor = getPropertyTypeColor(badgeType);

		return {
			badgeColor,
			badgeType,
			description: member.description,
			isComponent,
			isFunction,
			isHoC,
			isObject,
			isTypeDefObject,
			memberOf: member.memberof,
			name: member.name,
			params: member.params,
			properties: member.members.instance || [],
			returns: member.returns,
			staticProperties: member.members.static[0]?.members.static || [],
			tags: member.tags,
			typeDefProperties: member.tags?.filter((tag) => tag.title === 'property') || [],
		}
	}).sort((a, b) => {
		const getWeight = (val) => {
			if (val.isTypeDefObject) return 2;
			if (val.isObject) return 1;
			return 0;
		};

		return getWeight(a) - getWeight(b);
	});
}

export {getJSONData, getMembers, getMemberData};