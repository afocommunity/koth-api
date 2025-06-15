import { z } from 'zod';

export const IdType = z
	.enum(['native', 'steam', 'eos'])
	.nullable()
	.default('native');
