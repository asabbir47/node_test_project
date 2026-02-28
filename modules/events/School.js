const Event = require('events');

class School extends Event {
    startPeriod() {
        console.log('Class satrted');

        setTimeout(() => {
            this.emit('bailRing', { period: 'first' });
        }, 2000);
    }
}

module.exports = School;
