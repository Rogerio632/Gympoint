import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import sentryConfig from './config/sentry';
import routes from './routes';
import './config/database/index';

class App {
  constructor() {
    this.server = express();

    Sentry.init({ sentryConfig });

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res
        .status(500)
        .json({ message: 'ERROR 500 - INTERNAL SERVER ERROR' });
    });
  }
}
export default new App().server;
