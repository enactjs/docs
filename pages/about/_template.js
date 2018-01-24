import React from 'react';

import Page from '../../components/Page';

export default ({children, ...rest}) => <Page {...rest}>{children}</Page>;
