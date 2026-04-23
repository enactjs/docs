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

		return `${localBaseLink}${reference.replace('.', '/#').toLowerCase()}`;
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