let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};

let guardIfPast = ( date, revert, callback ) => {
  if ( isPast( date.format() ) ) {
    Bert.alert( 'Can\'t schedule an event in the past!', 'danger' );
    revert();
  } else {
    callback();
  }
};

Template.events.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'events' );
  template.modalData = new ReactiveVar();
});

Template.events.onRendered( () => {
  $( '#events-calendar' ).fullCalendar({
    lazyFetching: false,
    events( start, end, timezone, callback ) {
      let data = Events.find().fetch().map( ( event ) => {
        event.editable = !isPast( event.start );
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    eventRender( event, element ) {
      element.find( 'span.fc-title' ).html(
        `<h4>${ event.title }</h4>
         <p class="guest-count">${ event.guests } Guests</p>
         <p class="type-${ event.type }">#${ event.type }</p>
        `
      );
    },
    eventDrop( event, delta, revert ) {
      guardIfPast( event.start, revert, () => {
        let start  = event.start.format(),
            end    = event.end,
            update = {
              _id: event._id,
              start: start,
              end: end ? end.format() : start
            };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      });
    },
    dayClick( date ) {
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    },
    eventClick( event ) {
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }
  });

  Tracker.autorun( () => {
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });
});
