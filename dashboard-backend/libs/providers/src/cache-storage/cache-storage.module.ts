import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisHost = config.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = config.get<string>('REDIS_PORT') || '6379';
        const redisPassword = config.get<string>('REDIS_PASSWORD');
        const connectionString = `redis://${redisPassword ? `:${redisPassword}@` : ''}${redisHost}:${redisPort}`;
        return {
          stores: [createKeyv(connectionString)],
          ttl: 7 * 24 * 60 * 60 * 1000,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheStorageModule {}
