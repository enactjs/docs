import css from './Link.module.css';

const Link = ({title, reference}) => {
	const getLinkHref = (link) => {
		return `/modules/${link.replace('.', '#').toLowerCase()}`;
	}

	return (
		<a className={css.link} href={reference}>{title}</a>
	)
}

export default Link;