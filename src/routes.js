import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import adminMiddleware from './app/middlewares/isAdmin';
import EnrollmentController from './app/controllers/EnrollmentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.use(adminMiddleware);
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

/**
 * Enrollment's Routes
 */
routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:id', EnrollmentController.show);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments', EnrollmentController.update);
routes.delete('/enrollments', EnrollmentController.delete);

export default routes;
