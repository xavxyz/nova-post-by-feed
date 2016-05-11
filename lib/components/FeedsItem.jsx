import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;

import Core from "meteor/nova:core";
const Messages = Core.Messages;

class FeedsItem extends Component {

  constructor(props) {
    super(props);
    this.removeFeed = this.removeFeed.bind(this);
    this.editFeed = this.editFeed.bind(this);
    this.state = {
      edited: false,
    };
  }

  renderCategories() {

    ({PostsCategories} = Telescope.components);

    return this.props.feed.categoriesArray ? <PostsCategories post={this.props.feed} /> : "";
  }

  renderActions() {

    ({Icon} = Telescope.components);

    return (
      <div className="post-stats">
        <span className="posts-stats-item" title="Edit"><a onClick={this.editFeed}><Icon name="pencil"/><span className="sr-only">Edit</span></a></span>
        <span className="posts-stats-item" title="Delete"><a onClick={this.removeFeed}><Icon name="close"/><span className="sr-only">Delete</span></a></span>
      </div>
    )
  }

  editFeed() {
    this.setState({edited: true});
  }

  removeFeed() {
    const feed = this.props.feed;
    if (window.confirm(`Delete feed “${feed.title}”?`)) {
      Meteor.call('feeds.deleteById', feed._id, (error, result) => {
        Messages.flash(`Feed “${feed.title}” deleted.`, "success");
        Events.track("feed deleted", { _id: feed._id });
      });
    }
  }
  
  render() {

    ({UsersAvatar, UsersName} = Telescope.components);

    const { feed, currentUser } = this.props;

    return (
      <div className="posts-item">

          {this.state.edited
            ?
            <DocumentContainer
              collection={Feeds}
              publication="feeds.single"
              selector={{_id: feed._id}}
              terms={{_id: feed._id}}
              joins={Feeds.getJoins()}
              component={NovaForm}
              componentProps={{
                collection: Feeds,
                currentUser,
                methodName: "feeds.edit",
                successCallback: () => {
                  Messages.flash("Feed edited.", "success");
                  this.setState({edited: false});
                },
                labelFunction: fieldName => Telescope.utils.getFieldLabel(fieldName, Feeds)
              }}
            />
            :
            <div className="post-item-content">
              <h3 className="posts-item-title">
                <a className="posts-item-title-link" href={feed.url}>{feed.title ? feed.title : "Feed not fetched yet"}</a>
                {this.renderCategories()}
              </h3>
              <div className="feeds-item-link"><a href={feed.url}>{feed.url}</a></div>

                <div className="posts-item-meta">
                {feed.user? <div className="posts-item-user"><UsersAvatar user={feed.user} size="small"/><UsersName user={feed.user}/></div> : null}
                {this.renderActions()}
              </div>
            </div>
          }
      </div>
    )
  }
}
  
FeedsItem.propTypes = {
  feed: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
};

FeedsItem.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = FeedsItem;
export default FeedsItem;