import { getFirstAdminUser } from './fetch_feeds';
import Categories from 'meteor/nova:categories';
import Feeds from '../collection.js';

// Load feeds from settings, if there are any
Meteor.startup(() => {
  if (Meteor.settings && Meteor.settings.feeds) {
    Meteor.settings.feeds.forEach(feed => {
      // look for existing feed with same url
      let existingFeed = Feeds.findOne({url: feed.url});

      // todo: accept more than one category
      if (feed.categorySlug) {
        const category = Categories.findOne({ slug: feed.categorySlug });
        feed.categories = [category._id];
      }

      if (existingFeed) {
        // if feed exists, update it with settings data except url
        delete feed.url;

        Feeds.update(existingFeed._id, {$set: feed});
      } else {
        // if not, create it only if there is an admin user
        if (!feed.userId) {
          const firstAdminUser = getFirstAdminUser();

          if (typeof firstAdminUser !== 'undefined') {
            feed.userId = firstAdminUser._id;
          } else {
            console.log('// No userId defined and no admin found, cannot create feed');
          }
        }

        feed.createdFromSettings = true;

        Feeds.insert(feed);
        console.log(`// Creating feed “${feed.url}”`);
      }
    });
  }
});
