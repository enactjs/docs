import {DocParse, MemberFunction, Tooltip} from '../index.js';
import {getPropertyTypeColor, typeToString} from '../utils';

import css from './MemberObject.module.css'

const MemberObjectTypeDef = ({children = null, member}) => {
	const renderTypeDefProperties = () => {
		return member.properties.map((typeDef, index, arr) => {
			const typeString = typeToString(typeDef.type);
			const convertedTypeString = typeString.replace('?', '')
			const isOptional = typeString.includes('?');

			return (
				<div key={index}>
					<div className={css.defPropsContainer}>
						<dt className={css.title}>
							<Tooltip title={isOptional ? 'Optional' : 'Required Property'}>
								<span style={{color: !isOptional && 'red'}}> &#x2022; </span>
							</Tooltip>
							{typeDef.name}
						</dt>
						<span className={css.type} style={{color: getPropertyTypeColor(convertedTypeString)}}>
							{convertedTypeString}
						</span>
						<span className={css.description}>
							<DocParse description={typeDef.description} />
						</span>
					</div>
					{(index < arr.length - 1 && <hr />)}
				</div>
			)
		})
	}

	if (member.badgeType === 'Function') {
		return (
			<>
				{children}
				<MemberFunction member={member} typeDefObjectFunction />
			</>
		)

	}

	return (
		<>
			<DocParse description={member.description} />
			{renderTypeDefProperties()}
		</>
	)
}

export default MemberObjectTypeDef;