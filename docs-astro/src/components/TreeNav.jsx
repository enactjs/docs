// Modules List
//

import kind from '@enact/core/kind';
import {Link} from './Link';
import PropTypes from 'prop-types';

// import {linkIsLocation} from '../utils/paths.js';

import css from './TreeNav.module.less';

const exampleTree = [
	{
		title: 'Cat 1',
		to: 'aLink',
		active: true,
		children: [
			{title: 'Item 1', to: 'aLink', props: {}},
			{title: 'Item 2', to: 'aLink', active: true, props: {}},
			{title: 'Item 3', to: 'aLink', props: {}},
			{title: 'Item 4', to: 'aLink', props: {}}
		]
	},
	{
		title: 'Cat 2',
		children: [
			{title: 'Item 1', to: 'aLink', props: {}},
			{title: 'Item 2', to: 'aLink', props: {}},
			{title: 'Item 3', to: 'aLink', props: {}},
			{title: 'Item 4', to: 'aLink', props: {}}
		]
	}
];

const renderItem = (itemProps) => {
	const {title, active, to} = itemProps;
	const uniqueKey = title.replace(/\s/, '');
	return (
		<li key={uniqueKey} className={active ? css.active : null}>
			<Link to={to}>{title}</Link>
		</li>
	);
};

// eslint-disable-next-line enact/prop-types
const renderSection = ({title, active, children, to}) => {
	const uniqueKey = title.replace(/\s/, '');
	return (
		<section key={uniqueKey}>
			<h2 className={active ? css.active : null}><Link to={to}>{title}</Link></h2>
			{active && children.length > 0 ? (
				<ul>{children.map(renderItem)}</ul>) : null
			}
		</section>
	);
};


const TreeNavBase = kind({
	name: 'TreeNav',

	propTypes: {
		title: PropTypes.string,
		titleLink: PropTypes.string,
		tree: PropTypes.array
	},

	defaultProps: {
		tree: exampleTree
	},

	styles: {
		css,
		className: 'treeNav covertLinks'
	},

	render: ({title, titleLink, tree, ...rest}) => {
		return (
			<div {...rest}>
				<section>
					<h2>
						{titleLink ? <Link to={titleLink}>{title}</Link> : title}
					</h2>
				</section>
				{tree.map(renderSection)}
			</div>
		);
	}
});

export default TreeNavBase;
export {
	TreeNavBase,
	TreeNavBase as TreeNav
};
