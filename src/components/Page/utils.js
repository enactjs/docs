import {getPropertyTypeColor} from '../utils';

const allJsonFiles = import.meta.glob('@moduleData/**/**/index.json');

/**
 * Fetches JSON data for a specific module based on its path.
 *
 * @param {string} docsPath - The path to the module's index.json file.
 * @returns {Promise<Object|undefined>} A promise that resolves to the module's data object, or undefined if not found.
 */
const getJSONData = async (docsPath) => {
	if (allJsonFiles[docsPath]) {
		return (await allJsonFiles[docsPath]()).default[0];
	}
};

/**
 * Determines the appropriate badge label for a documentation member.
 *
 * The badge type is determined based on the member's kind and specific metadata
 * flags (e.g., isClass, isComponent). If the member is a constant, it falls back
 * to the name of its data type.
 *
 * @param {Object} member - The raw documentation member object.
 * @param {Object} types - An object containing boolean flags for member classification.
 * @returns {string} The badge label (e.g., 'Class', 'Function', 'Object') or an empty string.
 */
const getBadgeType = (member, types) => {
	const {isClass, isComponent, isFunction, isHoC, isObject, isConstant} = types;

	if (isClass) return 'Class';
	if (isComponent) return 'Component';
	if (isFunction) return 'Function';
	if (isHoC) return 'Higher-Order Component';
	if (isObject) return 'Object';
	if (isConstant) return member.type?.name || '';

	return '';
};

/**
 * Extracts and transforms raw member data into a structured format for UI components.
 *
 * It identifies the type of each member (Class, Component, Function, etc.),
 * assigns appropriate badges/colors, and maps properties like parameters,
 * return values, and tags.
 *
 * @param {Array<Object>} members - A list of raw member objects.
 * @returns {Array<Object>} A list of formatted member data objects.
 */
const getMemberData = (members) => {
	const filteredData = Array.isArray(members) ?
		members.filter((member) => member && member.kind !== 'typedef') :
		[];

	return filteredData.map((member) => {
		const isClass = !!(member.kind?.toLowerCase() === 'class' && member.constructorComment);
		const isComponent = !!member.tags?.find((tag) => tag.title === 'ui');
		const isHoC = !!member.tags?.find((tag) => tag.title === 'hoc');
		const isConstant = !!(member.kind === 'constant' && !(member.type?.name === 'Object') && !isHoC);
		const isFunction = member.kind?.toLowerCase() === 'function';
		const isObject = !!(member.kind === 'constant' && member.type?.name === 'Object');

		const badgeType = getBadgeType(member, {isClass, isComponent, isFunction, isHoC, isObject, isConstant});
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
			description: member.description || '',
			name: member.name || '',

			// Class Details
			classConstructor: member.constructorComment || {},

			// Member Import
			memberOf: member.memberof || '',

			// Members Properties
			properties: isObject ? (member.properties || []) : (member.members?.instance || []),

			// Function Details
			params: member.params || [],
			returns: member.returns || [],

			// Higher-Order Component Configuration
			staticProperties: member.members?.static?.[0]?.members?.static || [],

			// Module Schema
			tags: member.tags || []
		};
	}) || [];
};

/**
 * Extracts and formats type definition (typedef) data.
 *
 * @param {Array<Object>} members - A list of raw member objects.
 * @returns {Array<Object>} A list of formatted type definition objects.
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
			properties: member.properties
		};
	}) || [];
};

/**
 * Processes documentation data to extract and sort members and type definitions.
 *
 * It filters the static members, sorts them alphabetically (ensuring the main module
 * member is first), and splits them into general members and type definitions.
 *
 * @param {Object} data - The raw JSON data for a module.
 * @param {Object} data.members - Members container.
 * @param {Array} data.members.static - List of static members in the module.
 * @returns {Array<Array>} An array containing two arrays: [memberData, typeDefinitionsData].
 */
const getMembers = (data) => {
	if (!data?.members?.static || data.members.static.length === 0) {
		return [[], []];
	}

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
};

export {getJSONData, getMembers, getMemberData, getTypeDefinitionsData};
