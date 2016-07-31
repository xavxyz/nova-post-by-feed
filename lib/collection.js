import Users from 'meteor/nova:users';
import Categories from 'meteor/nova:categories';
import Posts from 'meteor/nova:posts';

Feeds = new Mongo.Collection('feeds');

Feeds.schema = new SimpleSchema({
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    insertableIf: Users.isAdmin,
    editableIf: Users.isAdmin,
    publish: true,
  },
  title: {
    type: String,
    optional: true,
    publish: true,
    insertableIf: Users.isAdmin,
    editableIf: Users.isAdmin,
  },
  userId: {
    type: String,
    insertableIf: Users.isAdmin,
    editableIf: Users.isAdmin,
    control: "select",
    publish: true,
    autoform: {
      prefill: () => Meteor.userId(),
      options: () => {
        // only find admins and owners, even if the feeds modal is opened on a normal user profile page
        return Users.find({ $or: [{ isAdmin: true }, { isOwner: true }] }).map((user) => {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    },
    join: {
      joinAs: "user",
      collection: () => Users
    }
  },
  categories: {
    type: [String],
    control: "checkboxgroup",
    optional: true,
    insertableIf: Users.isAdmin,
    editableIf: Users.isAdmin,
    autoform: {
      noselect: true,
      type: "bootstrap-category",
      order: 50,
      options: () => {
        return Categories.find().map((category) => {
          return {
            value: category._id,
            label: category.name
          };
        });
      }
    },
    publish: true,
    join: {
      joinAs: "categoriesArray",
      collection: () => Categories
    }
  },
  // if true, block the edit / removal from the UI Component <FeedsItem/>
  // it differs from the settings collection where an attribute is set on insertableIf / editableIf which is done serverside
  // it differs from the categories collection where you can edit a category created from the settings (at this time)
  createdFromSettings: {
    type: Boolean,
    optional: true,
  }
});

Feeds.attachSchema(Feeds.schema);

export default Feeds;