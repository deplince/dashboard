import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env.migrations') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: 'localhost',
    port: Number(configService.get<number>('DATABASE_PORT')),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    schema: 'public',
    logging: configService.get<string>('IS_PROD') === 'false',
    entities: [
      join(process.cwd(), 'libs', 'entities', 'src', '**', '*.entity.ts'),
    ],
    migrations: [join(process.cwd(), 'migrations', '*migration.ts')],
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
