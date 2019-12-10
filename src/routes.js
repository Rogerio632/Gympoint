import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

/**
 * Plan's Routes
 */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans/', PlanController.store);
routes.put('/plans/', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

/**
 * Student's Routes
 */
routes.post('/student/create', StudentController.store);
routes.put('/student/update', StudentController.update);

export default routes;
