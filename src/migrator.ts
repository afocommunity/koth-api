import { Umzug, SequelizeStorage } from 'umzug';
import { createDatabase } from './database';

/**
 * Creates and configures the Umzug migrator for database migrations
 * Uses Sequelize as the storage mechanism
 * Loads migration files from the specified glob pattern
 * @return {Umzug} Configured Umzug instance
 */
export const createMigrator = () => {
	const sequelize = createDatabase();
	return new Umzug({
		context: sequelize.getQueryInterface(),
		logger: console,
		migrations: { glob: '**/migrations/*.ts' },
		storage: new SequelizeStorage({ sequelize }),
	});
};

export type Migration = ReturnType<
	typeof createMigrator
>['_types']['migration'];
