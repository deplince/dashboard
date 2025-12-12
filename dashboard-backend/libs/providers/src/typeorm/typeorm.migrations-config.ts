import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: Number(configService.get<number>('DATABASE_PORT')),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    schema: 'public',
    logging: configService.get<string>('IS_PROD') === 'false',
    entities: [
      join(process.cwd(), 'dist', 'libs', 'entities', '**', '*.entity.{ts,js}'),
    ],
    migrations: [join(process.cwd(), 'migrations', 'js', '*migration.js')],
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
