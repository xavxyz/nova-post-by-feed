import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";

class FeedsPage extends Component {

  render() {
    return (
      <div className="feeds-edit-form">
        <Telescope.components.FeedsNewForm currentUser={ this.props.currentUser } />
        
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

FeedsPage.propsType = {
  currentUser: React.PropTypes.object
};

module.exports = FeedsPage;
export default FeedsPage;