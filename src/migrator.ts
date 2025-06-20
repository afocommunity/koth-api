import { Umzug, SequelizeStorage } from 'umzug';
import { createDatabase } from './database';
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
