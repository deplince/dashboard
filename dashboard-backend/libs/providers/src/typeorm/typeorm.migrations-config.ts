import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

if (process.env.IS_PROD !== 'true') {
  config({ path: join(process.cwd(), '.env.migrations') });
}

const options = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: 'public',
    logging: process.env.IS_PROD === 'false',
    entities: [
      join(process.cwd(), 'libs', 'entities', 'src', '**', '*.entity.ts'),
    ],
    migrations: [join(process.cwd(), 'migrations', '*migration.ts')],
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
