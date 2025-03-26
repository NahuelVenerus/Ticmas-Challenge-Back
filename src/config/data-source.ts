import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const type = 'postgres';
const host = process.env.DB_HOST;
const port = 5432;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;

const AppDataSource = new DataSource({
  type: 'postgres',  
  url: `${type}://${username}:${password}@${host}:${port}/${database}`,
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entities/*.js'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
