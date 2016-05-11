/**
 * @summary Publish a list of all feeds
 */
Meteor.publish('feeds.list', function() {
  return Users.is.adminById(this.userId) ? Feeds.find() : [];
});


/**
 * @summary Publish a single feed, along with all relevant users
 * @param {Object} terms
 */
Meteor.publish('feeds.single', function (terms) {
  check(terms, { _id: String });

  return Users.is.adminById(this.userId) ? Feeds.find(terms) : [];
});