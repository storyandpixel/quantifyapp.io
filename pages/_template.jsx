import React from 'react';
import { RouteHandler, Link, State } from 'react-router';

module.exports = React.createClass({
  mixins: [State],

  render: function() {
    return (
      <div>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});
