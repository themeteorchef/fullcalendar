Meteor.methods({
  editEvent( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      start: Match.Optional( String ),
      end: Match.Optional( String ),
      type: Match.Optional( String ),
      guests: Match.Optional( Number )
    });

    let eventId = event._id;
    delete event._id;

    try {
      return Events.update( eventId, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});
