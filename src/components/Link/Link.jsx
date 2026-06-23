import {withBase} from '@utils';
import {Tooltip} from '../index.js';

import css from './Link.module.css';

const Link = ({title, linkTitle, reference}) => {
	const localBaseLink = withBase('modules/');

	const getHref = () => {
		if (!reference) return;
		if (!title) linkTitle = reference;

		const isExternal = reference.includes('http');
		const isSeeLink = reference.includes('@link');

		if (isExternal) {
			return reference;
		}

		// Absolute internal paths (old Gatsby /docs/ prefix or already-absolute)
		if (reference.startsWith('/')) {
			const path = reference.startsWith('/docs/')
				? reference.slice('/docs'.length)
				: reference;
			return withBase(path);
		}

		if (isSeeLink) {
			const link = reference.replace('}', '').split(' ')[1]
			if (!title) linkTitle = link;

			const [first, ...last] = link.split('.');
			const fullLink = first + '/#' + last.at(-1);
			return `${localBaseLink}${fullLink.toLowerCase()}`;
		}

		if (reference.includes('~')) {
			return `${localBaseLink}${reference.replace('~', '/#').toLowerCase()}`
		}

		const resolved = `${localBaseLink}${reference.replace('.', '/#').toLowerCase()}`;
		// Collapse /modules/foo/foo[/#anchor] → /modules/foo[/#anchor]
		// Happens when a class name matches its module name (e.g. spotlight/Spotlight)
		return resolved.replace(/\/modules\/([^/#]+)\/\1(\/|#|$)/, '/modules/$1$2');
	}

	const href = getHref();

	return (
		<Tooltip
			title={(title || linkTitle)?.split(/[.~]/).at(0)}
			style={{backgroundColor: '#fff7cc', border: '1px solid #fd3', color: '#666', fontStyle: 'normal'}}
		>
			<a className={css.link} href={href}>{title || linkTitle}</a>
		</Tooltip>
	)
}

export default Link;