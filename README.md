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
import NovaForm from "meteor/nova:forms";
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Feeds from '../collection.js';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';

class UsersMenuWithFeed extends Component {

  constructor(props) {
    super(props);
    this.editFeed = this.editFeed.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.removeFeed = this.removeFeed.bind(this);
    this.state = {
      edited: false,
    };
  }

  renderCategories() {
    return this.props.feed.categoriesArray ? <Telescope.components.PostsCategories post={ this.props.feed } /> : "";
  }

  renderActions() {
    return this.props.feed.createdFromSettings
          ? <span>This feed has been added from your settings.json file, you cannot edit or remove it the client. Please make your modifications in your settings file.</span>
          : <div className="post-stats">
              <Telescope.components.CanDo action="feeds.edit">
                <span className="posts-stats-item" title="Edit"><a onClick={this.editFeed}><Telescope.components.Icon name="pencil"/><span className="sr-only">Edit</span></a></span>
              </Telescope.components.CanDo>
              <Telescope.components.CanDo action="feeds.delete">
                <span className="posts-stats-item" title="Delete"><a onClick={this.removeFeed}><Telescope.components.Icon name="close"/><span className="sr-only">Delete</span></a></span>
              </Telescope.components.CanDo>
            </div>
  }

  editFeed() {
    if (Users.canDo(this.context.currentUser, 'feeds.edit')) {
      this.setState({ edited: true });
    }
  }

  cancelEdit(e) {
    e.preventDefault();
    this.setState({ edited: false });
  }

  removeFeed() {
    const feed = this.props.feed;

    if (Users.canDo(this.context.currentUser, 'feeds.delete') && window.confirm(`Delete feed “${ feed.title }”?`)) {
      this.context.actions.call('feeds.deleteById', feed._id, (error, result) => {
        if (error) {
          this.context.messages.flash(error.message, "error");
        } else {
          this.context.messages.flash(`Feed “${ feed.title }” deleted.`, "success");
          this.context.events.track("feed deleted", { _id: feed._id });
        }
      });
    }
  }

  render() {
    const { feed } = this.props;
    const { currentUser, messages } = this.context;

    return (
      <div className="posts-item">

          {
            // could be done another way I think, a lot of code hard to read imo
            this.state.edited
            ? <div>
                <Telescope.components.CanDo action="feeds.edit">
                  <div>
                    <DocumentContainer
                      collection={ Feeds }
                      publication="feeds.single"
                      selector={ { _id: feed._id } }
                      terms={ { _id: feed._id } }
                      joins={ Feeds.getJoins() }
                      component={ NovaForm }
                      componentProps={{
                        collection: Feeds,
                        currentUser: currentUser,
                        methodName: "feeds.edit",
                        successCallback: (feed) => {
                          messages.flash(`“${ feed.title }” feed successfully edited`, 'success');
                          this.setState({ edited: false });
                        },
                      }}

                    />
                    <div className="cancel_button">
                      <Button className="btn-secondary"><a onClick={this.cancelEdit}>Cancel</a></Button>
                    </div>
                  </div>
                </Telescope.components.CanDo>
              </div>
            : <div className="post-item-content">
                <h3 className="posts-item-title">
                  <a className="posts-item-title-link" href={ feed.url }>{ feed.title ? feed.title : "Feed not fetched yet" }</a>
                  { this.renderCategories() }
                </h3>
                <div className="feeds-item-link"><a href={ feed.url }>{feed.url }</a></div>

                <div className="posts-item-meta">
                  { feed.user
                    ? (
                      <div className="posts-item-user">
                        <Telescope.components.UsersAvatar user={ feed.user } size="small"/>
                        <Telescope.components.UsersName user={ feed.user }/>
                      </div>
                    ) : null }
                  { this.renderActions() }
                </div>
              </div>
          }
      </div>
    )
  }
}

UsersMenuWithFeed.propTypes = {
  feed: React.PropTypes.object.isRequired
};

UsersMenuWithFeed.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

module.exports = UsersMenuWithFeed;
export default UsersMenuWithFeed;

```

**Note:** it's not recommended to edit the `nova:base-components` package as you might have conflict with Nova's updates.

## Why not part of core?
This is an additional feature that every Nova app doesn't need. For more information, see this PR: https://github.com/TelescopeJS/Telescope/pull/1321
