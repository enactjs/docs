import kind from '@enact/core/kind';
import React from 'react';
import Layout from '@theme/Layout';

const App = kind({
    name: 'App',

    styles: {
        className: 'app'
    },

    render: function (props) {
        return (
            <Layout>
                <h1>My Enact page</h1>
                <p>This is an Enact page</p>
            </Layout>
        );
    }
});

export default App;
export {App};
