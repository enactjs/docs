import DocParse from '../DocParse/DocParse';
import {Link, Tooltip} from '../index';
import {getPropertyTypeColor, typeToString} from '../utils';

import css from './MemberFunction.module.css';

const ParamsReturnsSection = ({data = [], type = 'params'}) => {
	return data.map((value, index) => {
			const paramType = typeToString(value.type).split('|').map((type, index, arr) => {
				const isLink = type.includes('/');
				const formatedType = type.trim().replace('?', '');

				return (
					<span key={index + '_type'}>
						<var className={css.sectionVar} style={{color: getPropertyTypeColor(formatedType)}}>
							{isLink ? <Link linkTitle={formatedType} reference={formatedType} /> : formatedType}
						</var>
						{index < arr.length - 1 && <span style={{color: 'gray', fontWeight: '400'}}> | </span>}
					</span>
				)
			});
			const description = value.description;
			const isOptional = value.type.type.includes('Optional');
			const hasProperties = value.properties?.length > 0;
			const valueName = value.name?.includes('.') ? value.name.split('.').at(-1) : value.name;

			return (
				<dl key={index + '_section'} className={css.section + ' ' + css[type]}>
					<dt className={css[type + 'Definition']}>
						{isOptional && <Tooltip title="Optional"> &#x2022; </Tooltip>}
						{valueName}&emsp;{paramType}
					</dt>
					<dd>
						<DocParse doc={description} />
					</dd>
					{hasProperties && (
						<div>
							<h6 className={css.header + ' ' + css.params}>Object keys for {value.name}</h6>
							<ParamsReturnsSection data={value.properties} />
						</div>
					)}
				</dl>
			)
		}
	)
}

export default ParamsReturnsSection;
