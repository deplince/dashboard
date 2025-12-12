import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const RedisConfig = {
  isGlobal: true,
  store: redisStore,
  host: configService.get<string>('REDIS_HOST'),
  port: Number(configService.get<number>('REDIS_PORT')),
};
