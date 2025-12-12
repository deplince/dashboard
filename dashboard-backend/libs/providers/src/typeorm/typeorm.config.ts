import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Record } from '@libs/entities';
import { config } from 'dotenv';
import { join } from 'path';

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
    entities: [User, Record],
    synchronize: configService.get<string>('IS_PROD') === 'false',
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
