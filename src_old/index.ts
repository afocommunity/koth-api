import 'dotenv/config';
import 'reflect-metadata';

import { createServer } from './createServer';
import { checkENV } from './checkENV';

checkENV();
createServer();
