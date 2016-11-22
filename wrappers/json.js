import React from 'react';
import DocParse from '../components/DocParse.js';
import jsonata from 'jsonata';

const renderModuleDescription = (doc) => {
	if (doc.length) {
		return (
			<div style={{marginBottom: '20px'}}>
				<div><DocParse>{doc[0].description}</DocParse></div>
			</div>
		);
	}
};

const renderFunction = (func) => {
	let params = func.params || [];
	let paramStr = params.map((param) => (param.name)).join(', ');
	let returnType = 'undefined';

	if (func.returns && func.returns.length && func.returns[0].type && func.returns[0].type.name) {
		returnType = func.returns[0].type.name;
	}

	return (
		<div style={{marginBottom: '10px'}}>
			<p style={{fontStyle: 'italic', marginBottom: '0'}}>&bull; {func.name}({paramStr}) &rarr; {returnType}</p>
			<DocParse style={{marginLeft: '1.5em'}}>{func.description}</DocParse>
			<div style={{marginLeft: '50px'}}>
				{params.length ?
					<div>
						<p style={{marginBottom: '0'}}>Params</p>
						{params.map((param) => (
							<div style={{marginLeft: '10px'}}>
								<p style={{fontStyle: 'italic', marginBottom: '0'}}>{param.name}</p>
								<DocParse style={{marginLeft: '35px'}}>{param.description}</DocParse>
							</div>
							)
						)}
					</div> :
						null
				}
				{returnType !== 'undefined' ?
					<div>
						<p style={{marginBottom: '0'}}>Returns</p>
						<DocParse style={{marginLeft: '35px'}}>{func.returns[0].description}</DocParse>
					</div> :
						null}
			</div>
		</div>
	);
};

const processTypeTag = (tags) => {
	let expression = "$join($[title='type'].**.name,'|')";
	let result = jsonata(expression).evaluate(tags);
	return result || '';
};

const processDefaultTag = (tags) => {
	let expression = "$[title='default'].description";
	let result = jsonata(expression).evaluate(tags);
	return result || 'undefined';
};

const hasRequiredTag = (tags) => {
	let expression = "$[title='required']";
	let result = jsonata(expression).evaluate(tags);
	return !!result;
};

const renderProperty = (prop) => {
	if ((prop.kind === 'function') || (prop.kind === 'class' && prop.name === 'constructor')) {
		return renderFunction(prop);
	} else {
		let typeStr = processTypeTag(prop.tags);
		typeStr = typeStr ? ` : ${typeStr}` : '';
		let defaultStr = processDefaultTag(prop.tags);
		let isRequired = hasRequiredTag(prop.tags);
		// TODO: Process @required!
		return (
			<div style={{marginBottom: '10px'}}>
				<p style={{fontStyle: 'italic', marginBottom: '0'}}>
					&bull; {prop.name}{typeStr}{isRequired ? ' (Required)' : ''}
				</p>
				<p style={{marginLeft: '1.5em', fontStyle: 'italic', marginBottom: '0'}}>Default: {defaultStr}</p>
				<DocParse style={{marginLeft: '1.5em'}}>{prop.description}</DocParse>
			</div>
		);
	}
};

const renderProperties = (properties) => {
	if (!properties.static.length && !properties.instance.length) {
		return;
	}
	// Check for static members first.  That'd be unusual!
	if (properties.static.length) {
		return (
			<div style={{margin: '15px 25px'}}>
				<h5>Statics</h5>
				<div>
					{properties.static.map(renderProperty)}
				</div>
				<h5>Instance</h5>
				<div>
					{properties.instance.map(renderProperty)}
				</div>
			</div>
		);
	}
	if (properties.instance.length) {
		return (
			<div style={{margin: '15px 25px'}}>
				<h5>Properties</h5>
				<div>
					{properties.instance.map(renderProperty)}
				</div>
			</div>
		);
	}
};

const renderModuleMember = (member) => (
	// TODO: Check type for 'class'
	<div style={{backgroundColor: '#eee', padding: '5px', marginBottom: '10px'}}>
		<h4 id={member.name}>{member.name}</h4>
		<div><DocParse>{member.description}</DocParse></div>
		{renderProperties(member.members)}
	</div>
);

const renderModuleMembers = (members) => {
	// All module members will be static, no need to check instance members
	if (members.static.length) {
		return (
			<div>
				<h3>Members</h3>
				{members.static.map(renderModuleMember)}
			</div>
		);
	} else {
		return 'No members.';
	}
};

export default class JSONWrapper extends React.Component {

	render () {
		const doc = this.props.route.page.data;
		const path = this.props.route.page.path.replace('/docs/components/modules/','').replace(/\/$/, "");;
		// TODO: Just get this info from the doc itself?
		if (!doc[0]) {
			console.log(path);
		}
		return (
			<div>
				<h1>{path}</h1>
				{renderModuleDescription(doc)}
				{renderModuleMembers(doc[0].members)}
			</div>
		);
	}
}
