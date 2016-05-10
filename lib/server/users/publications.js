// Custom publications for admin users, not part of core by now
Meteor.publish('users.allAdmins', function () {
  if (Users.is.adminById(this.userId)) {
    return Meteor.users.find({$or: [{isAdmin: true}, {isOwner: true}]}, {fields: {_id: 1, username: 1, isAdmin: 1, isOwner: 1}});
  }
  return [];
});