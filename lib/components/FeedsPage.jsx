import React, { PropTypes, Component } from 'react';
import { ListContainer } from "meteor/utilities:react-list-container";
import Feeds from '../collection.js';
import Telescope from 'meteor/nova:lib';

class FeedsPage extends Component {

  render() {
    return (
      <div className="feeds-edit-form">
        <Telescope.components.CanDo action="feeds.new"> 
          <Telescope.components.FeedsNewForm />
        </Telescope.components.CanDo>
        
        <Telescope.components.CanDo 
          action="feeds.view"
          displayNoPermissionMessage={true}
        >
          <ListContainer
            collection={ Feeds }
            publication="feeds.list"
            selector={{}}
            terms={{}}
            joins={ Feeds.getJoins() }
            component={ Telescope.components.FeedsList }
            cacheSubscription={ false }
            limit={0}
          />
        </Telescope.components.CanDo>
      </div>
    );
  }
}

module.exports = FeedsPage;
export default FeedsPage;