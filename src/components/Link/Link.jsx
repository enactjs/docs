import {withBase} from '@utils';
import {Tooltip} from '../index.js';

import css from './Link.module.css';

const Link = ({title, linkTitle, reference}) => {
	const localBaseLink = withBase('modules/');

	const getHref = () => {
		if (!reference) return;
		if (!title) linkTitle = reference;

		const isExternal = reference.startsWith('http://') || reference.startsWith('https://');
		const isSeeLink = reference.includes('@link');

		if (isExternal && !isSeeLink) {
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
			const raw = reference.replace(/^\{?@link\s+/i, '').replace(/\}$/, '').trim();

			const pipeIdx = raw.indexOf('|');
			const target = pipeIdx !== -1 ? raw.slice(0, pipeIdx).trim() : raw;
			const displayText = pipeIdx !== -1 ? raw.slice(pipeIdx + 1).trim() : null;

			if (displayText) linkTitle = displayText;
			else if (!title) linkTitle = target;

			if (target.startsWith('http://') || target.startsWith('https://')) {
				return target;
			}

			const [first, ...last] = target.split('.');
			const fullLink = last.length > 0 ? first + '/#' + last.at(-1) : first;
			const formattedFullLink = fullLink.endsWith('/') ? fullLink : fullLink + '/';
			return `${localBaseLink}${formattedFullLink.toLowerCase()}`;
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