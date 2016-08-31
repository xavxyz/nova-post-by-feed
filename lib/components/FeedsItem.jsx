import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';

import Telescope from 'meteor/nova:lib';
import NovaForm from "meteor/nova:forms";
import { DocumentContainer } from "meteor/utilities:react-list-container";

import Feeds from '../collection.js';

class FeedsItem extends Component {

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
                        currentUser,
                        methodName: "feeds.edit",
                        successCallback: () => {
                          messages.flash("Feed edited.", "success");
                          this.setState({ edited: false });
                        },
                      }}
                    />
                    <div>
                      <span>Or <a onClick={this.cancelEdit}>cancel edition</a></span>
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
  
FeedsItem.propTypes = {
  feed: React.PropTypes.object.isRequired,
};

FeedsItem.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

module.exports = FeedsItem;
export default FeedsItem;