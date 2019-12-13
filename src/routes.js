import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import adminMiddleware from './app/middlewares/isAdmin';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpController from './app/controllers/HelpController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

/**
 *  Help's Routes
 */
routes.post('/students/:id/help', HelpController.store);

routes.use(adminMiddleware);
/**
 * Plan's Routes
 */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans/', PlanController.store);
routes.put('/plans/:id', PlanController.update);
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
routes.get('/enrollment/:id', EnrollmentController.show);
routes.post('/enrollment', EnrollmentController.store);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

/**
 * Checkin's Routes
 */
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.show);

export default routes;
