import {Tooltip} from '../index.js';
import css from './Link.module.css';

const Link = ({title = '', reference}) => {
	let linkTitle = title || 'Link';
	const localBaseLink = '/modules/';

	const href = () => {
		if (!reference) return;

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

		return `${localBaseLink}${reference.replace('.', '/#').toLowerCase()}`;
	}

	return (
		<Tooltip
			title={linkTitle.split('.').at(0)}
			style={{backgroundColor: '#fff7cc', border: '1px solid #fd3', color: '#666', fontStyle: 'normal'}}
		>
			<a className={css.link} href={href()}>{linkTitle}</a>
		</Tooltip>
	)
}

export default Link;