import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CommentEntity } from '@lib/entities';

const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get<string>('POSTGRES_URL');
  if (!url) {
    throw new Error('Database URL is empty');
  }
  return {
    url,
    type: 'postgres',
    schema: 'public',
    logging: configService.get<string>('IS_PROD') === 'false',
    entities: [CommentEntity],
    synchronize: configService.get<string>('IS_PROD') === 'false',
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
