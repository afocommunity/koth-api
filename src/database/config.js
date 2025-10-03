import 'dotenv/config';

const DB_DIALECT = process.env.DB_DIALECT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

export default {
	development: {
		database: DB_DATABASE,
		dialect: DB_DIALECT,
		host: DB_HOST,
		password: DB_PASSWORD,
		port: DB_PORT != null ? Number(DB_PORT) : null,
		username: DB_USER,
	},
};
