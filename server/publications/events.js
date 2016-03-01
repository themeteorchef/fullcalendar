Meteor.publish( 'events', function() {
  return Events.find();
});
