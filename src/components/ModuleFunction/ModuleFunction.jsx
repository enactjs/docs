import Code from '../Code/Code.jsx';
import DocParse from '../DocParse/DocParse.jsx';
import {getPropertyTypeColor, typeToString} from '../utils/utils.js';

import css from './ModuleFunction.module.css';

const ModuleFunction = ({isFunction, member}) => {
	if (!isFunction) return null;

	const functionParams = <var>{member.params.map(value => value.name)}</var>;
	const functionReturns = <var style={{color: '#708090'}}>{member.returns.map(value => typeToString(value.type))}</var>;
	const functionCode = <>{member.name}( {functionParams} ) <span>&#8594;</span> {functionReturns}</>;

	const Section = ({data = [], type = 'params'}) => {
		return data.map(value => {
			const paramType = typeToString(value.type);
			const description = value.description;

				return (
					<dl className={css.section + ' ' + css[type]}>
						<dt className={css[type + 'Definition']}>
							{value.name}&nbsp;
							<var className={css.sectionVar} style={{color: getPropertyTypeColor(paramType)}}>{paramType}</var>
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
					<h6 className={css.header + ' ' + css.params}>{member.params.length} Param</h6>
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

export default ModuleFunction;