import React, { PropTypes, Component } from 'react';

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

class FeedsPage extends Component {

  render() {

    ({FeedsNewForm, FeedsList} = Telescope.components);

    return (
      <div className="feeds-edit-form">
        <FeedsNewForm currentUser={ this.props.currentUser } />
        
        <ListContainer
          collection={ Feeds }
          publication="feeds.list"
          selector={{}}
          terms={{}}
          joins={ Feeds.getJoins() }
          component={ FeedsList }
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