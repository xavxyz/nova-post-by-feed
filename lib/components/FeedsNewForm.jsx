import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

import Core from "meteor/nova:core";
const Messages = Core.Messages;

const FeedsNewForm = ({ currentUser }) => {
  return (
    <div>
      <p>Add a new feed:</p>
      <ListContainer
        collection={ Feeds }
        publication="users.allAdmins" // subscribe to only admins or users
        selector={{}} // a specific selector is set directly in the feeds schema to avoid showing normal user in the list if the modal is triggered on their profile
        terms={{}}
        component={ NovaForm }
        componentProps={{
          collection: Feeds,
          currentUser,
          methodName: "feeds.new",
          successCallback: () => {
            Messages.flash("Feed added.", "success");
          },
          labelFunction: fieldName => Telescope.utils.getFieldLabel(fieldName, Feeds)
        }}
      />
    </div>
  )
};

module.exports = FeedsNewForm;
export default FeedsNewForm;