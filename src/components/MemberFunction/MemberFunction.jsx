import Code from '../Code/Code.jsx';
import DocParse from '../DocParse/DocParse.jsx';
import {Link} from '../index.js';
import {getPropertyTypeColor, typeToString} from '../utils/utils.js';

import css from './MemberFunction.module.css';

const MemberFunction = ({member}) => {
	const functionParams = member.params.map((value, index) => {
		return (
			<span key={index + '_params'}>
				<var className={css.functionCode}>{value.name}</var>
				{index < member.params.length - 1 && ', '}
			</span>
		)
	});

	const functionReturns = member.returns.map((value) => {
		const returns = typeToString(value.type).split('|');
		return returns.map((value, index) => {
			return (
				<span key={index + '_returns'}>
					<var className={css.functionCode} style={{color: getPropertyTypeColor(value.trim())}}>{value}</var>
					{index < returns.length - 1 && '|'}
				</span>
			)
		});
	})
	const functionCode = <>{member.name}( {functionParams} ) <span>&#8594;</span> {functionReturns}</>;
	const paramsNumber = member.params.length;

	const Section = ({data = [], type = 'params'}) => {
		return data.map((value, index) => {
			const paramType = typeToString(value.type).split('|').map((type, index, arr) => {
				const isLink = type.includes('/');
				return (
					<span key={index + '_type'}>
						<var className={css.sectionVar} style={{color: getPropertyTypeColor(type.trim())}}>
							{isLink ? <Link title={type} reference={type.trim()} /> : type}
						</var>
						{index < arr.length - 1 && <span style={{color: 'gray', fontWeight: '400'}}>|</span>}
					</span>
				)
			});
			const description = value.description;

				return (
					<dl key={index + '_section'} className={css.section + ' ' + css[type]}>
						<dt className={css[type + 'Definition']}>
							{value.name}&emsp;{paramType}
						</dt>
						<dd>
							<DocParse doc={description} />
						</dd>
					</dl>
				)
			}
		)
	}

	return (
		<>
			<Code>{functionCode}</Code>
			<DocParse doc={member.description} />
			<dd className={css.functionDetails}>
				<div className={css.paramsContainer}>
					<h6 className={css.header + ' ' + css.params}>{paramsNumber} Param{paramsNumber > 1 && 's'}</h6>
					<Section data={member.params} />
				</div>
				<div className={css.returnsContainer}>
					<h6 className={css.header + ' ' + css.returns}>Returns</h6>
					<Section data={member.returns} type="returns" />
				</div>
			</dd>
		</>
	)
}

export default MemberFunction;