import { createQueue } from "kue";

const queue = createQueue();

const sendNotification = (phoneNumber, message) => {
  console.log(
    `sending notifiacation to ${phoneNumber}, with message: ${message}`
  );
};

queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});