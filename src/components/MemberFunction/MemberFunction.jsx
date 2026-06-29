import Code from '../Code/Code.jsx';
import DocParse from '../DocParse/DocParse.jsx';
import ParamsReturnsSection from './ParamsReturnsSection';
import {getPropertyTypeColor, typeToString} from '../utils';

import css from './MemberFunction.module.css';

const MemberFunction = ({member, typeDefObjectFunction = false}) => {
	const functionParams = member.params.map((value, index) => {
		const isOptional = value.type.type.includes('Optional');

		return (
			<span key={index + '_params'}>
				<var className={css.functionCode}>{isOptional ? `{${value.name}}` : value.name}</var>
				{index < member.params.length - 1 && ', '}
			</span>
		)
	});

	const functionReturns = member.returns.map((value) => {
		return typeToString(value.type).split('|').map((value, index, arr) => {
			return (
				<span key={index + '_returns'}>
					<var className={css.functionCode} style={{color: getPropertyTypeColor(value.trim())}}>{value}</var>
					{index < arr.length - 1 && ' | '}
				</span>
			)
		});
	});

	const functionCode = <>{member.name}( {functionParams} ) <span>&#8594;</span> {functionReturns}</>;
	const paramsNumber = member.params.length;
	const returnsNumber = member.returns.length;
	const noParamsClassName = paramsNumber === 0 ? css.noParams : '';
	const noReturnsClassName = returnsNumber === 0 ? css.noReturns : '';

	return (
		<>
			{!typeDefObjectFunction && (
				<>
					<Code>{functionCode}</Code>
					<DocParse description={member.description} />
				</>
			)}
			<dd className={css.functionDetails + ' ' + noParamsClassName + ' ' + noReturnsClassName}>
				<div className={css.paramsContainer}>
					<h6 className={css.header + ' ' + css.params}>{paramsNumber} Param{paramsNumber !== 1 && 's'}</h6>
					<ParamsReturnsSection data={member.params} />
				</div>
				<div className={css.returnsContainer}>
					<h6 className={css.header + ' ' + css.returns}>Returns</h6>
					<ParamsReturnsSection data={member.returns} type="returns" />
				</div>
			</dd>
		</>
	)
}

export default MemberFunction;