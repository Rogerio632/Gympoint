import Bee from 'bee-queue';
import WelcomeMail from '../app/jobs/WelcomeMail';
import AnswerHelpMail from '../app/jobs/AnswerHelpMail';
import RequestHelpMail from '../app/jobs/RequestHelpMail';
import redisConfig from '../config/redis';

const jobs = [WelcomeMail, AnswerHelpMail, RequestHelpMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Job name: ${job.queue.name} | error: ${err}`);
  }
}
export default new Queue();
