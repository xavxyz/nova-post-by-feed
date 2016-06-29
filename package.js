Package.describe({
  name: "xavcz:nova-post-by-feed",
  summary: "Auto post via RSS to Nova, additional feature not part of core",
  version: "0.2.0",
  git: "https://github.com/xavcz/nova-post-by-feed.git"
});

Npm.depends({
  'feedparser': '1.0.0',
  'to-markdown': '0.0.2',
  'he': '0.5.0',
  'iconv-lite': '0.4.7',
  'moment': '2.13.0',
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.3-nova',
    'nova:lib@0.26.3-nova',
    'nova:posts@0.26.3-nova',
    'nova:users@0.26.3-nova',
    'nova:categories@0.26.3-nova',
    'nova:settings@0.26.3-nova',
    'nova:events@0.26.3-nova',
    'nova:base-components@0.26.3-nova',
  ]);

  api.mainModule('lib/client.js', 'client');
  api.mainModule('lib/server.js', 'server');

  api.export([
    'Feeds'
  ]);
});
