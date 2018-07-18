export const sequelizeConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Q@wertyuiop',
  database: process.env.DB_NAME || 'test',
  host: process.env.DB_HOSTNAME || 'localhost',
  dialect: process.env.DB_DIALECT || 'postgres',
};
