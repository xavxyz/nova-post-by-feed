import Users from 'meteor/nova:users';

const adminActions = [
  'feeds.new',
  'feeds.edit',
  'feeds.delete',
];
Users.groups.admins.can(adminActions);
