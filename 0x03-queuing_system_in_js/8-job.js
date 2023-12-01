const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  for (const job of jobs) {
    const createjob = queue.create('push_notification_code_3', job).save((error) => {
      if (!error) console.log(`Notification job created: ${createjob.id}`);
    });
    createjob
    .on('complete', () => {
      console.log(`Notification job ${createjob.id} completed`);
    })
    .on('failed attempt', (err) => {
      console.log(`Notification job ${createjob.id} failed: ${err.messagen || err.toString()}`);
    })
    .on('failed', (err) => {
      console.log(`Notification job ${createjob.id} failed: ${err.messagen || err.toString()}`);
    })
    .on('progress', (progress, data) => {
      console.log(`Notification job ${createjob.id} ${progress}% complete`);
    })
  }
}

export default createPushNotificationsJobs;
