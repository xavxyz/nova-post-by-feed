import Users from 'meteor/nova:users';
import Feeds from './collection.js';

Meteor.methods({
  /**
   * @summary create a new feed
   * @param feed
   */
  'feeds.new'(feed) {
    check(feed, Feeds.schema);

    if (Feeds.findOne({ url: feed.url }))
      throw new Meteor.Error('already-exists', 'This feed already exists');

    if (!Meteor.user() || !Users.canDo(Meteor.user(), 'feeds.new'))
      throw new Meteor.Error('login-required', 'You need to be logged in and have permission to add a new feed');

    return Feeds.insert(feed);
  },

  /**
   * @summary edit an existing feed
   * @param feedId
   * @param modifier
   */
  'feeds.edit'(feedId, modifier) {
    Feeds.simpleSchema().namedContext("feeds.edit").validate(modifier, { modifier: true });
    check(feedId, String);

    if (!Feeds.findOne({ _id: feedId }))
      throw new Meteor.Error('already-exists', 'This feed doesn\'t exist');

    if (!Meteor.user() || !Users.canDo(Meteor.user(), 'feeds.edit'))
      throw new Meteor.Error('login-required', 'You need to be logged in and have permission to edit a feed');

    const feed = Feeds.findOne(feedId);

    // if the feed url is modified , unset the old title
    // if (modifier.$set.url !== feed.url && !!modifier.$set.title) {
    //   modifier.$unset = { title: 1 };
    // }

    return Feeds.update(feedId, modifier);
  },

  /**
   * @summary remove an existing feed by this id
   * @param feedId
   */
  'feeds.deleteById'(feedId) {
    check(feedId, String);

    if (!Feeds.findOne({ _id: feedId }))
      throw new Meteor.Error('already-exists', 'This feed doesn\'t exist');

    if (!Meteor.user() || !Users.canDo(Meteor.user(), 'feeds.delete'))
      throw new Meteor.Error('login-required', 'You need to be logged in and have permission to remove a new feed');

    return Feeds.remove({ _id: feedId });
  },
});

