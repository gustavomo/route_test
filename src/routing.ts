// Libraries
import { Application } from 'express';

// Components
import stepRoutes from './api/step/route';

const routes = (app: Application) => {
  app.use('/api', stepRoutes);
  app.get('/healthcheck', (_, res) => res.status(200).send('OK'));
};

export default routes;
