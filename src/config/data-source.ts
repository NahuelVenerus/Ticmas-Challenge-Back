import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',  
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entities/*.js'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
