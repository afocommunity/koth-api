import { Sequelize } from 'sequelize-typescript';

const DB_DIALECT = process.env.DB_DIALECT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
export const createDatabase = () => {
	return new Sequelize({
		database: DB_DATABASE,
		dialect: DB_DIALECT as 'mysql' | 'mariadb' | 'postgres',
		host: DB_HOST,
		modelMatch: (file, member) => {
			console.info(`Declaring model ${member} from ${file}`);
			return true;
		},
		models: [__dirname + '/models/**/*.model.ts'],
		password: DB_PASSWORD,
		port: DB_PORT != null ? Number(DB_PORT) : null,
		username: DB_USER,
	});
};
