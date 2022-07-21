// Libraries
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';

// Utils
import routing from './routing';

// Config
import config from './config';

// Constants
const port = config.port;

// Express connection
const app = express();

// Cors for enable request from frontend
app.use(cors({
  origin: '*',
})); // Uncoment to prevent CROSS ORIGIN problems.
app.use(bodyParser.json());

// Routing Management
routing(app);

// Node Server initializing
const server = new http.Server(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`This app is listening in ${port}.. Go to => ${config.host}:${port}`);
});
