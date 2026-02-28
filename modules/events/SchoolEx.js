const School = require('./School');

const school = new School();

school.on('bailRing', (ob) => {
    console.log(`We need to go home because ${ob.period} ended`);
});

school.startPeriod();
