import seed from 'meteor/themeteorchef:seeder';

let _seedUsers = () => {
  seed( 'users', {
    environments: [ 'development', 'staging', 'production' ],
    data: [{
      email: 'admin@admin.com',
      password: 'password',
      profile: {
        name: { first: 'Carl', last: 'Winslow' }
      },
      roles: [ 'admin' ]
    }]
  });
};

let _seedEvents = () => {
  seed( 'events', {
    data: [{
      title: 'Liu Family Reunion',
      start: '2016-02-27',
      type: 'Miscellaneous',
      guests: 23
    },{
      title: 'Megacorp Spring Fling',
      start: '2016-03-01',
      end: '2016-03-03',
      type: 'Corporate',
      guests: 319
    },{
      title: 'Michner Edelweiss Reception',
      start: '2016-03-01',
      type: 'Wedding',
      guests: 51
    },{
      title: 'Elizabeth Winthrop Birthday',
      start: '2016-03-12',
      type: 'Birthday',
      guests: 7
    }]
  });
};

export default function() {
  _seedUsers();
  _seedEvents();
}
