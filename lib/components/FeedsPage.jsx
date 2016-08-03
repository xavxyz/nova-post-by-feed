import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Feeds from '../collection.js';

class FeedsPage extends Component {

  render() {
    return (
      <div className="feeds-edit-form">
        <Telescope.components.FeedsNewForm />
        
        <ListContainer
          collection={ Feeds }
          publication="feeds.list"
          selector={{}}
          terms={{}}
          joins={ Feeds.getJoins() }
          component={ Telescope.components.FeedsList }
          cacheSubscription={ false }
        />
      </div>
    );
  }
}

module.exports = FeedsPage;
export default FeedsPage;