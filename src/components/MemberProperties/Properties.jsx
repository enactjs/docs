import {DocParse, Link} from '../index.js';

import css from './MemberProperties.module.css';

const Properties = ({children, propsData}) => {
	const renderDefaultValue = (defaultValue) => {
		if (defaultValue) {
			return (
				<var>
					<span className={css.defaultValue}>Default:&emsp;</span>
					{defaultValue.description}
				</var>
			)
		}
	}

	const renderSeeLink = (link) => {
		if (link) {
			return (
				<div className={css.seeLink}>
					<span>See:&emsp;</span>
					<Link reference={link} />
				</div>
			)
		}
	}

	return (
		<div className={css.propContainer}>
			<div className={css.propSection}>
				{children}
			</div>
			<div className={css.descriptionSection}>
				<DocParse doc={propsData.description} />
				{renderDefaultValue(propsData.defaultValue)}
				{renderSeeLink(propsData.see)}
			</div>
		</div>
	)
}

export default Properties;