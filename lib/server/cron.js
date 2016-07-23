import Feeds from '../collection.js';
import { fetchFeeds } from './fetch_feeds';

const addJob = () => {
  SyncedCron.add({
    name: 'Post by RSS feed',
    schedule: function(parser) {
      return parser.text('every 30 minutes');
    }, 
    job: () => {
      if (Feeds.find().count()) {
        fetchFeeds();
      }
    }
  });
};

Meteor.startup(() => addJob());
