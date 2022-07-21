// Libraries
import { Router } from 'express';

// Controllers
import * as controller from './controller';

// Middlewares
import * as middlewares from '../../middlewares';

// Schema
import * as schema from '../../middlewares/schemas/step';

// Router
const router = Router();

router.post(
  '/get_steps',
  middlewares.handlerValidation('getSteps', schema.getStepsRule),
  middlewares.handlerReponse(controller.getSteps),
);

export default router;
