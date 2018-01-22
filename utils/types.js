// Utilities for working with types.  Primary use is in rendering types
// as part of /wrappers/json.js

import Type from '../components/Type';
import React from 'react';

const renderType = (type, index) => {
	return <Type key={index}>{type}</Type>;
};

export default renderType;
