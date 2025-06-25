import { z } from 'zod';

export const PlayerScope = z.array(z.enum(['savefile'])).nullable();
