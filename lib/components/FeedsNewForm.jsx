import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { ListContainer } from "meteor/utilities:react-list-container";
import Feeds from '../collection.js';

const FeedsNewForm = (props, context) => {

  return (
    <div style={{marginBottom: 15}}>
      <h2>Add a new feed</h2>
      <ListContainer
        collection={ Feeds }
        publication="users.allAdmins" // subscribe to only admins or users
        selector={{}} // a specific selector is set directly in the feeds schema to avoid showing normal user in the list if the modal is triggered on their profile
        terms={{}}
        component={ NovaForm }
        componentProps={{
          collection: Feeds,
          currentUser: context.currentUser,
          methodName: "feeds.new",
          successCallback: () => {
            context.messages.flash("Feed added.", "success");
          },
        }}
      />
    </div>
  )
};

FeedsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

module.exports = FeedsNewForm;
export default FeedsNewForm;