import Users from 'meteor/nova:users';

const adminActions = [
  'feeds.view',
  'feeds.new',
  'feeds.edit',
  'feeds.delete',
];
Users.groups.admins.can(adminActions);
