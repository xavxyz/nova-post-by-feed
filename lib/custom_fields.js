import Posts from 'meteor/nova:posts';
import PublicationsUtils from 'meteor/utilities:smart-publications';

// used to keep track of which feed a post was imported from
Posts.addField([
  {
    fieldName: 'feedId',
    fieldSchema: {
      type: String,
      label: 'feedId',
      optional: true,
      form: {
        omit: true
      }
    }
  },
// the RSS ID of the post in its original feed
  {
    fieldName: 'feedItemId',
    fieldSchema: {
      type: String,
      label: 'feedItemId',
      optional: true,
      form: {
        omit: true
      }
    }
  }
]);
PublicationsUtils.addToFields(Posts.publishedFields.list, ['feedId', 'feedItemId']);
