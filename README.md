# nova:post-by-feed
[Telescope Nova](https://github.com/TelescopeJS/Telescope/) post by feed package, used internally as an additional feature not part of core.

## What is this package for?
This package lets you register RSS feeds that will be fetched every 30 minutes and create new posts automatically for you. You can assign an admin user and several categories to a feed.

## Install the package
First, install the package in your Nova app, type:
```bash
meteor add xavcz:nova-post-by-feed
```

## How to use
**Disclaimer:** the package provides server-side logic out-of-the-box. Concerning the components, they are ready to use *but you will have to implement them yourself wherever you want/need (see examples below)*.

You can set up the feeds you want to fetch via your `settings.json` file (same logic as categories).

This package also comes with some components ready to use to help you manage RSS feeds. You need to import them in your app or custom package. You can place the components wherever you want, however the "master" one is `FeedsPage`.

You can also set a default status for the posts to be imported, adding a new key in your `settings.json` file :
```
  // imported posts will be pending by default
  "postByFeedDefaultStatus": 1
```

#### Example 1: `settings.json` (no UI)
With this methods, you don't need to import the package's components anywhere. Just edit your `settings.json` file and add at the bottom of the file a `feeds` JSON-array field:
```
"feeds": [
    {
      "url": "https://blablabla.com/rss/",
      "categorySlug": "testcat2",
      "title": "Awesome Feed"
    },
    {
      "url": "http://info.meteor.com/blog/rss.xml",
      "title": "Meteor Info"
    }
  ],

```

**Note:** a feeds entry **must contain a url key**, other fields are optional. You can add as many as you want.

#### Example 2: Route style (easy)
Add a route to the `Telescope.routes` namespace with the `FeedsPage` component.

```
Telescope.routes.add([{ name:"feeds", path:"feeds", component:Telescope.components.FeedsPage }]);
```

**Note:** it's not recommended to edit the `nova:base-routes` package as you might have conflict with Nova's updates.


#### Example 3: Modal style (more complex)
You can extend a Nova base component (like in this [screencast](https://www.youtube.com/watch?v=L8t4Ziw-kdQ)). Let's take for example the `UsersMenu` component and make it open a modal like the settings.

*In the following code, I tweaked the way the modal was opened/closed before to add a new type of modal.*

```
import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import { Modal, Dropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Router } from 'react-router';
import Users from 'meteor/nova:users';
import Core from "meteor/nova:core";
const ContextPasser = Core.ContextPasser;


class UsersMenuWithFeed extends Telescope.components.UsersMenu {

  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalOpen: {
        settings: false,
        feeds: false
      }
    };
  }

  openModal(modal) {
    return (event) => {
      const modalOpen = {};
      modalOpen[modal] = true;
      this.setState({ modalOpen });
    };
  }

  closeModal(modal) {
    return (event) => {
      const modalOpen = {};
      modalOpen[modal] = false;
      this.setState({ modalOpen });
    };
  }

  renderSettingsModal() {

    const SettingsEditForm = Telescope.components.SettingsEditForm;

    return (
      <Modal show={this.state.modalOpen.settings} onHide={this.closeModal('settings')}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContextPasser currentUser={this.props.user} messages={this.context.messages} actions={this.context.actions} track={this.context.track} closeCallback={this.closeModal('settings')}>
            <SettingsEditForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  renderFeedsModal() {

    const FeedsPage = Telescope.components.FeedsPage;

    return (
      <Modal bsSize='large' show={this.state.modalOpen.feeds} onHide={this.closeModal('feeds')}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feeds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContextPasser currentUser={this.props.user} messages={this.context.messages} actions={this.context.actions} track={this.context.track}closeCallback={this.closeModal('feeds')}>
            <FeedsPage/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  render() {

    ({UsersAvatar, UsersName} = Telescope.components);

    const user = this.props.user;
    const {currentUser} = this.context;

    return (
      <div className="users-menu">
        <Dropdown id="user-dropdown">
          <Dropdown.Toggle>
            <UsersAvatar size="small" user={user} link={false} />
            <div>{Users.getDisplayName(currentUser)}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <LinkContainer to={`/users/${currentUser.telescope.slug}`}>
              <MenuItem className="dropdown-item" eventKey="1"><FormattedMessage  id="users.profile"/></MenuItem>
            </LinkContainer>
            <LinkContainer to={`/account`}>
              <MenuItem className="dropdown-item" eventKey="2"><FormattedMessage id="users.edit_account"/></MenuItem>
            </LinkContainer>
            {Users.isAdmin(user) ? <MenuItem className="dropdown-item" eventKey="4" onClick={this.openModal('feeds')}>Edit Feeds</MenuItem> : null}
            <MenuItem className="dropdown-item" eventKey="5" onClick={() => Meteor.logout(Accounts.ui._options.onSignedOutHook())}><FormattedMessage id="users.log_out"/></MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        {this.renderSettingsModal()}
        {this.renderFeedsModal()}
      </div>
    )
  }
}

UsersMenuWithFeed.propTypes = {
  currentUser: React.PropTypes.object,
  user: React.PropTypes.object
};

export default UsersMenuWithFeed;
```

**Note:** it's not recommended to edit the `nova:base-components` package as you might have conflict with Nova's updates.

## Why not part of core?
This is an additional feature that every Nova app doesn't need. For more information, see this PR: https://github.com/TelescopeJS/Telescope/pull/1321
