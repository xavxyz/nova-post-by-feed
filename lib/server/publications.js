import Users from 'meteor/nova:users';
import Feeds from '../collection.js';

/**
 * @summary Publish a list of all feeds
 */
Meteor.publish('feeds.list', function() {
  return Users.canDo(Users.getUser(this.userId), 'feeds.view')  ? Feeds.find() : [];
});


/**
 * @summary Publish a single feed, along with all relevant users, used to edit a feed
 * @param {Object} terms
 */
Meteor.publish('feeds.single', function(terms) {
  check(terms, { _id: String });

  return Users.canDo(Users.getUser(this.userId), 'feeds.edit') ? Feeds.find(terms) : [];
});

// Custom publications for admin users,
// If you want to add admins who are not admin, do it directly via settings
Meteor.publish('users.allAdmins', function() {
  if (Users.canDo(Users.getUser(this.userId), 'feeds.new')) {
    return Users.find({isAdmin: true}, {fields: {_id: 1, username: 1}});
  }
  return [];
});