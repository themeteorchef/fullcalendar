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
});

Template.events.onRendered( () => {
  $( '#events-calendar' ).fullCalendar({
    defaultView: 'agendaWeek',
    selectable: true,
    selectHelper: true,
    events( start, end, timezone, callback ) {
      console.log( start, end );
      
      let data = Events.find().fetch().map( ( event ) => {
        event.editable = !isPast( event.start );
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    eventRender( event, element ) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
         <p class="guest-count">${ event.guests } Guests</p>
         <p class="type-${ event.type }">#${ event.type }</p>
        `
      );
    },
    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id: event._id,
          start: date,
          end: date
        };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      } else {
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
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
