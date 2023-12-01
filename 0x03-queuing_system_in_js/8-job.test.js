import createPushNotificationsJobs from "./8-job.js";
import sinon from "sinon";
import { expect } from "chai";
import { createQueue } from "kue";

describe('createPushNotificationsJobs', () => {
  let spyConsole;
  const queue = createQueue({ name: 'push_notification_code_3' });

  before(() => {
    queue.testMode.enter(true);
    if (!spyConsole) spyConsole = sinon.spy(console, 'log');
  });

  after(() => {
    queue.testMode.exit();
  });

  afterEach(() => {
    queue.testMode.clear();
    if (spyConsole) spyConsole.resetHistory();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, queue)
    ).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the corect type', (done) => {
    expect(queue.testMode.jobs.length).to.equal(0);
    const list =[
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      },
    ];
    createPushNotificationsJobs(list, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].data).to.deep.equal(list[0]);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    queue.process('push_notification_code_3', () => {
      expect(spyConsole.calledWith('Notification job created', queue.testMode.jobs[0].id)).to.be.true;
      done();
    });
  });

  it('registers the progress event handler for a job', (done) => {
    queue.testMode.jobs[0].addListener('progress', () => {
      expect(spyConsole.calledWith('Notification job', queue.testMode.jobs[0].id, '25% complete')).to.be.true;
      done();
    });
    queue.testMode.jobs[0].emit('progress', 25);
  });

  it('registers the failed event handler for a job', (done) => {
    queue.testMode.jobs[0].addListener('failed', () => {
      expect(spyConsole.calledWith('Notification job', queue.testMode.jobs[0].id, 'failed', 'Failed to send')).to.be.true;;
      done();
    });
    queue.testMode.jobs[0].emit('failed', new Error('Failed to send'))
  });

  it('registers the complete event handler for a job', (done) => {
    queue.testMode.jobs[0].addListener('complete', () => {
      expect(spyConsole.calledWith('Notification job', queue.testMode.jobs[0].d, 'complete')).to.be.true;
      done();
    });
    queue.testMode.jobs[0].emit('complete');
  });
});
