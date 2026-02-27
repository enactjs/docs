import {DocParse, Tooltip} from '../index.js';
import {getPropertyTypeColor, typeToString} from '../utils/index.js';

import css from './MemberObject.module.css'

const MemberObject = ({member}) => {
	const renderTypeDefProperties = () => {
		return member.typeDefProperties.map((typeDef, index, arr) => {
			const typeString = typeToString(typeDef.type);
			const convertedTypeString = typeString.replace('?', '')
			const isOptional = typeString.includes('?');

			return (
				<>
					<div key={index} className={css.defPropsContainer}>
						<dt className={css.title}>{typeDef.name}</dt>
						<span className={css.type}>
						<span style={{color: getPropertyTypeColor(convertedTypeString), fontSize: '90%'}}>
							{convertedTypeString}
							{isOptional && (
								<Tooltip title="Optional" style={{backgroundColor: '#f4ffcc', border: '1px solid #fd3', color: '#666', fontStyle: 'normal'}}>
									<span> &#x2022; </span>
								</Tooltip>
							)}
						</span>
					</span>
						<span className={css.description}>{typeDef.description}</span>
					</div>
					{(index < arr.length - 1 && <hr />)}
				</>
			)
		})
	}

	return (
		<>
			<DocParse doc={member.description} />
			{renderTypeDefProperties()}
		</>
	)
}

export default MemberObject;