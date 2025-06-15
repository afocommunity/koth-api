import { z } from 'zod';

export const PlayerScope = z
	.array(z.enum(['savefile']))
	.nullable()
	.default(['savefile'])
	.transform((val) => Array.from(new Set(String(val)))); //Unique
