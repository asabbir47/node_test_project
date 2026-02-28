const Event = require('events');

const event = new Event();

event.on('bailRing', (ob) => {
    console.log(`We need to run becouse ${ob.period} is finished`);
});

event.emit('bailRing', { period: 'first' });
