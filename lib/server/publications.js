import Users from 'meteor/nova:users';
import Feeds from '../collection.js';

/**
 * @summary Publish a list of all feeds
 */
Meteor.publish('feeds.list', function() {
  return Users.isAdminById(this.userId) ? Feeds.find() : [];
});


/**
 * @summary Publish a single feed, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('feeds.single', function (terms) {
  check(terms, { _id: String });

  return Users.isAdminById(this.userId) ? Feeds.find(terms) : [];
});

// Custom publications for admin users, not part of core by now
Meteor.publish('users.allAdmins', function () {
  if (Users.isAdminById(this.userId)) {
    return Users.find({$or: [{isAdmin: true}, {isOwner: true}]}, {fields: {_id: 1, username: 1, isAdmin: 1, isOwner: 1}});
  }
  return [];
});