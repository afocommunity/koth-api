import { Umzug, SequelizeStorage } from 'umzug';
import { sequelize } from './database';
export const migrator = new Umzug({
	context: sequelize.getQueryInterface(),
	logger: console,
	migrations: { glob: '**/migrations/*.ts' },
	storage: new SequelizeStorage({ sequelize }),
});

export type Migration = typeof migrator._types.migration;
