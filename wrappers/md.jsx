import React from 'react'
import DocumentTitle from 'react-document-title'
import {config} from 'config'

import css from '../css/main.less';

const makeAnchorName = (headingText) => {
    const anchor = headingText
        .replace(/<.*>(.*)<\/.*>/g, '$1') // strip out inner tags
        .replace('/', '-')
        .replace(/[^A-Za-z0-9\- ]/g, '')
        .replace(/\s+/g, '-');
    return anchor.toLowerCase();
};

const headingMatch = /(<h(?!1)(\d)>)(.*)(<\/h\2>)/gim;

module.exports = React.createClass({
  propTypes () {
    return {
      route: React.PropTypes.object,
    }
  },
  render () {
    const post = this.props.route.page.data;
    const body = post.body.replace(headingMatch, (m, p1, p2, p3, p4) => {
        return `${p1}<a name="${makeAnchorName(p3)}" class="navAnchor"></a>${p3}${p4}`;
    });

    return (
      <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
        <div className={css.markdown}>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </DocumentTitle>
    )
  },
})
