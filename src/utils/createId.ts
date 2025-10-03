import { init } from '@paralleldrive/cuid2';

/**
 * Generates a unique identifier using the cuid2 library
 * @return {string} A unique identifier string
 */
export const createId = init();
