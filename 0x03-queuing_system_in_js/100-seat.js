const redis = require('redis');
const util = require('util');
const kue = require('kue')
const express = require('express');

const redisClient = redis.createClient({ name: 'reserve_seat'} );
const promisify = util.promisify;
const initial_seats = 50;
let reservationEnabled = true;
const queue = kue.createQueue();
const app = express();
const PORT = 1245;

const reserveSeat = async (number) => {
  return promisify(redisClient.SET).bind(redisClient)('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  return promisify(redisClient.GET).bind(redisClient)('available_seats');
};

app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats()
  .then((numberOfAvailableSeats) => {
    console.log('see', numberOfAvailableSeats)
    res.json({ numberOfAvailableSeats })
  });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ 'status': 'Reservation are blocked' });
  }
  try {
    const job = queue.create('reserve_seat');
    job
    .on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err.message || err.toString()}`);
    })
    .on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .save();
    res.json({ 'status': 'Reservation in process' });
  } catch {
    res.json({ 'status': 'Reservation failed' });
  }
})

app.get('/process', (_, res) => {
  queue.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats()
    .then((result) => parseInt(result) || 0)
    .then((availableSeats) => {
      console.log('see', availableSeats)
      reservationEnabled = availableSeats <= 1 ? false : reservationEnabled;
      if (available_seats >= 1) {
        reserveSeat(availableSeats - 1)
        .then(() => done());
      } else {
        done(new Error('Not enough seats available'));
      };
    });
  });
  res.json({ 'staus': 'Queue processing' });
});

const normalSeats = async (normalSeats_count) => {
  return promisify(redisClient.SET).bind(redisClient)('available_seats', parseInt(normalSeats_count));
}

app.listen(PORT, () => {
  normalSeats(process.env.initial_seats || initial_seats);
  console.log(`app listening at http://localhost:${PORT}`)
})
