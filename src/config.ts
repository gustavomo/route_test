import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

const newLocal = process.env;

// capture the environment variables the application needs
/* eslint-disable @typescript-eslint/naming-convention */
const {
  BACKEND_PORT,
  HOST,
  NODE_ENV,
} = newLocal;
/* eslint-enable @typescript-eslint/naming-convention */

// validate the required configuration information
assert(BACKEND_PORT, 'PORT configuration is required.');
assert(HOST, 'HOST configuration is required.');
assert(NODE_ENV, 'NODE_ENV configuration is required.');

// export the configuration information
const config = {
  host: HOST,
  nodeENV: NODE_ENV,
  port: BACKEND_PORT,
};

export default config;
