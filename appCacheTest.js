if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return new Date;
  };
}

if (Meteor.isServer) {
  Meteor.AppCache.config({firefox: true});
}
