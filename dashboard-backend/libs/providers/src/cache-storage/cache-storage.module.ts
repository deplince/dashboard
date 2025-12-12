import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get<string>('REDIS_HOST') || 'localhost',
            port: parseInt(config.get<string>('REDIS_PORT') || '6379', 10),
          },
          ttl: 60 * 60 * 1000,
        });

        return {
          store,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheStorageModule {}
