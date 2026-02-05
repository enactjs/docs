// src/components/LiveCode.jsx
import React from 'react';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
// import Component from '../../../sample-runner/index';
import {Button} from '../../../sample-runner/limestone/src/index';


const code = `

render(<Button />)`;

export default function LiveCode() {
	return (

		<Button />
	);
}